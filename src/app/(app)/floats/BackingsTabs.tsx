"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContent } from "@/components/TabContent";
import { Users, UserCheck } from "lucide-react";

export type BackingForRender = { id: number; name: string; lastSession: Date };

export default function BackingTabs({
  players,
  backers,
}: {
  players: BackingForRender[];
  backers: BackingForRender[];
}) {
  const defaultTab = backers.length > 0 ? "backer" : "player";
  
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        {backers.length > 0 && (
          <TabsTrigger value="backer" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Backing</span>
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {backers.length}
            </span>
          </TabsTrigger>
        )}
        {players.length > 0 && (
          <TabsTrigger value="player" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Staked by</span>
            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {players.length}
            </span>
          </TabsTrigger>
        )}
      </TabsList>
      
      {backers.length > 0 && (
        <TabsContent value="backer" className="mt-0">
          <TabContent backings={backers} />
        </TabsContent>
      )}
      
      {players.length > 0 && (
        <TabsContent value="player" className="mt-0">
          <TabContent backings={players} />
        </TabsContent>
      )}
    </Tabs>
  );
}
