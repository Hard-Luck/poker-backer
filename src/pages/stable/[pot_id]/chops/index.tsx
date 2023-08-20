import { useRouter } from "next/router";
import ChopHistory from "~/components/individual-horse/ChopHistory";
import { HasAccess } from "~/components/utils/HasAccess";

export default function Chops() {
  const router = useRouter();
  const { pot_id } = router.query;
  if (typeof pot_id !== "string") return null;
  return (
    <HasAccess pot_id={+pot_id}>
      <ChopHistory pot_id={+pot_id} />;
    </HasAccess>
  );
}
