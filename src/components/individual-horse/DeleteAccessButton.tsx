import React from 'react';
import { api } from '~/utils/api';
import { toastDefaultError } from '../utils/default-toasts';

type Props = { pot_id: number; user_id: string };

export default function DeleteAccessButton({ user_id, pot_id }: Props) {
  const ctx = api.useContext();
  const { mutate, isLoading } = api.potAccess.deletePotAccess.useMutation({
    onError: () => {
      toastDefaultError('Error deleting access to pot');
    },
    onSuccess: () => {
      void ctx.potAccess.getAccessByPotId.invalidate();
    },
  });

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
