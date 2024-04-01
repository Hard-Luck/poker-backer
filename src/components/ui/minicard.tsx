import { FC, PropsWithChildren } from "react";

const MiniCard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-primary p-4 m-2 text-center rounded  flex flex-col">
      {children}
    </div>
  );
};

export default MiniCard;
