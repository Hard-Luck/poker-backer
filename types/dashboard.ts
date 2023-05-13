import type { Sessions } from "@prisma/client";

export type BackedPlayer = {
    username: string;
    pot_id: number;
    float: number;
    total: number;
    percentage: number;
    user_id: string;
}
export type RecentSession = Sessions & {
    user: {
        username: string;
    };
}