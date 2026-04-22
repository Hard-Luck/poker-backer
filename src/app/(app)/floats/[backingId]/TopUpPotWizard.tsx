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
import { Label } from "@/components/ui/label";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { useParams } from "next/navigation";
import { type FC, useState } from "react";
import {
  ArrowUpCircle,
  Plus,
  Minus,
  Loader2,
  X,
  StickyNote,
} from "lucide-react";

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
          amount > 0
            ? `Topped up by £${amount}`
            : `£${-amount} top up taken back`
        }`
      );
    },
    onError: () => {
      toastDefaultError("Top up failed, please try again.");
    },
  });

  const { backingId } = useParams() as { backingId: string };

  return (
    <Drawer
      onOpenChange={() => {
        setAmount("");
        setNote("");
        setPlusOrMinus("+");
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex-1 h-12 rounded-none gap-2 text-sm font-medium hover:bg-muted"
        >
          <ArrowUpCircle className="h-4 w-4" />
          Top Up
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-8">
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
              <ArrowUpCircle className="h-5 w-5 text-primary" />
              Top Up Float
            </DrawerTitle>
            <DrawerDescription>
              Add or remove funds from the float
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="topup-amount">
                Amount{" "}
                <span className="text-xs text-muted-foreground">
                  (required)
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={plusOrMinus === "+" ? "default" : "outline"}
                  size="icon"
                  className="shrink-0"
                  onClick={() =>
                    setPlusOrMinus(plusOrMinus === "+" ? "-" : "+")
                  }
                >
                  {plusOrMinus === "+" ? (
                    <Plus className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </Button>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {plusOrMinus}£
                  </span>
                  <Input
                    id="topup-amount"
                    className="pl-10"
                    placeholder="0"
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
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="topup-note" className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                Note
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="topup-note"
                placeholder="e.g. Monthly top up"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            {/* Submit */}
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
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  {plusOrMinus === "+" ? "Add" : "Remove"} Top Up
                </>
              )}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TopUpDrawerButton;
