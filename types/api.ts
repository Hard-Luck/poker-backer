import type {
  Friendship,
  PotAccess,
  Pots,
  Prisma,
  UserInfo,
} from '@prisma/client';

export type FriendRequest = Friendship & {
  user: {
    username: string;
    img_url: string | null;
  };
  friend: {
    username: string;
    img_url: string | null;
  };
};

export type InputPot = Omit<Pots, 'id' | 'created_at'> & { created_at?: Date };

export type InputPotAccess = Omit<PotAccess, 'id' | 'percent'> & {
  percent?: number;
};

export type NewUserInput = Omit<UserInfo, 'id' | 'admin'>;

export type ChopHistoryWithUsername = {
  tx_by: string;
  id: number;
  user_id: string;
  pot_id: number;
  amount: number;
  split: Prisma.JsonValue;
  created_at: Date;
};
