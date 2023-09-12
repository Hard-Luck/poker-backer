import React from "react";
import { api } from "~/utils/api";

type Props = { pot_id: number; user_id: string };

export default function DeleteAccessButton({ user_id, pot_id }: Props) {
  const ctx = api.useContext();
  const { mutate, isError, isSuccess, isLoading } =
    api.potAccess.deletePotAccess.useMutation();
  if (isSuccess) void ctx.potAccess.getAccessByPotId.invalidate();
  if (isError) console.error(isError);

  return (
    <button
      disabled={isLoading}
      onClick={() => void mutate({ user_id, pot_id })}
      className="rounded-lg bg-theme-red p-2 text-white"
    >
      delete
    </button>
  );
}
