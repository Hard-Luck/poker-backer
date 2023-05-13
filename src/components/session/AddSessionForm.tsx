import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { api } from "~/utils/api";
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
  const [success, setSuccess] = useState(false);
  const { mutate: postSession } = api.sessions.create.useMutation();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setPot(() => {
      return pots.find((pot) => pot.name === selectedValue);
    });
  };

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value);
    setAmountError(event.target.value === "" || +event.target.value < 0);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      setSuccess(true);
      setAmount("");
      setCreated_at(new Date());
      setSessionLength("");
    }
  }
  console.log(pot);

  return (
    <div>
      <span>Backer Pot Name:</span>
      {pots?.length && (
        <select value={pot?.name} onChange={handleChange}>
          {pots.map((pot, index) => (
            <option key={index} value={index}>
              {pot.name}
            </option>
          ))}
        </select>
      )}
      {success && (
        <div style={{ color: "green" }}>Session added successfully!</div>
      )}
      <form id="add-session-form" onSubmit={handleSubmit}>
        <label>
          Amount:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
        <br />
        <label>
          Session Time (in minutes):
          <input
            type="number"
            value={sessionLength}
            onChange={handleSessionLengthChange}
          />
        </label>
        <br />
        <label>
          Date/Time:
          <input
            type="datetime-local"
            value={created_at.toISOString().slice(0, -8)}
            onChange={handleCreated_atChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
