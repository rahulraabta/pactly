"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  AlertCircle,
  Activity,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { HeroNumber } from "@/components/ui/hero-number";
import { KpiCard } from "@/components/ui/kpi-card";
import { getAIConfig } from "@/actions/ai-config";
import { getDashboardData } from "@/actions/dashboard";

export default function DashboardPage() {
  const [aiActive, setAiActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    async function loadData() {
      setIsLoading(true);
      try {
        const [aiRes, dashRes] = await Promise.all([
          getAIConfig("mock-user"),
          getDashboardData()
        ]);

        if (aiRes.success && aiRes.data && aiRes.data.apiKey) {
          setAiActive(true);
        }

        if (dashRes.success && dashRes.data) {
          setDashboardData(dashRes.data);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  const { revenueData, projectHealthData, upcomingMilestones, recentActivity, kpis } = dashboardData;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top: HeroNumber + AI pill */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <HeroNumber value={kpis.totalUnpaid} label="in unpaid milestones" />
        <Link href={aiActive ? "/settings" : "/settings?tab=ai"} className="self-start">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wide border cursor-pointer transition-all duration-200 hover:-translate-y-[1px] ${
              aiActive
                ? "border-accent/30 bg-accent/5 text-accent"
                : "border-warning/30 bg-warning/5 text-warning"
            }`}
          >
            {aiActive ? "✦ AI Active" : "✦ Unlock AI →"}
          </span>
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Active Projects" value={kpis.activeProjects.toString()} trend={12} icon={Briefcase} />
        <KpiCard title="Monthly Revenue" value={kpis.monthlyRevenue} trend={8} icon={TrendingUp} />
        <KpiCard title="At-Risk Projects" value={kpis.atRisk.toString()} trend={-15} icon={AlertCircle} />
        <KpiCard title="Avg Burn Rate" value={kpis.avgBurnRate} trend={3} icon={Activity} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">Revenue Trend</h3>
            <span className="text-xs text-text-muted">Last 6 months</span>
          </div>
          <div className="h-[220px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}
                    itemStyle={{ color: "var(--text)" }}
                    labelStyle={{ color: "var(--text-muted)", fontSize: 11 }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }} activeDot={{ r: 5, fill: "var(--accent)" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Project Health */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-6">Project Health</h3>
          <div className="h-[220px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectHealthData} layout="vertical" margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }} itemStyle={{ color: "var(--text)" }} labelStyle={{ color: "var(--text-muted)", fontSize: 11 }} />
                  <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                    {projectHealthData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Milestones */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">Upcoming Milestones</h3>
            <Link href="/milestone-escrow" className="text-xs text-accent font-medium hover:text-accent-hover flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {upcomingMilestones.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-text truncate">{m.project}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">Due {m.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-text">{m.amount}</span>
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: m.statusColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface border border-border rounded-lg p-5">
          <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((act: any) => (
              <div key={act.id} className="flex justify-between items-start gap-4">
                <p className="text-[13px] text-text leading-relaxed">{act.action}</p>
                <span className="text-[11px] text-text-faint font-medium whitespace-nowrap shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}