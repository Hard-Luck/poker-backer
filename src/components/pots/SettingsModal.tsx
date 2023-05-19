import { useState } from "react";
import InputSlider from "react-input-slider";
import { api } from "~/utils/api";
import { sumValues } from "~/utils/helper";

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
  if (!data || isLoading) return <div>Loading...</div>;
  if (isError) return <p>Error: refresh, if error persists contact admin</p>;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p>Setting</p>
        <PercentageWithSliders pot_id={pot_id} access={data} />
        <button onClick={onClose}>Close</button>
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
  const { mutate, data, isError, error } =
    api.potAccess.patchPercent.useMutation();
  const percentagesForState: { [key: string]: number } = {};
  access.forEach(({ user_id, percent }) => {
    percentagesForState[user_id] = percent;
  });
  const [percentages, setPercentages] = useState(percentagesForState);

  function handleClick() {
    const sum = sumValues(percentages);
    if (sum !== 100) {
      return setSliderError("Sum of percentages must be 100");
    }
    const formattedPercentages = Object.entries(percentages).map(
      ([user_id, percent]) => ({
        user_id,
        percent,
      })
    );
    mutate({ pot_id, percentages: formattedPercentages });
  }

  function handleSliderChange(id: string, value: number) {
    setPercentages((prevPercentages) => ({ ...prevPercentages, [id]: value }));
  }

  function handleInputChange(id: string, value: string) {
    // Convert string input to number
    const percentValue = parseInt(value);
    if (!isNaN(percentValue)) {
      setPercentages((prevPercentages) => ({
        ...prevPercentages,
        [id]: percentValue,
      }));
    }
  }
  return (
    <div className="flex flex-col gap-2">
      {access.map((player: Access) => (
        <div key={player.user_id}>
          <p>{player.username}</p>
          <InputSlider
            axis="x"
            xmin={0}
            x={percentages[player.user_id]}
            onChange={({ x }: { x: number }) =>
              handleSliderChange(player.user_id, x)
            }
          />
          <input
            type="number"
            min={0}
            value={percentages[player.user_id]}
            onChange={(e) => handleInputChange(player.user_id, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleClick}>Update</button>
      {!!data && <p>Updated</p>}
      {isError && <p>{error.message}</p>}
      {!!sliderError && <p>{sliderError}</p>}
    </div>
  );
}
