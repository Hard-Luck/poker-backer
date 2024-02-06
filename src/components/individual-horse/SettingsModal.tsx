import { useRouter } from 'next/router';
import { useState } from 'react';
import InputSlider from 'react-input-slider';
import { api } from '~/utils/api';
import { sumValues } from '~/utils/helper';
import { FiX } from 'react-icons/fi';
import DeleteAccessButton from './DeleteAccessButton';
import {
  toastDefaultError,
  toastDefaultSuccess,
} from '../utils/default-toasts';

export default function SettingsModal({
  pot_id,
  onClose,
}: {
  pot_id: number;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = api.potAccess.getAccessByPotId.useQuery({
    pot_id,
  });
  if (!data || isLoading)
    return (
      <div className="bg-theme-black text-center text-white">Loading...</div>
    );
  if (isError) return <p>Error: refresh, if error persists contact admin</p>;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-theme-black bg-opacity-90"
      onClick={onClose}
    >
      <div
        className="rounded-lg bg-theme-black p-6 text-center text-white"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <p className="text-2xl font-bold">Settings</p>

          <button
            className="absolute right-0 top-0 rounded-lg bg-theme-header p-1 text-2xl"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>
        <PercentageWithSliders pot_id={pot_id} access={data} />
      </div>
    </div>
  );
}

interface Access {
  user_id: string;
  percent: number;
  username: string;
}

export function PercentageWithSliders({
  pot_id,
  access,
}: {
  pot_id: number;
  access: Access[];
}) {
  const [sliderError, setSliderError] = useState<string | null>(null);
  const ctx = api.useContext();
  const { mutate } = api.potAccess.patchPercent.useMutation({
    onSuccess: () => {
      void ctx.potAccess.getAccessByPotId.invalidate();
      toastDefaultSuccess('Updated split');
    },
    onError: error => {
      toastDefaultError(error.message);
    },
  });
  const percentagesForState: { [key: string]: string } = {};
  access.forEach(({ user_id, percent }) => {
    percentagesForState[user_id] = percent.toString();
  });
  const [percentages, setPercentages] = useState(percentagesForState);

  function handleClick() {
    const sum = sumValues(percentages);
    if (sum !== 100) {
      return setSliderError('Sum of percentages must be 100');
    }
    const formattedPercentages = Object.entries(percentages).map(
      ([user_id, percent]) => ({
        user_id,
        percent: +percent,
      })
    );
    mutate({ pot_id, percentages: formattedPercentages });
  }
  function handleSliderChange(id: string, value: number) {
    setPercentages(prevPercentages => ({
      ...prevPercentages,
      [id]: value.toFixed(1),
    }));
  }

  function handleInputChange(id: string, value: string) {
    // Allow for deletion of values from the input box
    if (!isNaN(parseFloat(value)) || value === '') {
      setPercentages(prevPercentages => ({
        ...prevPercentages,
        [id]: value === '' ? '' : value,
      }));
    }
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center ">
      {access.map((player: Access) => (
        <div className="flex flex-col gap-1" key={player.user_id}>
          <p>{player.username}</p>
          <input
            className="rounded-lg p-2 text-theme-black"
            type="number"
            min={0}
            value={percentages[player.user_id]}
            onChange={e => handleInputChange(player.user_id, e.target.value)}
          />
          <InputSlider
            axis="x"
            xstep={10}
            xmin={0}
            x={parseFloat(percentages[player.user_id] || '')}
            onChange={({ x }: { x: number }) =>
              handleSliderChange(player.user_id, x)
            }
          />

          <DeleteAccessButton user_id={player.user_id} pot_id={pot_id} />
        </div>
      ))}
      <button
        className="m-2 w-fit rounded-lg bg-theme-header p-2"
        onClick={handleClick}
      >
        Update
      </button>
      {!!sliderError && <p>{sliderError}</p>}
      <UpdateFloat pot_id={pot_id} />
      <DeletePotButton pot_id={pot_id} />
    </div>
  );
}

export function DeletePotButton({ pot_id }: { pot_id: number }) {
  const [confirmMessage, setConfirmMessage] = useState(false);
  const ctx = api.useContext();
  const router = useRouter();
  const { mutate: delete_pot } = api.pots.delete.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      void router.push('/stable');
      toastDefaultSuccess('Pot deleted');
    },
    onError: error => {
      toastDefaultError(error.message);
    },
  });
  return (
    <div className="dark flex flex-col gap-2 rounded-lg  p-2 text-center text-red-500">
      {!confirmMessage && (
        <button
          className="rounded-lg bg-theme-red p-2 text-white"
          onClick={() => setConfirmMessage(true)}
        >
          Delete Pot?
        </button>
      )}
      {confirmMessage && (
        <button
          onClick={() => delete_pot({ pot_id })}
          className="rounded-lg bg-theme-red p-2 text-white"
        >
          DELETE
        </button>
      )}
      {confirmMessage && <p>This cannot be undone, click below to delete</p>}
    </div>
  );
}
function UpdateFloat({ pot_id }: { pot_id: number }) {
  const [floatValue, setFloatValue] = useState('');
  const ctx = api.useContext();
  const router = useRouter();
  const { mutate: update_float, isError } = api.pots.patchFloat.useMutation({
    onSuccess: () => {
      void ctx.invalidate();
      setFloatValue('');
      toastDefaultSuccess('Float updated');
    },
    onError: error => {
      toastDefaultError(error.message);
    },
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isNaN(Number(e.target.value))) setFloatValue(e.target.value);
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log(floatValue);

    e.preventDefault();
    update_float({ pot_id, float: +floatValue });
  }
  return (
    <form onSubmit={handleSubmit}>
      <p className="text-red-400">This is an experimenatal feature</p>
      <input
        type="text"
        value={floatValue}
        onChange={handleChange}
        className="text-right text-black"
        placeholder="0"
      />
      <button type="submit" className="m-2 rounded-lg bg-blue-400 p-2">
        Update Float
      </button>
      {isError && <p>Error: can only change float after a chop</p>}
    </form>
  );
}
