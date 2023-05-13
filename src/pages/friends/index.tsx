import { useUser } from "@clerk/nextjs";

export default function Friends() {
  const user = useUser();
  if (!user) return null;
  return (
    <div>
      <h1>Friends</h1>
    </div>
  );
}
