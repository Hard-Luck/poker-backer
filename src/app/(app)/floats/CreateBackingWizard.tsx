'use client';
import { FC, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import Modal from 'react-modal';
import { BsXCircleFill } from 'react-icons/bs';
import {
  toastDefaultError,
  toastDefaultSuccess,
} from '../../../components/utils/default-toasts';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
type CreateBackingWizardProps = {};
const CreateBackingWizard: FC<CreateBackingWizardProps> = ({}: {}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPot, setNewPot] = useState({ name: '', float: 0 });
  const router = useRouter();
  const { mutate, isLoading } = trpc.backings.create.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  function handleSuccess() {
    setNewPot({ name: '', float: 0 });
    toastDefaultSuccess('Pot created successfully');
    setModalIsOpen(false);
    router.refresh();
  }
  function handleError() {
    toastDefaultError('Error creating pot. Could be duplicate name.');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, float } = newPot;
    mutate({ name, float });
  };
  if (!modalIsOpen) {
    return (
      <Button
        variant="default"
        className="w-28 self-center rounded-md bg-blue-500 p-2 text-white"
        onClick={() => setModalIsOpen(true)}
      >
        Create Pot
      </Button>
    );
  }
  return (
    <Modal
      style={{
        overlay: { background: '#232931' },
        content: { background: '#393e46' },
      }}
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
    >
      <div className="flex flex-col items-center">
        <Button className="" onClick={() => setModalIsOpen(false)}>
          <BsXCircleFill />
        </Button>
        <form className="flex flex-col gap-4 p-4">
          <label
            className="w-28 self-center text-center text-lg"
            htmlFor="nameInput"
          >
            Name:
          </label>
          <input
            id="nameInput"
            type="text"
            value={newPot.name}
            onChange={e => setNewPot({ ...newPot, name: e.target.value })}
            className="w-72 self-center rounded-lg p-2"
          />

          <label
            className="w-28 self-center text-center text-lg "
            htmlFor="floatInput"
          >
            Float:
          </label>
          <input
            id="floatInput"
            type="number"
            value={newPot.float}
            onChange={e =>
              setNewPot({ ...newPot, float: parseFloat(e.target.value) })
            }
            className="w-72 self-center rounded-lg p-2 text-right"
          />

          <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default CreateBackingWizard;
