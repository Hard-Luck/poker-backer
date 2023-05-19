import { api } from "~/utils/api";

export default function ChopButton({ pot_id }: { pot_id: number }) {
  const { mutate, data, isLoading, isError } = api.pots.chop.useMutation();
  if (isLoading) return null;
  return (
    <div>
      <button
        className="my-2 mb-2 mr-2 rounded-lg bg-green-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        disabled={isLoading}
        onClick={() => mutate({ pot_id })}
      >
        Chop
      </button>
      {data && <p className="text-green-500">Success</p>}
      {isError && <p className="text-red-500">Failed</p>}
    </div>
  );
}
