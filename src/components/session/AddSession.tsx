import { api } from "~/utils/api";
import AddSessionForm from "./AddSessionForm";
import Loading from "../Loading";

export default function AddSession() {
  const { data, isLoading, isSuccess } = api.pots.getCurrentUserPot.useQuery();
  const ctx = api.useContext();
  if (isLoading) return <Loading />;
  if (!data) return <p>No pot</p>;
  if (isSuccess) void ctx.pots.invalidate();
  const pots = data.map((pot) => {
    return {
      id: pot.pot_id,
      name: pot.pot.name,
    };
  });
  if (pots.length === 0) return <p>No Associated Pots</p>;
  return <AddSessionForm pots={pots} />;
}
