import DeleteButton from '@/components/DeleteButton';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';

const DeleteSessionButton = ({ sessionId }: { sessionId: number }) => {
  const router = useRouter();
  const { mutate, isLoading } = trpc.sessions.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  if (isLoading) return null;
  return (
    <DeleteButton
      onClick={() => {
        mutate({ sessionId });
      }}
    />
  );
};

export default DeleteSessionButton;
