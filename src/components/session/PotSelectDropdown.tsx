import { type PotAccess } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
interface PotSelectDropdownProps {
  initial: number;
  pots: PotAccess[];
  setPotId: Dispatch<SetStateAction<number | null>>;
}

export default function PotSelectDropDown({
  initial,
  pots,
  setPotId,
}: PotSelectDropdownProps) {
  const numbers = pots.map((pot) => pot.pot_id);
  const handleNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPotId(Number(event.target.value));
  };
  return (
    <select value={initial} onChange={handleNumberChange}>
      <option value="">Select a number</option>
      {numbers.map((number) => (
        <option key={number} value={number}>
          {number}
        </option>
      ))}
    </select>
  );
}
