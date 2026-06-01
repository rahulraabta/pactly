"use client";

import React, { useState } from "react";
import { HeroNumber } from "@/components/ui/hero-number";
import { KpiCard } from "@/components/ui/kpi-card";
import { Percent, Layers, DollarSign } from "lucide-react";

interface ProjectRetro {
  id: string;
  project: string;
  quote: number;
  actual: number;
  recommendedRate: number;
  notes: string;
}

const initialMockRows: ProjectRetro[] = [
  {
    id: "PR-1",
    project: "Sunrise Portal",
    quote: 200000,
    actual: 240000,
    recommendedRate: 2500,
    notes: "ScopeShield successfully captured ₹40,000 in approved change orders.",
  },
  {
    id: "PR-2",
    project: "Neon Labs",
    quote: 150000,
    actual: 180000,
    recommendedRate: 2200,
    notes: "Client signed off on all milestones within 24 hours of notification.",
  },
  {
    id: "PR-3",
    project: "Prism Media",
    quote: 120000,
    actual: 95000,
    recommendedRate: 2000,
    notes: "Significant delay in asset delivery caused scope leak and schedule slippage.",
  },
  {
    id: "PR-4",
    project: "Aether Branding",
    quote: 80000,
    actual: 75000,
    recommendedRate: 1800,
    notes: "Underestimated logo revision cycles. Recommend setting capping rules.",
  },
  {
    id: "PR-5",
    project: "TechFlow API",
    quote: 100050,
    actual: 120000,
    recommendedRate: 2800,
    notes: "Fast integration via reuse of standard DB scaffold schemas.",
  },
];

export default function PostProjectPage() {
  const [retros] = useState<ProjectRetro[]>(initialMockRows);

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <HeroNumber value="28%" label="average profit margin" />

      {/* Top Stat Row (3 KpiCards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Avg Margin %" value="28%" icon={Percent} />
        <KpiCard title="Best Project Type" value="Mobile Apps" icon={Layers} />
        <KpiCard
          title="Recommended Rate"
          value="₹2,400/hr"
          icon={DollarSign}
        />
      </div>

      {/* Retro Table */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-text-muted font-medium">
                <th className="p-3.5">Project</th>
                <th className="p-3.5 text-right">Quote</th>
                <th className="p-3.5 text-right">Actual</th>
                <th className="p-3.5 text-center">Profit/Loss</th>
                <th className="p-3.5 text-center">Recommended Rate</th>
                <th className="p-3.5 w-1/3">Notes</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {retros.map((item) => {
                const isProfit = item.actual >= item.quote;
                return (
                  <tr key={item.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="p-3.5 font-medium text-text">{item.project}</td>
                    <td className="p-3.5 text-right font-mono text-text">
                      ₹{item.quote.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-right font-mono text-text">
                      ₹{item.actual.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          isProfit
                            ? "text-success bg-success/10 border border-success/15"
                            : "text-danger bg-danger/10 border border-danger/15"
                        }`}
                      >
                        {isProfit ? "✓ Profit" : "✗ Loss"}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-accent/10 text-accent border border-accent/15">
                        ₹{item.recommendedRate}/hr
                      </span>
                    </td>
                    <td className="p-3.5 text-text-muted leading-relaxed">
                      {item.notes}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => console.log(`Viewing report for project: ${item.project}`)}
                        className="bg-transparent border border-border hover:bg-surface-elevated text-text text-[12px] px-3 py-1 rounded-sm cursor-pointer transition-colors font-medium"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
