import { FriendforFriendListWithImgUrl } from "@/models/friends";
import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Image from "next/image";
import placeHolderImage from "../../../../public/defaultUser.jpg";
import AcceptFriendRequestButton from "./AcceptFriendRequestButton";

type FriendsRequestListProps = {
  friendRequests: FriendforFriendListWithImgUrl[];
  sentFriendRequests: FriendforFriendListWithImgUrl[];
};

const FriendRequestList: FC<FriendsRequestListProps> = ({
  friendRequests,
  sentFriendRequests,
}) => {
  return (
    <section className="">
      {friendRequests.length > 0 && (
        <div>
          <h3>Requests</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Accept?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {friendRequests.map((friend) => {
                return (
                  <TableRow key={friend.friend_id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={friend.friend?.img_url || placeHolderImage}
                          alt="Profile Image"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{friend.friend.username}</TableCell>
                    <TableCell>
                      <AcceptFriendRequestButton friendshipId={friend.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {sentFriendRequests.length > 0 && (
        <div>
          <h3>Sent Friend Requests</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead className="w-[100px]">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentFriendRequests.map((friend) => {
                return (
                  <TableRow key={friend.friend_id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Image
                          src={friend.friend?.img_url || placeHolderImage}
                          alt="Profile Image"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{friend.friend.username}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default FriendRequestList;
