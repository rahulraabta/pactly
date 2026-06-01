import React from "react";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: number; // e.g. +12 or -5
  icon?: LucideIcon;
}

export function KpiCard({ title, value, trend, icon: Icon }: KpiCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_16px_oklch(0_0_0_/_0.3)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-body font-semibold uppercase tracking-[0.08em] text-text-muted">
          {title}
        </span>
        {Icon && <Icon className="h-4 w-4 text-text-muted" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[24px] font-body font-semibold text-text">
          {value}
        </span>
        {trend !== undefined && (
          <span
            className={`text-xs font-medium flex items-center ${
              trend >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
