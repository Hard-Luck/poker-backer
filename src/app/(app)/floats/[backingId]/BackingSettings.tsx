"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useUsersWithAccessToBackingContext from "@/contexts/UsersWithAccessToBacking/useUsersWithAccessToBackingContext";
import { Settings, Plus, Minus, AlertTriangle, Users, Percent, PiggyBank, Trash2, Loader2, X } from "lucide-react";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { useParams, useRouter } from "next/navigation";
import DeleteBackingButton from "./DeleteBackingButton";
import { Input } from "@/components/ui/input";
import AddToBackingWizardButton from "./AddToBackingWizard";
import DownloadDataButton from "./DownloadDataButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";

const BackingSettings = () => {
  const usersWithAccessToBacking = useUsersWithAccessToBackingContext();


  const { user } = useUser()
  if (!user) return null;
  const userId = user.id;
  const backingType = usersWithAccessToBacking.userDetails[userId]?.type;

  if (backingType !== "BACKER") return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex-1 h-12 rounded-none gap-2 text-sm font-medium hover:bg-muted"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg pb-8">
          <DrawerHeader className="relative">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Float Settings
            </DrawerTitle>
            <DrawerDescription>
              Manage percentages, float amount, and users
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="danger" className="text-destructive data-[state=active]:text-destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Danger
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                {/* Percentages */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      User Percentages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChangePercentages users={usersWithAccessToBacking.userDetails} />
                  </CardContent>
                </Card>

                {/* Float */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <PiggyBank className="h-4 w-4" />
                      Change Float
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChangeFloat />
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  <AddToBackingWizardButton />
                  <DownloadDataButton />
                </div>
              </TabsContent>

              <TabsContent value="danger" className="space-y-4 mt-4">
                {/* Remove Users */}
                <Card className="border-destructive/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                      <Users className="h-4 w-4" />
                      Remove Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeleteUserFromBackingSettings />
                  </CardContent>
                </Card>

                {/* Delete Backing */}
                <Card className="border-destructive/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete Float
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action cannot be undone. All sessions, chops, and top-ups will be permanently deleted.
                    </p>
                    <DeleteBackingButton />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BackingSettings;

type ChangePercentagesProps = {
  users: Record<string, { username: string; percent: number }>;
};

const ChangePercentages: React.FC<ChangePercentagesProps> = ({ users }) => {
  const [newPercentages, setNewPercentages] = React.useState(users);

  React.useEffect(() => {
    setNewPercentages(users);
  }, [users]);

  const utils = trpc.useUtils();
  const { mutate, isLoading } = trpc.userBackings.update.useMutation({
    onSuccess: () => {
      toastDefaultSuccess("Percentages updated");
      void utils.userBackings.listIndividual.invalidate();
    },
    onError: () => {
      toastDefaultError("Failed to update percentages, please try again later.");
    },
  });

  const params = useParams();
  const backingId = params?.backingId;

  const totalPercent = Object.values(newPercentages).reduce((acc, u) => acc + u.percent, 0);

  function handleClick() {
    const parsedBackingId = parsePositiveInt(typeof backingId === "string" ? backingId : null);

    if (!parsedBackingId) {
      toastDefaultError("Invalid backing ID.");
      return;
    }

    if (totalPercent !== 100) {
      toastDefaultError("Percentages must add up to 100");
      return;
    }

    const percentages = Object.entries(newPercentages).map(([user_id, { percent }]) => ({
      user_id,
      percent,
    }));

    mutate({ backingId: parsedBackingId, percentages });
  }

  return (
    <div className="space-y-4">
      {Object.entries(users).map(([userId, user]) => {
        const currentUser = newPercentages[userId] ?? user;
        const currentPercent = currentUser.percent;

        return (
          <div key={userId} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{user.username}</Label>
              <span className="text-sm text-muted-foreground">{currentPercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => {
                  setNewPercentages(prev => ({
                    ...prev,
                    [userId]: {
                      ...prev[userId] ?? user,
                      percent: Math.max(0, (prev[userId]?.percent ?? user.percent) - 0.5),
                    },
                  }));
                }}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Slider
                className="flex-1"
                value={[currentPercent]}
                max={100}
                step={0.5}
                onValueChange={([value]) => {
                  setNewPercentages(prev => ({
                    ...prev,
                    [userId]: { ...prev[userId] ?? user, percent: value },
                  }));
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => {
                  setNewPercentages(prev => ({
                    ...prev,
                    [userId]: {
                      ...prev[userId] ?? user,
                      percent: Math.min(100, (prev[userId]?.percent ?? user.percent) + 0.5),
                    },
                  }));
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Input
                className="w-16 text-center"
                value={currentPercent}
                onChange={e => {
                  const parsedValue = e.target.value === "" ? 0 : Number(e.target.value);
                  if (!Number.isFinite(parsedValue)) return;
                  setNewPercentages(prev => ({
                    ...prev,
                    [userId]: {
                      ...prev[userId] ?? user,
                      percent: Math.max(0, Math.min(100, parsedValue)),
                    },
                  }));
                }}
              />
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-sm font-medium">Total</span>
        <span className={`text-sm font-semibold ${totalPercent === 100 ? 'text-primary' : 'text-destructive'}`}>
          {totalPercent}%
        </span>
      </div>

      <Button
        disabled={isLoading || totalPercent !== 100}
        className="w-full"
        onClick={handleClick}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Percentages"
        )}
      </Button>
    </div>
  );
};

const ChangeFloat: React.FC = () => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.backings.update.useMutation({
    onSuccess: () => {
      toastDefaultSuccess("Float updated");
      router.refresh();
    },
    onError: () => {
      toastDefaultError("Failed to update float, please try again later.");
    },
  });
  const [amount, setAmount] = React.useState("");
  const { backingId } = useParams() as { backingId: string };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="float-amount">New Float Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <Input
            id="float-amount"
            className="pl-7"
            placeholder="0"
            value={amount}
            onChange={e => {
              if (e.target.value === "" || !isNaN(+e.target.value)) {
                setAmount(e.target.value);
              }
            }}
          />
        </div>
      </div>
      <Button
        className="w-full"
        disabled={isLoading || !amount}
        onClick={() => {
          const parsedBackingId = parsePositiveInt(backingId);
          const parsedAmount = Number(amount);

          if (!parsedBackingId) {
            toastDefaultError("Invalid backing ID.");
            return;
          }

          if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            toastDefaultError("Please enter a valid float amount.");
            return;
          }

          mutate({ backingId: parsedBackingId, float: parsedAmount });
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Float"
        )}
      </Button>
    </div>
  );
};

const DeleteUserFromBackingSettings: React.FC = () => {
  // TEMPORARILY MOCKED FOR UI DEVELOPMENT
  const user = { id: 'mock-user-id' };
  const usersWithAccessToBacking = useUsersWithAccessToBackingContext();

  if (!user) return null;

  const otherUsers = Object.entries(usersWithAccessToBacking.userDetails).filter(
    ([userId]) => userId !== user.id
  );

  if (otherUsers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No other users to remove
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {otherUsers.map(([userId, { username }]) => (
        <UserWithAccessCardWithRemoveButton
          key={userId}
          userId={userId}
          username={username}
        />
      ))}
    </div>
  );
};

const UserWithAccessCardWithRemoveButton = ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const utils = trpc.useUtils();
  const [confirmNotice, setConfirmNotice] = React.useState(false);
  const { backingId } = useParams() as { backingId: string };

  const { mutate, isLoading } = trpc.userBackings.delete.useMutation({
    onSuccess: () => {
      toastDefaultSuccess("User removed");
      void utils.userBackings.listIndividual.invalidate();
    },
    onError: () => {
      toastDefaultError("Failed to remove user, please try again later.");
    },
  });

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <span className="font-medium">{username}</span>
      {confirmNotice ? (
        <Button
          variant="destructive"
          size="sm"
          disabled={isLoading}
          onClick={() => {
            const parsedBackingId = parsePositiveInt(backingId);
            if (!parsedBackingId) {
              toastDefaultError("Invalid backing ID.");
              return;
            }
            mutate({ toRemoveId: userId, backingId: parsedBackingId });
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirm"
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmNotice(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
