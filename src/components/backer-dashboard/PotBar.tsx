import React, { useState, useEffect } from "react";
interface IPotBarProps {
  total: number;
  float: number;
}

export function PotBar({ total, float }: IPotBarProps) {
  const difference = total - float;
  const circumference = 2 * Math.PI * 50; // Assuming a radius of 50

  const dashOffset = (percentage: number) =>
    circumference - (percentage / 100) * circumference;

  return (
    <svg width="26" height="26" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke="#006400" // Default darker green color
        strokeWidth="10"
      />
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke={float >= total ? "#90EE90" : "#FF0000"} // Light green for profit, red otherwise
        strokeWidth="10"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset(100)}
        strokeLinecap="round"
        transform="rotate(-90 60 60)" // Rotate the ring to start from the top and move left
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="20"
        fill="white" // Set the text color to white
      >
        {difference}
      </text>
    </svg>
  );
}
