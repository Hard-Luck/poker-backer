"use client";

import type { Session } from "@prisma/client";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import React from "react";
import {
  convertMinsToHrsMins,
  formatDateStringToDDMM,
} from "@/models/utils/timestamp";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";
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
  return (
    <section className={`text-secondary-foreground `}>
      <h2
        className={`text-center text-2xl bg-black p-2 h-full border-2 rounded-t-md border-primary border-b-0`}
      >
        Recent Sessions
      </h2>
      <ScrollArea className="border-primary border-2 border-t-0">
        <ScrollAreaViewport className="max-h-[400px] ">
          <Table className=" border-black">
            <TableHeader className="">
              <TableRow className="text-center bg-opacity-100">
                <TableHead className="text-center bg-black">Player</TableHead>
                <TableHead className="text-center bg-black">Mins</TableHead>
                <TableHead className="text-center bg-black">+/-</TableHead>
                <TableHead className="text-center bg-black">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map(session => {
                const winnerOrLoser =
                  session.amount < 0 ? "text-red-700" : "text-lime-600";

                return (
                  <TableRow key={session.id} className="h-20">
                    <TableCell className="text-center align-middle">
                      {session.user.username}
                    </TableCell>
                    <TableCell className="text-center">
                      {convertMinsToHrsMins(session.length ?? 0)}
                    </TableCell>
                    <TableCell
                      className={`${winnerOrLoser}  align-middle justify-center`}
                    >
                      <span className="flex text-center items-center justify-center gap-1">
                        {session.amount < 0 ? <ImArrowDown /> : <ImArrowUp />}
                        {`£${session.amount}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-center">
                        <span>
                          {formatDateStringToDDMM(session.created_at)}
                        </span>
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
