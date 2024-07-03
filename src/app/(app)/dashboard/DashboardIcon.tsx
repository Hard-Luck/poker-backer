import { FC } from 'react';
import { IconType } from 'react-icons/lib';

type DashboardIconProps = {
  text: string;
  Icon: IconType;
};

const DashboardIcon: FC<DashboardIconProps> = ({ text, Icon }) => {
  return (
    <div className="bg-primary p-4 m-2 text-center rounded aspect-square flex flex-col">
      <Icon size="6em" />
      <span className="text-2xl">{text}</span>
    </div>
  );
};

export default DashboardIcon;
