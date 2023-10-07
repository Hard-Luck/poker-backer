import { useState } from "react";
import { api } from "~/utils/api";
import ConfirmButton from "../confirm-button/ConfirmButton";
import { formatCurrency } from "~/utils/currency";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

export function TopUpWizard({
  pot_id,
  onClose,
}: {
  pot_id: number;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState<number | "">("");
  const ctx = api.useContext();
  const { isLoading, mutate } = api.pots.topUp.useMutation({
    onSuccess: () => {
      void ctx.pots.invalidate();
      onClose();
      toast.message("Topped up pot", {
        duration: 3000,
        position: "bottom-center",
      });
    },
  });
  if (!mutate) return null;

  const handleConfirm = () => {
    if (amount !== "") {
      mutate({ pot_id, amount });
      setAmount("");
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-theme-black bg-opacity-90">
      <div className="flex flex-col items-center justify-center ">
        <button
          className="absolute right-0 top-0 m-8 rounded-lg bg-theme-header p-2 text-white"
          onClick={onClose}
        >
          <FiX />
        </button>
        <input
          className="m-2 rounded-lg p-3 "
          type="number"
          value={amount ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setAmount("");
            } else {
              setAmount(Number(e.target.value));
            }
          }}
        />
        <ConfirmButton
          buttonLabel="Top Up"
          onConfirm={handleConfirm}
          disabled={isLoading}
          className="m-2 rounded-lg bg-theme-header p-2 text-white"
          confirmMessage={
            amount !== ""
              ? `Are you sure you want to top up this pot by ${formatCurrency(
                  amount
                )}`
              : "You must enter an amount to top up this pot"
          }
        />
      </div>
    </div>
  );
}
