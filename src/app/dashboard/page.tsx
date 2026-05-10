"use client";

import { Briefcase, CheckCircle, IndianRupee, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const kpis = [
  {
    label: "Active Projects",
    value: "12",
    subtitle: "+2 this month",
    icon: Briefcase,
  },
  {
    label: "Open Tasks",
    value: "48",
    subtitle: "12 due today",
    icon: CheckCircle,
  },
  {
    label: "Pending Invoices",
    value: "₹4,25,000",
    subtitle: "₹1,20,000 overdue",
    icon: IndianRupee,
  },
  {
    label: "Client Pulse Score",
    value: "8.4",
    subtitle: "+0.2 last week",
    icon: TrendingUp,
  },
] as const;

const deliveryTrend = [
  { week: "W1", deliveries: 18 },
  { week: "W2", deliveries: 25 },
  { week: "W3", deliveries: 22 },
  { week: "W4", deliveries: 30 },
  { week: "W5", deliveries: 28 },
  { week: "W6", deliveries: 35 },
];

const activities = [
  {
    client: "Mehta & Associates",
    action: "Payment of ₹75,000 received",
    time: "Today, 2:45 PM",
    color: "bg-teal-500",
  },
  {
    client: "Sunrise Exports",
    action: "Project deadline delayed by 3 days",
    time: "Today, 11:20 AM",
    color: "bg-red-500",
  },
  {
    client: "Pinnacle Infra",
    action: "Proposal approved for Phase 2",
    time: "Yesterday, 6:10 PM",
    color: "bg-blue-500",
  },
  {
    client: "GreenLeaf Organics",
    action: "Payment of ₹1,20,000 received",
    time: "Yesterday, 3:30 PM",
    color: "bg-teal-500",
  },
  {
    client: "Nova Digital",
    action: "Campaign budget approved",
    time: "May 2, 10:00 AM",
    color: "bg-blue-500",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good morning 👋</h1>
          <p className="text-gray-500">Sunday, 10 May 2026</p>
        </div>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(({ label, value, subtitle, icon: Icon }) => (
          <div
            key={label}
            className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <Icon className="h-5 w-5 text-teal-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Delivery Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={deliveryTrend}>
              <defs>
                <linearGradient id="tealFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="deliveries"
                stroke="#0d9488"
                strokeWidth={3}
                fill="url(#tealFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-8">
            {activities.map(({ client, action, time, color }, i) => (
              <div key={i} className="relative flex gap-4">
                {/* dot + vertical line */}
                <div className="flex flex-col items-center">
                  <div className={`mt-1.5 h-3 w-3 rounded-full ${color} ring-4 ring-white`} />
                  {i < activities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-100 mt-2" />
                  )}
                </div>

                <div className="pb-2">
                  <p className="text-sm">
                    <span className="font-semibold text-gray-900">{client}</span>{" "}
                    <span className="text-gray-600">{action}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
