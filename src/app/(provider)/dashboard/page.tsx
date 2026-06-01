"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  TrendingUp,
  AlertCircle,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 67000 },
  { month: "May", revenue: 73000 },
  { month: "Jun", revenue: 89000 },
];

const projectHealthData = [
  { name: "On Track", value: 5 },
  { name: "At Risk", value: 2 },
  { name: "Delayed", value: 1 },
];

const activity = [
  {
    id: 1,
    icon: CheckCircle2,
    color: "text-emerald-400",
    text: "Milestone 3 approved by Sunrise Exports",
    time: "2h ago",
  },
  {
    id: 2,
    icon: AlertTriangle,
    color: "text-yellow-400",
    text: "Scope change requested on Dashboard Redesign",
    time: "4h ago",
  },
  {
    id: 3,
    icon: IndianRupee,
    color: "text-teal-400",
    text: "Payment of ₹35,000 released — Neon Labs",
    time: "Yesterday",
  },
  {
    id: 4,
    icon: AlertCircle,
    color: "text-red-400",
    text: "Client delay logged: 3 days — Prism Media",
    time: "Yesterday",
  },
  {
    id: 5,
    icon: CheckCircle2,
    color: "text-emerald-400",
    text: "Post-project retrospective completed — TechFlow",
    time: "2 days ago",
  },
];

const kpis = [
  {
    label: "Active Projects",
    value: "8",
    sub: "+2 this month",
    icon: Briefcase,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    label: "Revenue (MTD)",
    value: "₹89,000",
    sub: "+22% vs last month",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    label: "Overdue Tasks",
    value: "3",
    sub: "Across 2 projects",
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    label: "Avg Health Score",
    value: "74/100",
    sub: "2 clients at risk",
    icon: HeartPulse,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Good morning — here's your project overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">{kpi.label}</span>
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="mt-1 text-xs text-slate-400">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="xl:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Revenue Trend</h2>
            <span className="text-xs text-slate-400">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="url(#revGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project health */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Project Health</h2>
            <span className="text-xs text-slate-400">8 active</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={projectHealthData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="value"
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
                label={{ position: "right", fontSize: 11, fill: "#94a3b8" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity feed + Quick stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="xl:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {activity.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{item.text}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {item.time}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick stats */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h2 className="text-sm font-semibold">This Week</h2>
          {[
            { label: "Scope changes logged", value: "4", icon: Clock },
            { label: "Milestones hit", value: "6", icon: CheckCircle2 },
            { label: "Client delays", value: "2", icon: AlertTriangle },
            { label: "Invoices pending", value: "₹1.2L", icon: IndianRupee },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Icon className="h-4 w-4" />
                  {stat.label}
                </div>
                <span className="text-sm font-semibold">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
