import { Card } from "@/components/ui/card";
import { type FC } from "react";
import { type IconType } from "react-icons/lib";

type DashboardIconProps = {
  text: string;
  Icon: IconType;
};

const DashboardIcon: FC<DashboardIconProps> = ({ text, Icon }) => {
  return (
    <Card className="border-primary p-2 m-2 text-center rounded w-24 h-24 flex flex-col justify-center items-center">
      <Icon size="4em" />
      <span className="whitespace-nowrap text-sm mt-2">{text}</span>
    </Card>
  );
};

export default DashboardIcon;
