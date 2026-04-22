import { Card, CardContent } from "@/components/ui/card";
import { type FC } from "react";
import { type IconType } from "react-icons/lib";

type DashboardIconProps = {
  text: string;
  Icon: IconType;
};

const DashboardIcon: FC<DashboardIconProps> = ({ text, Icon }) => {
  return (
    <Card className="group border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md h-full">
      <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center gap-2 h-full">
        <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
          {text}
        </span>
      </CardContent>
    </Card>
  );
};

export default DashboardIcon;
