import { useUser } from "@clerk/nextjs";
import AddSession from "~/components/session/AddSession";

export default function Session() {
  const user = useUser();
  if (!user.isLoaded) return <p>Loading...</p>;
  return <AddSession />;
}
