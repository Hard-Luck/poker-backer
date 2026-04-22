"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import { UserPlus, Check, Loader2, Users } from "lucide-react";

const AddToBackingWizardButton: FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add User to Float
          </DialogTitle>
        </DialogHeader>
        <AddToBackingWizard setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddToBackingWizardButton;

type AddToBackingWizardProps = {
  setOpen: (open: boolean) => void;
};

const AddToBackingWizard: FC<AddToBackingWizardProps> = ({ setOpen }) => {
  const { backingId } = useParams() as { backingId: string };
  const parsedBackingId = parsePositiveInt(backingId);
  const hasValidBackingId = parsedBackingId !== null;
  
  const { data: friends, isLoading } = trpc.friendships.listNotInBacking.useQuery(
    { backingId: hasValidBackingId ? parsedBackingId : 0 },
    { enabled: hasValidBackingId }
  );
  
  if (!hasValidBackingId) return null;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!friends) return null;
  
  const formattedRecievedFriends = friends.receivedFriendships.map(
    friendship => friendship.user
  );
  const formattedSentFriends = friends.sentFriendships.map(
    friendship => friendship.friend
  );
  const friendsToList = [...formattedRecievedFriends, ...formattedSentFriends];

  if (friendsToList.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          No friends available to add
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Add friends first to invite them to this float
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {friendsToList.map(friend => (
        <FriendCard key={friend.id} friend={friend} onSuccess={() => setOpen(false)} />
      ))}
    </div>
  );
};

type FriendCardProps = {
  friend: { id: string; username: string };
  onSuccess: () => void;
};

const FriendCard: FC<FriendCardProps> = ({ friend, onSuccess }) => {
  const router = useRouter();
  const path = usePathname();
  const { backingId } = useParams() as { backingId: string };
  const parsedBackingId = parsePositiveInt(backingId);
  const [added, setAdded] = useState(false);
  const utils = trpc.useUtils();
  
  const { mutate: addFriend, isLoading } = trpc.userBackings.create.useMutation({
    onSuccess: () => {
      void utils.friendships.invalidate();
      setAdded(true);
      toastDefaultSuccess(`${friend.username} added to float`);
      router.push(path ?? "/floats");
      onSuccess();
    },
    onError: () => {
      toastDefaultError(`Failed to add ${friend.username} to float`);
    },
  });
  
  function handleClick() {
    if (!parsedBackingId) {
      toastDefaultError("Invalid backing ID.");
      return;
    }
    addFriend({ friendId: friend.id, backingId: parsedBackingId });
  }
  
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {friend.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{friend.username}</span>
      </div>
      {added ? (
        <div className="flex items-center gap-1 text-primary text-sm">
          <Check className="h-4 w-4" />
          Added
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-1" />
              Add
            </>
          )}
        </Button>
      )}
    </div>
  );
};
