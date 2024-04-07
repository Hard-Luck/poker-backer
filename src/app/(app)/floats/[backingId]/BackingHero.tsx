import MiniCard from '@/components/ui/minicard';
import { FC } from 'react';

type BackingHeroProps = {
  totalSessions: number;
  currentTopUps: number;
  currentFloat: number;
  float: number;
  profitOrLoss: number;
  sessionsSinceLastChop: number;
};

const BackingHero: FC<BackingHeroProps> = ({
  totalSessions,
  currentFloat,
  currentTopUps,
  float,
  profitOrLoss,
  sessionsSinceLastChop,
}) => {
  return (
    <section className="grid grid-cols-2 grid-rows-2 bg-secondary">
      <MiniCard>
        <h3 className="text-lg font-bold">Balance</h3>
        <div className="flex flex-col">
          <span>£{currentFloat + currentTopUps}</span>
          {!!currentTopUps && (
            <span className="text-xs">(£{currentTopUps} in topups)</span>
          )}
        </div>
      </MiniCard>
      <MiniCard>
        <h3 className="text-lg font-bold">Sessions</h3>
        <span className="">Since Last Chop: {sessionsSinceLastChop}</span>
        <span className="">Total: {totalSessions}</span>
      </MiniCard>
      <MiniCard>
        <h3 className="text-lg font-bold">Float</h3>
        <div className="3">£{float}</div>
      </MiniCard>
      <MiniCard alternateColor={profitOrLoss >= 0 ? 'blue' : 'red'}>
        <h3 className="text-lg font-bold">Make up</h3>
        <div className="">£{profitOrLoss}</div>
      </MiniCard>
    </section>
  );
};

export default BackingHero;
