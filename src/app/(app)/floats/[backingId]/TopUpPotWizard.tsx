"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { useParams } from "next/navigation";
import { type FC, useState } from "react";
import { FaPlusMinus } from "react-icons/fa6";
type TopUpPotWizardProps = {
  profit: number;
};
const TopUpDrawerButton: FC<TopUpPotWizardProps> = ({ profit }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [plusOrMinus, setPlusOrMinus] = useState<"+" | "-">("+");
  const { mutate: topUpPot, isLoading } = trpc.topUps.create.useMutation({
    onSuccess: ({ amount }) => {
      toastDefaultSuccess(
        `Top up successful. ${
          amount > 0 ? `Topped up by ${amount}` : `${-amount} top up taken back`
        }`
      );
    },
    onError: () => {
      toastDefaultError("Top up failed, please try again.");
    },
  });
  const { backingId } = useParams() as {
    backingId: string;
  };
  return (
    <Drawer
      onOpenChange={() => {
        setAmount("");
        setNote("");
        setPlusOrMinus("+");
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="ghost" className="flex-1" aria-label="settings">
          Top Up
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerClose className="absolute" asChild>
          <Button className="w-fit right-4">X</Button>
        </DrawerClose>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Top Up</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription>Amount to top up by?</DrawerDescription>
          <label htmlFor="amount">
            Amount <span className="text-xs">(required)</span>
          </label>
          <div className="flex items-center">
            <Button>
              <FaPlusMinus
                onClick={() => {
                  if (plusOrMinus === "+") {
                    setPlusOrMinus("-");
                  } else {
                    setPlusOrMinus("+");
                  }
                }}
              />
            </Button>
            <span className="px-2 text-2xl">{plusOrMinus}</span>
            <Input
              id="amount"
              value={amount}
              onChange={e => {
                if (e.target.value === "") {
                  setAmount("");
                  return;
                }
                if (!/^\d*\.?\d*$/.test(e.target.value)) {
                  return;
                }
                setAmount(e.target.value);
              }}
            />
          </div>
          <label htmlFor="note">
            Note <span className="text-xs">(optional)</span>
          </label>

          <Input
            id="note"
            placeholder="optional"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <Button
            className="mt-4 w-full"
            disabled={isLoading}
            onClick={() => {
              const parsedBackingId = parsePositiveInt(backingId);
              const parsedAmount = Number(amount);

              if (!parsedBackingId) {
                toastDefaultError("Invalid backing ID.");
                return;
              }

              if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
                toastDefaultError("Please enter a valid top up amount.");
                return;
              }

              const signedAmount =
                parsedAmount * (plusOrMinus === "+" ? 1 : -1);

              if (signedAmount < 0 && profit + signedAmount < 0) {
                toastDefaultError("Cannot remove more than the profit.");
                return;
              }
              topUpPot({
                amount: signedAmount,
                note,
                backingId: parsedBackingId,
              });
            }}
          >
            Top Up
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TopUpDrawerButton;
