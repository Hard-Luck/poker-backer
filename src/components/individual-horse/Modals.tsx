import { useState } from "react";
import ReactModal from "react-modal";
import SettingsModal from "./SettingsModal";
import AddPlayerToPot from "./AddPlayerToPot";
import { TopUpWizard } from "./TopUpWizard";
import ChopButton from "./ChopButton";

export function Modals({ pot_id }: { pot_id: number }) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddToPotModalOpen, setIsAddToPotModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  return (
    <div className="m-4 flex justify-center ">
      <div className="self-center">
        <button
          className="w-30 m-4  my-1 h-12 rounded-lg  bg-blue-500 px-4  font-bold text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-gray-200 dark:hover:bg-blue-800 dark:hover:text-white"
          onClick={() => setIsSettingsModalOpen(true)}
        >
          Settings
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
      </div>
      <div className="self-center">
        <button
          className="w-30 m-4  my-1 h-12 rounded-lg  bg-blue-500 px-4  font-bold text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-gray-200 dark:hover:bg-blue-800 dark:hover:text-white"
          onClick={() => setIsAddToPotModalOpen(true)}
        >
          Add Player to Pot
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
      </div>
      <div className="self-center">
        <button
          className="w-30 m-4  my-1 h-12 rounded-lg  bg-blue-500 px-4  font-bold text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-gray-200 dark:hover:bg-blue-800 dark:hover:text-white"
          onClick={() => setIsTopUpModalOpen(true)}
        >
          Top Up
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
      </div>
      <div className="self-center">
        <ChopButton pot_id={pot_id} />
      </div>
    </div>
  );
}
