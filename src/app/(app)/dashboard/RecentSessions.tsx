"use client";

import type { Session } from "@prisma/client";
import { TrendingUp, TrendingDown, Clock, MapPin } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <Card className="flex flex-col h-full border-border shadow-sm">
      <CardHeader className="pb-3 px-4 md:px-6">
        <CardTitle className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-0 pb-0">
        {/* Desktop Table View */}
        <div className="hidden md:block h-full">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold pl-6">Player</TableHead>
                  <TableHead className="text-center font-semibold">Duration</TableHead>
                  <TableHead className="text-center font-semibold">Result</TableHead>
                  <TableHead className="text-center font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(session => {
                  const isWin = session.amount >= 0;
                  return (
                    <TableRow key={session.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {session.user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{session.user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {convertMinsToHrsMins(session.length ?? 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={isWin ? "default" : "destructive"}
                          className={`${isWin ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20"} border`}
                        >
                          <span className="flex items-center gap-1">
                            {isWin ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {isWin ? "+" : ""}£{session.amount}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center text-center">
                          <span className="font-medium">{formatDateStringToDDMM(session.created_at)}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="flex flex-col gap-3 px-4 pb-4">
              {sessions.map(session => {
                const isWin = session.amount >= 0;
                return (
                  <Card key={session.id} className="border-border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {session.user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{session.user.username}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.location}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={isWin ? "default" : "destructive"}
                          className={`${isWin ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"} border`}
                        >
                          <span className="flex items-center gap-1">
                            {isWin ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {isWin ? "+" : ""}£{session.amount}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {convertMinsToHrsMins(session.length ?? 0)}
                        </span>
                        <span>{formatDateStringToDDMM(session.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
