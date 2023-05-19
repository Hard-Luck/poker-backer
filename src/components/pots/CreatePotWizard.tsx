import { useState } from "react";
import { api } from "~/utils/api";

export default function CreatePotWizard() {
  const [name, setName] = useState<string>("");
  const [float, setFloat] = useState<number>(0);
  const { mutate, data, isLoading } = api.pots.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, float });
  };
  return (
    <form className="flex flex-col gap-4 p-4">
      <label
        className="w-28 self-center text-center text-lg"
        htmlFor="nameInput"
      >
        Name:
      </label>
      <input
        id="nameInput"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-72 self-center rounded-md border border-gray-300 p-2"
      />

      <label
        className="w-28 self-center text-center text-lg "
        htmlFor="floatInput"
      >
        Float:
      </label>
      <input
        id="floatInput"
        type="number"
        value={float}
        onChange={(e) => setFloat(parseFloat(e.target.value))}
        className="w-72 self-center rounded-md border border-gray-300 p-2 text-right"
      />

      <button
        type="submit"
        disabled={isLoading}
        onClick={handleSubmit}
        className="w-28 self-center rounded-md bg-blue-500 p-2 text-white"
      >
        Submit
      </button>
      {data && <p>Pot created!</p>}
    </form>
  );
}
