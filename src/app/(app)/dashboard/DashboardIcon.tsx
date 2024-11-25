import { Card } from "@/components/ui/card";
import { type FC } from "react";
import { type IconType } from "react-icons/lib";

type DashboardIconProps = {
  text: string;
  Icon: IconType;
};

const DashboardIcon: FC<DashboardIconProps> = ({ text, Icon }) => {
  return (
    <Card className="border-primary p-4 m-2 text-center rounded aspect-square flex flex-col">
      <Icon size="6em" />
      <span className="text-2xl">{text}</span>
    </Card>
  );
};

export default DashboardIcon;
