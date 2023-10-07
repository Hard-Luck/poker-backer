import { useState } from "react";
import { api } from "~/utils/api";
import Modal from "react-modal";
import { BsXCircleFill } from "react-icons/bs";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "../utils/default-toasts";

export default function CreatePotWizard({
  modalIsOpen,
  setModalIsOpen,
}: {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [newPot, setNewPot] = useState({ name: "", float: 0 });
  const ctx = api.useContext();
  const { data: userData, isLoading: userLoading } =
    api.users.getCurrentUserInfo.useQuery();

  const { mutate, isLoading } = api.pots.create.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  if (userLoading || !userData?.is_backer) return null;
  function handleSuccess() {
    void ctx.pots.invalidate();
    setNewPot({ name: "", float: 0 });
    setModalIsOpen(false);
    toastDefaultSuccess("Pot created successfully");
  }
  function handleError() {
    toastDefaultError("Error creating pot. Could be duplicate name.");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, float } = newPot;
    mutate({ name, float });
  };

  return (
    <>
      <Modal
        style={{
          overlay: { background: "#232931" },
          content: { background: "#393e46" },
        }}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <div className="flex flex-col items-center">
          <button
            className="w-fit rounded-lg bg-theme-header p-2 text-2xl text-white"
            onClick={() => setModalIsOpen(false)}
          >
            <BsXCircleFill />
          </button>
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
              onChange={(e) => setNewPot({ ...newPot, name: e.target.value })}
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
              onChange={(e) =>
                setNewPot({ ...newPot, float: parseFloat(e.target.value) })
              }
              className="w-72 self-center rounded-lg p-2 text-right"
            />

            <button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
              className="w-28 self-center rounded-md bg-blue-500 p-2 text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
