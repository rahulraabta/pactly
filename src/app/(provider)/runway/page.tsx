"use client";

import React, { useState, useEffect } from "react";
import { HeroNumber } from "@/components/ui/hero-number";
import { KpiCard } from "@/components/ui/kpi-card";
import { Wallet, TrendingUp, Activity, Loader2 } from "lucide-react";
import { getRunways } from "@/actions/runway";

interface ProjectRunway {
  id: string;
  project: string;
  budget: number;
  spent: number;
  remaining: number;
  burnPercentage: number;
  risk: "Safe" | "Warning" | "Critical";
}

export default function RunwayPage() {
  const [projects, setProjects] = useState<ProjectRunway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getRunways();
        if (res.success && res.data) {
          setProjects(res.data);
          // Set widths to 0 initially for progress bar animation
          setWidths(res.data.map(() => 0));
        }
      } catch (err) {
        console.error("Failed to load runway data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Trigger smooth enter transition for progress bars
  useEffect(() => {
    if (projects.length > 0) {
      const timer = setTimeout(() => {
        setWidths(projects.map((p) => p.burnPercentage));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [projects]);

  // Aggregated figures
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const avgBurnRate = totalBudget > 0 ? parseFloat(
    ((totalSpent / totalBudget) * 100).toFixed(1)
  ) : 0;

  // Dynamic count of projects above 75% burn rate
  const criticalBurnCount = projects.filter((p) => p.burnPercentage > 75).length;

  const getBurnBarColor = (burn: number) => {
    if (burn < 50) return "bg-success";
    if (burn <= 75) return "bg-warning";
    return "bg-danger";
  };

  const getRiskBadgeClass = (risk: "Safe" | "Warning" | "Critical") => {
    switch (risk) {
      case "Safe":
        return "bg-success/10 text-success border border-success/20";
      case "Warning":
        return "bg-warning/10 text-warning border border-warning/20";
      case "Critical":
        return "bg-danger/10 text-danger border border-danger/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <HeroNumber
        value={`${criticalBurnCount} projects`}
        label="above 75% budget burn"
        color="danger"
      />

      {/* Top Stat Row (3 KpiCards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total Budget"
          value={`₹${totalBudget.toLocaleString("en-IN")}`}
          icon={Wallet}
        />
        <KpiCard
          title="Total Spent"
          value={`₹${totalSpent.toLocaleString("en-IN")}`}
          icon={TrendingUp}
        />
        <KpiCard
          title="Avg Burn Rate"
          value={`${avgBurnRate}%`}
          icon={Activity}
        />
      </div>

      {/* Runway Table */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-text-muted font-medium">
                <th className="p-3.5">Project</th>
                <th className="p-3.5 text-right">Budget</th>
                <th className="p-3.5 text-right">Spent</th>
                <th className="p-3.5 text-right">Remaining</th>
                <th className="p-3.5 w-1/4">Burn % Bar</th>
                <th className="p-3.5 text-center">Risk Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-faint">
                    No project runway data available.
                  </td>
                </tr>
              ) : (
                projects.map((p, index) => (
                  <tr key={p.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="p-3.5 font-medium text-text">{p.project}</td>
                    <td className="p-3.5 text-right font-mono text-text">
                      ₹{p.budget.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-right font-mono text-text">
                      ₹{p.spent.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-right font-mono text-text-muted">
                      ₹{p.remaining.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px] text-text-muted">
                          <span>{p.burnPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-surface-elevated rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-[600ms] ease-out ${getBurnBarColor(
                              p.burnPercentage
                            )}`}
                            style={{ width: `${widths[index] || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getRiskBadgeClass(
                          p.risk
                        )}`}
                      >
                        {p.risk}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
