import { useState } from "react";
import { api } from "~/utils/api";
import ConfirmButton from "../confirm-button/ConfirmButton";
import { formatCurrency } from "~/utils/currency";

export function TopUpWizard({
  pot_id,
  onClose,
}: {
  pot_id: number;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState<number | "">("");
  const { isSuccess, isLoading, mutate } = api.pots.topUp.useMutation();
  const ctx = api.useContext();
  if (!mutate) return null;
  if (isSuccess) {
    void ctx.pots.invalidate();
    onClose();
  }
  const handleConfirm = () => {
    if (amount !== "") {
      mutate({ pot_id, amount });
      setAmount("");
    }
  };
  return (
    <div className="flex w-48 flex-col items-center justify-center gap-4 self-center  border-2 border-gray-200 bg-white p-4 text-right dark:border-gray-700 dark:bg-gray-800">
      <input
        className="text-right"
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
        className="w-32 rounded-sm bg-blue-500 text-white"
        confirmMessage={
          amount !== ""
            ? `Are you sure you want to top up this pot by ${formatCurrency(
                amount
              )}`
            : "You must enter an amount to top up this pot"
        }
      />
    </div>
  );
}
