export default function TotalAllFloats({ total }: { total: number }) {
  const circumference = 2 * Math.PI * 50; // Assuming a radius of 50

  const dashOffset = (percentage: number) =>
    circumference - (percentage / 100) * circumference;
  // Im not married to this being the way of representing the data!
  return (
    <div className=" h-7/16 w-7/16  m-2 flex flex-col items-center justify-center rounded-lg bg-theme-grey  p-2 text-white">
      <svg width="100" height="100" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#006400" // Default darker green color
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke={total >= 0 ? "#90EE90" : "#FF0000"} // Light green for profit, red otherwise
          strokeWidth="10"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset(100)}
          strokeLinecap="round"
          transform="rotate(-90 60 60)" // Rotate the ring to start from the top and move left
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="20"
          fill="white"
        >
          {total}
        </text>
      </svg>
    </div>
  );
}
