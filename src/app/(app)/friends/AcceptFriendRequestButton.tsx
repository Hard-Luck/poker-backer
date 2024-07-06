'use client';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { FaUserFriends } from 'react-icons/fa';

export default function AcceptFriendRequestButton({
  friendshipId,
}: {
  friendshipId: number;
}) {
  const [visible, setVisible] = useState(true);
  const { mutate } = trpc.friendships.acceptFriendRequest.useMutation({
    onError: () => {
      toast.error('Failed to accept friend request', {
        duration: 3000,
        position: 'top-center',
      });
    },
    onSuccess: () => {
      toast.success('Friend request accepted', {
        duration: 3000,
        position: 'top-center',
      });
      setVisible(false);
    },
  });
  if (!visible) return <p>Accepted</p>;
  return (
    <Button
      onClick={() => {
        mutate({ friendshipId });
      }}
    >
      <FaUserFriends />
      Accept
    </Button>
  );
}
