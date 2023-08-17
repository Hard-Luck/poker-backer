import { api } from "~/utils/api";
import ConfirmButton from "../confirm-button/ConfirmButton";

export default function ChopButton({ pot_id }: { pot_id: number }) {
  const { mutate, data, isLoading, isError, isSuccess } =
    api.pots.chop.useMutation();
  if (isLoading) return null;
  return (
    <div className="flex items-center">
      <ConfirmButton
        className="my-2 mb-2 mr-2 rounded-lg  px-2 py-2 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-theme-green dark:hover:bg-green-700 dark:focus:ring-green-800"
        disabled={isLoading}
        onConfirm={() => mutate({ pot_id })}
        // confirmMessage="Confirm chop?"
        buttonLabel="Chop"
      />

      {data && <p className="text-theme-green">Success</p>}
      {isError && <p className="text-theme-red">Failed</p>}
    </div>
  );
}
