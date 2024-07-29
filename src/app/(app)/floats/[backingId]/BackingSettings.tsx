"use client";

import { Button } from "@/components/ui/button";
import useUsersWithAccessToBackingContext from "@/contexts/UsersWithAccessToBacking/useUsersWithAccessToBackingContext";
import { useUser } from "@clerk/nextjs";
import { CiSettings } from "react-icons/ci";
import { FaRegSquarePlus, FaRegSquareMinus } from "react-icons/fa6";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { trpc } from "@/lib/trpc/client";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { useParams, useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Delete } from "lucide-react";
import DeleteBackingButton from "./DeleteBackingButton";
import { Input } from "@/components/ui/input";
import AddToBackingWizardButton from "./AddToBackingWizard";

const BackingSettings = () => {
  const usersWithAccessToBacking = useUsersWithAccessToBackingContext();
  const [settingsTab, setSettingsTab] = React.useState<"DEFAULT" | "DANGEROUS">(
    "DEFAULT"
  );

  const { user } = useUser();
  if (!user) return null;
  const userId = user.id;
  const backingType = usersWithAccessToBacking.userDetails[userId]?.type;
  if (backingType !== "BACKER") return null;
  return (
    <Drawer
      onClose={() => {
        setSettingsTab("DEFAULT");
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="ghost" className="flex-1" aria-label="settings">
          <CiSettings size={"md"} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm text-center">
          <DrawerHeader>
            <DrawerTitle className="text-center">Settings</DrawerTitle>
            <div className="flex flex-col justify-self-center justify-center items-center">
              <Switch
                checked={settingsTab === "DANGEROUS"}
                onChange={checked =>
                  setSettingsTab(checked ? "DANGEROUS" : "DEFAULT")
                }
                onClick={() => {
                  setSettingsTab(value =>
                    value === "DANGEROUS" ? "DEFAULT" : "DANGEROUS"
                  );
                }}
              >
                Dangerous
              </Switch>
              <span className="text-xs">Dangerous Settings</span>
            </div>
          </DrawerHeader>
          {settingsTab === "DEFAULT" ? (
            <div>
              <div className="p-4">
                <DrawerDescription className="text-center">
                  Percentages
                </DrawerDescription>
                <ChangePercentages
                  users={usersWithAccessToBacking.userDetails}
                />
              </div>
              <ChangeFloat />
              <div className="p-4 "></div>
              <AddToBackingWizardButton />
            </div>
          ) : (
            <div>
              <div className="p-4">
                <DrawerDescription className="text-center">
                  Remove User
                </DrawerDescription>
                <DeleteUserFromBackingSettings />
              </div>
              <div className="flex p-4 justify-center">
                <DeleteBackingButton />
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default BackingSettings;

type ChangePercentagesProps = {
  users: Record<
    string,
    {
      username: string;
      percent: number;
    }
  >;
};

const ChangePercentages: React.FC<ChangePercentagesProps> = ({ users }) => {
  const [newPercentages, setNewPercentages] = React.useState(users);
  const utils = trpc.useUtils();
  const { mutate, isLoading } = trpc.userBackings.update.useMutation({
    onSuccess: () => {
      toastDefaultSuccess("Percentages updated");
      void utils.userBackings.listIndividual.invalidate();
    },
    onError: () => {
      toastDefaultError(
        "Failed to update percentages, please try again later."
      );
    },
  });
  const params = useParams();
  const backingId = params?.backingId;
  function handleClick() {
    if (!backingId) return; // TEMP FIX
    let total = 0;
    const percentages = [];
    for (const userId in newPercentages) {
      percentages.push({
        user_id: userId,
        percent: newPercentages[userId].percent,
      });
      total += newPercentages[userId].percent;
    }
    if (total !== 100) {
      toastDefaultError("Percentages must add up to 100");
      return;
    }
    mutate({
      backingId: +backingId,
      percentages,
    });
  }

  return (
    <div className="">
      {Object.entries(users).map(([userId, user]) => {
        return (
          <div key={userId} className="my-4 flex flex-col w-full">
            <span className="">{user.username}</span>
            <div className="flex  w-full gap-2">
              <Button
                className="aspect-square flex-1 p-0 m-0 h-6"
                onClick={() => {
                  setNewPercentages(prev => {
                    return {
                      ...prev,
                      [userId]: {
                        ...prev[userId],
                        percent: Math.max(0, prev[userId].percent - 0.5),
                      },
                    };
                  });
                }}
              >
                <FaRegSquareMinus />
              </Button>
              <Slider
                className="flex-3"
                value={[newPercentages[userId].percent]}
                max={100}
                step={0.5}
                onValueChange={([value]) => {
                  setNewPercentages(prev => {
                    return {
                      ...prev,
                      [userId]: { ...prev[userId], percent: value },
                    };
                  });
                }}
              />
              <Button
                className="aspect-square flex-1 p-0 m-0 h-6"
                onClick={() => {
                  setNewPercentages(prev => {
                    return {
                      ...prev,
                      [userId]: {
                        ...prev[userId],
                        percent: Math.min(100, prev[userId].percent + 0.5),
                      },
                    };
                  });
                }}
              >
                <FaRegSquarePlus />
              </Button>
              <input
                max={100}
                min={0}
                className="w-1/6 text-center"
                value={newPercentages[userId].percent}
                onChange={e => {
                  const value = Math.min(100, +e.target.value);
                  setNewPercentages(prev => {
                    return {
                      ...prev,
                      [userId]: { ...prev[userId], percent: value || 0 },
                    };
                  });
                }}
              />
              <span>%</span>
            </div>
          </div>
        );
      })}
      <Button
        disabled={isLoading}
        variant="default"
        className="w-full"
        onClick={handleClick}
      >
        Set percentages
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
  const { backingId } = useParams() as {
    backingId: string;
  };
  return (
    <div className="p-4 gap-2 flex flex-col">
      <DrawerDescription className="justify-self-center text-center py-4">
        Change Float
      </DrawerDescription>
      <Input
        value={amount}
        onChange={e => {
          if (e.target.value === "" || !isNaN(+e.target.value)) {
            setAmount(e.target.value);
          }
        }}
      />
      <div className="flex flex-col">
        <Button
          variant="default"
          onClick={() => {
            mutate({ backingId: +backingId, float: +amount });
          }}
          disabled={isLoading}
        >
          Change Float
        </Button>
      </div>
    </div>
  );
};

const DeleteUserFromBackingSettings: React.FC = () => {
  const { user } = useUser();
  const usersWithAccessToBacking = useUsersWithAccessToBackingContext();

  if (!user) return null;
  return Object.entries(usersWithAccessToBacking.userDetails).map(
    ([userId, { username }]) => {
      if (userId === user.id) {
        return null;
      }
      return (
        <UserWithAccessCardWithRemoveButton
          key={userId}
          userId={userId}
          username={username}
        />
      );
    }
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
  const { backingId } = useParams() as {
    backingId: string;
  };
  const { mutate } = trpc.userBackings.delete.useMutation({
    onSuccess: () => {
      toastDefaultSuccess("User removed");
      void utils.userBackings.listIndividual.invalidate();
    },
    onError: () => {
      toastDefaultError("Failed to remove user, please try again later.");
    },
  });
  return (
    <div key={userId} className="flex justify-between items-center">
      <span>{username}</span>
      {confirmNotice ? (
        <Button
          onClick={() => {
            mutate({
              toRemoveId: userId,
              backingId: Number(backingId),
            });
          }}
          variant="destructive"
          className="aspect-square w-[75px] p-0 m-0"
          aria-label="delete user from backing"
        >
          Remove
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={() => setConfirmNotice(true)}
          className="aspect-square w-[75px] p-0 m-0"
          aria-label="delete user from backing"
        >
          <Delete />
        </Button>
      )}
    </div>
  );
};
