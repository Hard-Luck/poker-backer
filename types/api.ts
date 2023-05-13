import type { Friendship } from "@prisma/client";

export type FriendRequest = Friendship & {
    user: {
        username: string;
    };
    friend: {
        username: string;
    };
}