"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, Hash, Calendar, PiggyBank } from "lucide-react";
import AddSessionSidePanel from "./AddSessionSidePanel";

interface BackingHeroProps {
  currentFloat: number;
  sessionsSinceLastChop: number;
  totalSessions: number;
  float: number;
  profitOrLoss: number;
}

const BackingHero: React.FC<BackingHeroProps> = ({
  currentFloat,
  sessionsSinceLastChop,
  totalSessions,
  float,
  profitOrLoss,
}) => {
  const isProfit = profitOrLoss >= 0;
  
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Balance */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Balance</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              £{currentFloat.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Float */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <PiggyBank className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Float</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              £{float.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Make Up */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              {isProfit ? (
                <TrendingUp className="h-4 w-4 text-primary" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className="text-xs font-medium uppercase tracking-wide">Make Up</span>
            </div>
            <p className={`text-xl md:text-2xl font-bold ${isProfit ? 'text-primary' : 'text-destructive'}`}>
              {isProfit ? '+' : '-'}£{Math.abs(profitOrLoss).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Sessions Since Chop */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Since Chop</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              {sessionsSinceLastChop}
            </p>
          </CardContent>
        </Card>

        {/* Total Sessions */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Hash className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total</span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              {totalSessions}
            </p>
          </CardContent>
        </Card>

        {/* Add Session Button */}
        <div className="col-span-2 md:col-span-1">
          <AddSessionSidePanel />
        </div>
      </div>
    </div>
  );
};

export default BackingHero;
