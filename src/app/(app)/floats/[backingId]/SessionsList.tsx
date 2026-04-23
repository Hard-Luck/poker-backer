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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useUsersWithAccessToBackingContext from "@/contexts/UsersWithAccessToBacking/useUsersWithAccessToBackingContext";
import { trpc } from "@/lib/trpc/client";
import type { AppRouter } from "@/lib/server/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import { formatCurrency } from "@/models/utils/currency";
import { parseAndValidateChopSplit } from "@/models/utils/parse";
import { formatDateStringToDDMMYY } from "@/models/utils/timestamp";
import { useRouter } from "next/navigation";
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
import {
  ArrowUpDown,
  Calendar,
  MapPin,
  ChevronRight,
  Scissors,
  ArrowUpCircle,
  Gamepad2,
  Loader2,
} from "lucide-react";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type HistoryData = RouterOutputs["backings"]["getHistory"];
type SessionItem = HistoryData["sessions"][0];
type ChopItem = HistoryData["chops"][0];
type TopUpItem = HistoryData["topUps"][0];

type HistoryListProps = {
  backingId: number;
};

const HistoryList: FC<HistoryListProps> = ({ backingId }) => {
  const { data, isLoading, error } = trpc.backings.getHistory.useQuery(
    { backingId },
    { refetchOnWindowFocus: false, retry: false }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 h-full pb-4">
        <Card className="h-full flex flex-col border-border items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 h-full pb-4">
        <Card className="h-full flex flex-col border-border items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Could not load history.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <HistoryListInner
      sessions={data.sessions}
      chops={data.chops}
      topUps={data.topUps}
      backingId={backingId}
    />
  );
};

export default HistoryList;

type HistoryListInnerProps = {
  sessions: SessionItem[];
  chops: ChopItem[];
  topUps: TopUpItem[];
  backingId: number;
};

const HistoryListInner: FC<HistoryListInnerProps> = ({
  chops,
  sessions,
  topUps,
  backingId,
}) => {
  const [sortBy, setSortBy] = useState<"date" | "name" | "type" | "amount">(
    "date"
  );
  const [reversed, setReversed] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  const list = [
    ...chops.map(c => ({ ...c, type: "chop" as const })),
    ...sessions.map(s => ({ ...s, type: "session" as const })),
    ...topUps.map(t => ({ ...t, type: "top_up" as const })),
  ];

  type Row = (typeof list)[0];

  const sortFunctions: Record<
    string,
    (a: Row, b: Row, reversed?: boolean) => number
  > = {
    date: (a, b, reversed = false) =>
      (a.created_at > b.created_at ? 1 : -1) * (reversed ? 1 : -1),
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateView = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateView();
    mediaQuery.addEventListener("change", updateView);

    return () => {
      mediaQuery.removeEventListener("change", updateView);
    };
  }, []);

  list.sort((a, b) => sortFunctions[sortBy](a, b, reversed));

  const SortIndicator = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return <span className="ml-1">{!reversed ? "▼" : "▲"}</span>;
  };

  return (
    <div className="container mx-auto px-4 h-full pb-4">
      <Card className="h-full flex flex-col border-border">
        <CardHeader className="flex-none py-3 px-4 border-b">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0">
          {isDesktop === null ? null : isDesktop ? (
            <ScrollArea className="h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50">
                  <TableRow>
                    <TableHead className="pl-6 w-[180px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClick}
                        className="font-semibold gap-1 -ml-2"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        Date
                        <SortIndicator column="date" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[150px]">
                      <span className="font-semibold">Player</span>
                    </TableHead>
                    <TableHead className="text-center w-[120px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClick}
                        className="font-semibold gap-1"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        Type
                        <SortIndicator column="type" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right w-[120px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClick}
                        className="font-semibold gap-1"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        Amount
                        <SortIndicator column="amount" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-center w-[80px]">
                      <span className="font-semibold">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map(({ type, ...item }, i) => {
                    switch (type) {
                      case "chop":
                        return (
                          <ChopRow key={`chop-${i}`} chop={item as ChopItem} />
                        );
                      case "session":
                        return (
                          <SessionRow
                            key={`session-${i}`}
                            session={item as SessionItem}
                          />
                        );
                      case "top_up":
                        return (
                          <TopUpRow
                            key={`topup-${i}`}
                            topUp={item as TopUpItem}
                            backingId={String(backingId)}
                          />
                        );
                    }
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <ScrollArea className="h-full">
              <div className="divide-y divide-border">
                {list.map(({ type, ...item }, i) => {
                  switch (type) {
                    case "chop":
                      return (
                        <ChopCard key={`chop-${i}`} chop={item as ChopItem} />
                      );
                    case "session":
                      return (
                        <SessionCard
                          key={`session-${i}`}
                          session={item as SessionItem}
                        />
                      );
                    case "top_up":
                      return (
                        <TopUpCard
                          key={`topup-${i}`}
                          topUp={item as TopUpItem}
                          backingId={String(backingId)}
                        />
                      );
                  }
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Desktop Row Components
const ChopRow = ({ chop }: { chop: ChopItem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  if (isLoading) return null;

  return (
    <>
      <TableRow
        onClick={() => setModalOpen(!modalOpen)}
        className="cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <TableCell className="pl-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDateStringToDDMMYY(chop.created_at)}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                {(userDetails[chop.user_id]?.username || "??")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {userDetails[chop.user_id]?.username || "Unknown"}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-700 border-purple-200"
          >
            <Scissors className="h-3 w-3 mr-1" />
            Chop
          </Badge>
        </TableCell>
        <TableCell className="text-right font-semibold text-purple-700">
          £{chop.amount.toLocaleString()}
        </TableCell>
        <TableCell className="text-center" onClick={e => e.stopPropagation()}>
          <DeleteChopButton chopId={chop.id} />
        </TableCell>
      </TableRow>
      <ChopSplitModal chopSplit={chop.chop_split} open={modalOpen} />
    </>
  );
};

const SessionRow = ({ session }: { session: SessionItem }) => {
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  const router = useRouter();
  if (isLoading) return null;

  const isProfit = session.amount >= 0;

  return (
    <TableRow
      role="link"
      onClick={() => router.push(`/session/${session.id}`)}
      className="cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <TableCell className="pl-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDateStringToDDMMYY(session.created_at)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {(userDetails[session.user_id]?.username || "??")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {userDetails[session.user_id]?.username || "Unknown"}
            </span>
            {session.location && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {session.location}
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="outline" className="capitalize">
          <Gamepad2 className="h-3 w-3 mr-1" />
          {session.game_type === "tournament" ? "Tournament" : "Cash"}
        </Badge>
      </TableCell>
      <TableCell
        className={`text-right font-semibold ${isProfit ? "text-primary" : "text-destructive"}`}
      >
        {formatCurrency(session.amount)}
      </TableCell>
      <TableCell className="text-center" onClick={e => e.stopPropagation()}>
        <DeleteSessionButton sessionId={session.id} />
      </TableCell>
    </TableRow>
  );
};

const TopUpRow = ({
  topUp,
  backingId,
}: {
  topUp: TopUpItem;
  backingId: string;
}) => {
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  if (isLoading) return null;

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="pl-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDateStringToDDMMYY(topUp.created_at)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-amber-100 text-amber-700 text-xs">
              {(userDetails[topUp.user_id]?.username || "??")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {userDetails[topUp.user_id]?.username || "Unknown"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 border-amber-200"
        >
          <ArrowUpCircle className="h-3 w-3 mr-1" />
          Top Up
        </Badge>
      </TableCell>
      <TableCell className="text-right font-semibold text-amber-700">
        {formatCurrency(topUp.amount)}
      </TableCell>
      <TableCell className="text-center">
        <DeleteTopUpButton topupId={topUp.id} backingId={backingId} />
      </TableCell>
    </TableRow>
  );
};

// Mobile Card Components
const ChopCard = ({ chop }: { chop: ChopItem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  if (isLoading) return null;

  return (
    <>
      <div
        onClick={() => setModalOpen(!modalOpen)}
        className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-purple-100 text-purple-700">
                {(userDetails[chop.user_id]?.username || "??")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {userDetails[chop.user_id]?.username || "Unknown"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDateStringToDDMMYY(chop.created_at)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 border-purple-200 mb-1"
            >
              Chop
            </Badge>
            <p className="font-semibold text-purple-700">
              £{chop.amount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <ChopSplitModal chopSplit={chop.chop_split} open={modalOpen} />
    </>
  );
};

const SessionCard = ({ session }: { session: SessionItem }) => {
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  const router = useRouter();
  if (isLoading) return null;

  const isProfit = session.amount >= 0;

  return (
    <div
      onClick={() => router.push(`/session/${session.id}`)}
      className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {(userDetails[session.user_id]?.username || "??")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {userDetails[session.user_id]?.username || "Unknown"}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDateStringToDDMMYY(session.created_at)}
              {session.location && (
                <>
                  <span>•</span>
                  <MapPin className="h-3 w-3" />
                  {session.location}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <Badge variant="outline" className="capitalize mb-1">
              {session.game_type === "tournament" ? "Tournament" : "Cash"}
            </Badge>
            <p
              className={`font-semibold ${isProfit ? "text-primary" : "text-destructive"}`}
            >
              {formatCurrency(session.amount)}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

const TopUpCard = ({
  topUp,
  backingId,
}: {
  topUp: TopUpItem;
  backingId: string;
}) => {
  const { userDetails, isLoading } = useUsersWithAccessToBackingContext();
  if (isLoading) return null;

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-amber-100 text-amber-700">
              {(userDetails[topUp.user_id]?.username || "??")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {userDetails[topUp.user_id]?.username || "Unknown"}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDateStringToDDMMYY(topUp.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-700 border-amber-200 mb-1"
            >
              Top Up
            </Badge>
            <p className="font-semibold text-amber-700">
              {formatCurrency(topUp.amount)}
            </p>
          </div>
          <DeleteTopUpButton topupId={topUp.id} backingId={backingId} />
        </div>
      </div>
    </div>
  );
};

// Chop Split Modal
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
      <div className="grid gap-3">
        {Object.entries(chopData).map(([userId, data]) => (
          <div
            key={userId}
            className="flex justify-between items-center p-3 bg-muted rounded-lg"
          >
            <span className="font-medium">{data.username}</span>
            <span className="text-primary font-semibold">
              £{data.split.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  } catch (e) {
    content = (
      <p className="text-center text-muted-foreground py-4">
        No split data available
      </p>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-purple-600" />
            Chop Split Details
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
