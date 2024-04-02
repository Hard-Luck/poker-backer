import { FC, PropsWithChildren } from 'react';
type MiniCardProps = {
  alternateColor?: 'blue' | 'red';
};
const MiniCard: FC<PropsWithChildren<MiniCardProps>> = ({
  children,
  alternateColor,
}) => {
  const bgColors = {
    blue: 'bg-blue-400',
    red: 'bg-red-500',
    green: 'bg-primary',
  };
  const bg = bgColors[alternateColor || 'green'];

  return (
    <div className={`${bg} p-4 m-2 text-center rounded  flex flex-col`}>
      {children}
    </div>
  );
};

export default MiniCard;
