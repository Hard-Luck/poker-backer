import { type FC, useState } from 'react';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

type DeleteButtonProps = {
  onClick: () => void;
};
const DeleteButton: FC<DeleteButtonProps> = ({ onClick }) => {
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  if (!hasBeenClicked) {
    return (
      <Button
        variant={'default'}
        className="p-0 w-6 h-6 aspect-square"
        onClick={() => {
          setHasBeenClicked(true);
        }}
      >
        <Trash2 width={'1rem'} height={'1rem'} />
      </Button>
    );
  }
  return (
    <Button
      variant={'destructive'}
      className="p-0 w-6 h-6 aspect-square"
      onClick={onClick}
    >
      <Trash2 width={'1rem'} height={'1rem'} />
    </Button>
  );
};

export default DeleteButton;
