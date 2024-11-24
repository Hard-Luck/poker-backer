"use client";
import { Button } from "@/components/ui/button";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { Dispatch, FC, SetStateAction } from "react";
import { useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
type AddToBackingWizardProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const AddToBackingWizard: FC<AddToBackingWizardProps> = ({ setOpen }) => {
  const { backingId } = useParams() as {
    backingId: string;
  };
  const { data: friends, isLoading } =
    trpc.friendships.listNotInBacking.useQuery({
      backingId: Number(backingId),
    });
  if (isLoading) return null;
  if (!friends) return null;
  const formattedRecievedFriends = friends.receivedFriendships.map(
    friendship => {
      return friendship.user;
    }
  );
  const formattedSentFriends = friends.sentFriendships.map(friendship => {
    return friendship.friend;
  });
  const friendsToList = [...formattedRecievedFriends, ...formattedSentFriends];

  return (
    <section className="fixed bg-muted p-4 rounded-t-xl bottom-0 left-0 flex flex-col w-full items-center">
      <Button
        onClick={() => setOpen(false)}
        variant={"secondary"}
        className="w-[200px] m-4"
      >
        Close
      </Button>
      <ul>
        {friendsToList.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </ul>
    </section>
  );
};

type FriendCardProps = {
  friend: {
    id: string;
    username: string;
  };
};
const FriendCard: FC<FriendCardProps> = ({ friend }) => {
  const router = useRouter();
  const path = usePathname();
  const { backingId } = useParams() as {
    backingId: string;
  };
  const [added, setAdded] = useState(false);
  const utils = trpc.useUtils();
  const { mutate: addFriend } = trpc.userBackings.create.useMutation({
    onSuccess: () => {
      void utils.friendships.invalidate();
      setAdded(true);
      toastDefaultSuccess(`${friend.username} added to backing`);
      router.push(path ?? "/floats");
    },
    onError: () => {
      toastDefaultError(`Failed to add ${friend.username} to backing`);
    },
  });
  function handleClick() {
    addFriend({ friendId: friend.id, backingId: +backingId });
  }
  return (
    <li className="flex gap-2 w-full justify-between text-left ">
      <span>{friend.username}</span>
      {added ? null : (
        <Button variant="outline" onClick={handleClick} disabled={added}>
          <IoMdPersonAdd />
        </Button>
      )}
    </li>
  );
};

const AddToBackingWizardButton: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {open ? (
        <AddToBackingWizard setOpen={setOpen} />
      ) : (
        <Button onClick={() => setOpen(true)}>Add User</Button>
      )}
    </div>
  );
};

export default AddToBackingWizardButton;
