import { useRouter } from "next/router";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { api } from "~/utils/api";
import { toastDefaultError } from "../utils/default-toasts";
export interface PotNameWithID {
  name: string;
  id: number;
}
export default function AddSessionForm({ pots }: { pots: PotNameWithID[] }) {
  const [pot, setPot] = useState(pots[0]);
  const [amount, setAmount] = useState("");
  const [sessionLength, setSessionLength] = useState("");
  const [created_at, setCreated_at] = useState(new Date());
  const [amountError, setAmountError] = useState(false);
  const [sessionLengthError, setSessionLengthError] = useState(false);
  const { mutate: postSession, data } = api.sessions.create.useMutation({
    onSuccess: () => {
      pot?.id && router.push(`/stable/${pot.id}`);
    },
    onError: () => {
      toastDefaultError("Error: are all inputs correct?");
    },
  });
  const router = useRouter();
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    const filteredPot = pots.find((pot) => pot.name === selectedValue);
    if (filteredPot) {
      setPot(filteredPot);
    }
  };

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value);
    setAmountError(event.target.value === "");
  }

  function handleSessionLengthChange(event: ChangeEvent<HTMLInputElement>) {
    setSessionLength(event.target.value);
    setSessionLengthError(
      event.target.value === "" || +event.target.value <= 0
    );
  }

  function handleCreated_atChange(event: ChangeEvent<HTMLInputElement>) {
    const attemptedDate = new Date(event.target.value);
    const now = new Date();

    const sessionDate =
      attemptedDate.getTime() < now.getTime() ? attemptedDate : now;
    setCreated_at(sessionDate);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAmountError(amount === "" || +amount < 0);
    setSessionLengthError(sessionLength === "" || +sessionLength <= 0);
    if (!amountError && !sessionLengthError) {
      postSession({
        pot_id: pot?.id as number,
        amount: +amount,
        session_length: +sessionLength,
        created_at,
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-theme-black pt-12 text-white">
      <span className="mb-4 text-lg font-bold">Backer Pot Name:</span>
      {pots?.length && (
        <div className="w-64">
          <select
            className="w-full rounded-lg p-2 text-theme-black"
            value={pot?.name}
            onChange={handleChange}
          >
            {pots.map((pot, index) => (
              <option key={index} value={pot.name}>
                {pot.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {!!data && (
        <div className="mb-4 text-green-500">Session added successfully!</div>
      )}
      <form
        id="add-session-form"
        onSubmit={handleSubmit}
        className="flex w-64 flex-col items-center"
      >
        <label className="mb-2 w-full">
          Amount:
          <input
            type="number"
            value={amount === "" ? "" : +amount}
            onChange={handleAmountChange}
            className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-theme-black"
          />
        </label>
        <label className="mb-2 w-full">
          Session Time (in minutes):
          <input
            type="number"
            value={sessionLength}
            onChange={handleSessionLengthChange}
            className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-theme-black"
          />
        </label>
        <label className="mb-4 w-full">
          Date/Time:
          <input
            type="datetime-local"
            value={created_at.toISOString().slice(0, -8)}
            onChange={handleCreated_atChange}
            className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-theme-black"
          />
        </label>
        <button
          type="submit"
          className="w-full  rounded-lg bg-theme-header px-4 py-2 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
