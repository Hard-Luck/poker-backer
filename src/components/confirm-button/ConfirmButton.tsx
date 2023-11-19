import React, { useState } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

interface ConfirmButtonProps {
  confirmMessage?: string;
  buttonLabel: React.ReactNode | string;
  onConfirm: () => void;
  className?: string;
  disabled: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  confirmMessage,
  buttonLabel,
  onConfirm,
  className,
  disabled,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setShowConfirmation(false);
  };
  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      {showConfirmation ? (
        <div className="flex flex-col items-center">
          <p className="text-center text-sm text-white">{confirmMessage}</p>
          <div className="flex">
            <button
              className="my-2 mb-2 mr-2 rounded-lg  bg-theme-green px-2 py-2 text-center text-sm font-medium text-white"
              onClick={handleConfirm}
              disabled={disabled}
            >
              <FiCheck />
            </button>
            <button
              className="my-2 mb-2 mr-2 rounded-lg  bg-theme-red px-2 py-2 text-center text-sm font-medium text-white"
              onClick={handleCancel}
            >
              <FiX />
            </button>
          </div>
        </div>
      ) : (
        <button className={className} onClick={handleClick} disabled={disabled}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default ConfirmButton;
