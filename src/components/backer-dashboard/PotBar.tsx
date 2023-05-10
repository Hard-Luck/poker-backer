import React, { useState, useEffect } from "react";
interface IPotBarProps {
  total: number;
  float: number;
}

export function PotBar({ total, float }: IPotBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = total / float;
    setProgress(newProgress);
  }, [total, float]);

  let barColor = "bg-red-500";
  let barWidth = `${(progress * 100).toFixed(2)}%`;

  if (progress >= 1) {
    barColor = "bg-green-500";
    barWidth = "100%";
  }

  return (
    <div className="overview-grid-item w-full">
      <div className="h-4 rounded-full bg-gray-300">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: barWidth }}
        ></div>
      </div>
    </div>
  );
}
