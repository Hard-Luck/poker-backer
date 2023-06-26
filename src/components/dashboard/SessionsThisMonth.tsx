export default function SessionsThisMonth({ sessions }: { sessions: number }) {
  const sessionOrSessions = `${sessions > 1 ? "Sessions" : "Session"}`;
  return (
    <div className="m-2 flex  h-48 w-48 flex-col items-center justify-center rounded-lg bg-theme-grey text-white">
      <span className="text-4xl font-black">{sessions}</span>
      <span>{sessionOrSessions} this month</span>
    </div>
  );
}
