import type { Friendship, PotAccess, Pots, UserInfo } from "@prisma/client";

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