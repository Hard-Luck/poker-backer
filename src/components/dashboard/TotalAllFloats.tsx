import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";

export default function TotalAllFloats({ total }: { total: number }) {
  return (
    <div className=" h-7/16 w-7/16  m-2 flex flex-col items-center justify-center rounded-lg bg-theme-grey  p-2 ">
      <span className="text-sm font-bold text-white">Total</span>
      <div
        className={`text-${
          total >= 0 ? "theme-green" : "theme-red"
        } flex items-center text-4xl font-bold`}
      >
        {total}
        {total >= 0 ? <FiArrowUpRight /> : <FiArrowDownLeft />}
      </div>
    </div>
  );
}
