"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Scissors, Loader2 } from "lucide-react";

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
      <div className="container mx-auto px-4 pb-4">
        <Card className="border-border">
          <div className="flex items-center justify-center divide-x divide-border">
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-none gap-2 text-sm font-medium hover:bg-muted"
              disabled={profitOrLoss <= 0 || isLoading}
              onClick={handleClick}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Scissors className="h-4 w-4" />
              )}
              Chop
            </Button>
            <TopUpDrawerButton profit={profitOrLoss} />
            <BackingSettings />
          </div>
        </Card>
      </div>
    </UsersWithAccessToBackingProvider>
  );
};

export default BackingActionsBar;
