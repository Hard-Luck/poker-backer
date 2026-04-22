import DeleteButton from '@/components/DeleteButton';
import { toastDefaultError } from '@/components/utils/default-toasts';
import { trpc } from '@/lib/trpc/client';
import { parsePositiveInt } from '@/models/utils/parse';
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
      onClick={() => {
        const parsedBackingId = parsePositiveInt(backingId);

        if (!parsedBackingId) {
          toastDefaultError('Invalid backing ID.');
          return;
        }

        mutate({ topupId, backingId: parsedBackingId });
      }}
    />
  );
};

export default DeleteTopUpButton;
