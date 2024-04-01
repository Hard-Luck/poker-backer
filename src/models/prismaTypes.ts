import { Prisma } from "@prisma/client";
import { findBackingWithSessionsChopsAndTopUps } from "./userBacking";
import { getFriendsNotInBacking } from "./friends";
import { getSessionWithComments } from "./sessions";

export type CompleteUserBackingWithChopsTopUpsSessions = NonNullable<
  Prisma.PromiseReturnType<typeof findBackingWithSessionsChopsAndTopUps>
>;

export type ChopsForHistoryList =
  CompleteUserBackingWithChopsTopUpsSessions["backing"]["chops"];

export type TopUpsForHistoryList =
  CompleteUserBackingWithChopsTopUpsSessions["backing"]["topUps"];

export type SessionsForHistoryList =
  CompleteUserBackingWithChopsTopUpsSessions["backing"]["session"];

export type FriendsThatAreNotInBacking = NonNullable<
  Prisma.PromiseReturnType<typeof getFriendsNotInBacking>
>;

export type CommentsWithUserNameAndImgURL = NonNullable<
  Prisma.PromiseReturnType<typeof getSessionWithComments>
>["comments"];

export type SessionOverview = Omit<
  NonNullable<Prisma.PromiseReturnType<typeof getSessionWithComments>>,
  "comments"
>;
