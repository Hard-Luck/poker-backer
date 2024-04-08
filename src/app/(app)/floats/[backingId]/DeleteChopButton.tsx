import DeleteButton from '@/components/DeleteButton';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';

const DeleteChopButton = ({ chopId }: { chopId: string }) => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.chops.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  if (isLoading) return null;
  return <DeleteButton onClick={() => mutate({ chopId })} />;
};

export default DeleteChopButton;
