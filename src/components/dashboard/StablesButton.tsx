import { useRouter } from "next/router";
// We want an SVG of a silhouette of a player or generic hoodie guy
export default function StableButton({ isBacker }: { isBacker: boolean }) {
  const router = useRouter();
  const path = isBacker ? "stable" : "me";
  return (
    <div className="m-2 flex h-48 w-48 justify-center rounded-lg border-2 border-black">
      <button onClick={() => void router.push(`/${path}`)}>{path}</button>
    </div>
  );
}
