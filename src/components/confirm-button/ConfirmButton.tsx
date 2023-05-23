import React, { useState } from "react";

interface ConfirmButtonProps {
  confirmMessage: string;
  buttonLabel: string;
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

  const handleClick = () => {
    if (showConfirmation) {
      onConfirm();
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      {showConfirmation ? (
        <div>
          <p>{confirmMessage}</p>
          <button
            className={`${className || ""} bg-green-500`}
            onClick={onConfirm}
            disabled={disabled}
          >
            Confirm
          </button>
          <button
            className={`${className || ""} bg-red-500`}
            onClick={handleCancel}
          >
            Cancel
          </button>
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
