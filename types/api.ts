import type { Friendship, PotAccess, Pots, Prisma, UserInfo, chop_top } from "@prisma/client";

export type FriendRequest = Friendship & {
    user: {
        username: string;
    };
    friend: {
        username: string;
    };
}

export type InputPot = Omit<Pots, 'id' | 'created_at'> & { created_at?: Date };

export type InputPotAccess = Omit<PotAccess, 'id' | 'percent'> & { percent?: number };

export type NewUserInput = Omit<UserInfo, 'id' | 'admin'>

export type ChopHistoryWithUsername = {
    tx_by: string;
    id: number;
    user_id: string;
    pot_id: number;
    chop_top: chop_top;
    amount: number;
    split: Prisma.JsonValue;
    created_at: Date;
}