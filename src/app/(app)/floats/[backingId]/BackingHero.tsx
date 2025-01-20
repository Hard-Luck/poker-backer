import AddSessionSidePanel from "./AddSessionSidePanel";

interface DashboardCardsProps {
  currentFloat: number;
  sessionsSinceLastChop: number;
  totalSessions: number;
  float: number;
  profitOrLoss: number;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({
  currentFloat,
  sessionsSinceLastChop,
  totalSessions,
  float,
  profitOrLoss,
}) => {
  const textColor = profitOrLoss >= 0 ? "text-blue-500" : "text-red-500";
  return (
    <section className="flex justify-between p-6 text-sm">
      <div className="flex flex-col ">
        <div>Balance - £{currentFloat}</div>
        <div>Sessions - Since Last Chop: {sessionsSinceLastChop}</div>
        <div>Sessions - Total: {totalSessions}</div>
        <div>Float - £{float}</div>
        <div>
          Make up -
          <span className={`${textColor}`}> £{Math.abs(profitOrLoss)}</span>
        </div>
      </div>
      <div>
        <AddSessionSidePanel />
      </div>
    </section>
  );
};

export default DashboardCards;
