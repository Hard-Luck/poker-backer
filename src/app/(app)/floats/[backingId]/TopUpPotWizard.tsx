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
      <DrawerContent>
        <DrawerClose asChild>
          <Button className=" m-2 self-center">X</Button>
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
                if (isNaN(Number(e.target.value))) {
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
              if (Number(amount) < 0 && Number(amount) + profit < 0) {
                toastDefaultError("Cannot remove more than the profit.");
                return;
              }
              topUpPot({
                amount: Number(amount) * (plusOrMinus === "+" ? 1 : -1),
                note,
                backingId: Number(backingId),
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
