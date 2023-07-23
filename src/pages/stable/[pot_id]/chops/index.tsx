import { useRouter } from "next/router";
import ChopHistory from "~/components/individual-horse/ChopHistory";

export default function Chops() {
  const router = useRouter();
  const { pot_id } = router.query;
  if (typeof pot_id !== "string") return null;
  return <ChopHistory pot_id={+pot_id} />;
}
