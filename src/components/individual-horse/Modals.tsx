import { useState } from "react";
import ReactModal from "react-modal";
import SettingsModal from "./SettingsModal";
import AddPlayerToPot from "./AddPlayerToPot";
import { TopUpWizard } from "./TopUpWizard";
import ChopButton from "./ChopButton";
import { FiSettings, FiUserPlus, FiDollarSign } from "react-icons/fi";

export function Modals({ pot_id }: { pot_id: number }) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddToPotModalOpen, setIsAddToPotModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  return (
    <div className="mt-2 h-9 text-lg flex items-center">
      <button
        className=" mr-2 rounded-lg bg-theme-header p-2"
        onClick={() => setIsSettingsModalOpen(true)}
      >
        <FiSettings />
      </button>

      <ReactModal
        isOpen={isSettingsModalOpen}
        onRequestClose={() => setIsSettingsModalOpen(false)}
      >
        <SettingsModal
          pot_id={pot_id}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      </ReactModal>

      <button
        className=" mr-2 rounded-lg bg-theme-header p-2"
        onClick={() => setIsAddToPotModalOpen(true)}
      >
        <FiUserPlus />
      </button>

      <ReactModal
        isOpen={isAddToPotModalOpen}
        onRequestClose={() => setIsAddToPotModalOpen(false)}
      >
        <AddPlayerToPot
          onClose={() => setIsAddToPotModalOpen(false)}
          pot_id={pot_id}
        />
      </ReactModal>

      <button
        className=" mr-2 rounded-lg bg-theme-header p-2"
        onClick={() => setIsTopUpModalOpen(true)}
      >
        <FiDollarSign />
      </button>

      <ReactModal
        isOpen={isTopUpModalOpen}
        onRequestClose={() => setIsTopUpModalOpen(false)}
      >
        <TopUpWizard
          pot_id={pot_id}
          onClose={() => setIsTopUpModalOpen(false)}
        />
      </ReactModal>

      <ChopButton pot_id={pot_id} />
    </div>
  );
}
