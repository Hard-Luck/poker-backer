"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContent } from "@/components/TabContent";

export type BackingForRender = { id: number; name: string; lastSession: Date };

export default function BackingTabs({
  players,
  backers,
}: {
  players: BackingForRender[];
  backers: BackingForRender[];
}) {
  return (
    <div className="container py-10">
      <Tabs defaultValue={backers.length > 0 ? "backer" : "player"}>
        <TabsList className="grid w-full grid-cols-2">
          {backers.length > 0 && (
            <TabsTrigger value="backer">Backing</TabsTrigger>
          )}
          {players.length > 0 && (
            <TabsTrigger value="player">Staked by</TabsTrigger>
          )}
        </TabsList>
        {players.length > 0 && (
          <TabsContent value="player">
            <h2 className="text-2xl font-bold mb-4">Players</h2>
            <TabContent backings={players} />
          </TabsContent>
        )}
        {backers.length > 0 && (
          <TabsContent value="backer">
            <h2 className="text-2xl font-bold mb-4">Backers</h2>
            <TabContent backings={backers} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
