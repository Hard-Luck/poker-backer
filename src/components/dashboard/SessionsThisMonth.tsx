export default function SessionsThisMonth({ sessions }: { sessions: number }) {
  const sessionOrSessions = `${sessions > 1 ? "Sessions" : "Session"}`;
  return (
    <div className="h w-7/16 m-2 flex flex-col items-center justify-center rounded-lg bg-theme-grey p-2 text-white">
      <span className="text-4xl font-black">{sessions}</span>
      <span>{sessionOrSessions} this month</span>
    </div>
  );
}
