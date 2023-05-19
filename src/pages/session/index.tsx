import { useUser } from "@clerk/clerk-react";
import Loading from "~/components/Loading";
import AddSession from "~/components/session/AddSession";

export default function Session() {
  const user = useUser();
  if (!user.isLoaded) return <Loading />;
  return <AddSession />;
}
