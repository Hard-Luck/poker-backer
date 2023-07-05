import { useRouter } from "next/router";
import { GiPokerHand } from "react-icons/gi";
// We want an SVG of a silhouette of a player or generic hoodie guy
export default function StableButton({ isBacker }: { isBacker: boolean }) {
  const router = useRouter();
  const path = isBacker ? "stable" : "me";
  return (
    <div className="h-7/16 w-7/16 m-2 flex justify-center  rounded-lg bg-theme-grey p-2 text-6xl text-white ">
      <button onClick={() => void router.push(`/${path}`)}>
        <GiPokerHand />
        <div className="text-xl">{isBacker ? "Stable" : "Me"}</div>
      </button>
    </div>
  );
}
