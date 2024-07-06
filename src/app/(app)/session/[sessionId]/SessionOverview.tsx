import { Button } from '@/components/ui/button';
import { type SessionOverview } from '@/models/prismaTypes';
import { formatDateStringToLongDate } from '@/models/utils/timestamp';
import { minutesToHours } from 'date-fns';
import Link from 'next/link';
import { type FC } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

type SessionOverviewProps = { session: SessionOverview };

const SessionOverview: FC<SessionOverviewProps> = ({ session }) => {
  return (
    <div className="text-center">
      <Button asChild role="link" variant={'link'}>
        <Link href={'/floats/' + session.backing_id}>
          <IoMdArrowRoundBack color="primary" />
          Back To Backing
        </Link>
      </Button>
      <h2>{formatDateStringToLongDate(session.created_at)}</h2>
      <p className="text-xs">{session.location ?? 'No location'}</p>
      <p className="text-xs">
        {session.game_type === 'cash_game' ? 'cash game' : 'tournament'}
      </p>
      <p>{minutesToHours(+(session.length || 0)).toFixed(1) + 'hrs'}</p>
      <p>W/L: {session.amount}</p>
    </div>
  );
};

export default SessionOverview;
