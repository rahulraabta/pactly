import React from "react";

interface HeroNumberProps {
  value: string;
  label: string;
  color?: "default" | "warning" | "danger";
}

export function HeroNumber({ value, label, color = "default" }: HeroNumberProps) {
  const colorMap = {
    default: "text-text",
    warning: "text-warning",
    danger: "text-danger",
  };

  const colorClass = colorMap[color] || "text-text";

  return (
    <div className="mb-8">
      <div className={`font-display text-[3rem] font-normal leading-none tracking-tight ${colorClass}`}>
        {value}
      </div>
      <div className="text-[13px] text-text-muted mt-1 font-medium">
        {label}
      </div>
    </div>
  );
}
