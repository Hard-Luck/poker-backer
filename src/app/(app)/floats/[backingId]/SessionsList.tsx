'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useUsersWithAccessToBackingContext from '@/contexts/UsersWithAccessToBacking/useUsersWithAccessToBackingContext';
import {
  ChopsForHistoryList,
  SessionsForHistoryList,
  TopUpsForHistoryList,
} from '@/models/prismaTypes';
import { formatCurrency } from '@/models/utils/currency';
import { parseAndValidateChopSplit } from '@/models/utils/parse';
import { formatDateStringToDDMMYY } from '@/models/utils/timestamp';
import { ScrollAreaViewport } from '@radix-ui/react-scroll-area';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import DeleteChopButton from './DeleteChopButton';
import DeleteSessionButton from './DeleteSessionButton';
import DeleteTopUpButton from './DeleteTopUpButton';

type HistoryListProps = {
  sessions: SessionsForHistoryList;
  topUps: TopUpsForHistoryList;
  chops: ChopsForHistoryList;
};

const HistoryList: FC<HistoryListProps> = ({ chops, sessions, topUps }) => {
  const list = [
    ...chops.map(c => ({ ...c, type: 'chop' })),
    ...sessions.map(s => ({ ...s, type: 'session' })),
    ...topUps.map(t => ({ ...t, type: 'top_up' })),
  ].sort((a, b) => {
    return a.created_at > b.created_at ? -1 : 1;
  });
  return (
    <ScrollArea>
      <ScrollAreaViewport className="max-h-[425px] ">
        <Table className="max-w-[375px] text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Amount</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map(({ type, ...item }, i) => {
              switch (type) {
                case 'chop':
                  return (
                    <ChopCard key={i} chop={item as ChopsForHistoryList[0]} />
                  );
                case 'session':
                  return (
                    <SessionCard
                      key={i}
                      session={item as SessionsForHistoryList[0]}
                    />
                  );
                case 'top_up':
                  return (
                    <TopUpCard
                      key={i}
                      topUp={item as TopUpsForHistoryList[0]}
                    />
                  );
              }
            })}
          </TableBody>
        </Table>
      </ScrollAreaViewport>
    </ScrollArea>
  );
};

export default HistoryList;
const ChopCard = ({ chop }: { chop: ChopsForHistoryList[0] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  if (isLoading) return null;
  return (
    <>
      <TableRow
        onClick={() => setModalOpen(!modalOpen)}
        className="text-purple-700"
      >
        <TableCell>{formatDateStringToDDMMYY(chop.created_at)}</TableCell>
        <TableCell>
          {userDetails[chop.user_id]?.username || 'No longer here'}
        </TableCell>
        <TableCell>Chop</TableCell>
        <TableCell>£{chop.amount}</TableCell>
        <TableCell
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <DeleteChopButton chopId={chop.id} />
        </TableCell>
      </TableRow>
      <ChopSplit chopSplit={chop.chop_split} open={modalOpen} />
    </>
  );
};

const SessionCard = ({ session }: { session: SessionsForHistoryList[0] }) => {
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  const router = useRouter();
  if (isLoading) return null;
  return (
    <TableRow
      role="link"
      onClick={() => {
        router.push(`/session/${session.id}`);
      }}
    >
      <TableCell>{formatDateStringToDDMMYY(session.created_at)}</TableCell>
      <TableCell>
        {userDetails[session.user_id]?.username || 'No longer here'}
      </TableCell>
      <TableCell className="">
        {session.location ? (
          <div className="flex flex-col">
            <span>
              {session.game_type === 'tournament' ? 'tournament' : 'cash'}
            </span>
            <span className="text-xs">{session.location}</span>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <span className="">
              {session.game_type === 'tournament' ? 'tournament' : 'cash'}
            </span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <span
          className={`${
            session.amount < 0 ? 'text-red-500' : 'text-primary'
          } text-lg`}
        >
          {formatCurrency(session.amount)}
        </span>
      </TableCell>
      <TableCell
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DeleteSessionButton sessionId={session.id}></DeleteSessionButton>
      </TableCell>
    </TableRow>
  );
};

const TopUpCard = ({ topUp }: { topUp: TopUpsForHistoryList[0] }) => {
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  const { backingId } = useParams() as { backingId: string };
  if (isLoading) return null;
  return (
    <TableRow>
      <TableCell>{formatDateStringToDDMMYY(topUp.created_at)}</TableCell>
      <TableCell>
        {userDetails[topUp.user_id]?.username || 'No longer here'}
      </TableCell>
      <TableCell className="text-yellow-700">Top Up</TableCell>
      <TableCell className="text-yellow-700">
        {formatCurrency(topUp.amount)}
      </TableCell>
      <TableCell
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DeleteTopUpButton topupId={topUp.id} backingId={backingId} />
      </TableCell>
    </TableRow>
  );
};

const ChopSplit = ({
  chopSplit,
  open,
}: {
  chopSplit: string;
  open: boolean;
}) => {
  if (!open) return null;
  try {
    const chopData = parseAndValidateChopSplit(chopSplit);
    return (
      <TableRow className="s">
        {Object.entries(chopData).map(([userId, data]) => {
          return (
            <TableCell key={userId} className="flex gap-2">
              <span>{data.username}</span>
              <span>£{data.split}</span>
            </TableCell>
          );
        })}
      </TableRow>
    );
  } catch (e) {
    return (
      <TableRow>
        <TableCell></TableCell>
        <TableCell>No Data</TableCell>
        <TableCell></TableCell>
      </TableRow>
    );
  }
};
