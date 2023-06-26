import { useRouter } from "next/router";
import { GiPokerHand } from "react-icons/gi";
// We want an SVG of a silhouette of a player or generic hoodie guy
export default function StableButton({ isBacker }: { isBacker: boolean }) {
  const router = useRouter();
  const path = isBacker ? "stable" : "me";
  return (
    <div className="m-2 flex h-24 w-48 justify-center rounded-lg  bg-theme-grey text-6xl text-white">
      <button onClick={() => void router.push(`/${path}`)}>
        <GiPokerHand />
        <div className="text-xl">stables</div>
      </button>
    </div>
  );
}
