export type PlayerOrBacker = 'PLAYER' | 'BACKER';
export type SessionType = 'cash_game' | 'tournament';
export type ChopSplitRecord = Record<
  string,
  {
    username: string;
    percent: number;
    split: number;
  }
>;
