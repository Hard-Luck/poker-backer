export default function SessionsThisMonth({ sessions }: { sessions: number }) {
  const sessionOrSessions = `${sessions > 1 ? "Sessions" : "Session"}`;
  return (
    <div className="h m-2 flex  h-48 w-48 flex-col items-center justify-center rounded-lg border-2 border-black">
      <span>{sessions}</span>
      <span>{sessionOrSessions} this month</span>
    </div>
  );
}
