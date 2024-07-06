import { formatDateStringToDDMM } from '@/models/utils/timestamp';
import placeHolderImage from '../../../../public/defaultUser.jpg';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import type { FriendforFriendListWithImgUrl } from '@/models/friends';

type FriendsListProps = {
  friends: FriendforFriendListWithImgUrl[];
};

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <section className="max-w-1/2 self-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Friend Since</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {friends.map(friend => {
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
                  {formatDateStringToDDMM(friend.created_at)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
