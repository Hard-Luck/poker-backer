import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MiniCardProps {
  title: string;
  children: React.ReactNode;
  textColor?: "blue" | "red";
}

const MiniCard: React.FC<MiniCardProps> = ({ title, children }) => {
  return (
    <Card className="h-full border-primary my-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className={`flex flex-col items-center justify-center `}>
        {children}
      </CardContent>
    </Card>
  );
};

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
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MiniCard title="Balance">
        <div className="text-center">
          <span className="text-xl font-semibold">£{currentFloat}</span>
        </div>
      </MiniCard>
      <MiniCard title="Sessions">
        <span className="block">Since Last Chop: {sessionsSinceLastChop}</span>
        <span className="block">Total: {totalSessions}</span>
      </MiniCard>
      <MiniCard title="Float">
        <div className="text-xl font-semibold">£{float}</div>
      </MiniCard>
      <MiniCard title="Make up" textColor={profitOrLoss >= 0 ? "blue" : "red"}>
        <div className={`text-xl font-semibold ${textColor}`}>
          £{Math.abs(profitOrLoss)}
        </div>
      </MiniCard>
    </section>
  );
};

export default DashboardCards;
