"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUsersWithAccessToBackingContext from "@/contexts/UsersWithAccessToBacking/useUsersWithAccessToBackingContext";
import type {
  ChopsForHistoryList,
  SessionsForHistoryList,
  TopUpsForHistoryList,
} from "@/models/prismaTypes";
import { formatCurrency } from "@/models/utils/currency";
import { parseAndValidateChopSplit } from "@/models/utils/parse";
import { formatDateStringToDDMMYY } from "@/models/utils/timestamp";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { useParams, useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";
import DeleteChopButton from "./DeleteChopButton";
import DeleteSessionButton from "./DeleteSessionButton";
import DeleteTopUpButton from "./DeleteTopUpButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type HistoryListProps = {
  sessions: SessionsForHistoryList;
  topUps: TopUpsForHistoryList;
  chops: ChopsForHistoryList;
};

const HistoryList: FC<HistoryListProps> = ({ chops, sessions, topUps }) => {
  const [sortBy, setSortBy] = useState<"date" | "name" | "type" | "amount">(
    "date"
  );
  const [reversed, setReversed] = useState(false);
  const list = [
    ...chops.map(c => ({ ...c, type: "chop" })),
    ...sessions.map(s => ({ ...s, type: "session" })),
    ...topUps.map(t => ({ ...t, type: "top_up" })),
  ];
  type Row = (typeof list)[0];
  const sortFunctions: Record<
    string,
    (a: Row, b: Row, reversed?: boolean) => number
  > = {
    date: (a, b, reversed = false) =>
      (a.created_at > b.created_at ? 1 : -1) * (reversed ? -1 : 1),
    type: (a, b, reversed = false) =>
      a.type.localeCompare(b.type) * (reversed ? -1 : 1),
    amount: (a, b, reversed = false) =>
      (a.amount - b.amount) * (reversed ? -1 : 1),
  };
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.target as HTMLButtonElement;
    const text = target.textContent?.replace(/▼|▲/g, "").trim().toLowerCase();

    if (text === sortBy) {
      setReversed(!reversed);
    } else {
      setSortBy(text as "date" | "name" | "type" | "amount");
      setReversed(false);
    }
  }
  list.sort((a, b) => sortFunctions[sortBy](a, b, reversed));
  return (
    <ScrollArea>
      <ScrollAreaViewport className="max-h-[425px]">
        <Table className=" text-center uppercase text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">
                <Button
                  className="w-10"
                  variant={"ghost"}
                  onClick={handleClick}
                >
                  Date
                  <span>{sortBy === "date" ? (reversed ? "▼" : "▲") : ""}</span>
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button className="w-10" variant={"ghost"}>
                  Name
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  className="w-10"
                  variant={"ghost"}
                  onClick={handleClick}
                >
                  Type
                  <span>{sortBy === "type" ? (reversed ? "▼" : "▲") : ""}</span>
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  className="w-10"
                  variant={"ghost"}
                  onClick={handleClick}
                >
                  Amount
                  <span>
                    {sortBy === "amount" ? (reversed ? "▼" : "▲") : ""}
                  </span>
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button className="w-10" variant={"ghost"}>
                  Delete
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map(({ type, ...item }, i) => {
              switch (type) {
                case "chop":
                  return (
                    <ChopCard key={i} chop={item as ChopsForHistoryList[0]} />
                  );
                case "session":
                  return (
                    <SessionCard
                      key={i}
                      session={item as SessionsForHistoryList[0]}
                    />
                  );
                case "top_up":
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
      <TableRow onClick={() => setModalOpen(!modalOpen)} className="">
        <TableCell>{formatDateStringToDDMMYY(chop.created_at)}</TableCell>
        <TableCell>
          {userDetails[chop.user_id]?.username || "No longer here"}
        </TableCell>
        <TableCell className="text-purple-700">Chop</TableCell>
        <TableCell>£{chop.amount}</TableCell>
        <TableCell
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <DeleteChopButton chopId={chop.id} />
        </TableCell>
      </TableRow>
      <ChopSplitModal chopSplit={chop.chop_split} open={modalOpen} />
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
        {userDetails[session.user_id]?.username || "No longer here"}
      </TableCell>
      <TableCell className="">
        {session.location ? (
          <div className="flex flex-col">
            <span>
              {session.game_type === "tournament" ? "tournament" : "cash"}
            </span>
            <span className="text-xs">{session.location}</span>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <span className="">
              {session.game_type === "tournament" ? "tournament" : "cash"}
            </span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <span
          className={`${session.amount < 0 ? "text-red-500" : "text-primary"}`}
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
  const { backingId } = useParams() as {
    backingId: string;
  };
  if (isLoading) return null;
  return (
    <TableRow>
      <TableCell>{formatDateStringToDDMMYY(topUp.created_at)}</TableCell>
      <TableCell>
        {userDetails[topUp.user_id]?.username || "No longer here"}
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

interface ChopSplitModalProps {
  chopSplit: string;
  open: boolean;
}

export const ChopSplitModal = ({ chopSplit, open }: ChopSplitModalProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
  };

  let content;
  try {
    const chopData = parseAndValidateChopSplit(chopSplit);
    content = (
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(chopData).map(([userId, data]) => (
          <div
            key={userId}
            className="flex justify-between items-center p-2 bg-secondary rounded-md"
          >
            <span className="font-medium">{data.username}</span>
            <span className="text-primary">£{data.split.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  } catch (e) {
    content = <p className="text-center text-muted-foreground">No Data</p>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Chop Split Details
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
