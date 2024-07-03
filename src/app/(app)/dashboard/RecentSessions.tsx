'use client';

import type { Session } from '@prisma/client';
import { ImArrowUp, ImArrowDown } from 'react-icons/im';
import React from 'react';
import {
  convertMinsToHrsMins,
  formatDateStringToDDMM,
} from '@/models/utils/timestamp';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { useTheme } from 'next-themes';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { ScrollAreaViewport } from '@radix-ui/react-scroll-area';
interface UsernameAndId {
  user: {
    username: string;
  };
}
export default function RecentSession({
  sessions,
}: {
  sessions: Array<Session & UsernameAndId>;
}) {
  const { theme } = useTheme();
  return (
    <section className={`text-secondary-foreground `}>
      <h2 className={`text-center text-2xl  `}>Recent Sessions</h2>
      <ScrollArea>
        <ScrollAreaViewport className="max-h-[400px] ">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Player</TableHead>
                <TableHead className="text-center">Mins</TableHead>
                <TableHead className="text-center">+/-</TableHead>
                <TableHead className="text-center">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map(session => {
                const winnerOrLoser =
                  session.amount < 0 ? 'text-red-700' : 'text-lime-600';

                return (
                  <TableRow key={session.id}>
                    <TableCell>{session.user.username}</TableCell>
                    <TableCell className="text-center">
                      {convertMinsToHrsMins(session.length ?? 0)}
                    </TableCell>
                    <TableCell className={`${winnerOrLoser} flex`}>
                      {session.amount < 0 ? <ImArrowDown /> : <ImArrowUp />}

                      {`£${session.amount}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-center">
                        <span>{formatDateStringToDDMM(session.created_at)}</span>
                        <span className="text-xs">{session.location}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollAreaViewport>
      </ScrollArea>
    </section>
  );
}
