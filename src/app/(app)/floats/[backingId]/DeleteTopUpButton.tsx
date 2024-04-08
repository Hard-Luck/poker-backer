import DeleteButton from '@/components/DeleteButton';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';

const DeleteTopUpButton = ({
  backingId,
  topupId,
}: {
  backingId: string;
  topupId: string;
}) => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.topUps.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  if (isLoading) return null;
  return (
    <DeleteButton
      onClick={() => mutate({ topupId, backingId: Number(backingId) })}
    />
  );
};

export default DeleteTopUpButton;
