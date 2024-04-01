import { FC, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import placeHolderImage from "../../../../public/defaultUser.jpg";
import Image from "next/image";
import { getSessionWithComments } from "@/models/sessions";
import { getUserAuth } from "@/lib/auth/utils";
import { notFound } from "next/navigation";
import AddComment from "./AddComment";
import SessionOverview from "./SessionOverview";
import SessionComments from "./SessionComments";

type SessionProps = {
  params: { sessionId: string };
};

const Session: FC<SessionProps> = async ({ params }) => {
  const sessionId = Number(params.sessionId);
  const { session: authSession } = await getUserAuth();
  const userId = authSession?.user.id as string;
  const session = await getSessionWithComments({ sessionId, userId });
  if (!session) {
    return notFound();
  }
  return (
    <main>
      <SessionOverview session={session} />
      <SessionComments comments={session.comments} />
      <AddComment />
    </main>
  );
};

export default Session;
