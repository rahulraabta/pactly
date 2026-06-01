"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Timer,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  HelpCircle,
  Trash2,
} from "lucide-react";

interface DelayRecord {
  id: string;
  project: string;
  type: "Client" | "Team" | "External";
  description: string;
  days: number;
  date: string;
  status: "Acknowledged" | "Disputed" | "Pending";
}

const initialDelays: DelayRecord[] = [
  {
    id: "DEL-001",
    project: "Dashboard Redesign",
    type: "Client",
    description: "Feedback on Figma wireframes delayed by 5 business days.",
    days: 5,
    date: "2026-05-27",
    status: "Acknowledged",
  },
  {
    id: "DEL-002",
    project: "Mobile App Development",
    type: "External",
    description: "App Store review process took longer than usual.",
    days: 4,
    date: "2026-05-22",
    status: "Acknowledged",
  },
  {
    id: "DEL-003",
    project: "E-Commerce Website",
    type: "Client",
    description: "Stripe API credential handover delayed.",
    days: 3,
    date: "2026-05-18",
    status: "Pending",
  },
  {
    id: "DEL-004",
    project: "API Integration",
    type: "Team",
    description: "Database refactoring required additional performance debugging.",
    days: 2,
    date: "2026-05-10",
    status: "Acknowledged",
  },
];

export default function DelayLedgerPage() {
  const [delays, setDelays] = useState<DelayRecord[]>(initialDelays);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Client" | "Team" | "External">("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newType, setNewType] = useState<"Client" | "Team" | "External">("Client");
  const [newDescription, setNewDescription] = useState("");
  const [newDays, setNewDays] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject || !newDescription || !newDays) return;

    const newRecord: DelayRecord = {
      id: `DEL-00${delays.length + 1}`,
      project: newProject,
      type: newType,
      description: newDescription,
      days: Number(newDays) || 1,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    setDelays([newRecord, ...delays]);
    setIsModalOpen(false);

    setNewProject("");
    setNewType("Client");
    setNewDescription("");
    setNewDays("");
  };

  const handleStatusChange = (id: string, newStatus: "Acknowledged" | "Disputed" | "Pending") => {
    setDelays(
      delays.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const handleDelete = (id: string) => {
    setDelays(delays.filter((d) => d.id !== id));
  };

  // Metrics
  const clientDays = delays.filter((d) => d.type === "Client").reduce((sum, d) => sum + d.days, 0);
  const teamDays = delays.filter((d) => d.type === "Team").reduce((sum, d) => sum + d.days, 0);
  const externalDays = delays.filter((d) => d.type === "External").reduce((sum, d) => sum + d.days, 0);
  const totalDays = clientDays + teamDays + externalDays;

  // Chart Data
  const chartData = [
    { name: "Client Delays", days: clientDays, fill: "#eab308" },
    { name: "Team Delays", days: teamDays, fill: "#f87171" },
    { name: "External Delays", days: externalDays, fill: "#38bdf8" },
  ];

  const filteredDelays = delays.filter((d) => {
    const matchesFilter = filterType === "All" || d.type === filterType;
    const matchesSearch =
      d.project.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Timer className="h-6 w-6 text-yellow-500" />
            DelayLedger
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track client-induced delays to automatically extend contract deadlines and prove milestones are blocked.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          Log Delay Record
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Delay Registered</span>
            <div className="p-2 rounded-lg bg-yellow-400/10">
              <Clock className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">{totalDays} Days</p>
          <p className="mt-1 text-xs text-slate-400">Aggregated across all projects</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Client Responsibility</span>
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-500">{clientDays} Days</p>
          <p className="mt-1 text-xs text-emerald-400">Protects your deadline milestones</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">External Responsibility</span>
            <div className="p-2 rounded-lg bg-sky-400/10">
              <HelpCircle className="h-4 w-4 text-sky-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-sky-400">{externalDays} Days</p>
          <p className="mt-1 text-xs text-slate-400">Forces of nature / 3rd party APIs</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Team Responsibility</span>
            <div className="p-2 rounded-lg bg-red-400/10">
              <XCircle className="h-4 w-4 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{teamDays} Days</p>
          <p className="mt-1 text-xs text-red-400">Freelancer/internal slippage</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-sm font-semibold mb-4">Attribution Breakdown (Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-2">Proactive Protection Tip</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a client delays asset delivery or review signatures, it triggers immediate downstream timeline slippage. By logging it in the DelayLedger, you automatically generate time-stamped proof to share with the client and attach to payment milestone dates.
            </p>
          </div>
          <div className="border-t border-slate-800 pt-3 mt-4 text-xs text-slate-300">
            <span className="font-semibold text-yellow-500">Contract Rule:</span> Every 1 day of Client delay defaults to an automatic 1.5 days extension of the delivery milestone.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex gap-1.5 self-start sm:self-center overflow-x-auto w-full sm:w-auto">
          {(["All", "Client", "Team", "External"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterType === type
                  ? "bg-yellow-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search delay records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="p-4">ID</th>
                <th className="p-4">Project</th>
                <th className="p-4">Type</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Days</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Attribution</th>
                <th className="p-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDelays.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-sm">
                    No delay logs recorded.
                  </td>
                </tr>
              ) : (
                filteredDelays.map((delay) => (
                  <tr key={delay.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400">{delay.id}</td>
                    <td className="p-4 font-semibold text-slate-200">{delay.project}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          delay.type === "Client"
                            ? "bg-yellow-400/10 text-yellow-400"
                            : delay.type === "External"
                            ? "bg-sky-400/10 text-sky-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {delay.type}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-300 max-w-sm">{delay.description}</td>
                    <td className="p-4 text-center font-semibold text-slate-200">
                      +{delay.days} Days
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`text-xs ${
                          delay.status === "Acknowledged"
                            ? "text-emerald-400"
                            : delay.status === "Disputed"
                            ? "text-red-400"
                            : "text-slate-400"
                        }`}
                      >
                        {delay.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusChange(delay.id, "Acknowledged")}
                          className="px-2 py-1 text-[10px] rounded border border-slate-700 bg-slate-800 text-emerald-400 hover:bg-slate-700"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => handleStatusChange(delay.id, "Disputed")}
                          className="px-2 py-1 text-[10px] rounded border border-slate-700 bg-slate-800 text-red-400 hover:bg-slate-700"
                        >
                          Dispute
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(delay.id)}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <XCircle className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-yellow-500" />
              Log Delay Event
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Create an official record of delays for timeline buffer reconciliation.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project *</label>
                  <input
                    type="text"
                    required
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="e.g. Dashboard Redesign"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Attribution Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="Client">Client (Wireframe reviews, Handover)</option>
                    <option value="External">External (APIs, Server uptime, Review gates)</option>
                    <option value="Team">Team (Internal delay, illness, tech debt)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Impact Duration (Days) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newDays}
                  onChange={(e) => setNewDays(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Delay Description *</label>
                <textarea
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the blocker in detail. Why did it happen and what is the concrete schedule impact?"
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-xs font-semibold text-white transition-colors"
                >
                  Register Delay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
