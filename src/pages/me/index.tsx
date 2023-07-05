import { useState } from "react";
import { PotsList } from "../stable";

export default function HorseSelfView() {
  const [, setModalIsOpen] = useState(false);
  return <PotsList setModalIsOpen={setModalIsOpen} isBacker={false} />;
}
