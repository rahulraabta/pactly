"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Search,
  Plus,
  Check,
  X,
  PlusCircle,
  FileText,
  Clock,
  DollarSign,
  Briefcase,
  AlertTriangle,
  User,
} from "lucide-react";

interface ChangeRequest {
  id: string;
  client: string;
  project: string;
  summary: string;
  description: string;
  amount: number;
  timeImpactDays: number;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
}

const initialRequests: ChangeRequest[] = [
  {
    id: "CR-001",
    client: "Sunrise Exports",
    project: "Dashboard Redesign",
    summary: "Extra reporting module & analytics export",
    description: "Client requested CSV/PDF download capabilities along with 3 custom charts on the admin panel.",
    amount: 25000,
    timeImpactDays: 5,
    status: "Pending",
    date: "2026-05-28",
  },
  {
    id: "CR-002",
    client: "Neon Labs",
    project: "Mobile App Development",
    summary: "Biometric login (FaceID / Fingerprint)",
    description: "Add FaceID and fingerprint authentication support to iOS and Android builds.",
    amount: 40000,
    timeImpactDays: 4,
    status: "Approved",
    date: "2026-05-24",
  },
  {
    id: "CR-003",
    client: "TechFlow",
    project: "API Integration",
    summary: "Stripe Subscriptions Webhooks Setup",
    description: "Setup complex webhook retry mechanisms and local database logging for failed subscriptions.",
    amount: 15000,
    timeImpactDays: 2,
    status: "Approved",
    date: "2026-05-20",
  },
  {
    id: "CR-004",
    client: "Prism Media",
    project: "E-Commerce Website",
    summary: "Multi-currency support & checkout localization",
    description: "Client wants automated currency conversion based on user IP geolocation and translation of checkouts.",
    amount: 30000,
    timeImpactDays: 8,
    status: "Rejected",
    date: "2026-05-15",
  },
];

export default function ScopeShieldPage() {
  const [requests, setRequests] = useState<ChangeRequest[]>(initialRequests);
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [search, setSearch] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newTimeImpact, setNewTimeImpact] = useState("");

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient || !newProject || !newSummary) return;

    const newRequest: ChangeRequest = {
      id: `CR-00${requests.length + 1}`,
      client: newClient,
      project: newProject,
      summary: newSummary,
      description: newDescription,
      amount: Number(newAmount) || 0,
      timeImpactDays: Number(newTimeImpact) || 0,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setRequests([newRequest, ...requests]);
    setIsModalOpen(false);

    // Reset fields
    setNewClient("");
    setNewProject("");
    setNewSummary("");
    setNewDescription("");
    setNewAmount("");
    setNewTimeImpact("");
  };

  // Metrics
  const approvedTotal = requests
    .filter((r) => r.status === "Approved")
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingTotal = requests
    .filter((r) => r.status === "Pending")
    .reduce((sum, r) => sum + r.amount, 0);

  const approvedTimeImpact = requests
    .filter((r) => r.status === "Approved")
    .reduce((sum, r) => sum + r.timeImpactDays, 0);

  const filteredRequests = requests.filter((r) => {
    const matchesFilter = filter === "All" || r.status === filter;
    const matchesSearch =
      r.client.toLowerCase().includes(search.toLowerCase()) ||
      r.project.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-teal-400" />
            ScopeShield
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and authorize change requests before scope creep drains your profitability.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          Log Change Request
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Approved Expansion</span>
            <div className="p-2 rounded-lg bg-emerald-400/10">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{approvedTotal.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-emerald-400">Successfully billed to clients</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Pending Authorization</span>
            <div className="p-2 rounded-lg bg-yellow-400/10">
              <Clock className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{pendingTotal.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-yellow-400">Awaiting client approval signature</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Approved Schedule Expansion</span>
            <div className="p-2 rounded-lg bg-blue-400/10">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            +{approvedTimeImpact} Days
          </p>
          <p className="mt-1 text-xs text-blue-400">Buffer officially added to deadlines</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex gap-1.5 self-start sm:self-center overflow-x-auto w-full sm:w-auto">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === opt
                  ? "bg-teal-500 text-slate-950"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search change requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Request Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="p-4">ID</th>
                <th className="p-4">Project & Client</th>
                <th className="p-4">Request Summary</th>
                <th className="p-4 text-right">Value</th>
                <th className="p-4 text-center">Impact</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                    No change requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-400">{request.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{request.project}</div>
                      <div className="text-xs text-slate-400">{request.client}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="font-medium text-slate-200 line-clamp-1">{request.summary}</div>
                      <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">{request.description}</div>
                    </td>
                    <td className="p-4 text-right font-semibold text-slate-200">
                      ₹{request.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center text-xs text-slate-300">
                      {request.timeImpactDays} days
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                          request.status === "Approved"
                            ? "bg-emerald-400/10 text-emerald-400"
                            : request.status === "Pending"
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {request.status === "Pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(request.id)}
                            title="Approve Change Request"
                            className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            title="Reject Change Request"
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-slate-950 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No action required</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
              <PlusCircle className="h-5 w-5 text-teal-400" />
              Log Scope Change Request
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter details for the new scope items. Once logged, you can track or approve them.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    placeholder="e.g. Sunrise Exports"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="e.g. Dashboard Redesign"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Summary *</label>
                <input
                  type="text"
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g. Integrate CSV Analytics Exports"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed breakdown of client changes and why they are out of the original project scope..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Financial Impact (₹)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 20000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Timeline Impact (Days)</label>
                  <input
                    type="number"
                    value={newTimeImpact}
                    onChange={(e) => setNewTimeImpact(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
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
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs font-semibold text-white transition-colors"
                >
                  Log Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
