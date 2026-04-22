"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UsersWithAccessToBackingProvider from "@/contexts/UsersWithAccessToBacking";
import { type FC } from "react";
import BackingSettings from "./BackingSettings";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { useParams, useRouter } from "next/navigation";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import TopUpDrawerButton from "./TopUpPotWizard";
import { useUser } from "@clerk/nextjs";
import useUsersWithAccessToBackingContext from "@/contexts/UsersWithAccessToBacking/useUsersWithAccessToBackingContext";

type BackingActionsBarProps = {
  profitOrLoss: number;
};

const BackingActionsBar: FC<BackingActionsBarProps> = ({ profitOrLoss }) => {
  const { user } = useUser();
  const router = useRouter();
  const { backingId } = useParams() as {
    backingId: string;
  };
  const usersWithAccessToBacking = useUsersWithAccessToBackingContext();

  const { mutate: chopPot, isLoading } = trpc.chops.create.useMutation({
    onSuccess: () => {
      toastDefaultSuccess("Chop successful");
      router.refresh();
    },
    onError: error => {
      console.error(error);
      toastDefaultError("Chop failed, please try again.");
    },
  });
  if (!user) return null;
  const userId = user.id;
  const backingType = usersWithAccessToBacking.userDetails[userId]?.type;
  if (backingType !== "BACKER") return null;

  function handleClick() {
    const parsedBackingId = parsePositiveInt(backingId);

    if (!parsedBackingId) {
      toastDefaultError("Invalid backing ID.");
      return;
    }

    chopPot({ backingId: parsedBackingId });
  }
  return (
    <UsersWithAccessToBackingProvider>
      <div className="flex h-5 items-center justify-between  text-sm text-center m-4">
        <Button
          variant="ghost"
          className="flex-1"
          disabled={profitOrLoss <= 0 || isLoading}
          onClick={handleClick}
        >
          Chop
        </Button>
        <Separator orientation="vertical" className="color-primary" />
        <TopUpDrawerButton profit={profitOrLoss} />
        <Separator orientation="vertical" />
        <BackingSettings />
      </div>
    </UsersWithAccessToBackingProvider>
  );
};

export default BackingActionsBar;
