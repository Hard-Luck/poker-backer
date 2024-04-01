"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CommentsWithUserNameAndImgURL } from "@/models/prismaTypes";
import { ScrollArea, ScrollAreaViewport } from "@radix-ui/react-scroll-area";
import { FC } from "react";

type SessionCommentsProps = {
  comments: CommentsWithUserNameAndImgURL;
};

const SessionComments: FC<SessionCommentsProps> = ({ comments }) => {
  return (
    <ScrollArea>
      <ScrollAreaViewport className="max-h-[425px] ">
        <Table className="max-w-[375px] text-center">
          <TableBody>
            {comments.map(
              ({ user: { username, img_url }, body, created_at }) => {
                return (
                  <TableRow key={created_at.toISOString()}>
                    <TableCell>
                      <img
                        src={img_url || "/defaultUser.jpg"}
                        alt={username}
                        className="w-8 h-8 rounded-full"
                      />
                    </TableCell>
                    <TableCell>{username}</TableCell>
                    <TableCell>{body}</TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </ScrollAreaViewport>
    </ScrollArea>
  );
};

export default SessionComments;
