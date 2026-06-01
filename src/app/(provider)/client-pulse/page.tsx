"use client";

import { useState } from "react";
import {
  HeartPulse,
  Plus,
  Smile,
  Meh,
  Frown,
  Calendar,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Clock,
  Briefcase,
  XCircle,
  ThumbsUp,
} from "lucide-react";

interface ClientRecord {
  id: string;
  name: string;
  project: string;
  healthScore: number;
  lastContact: string;
  feedbackSpeed: "Fast" | "Moderate" | "Slow";
  paymentBehavior: "Excellent" | "Good" | "Delayed";
  blockersCount: number;
  notes: string[];
}

const initialClients: ClientRecord[] = [
  {
    id: "CL-01",
    name: "Sunrise Exports",
    project: "Dashboard Redesign",
    healthScore: 68,
    lastContact: "2026-05-28",
    feedbackSpeed: "Slow",
    paymentBehavior: "Good",
    blockersCount: 1,
    notes: [
      "Client is slow to review design mocks.",
      "Logged a change request for analytics module, which is pending decision.",
    ],
  },
  {
    id: "CL-02",
    name: "Neon Labs",
    project: "Mobile App Development",
    healthScore: 92,
    lastContact: "2026-05-30",
    feedbackSpeed: "Fast",
    paymentBehavior: "Excellent",
    blockersCount: 0,
    notes: [
      "Extremely responsive on Slack.",
      "Just approved biometric login milestone and funded the next dev gate.",
    ],
  },
  {
    id: "CL-03",
    name: "Prism Media",
    project: "E-Commerce Website",
    healthScore: 45,
    lastContact: "2026-05-25",
    feedbackSpeed: "Slow",
    paymentBehavior: "Delayed",
    blockersCount: 2,
    notes: [
      "Overdue invoice for milestone 1 has been unpaid for 8 days.",
      "Client requested major checkout logic overhaul without signing the change request.",
    ],
  },
  {
    id: "CL-04",
    name: "TechFlow",
    project: "API Integration",
    healthScore: 85,
    lastContact: "2026-05-29",
    feedbackSpeed: "Moderate",
    paymentBehavior: "Excellent",
    blockersCount: 0,
    notes: [
      "System testing completed successfully.",
      "Client thanked the team for rapid integration.",
    ],
  },
];

export default function ClientPulsePage() {
  const [clients, setClients] = useState<ClientRecord[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);

  // Modal State for New Touchpoint/Note
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetClientId, setTargetClientId] = useState("");
  const [touchpointNote, setTouchpointNote] = useState("");
  const [newFeedbackSpeed, setNewFeedbackSpeed] = useState<ClientRecord["feedbackSpeed"]>("Moderate");
  const [newPaymentBehavior, setNewPaymentBehavior] = useState<ClientRecord["paymentBehavior"]>("Good");
  const [newHealthScore, setNewHealthScore] = useState("80");

  const handleAddTouchpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClientId || !touchpointNote) return;

    setClients(
      clients.map((c) => {
        if (c.id === targetClientId) {
          const score = Number(newHealthScore) || c.healthScore;
          return {
            ...c,
            healthScore: score > 100 ? 100 : score < 0 ? 0 : score,
            lastContact: new Date().toISOString().split("T")[0],
            feedbackSpeed: newFeedbackSpeed,
            paymentBehavior: newPaymentBehavior,
            notes: [touchpointNote, ...c.notes],
          };
        }
        return c;
      })
    );

    setIsModalOpen(false);
    setTargetClientId("");
    setTouchpointNote("");
    setSelectedClient(null); // Force close detail to refresh or sync visual
  };

  // Aggregated indicators
  const averageHealth = Math.round(clients.reduce((sum, c) => sum + c.healthScore, 0) / clients.length);
  const atRiskCount = clients.filter((c) => c.healthScore < 70).length;
  const criticalCount = clients.filter((c) => c.healthScore < 50).length;

  const getHealthEmoji = (score: number) => {
    if (score >= 80) return <Smile className="h-5 w-5 text-emerald-400" />;
    if (score >= 60) return <Meh className="h-5 w-5 text-yellow-400" />;
    return <Frown className="h-5 w-5 text-red-400" />;
  };

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-400/10 text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "bg-yellow-400/10 text-yellow-400 border-yellow-500/20";
    return "bg-red-400/10 text-red-400 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-teal-400" />
            ClientPulse
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor client health metrics, communication turnaround times, and billing risks before they impact dev velocity.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Avg Account Health</span>
            <div className="p-2 rounded-lg bg-teal-400/10">
              <HeartPulse className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">{averageHealth}%</p>
          <p className="mt-1 text-xs text-slate-400">Across all active contracts</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Accounts At Risk</span>
            <div className="p-2 rounded-lg bg-yellow-400/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{atRiskCount}</p>
          <p className="mt-1 text-xs text-slate-400">Score &lt; 70 requiring touchpoint</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Critical Red Flags</span>
            <div className="p-2 rounded-lg bg-red-400/10">
              <XCircle className="h-4 w-4 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
          <p className="mt-1 text-xs text-slate-400">Unpaid invoices or major creep</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Healthy Partnerships</span>
            <div className="p-2 rounded-lg bg-emerald-400/10">
              <ThumbsUp className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{clients.length - atRiskCount}</p>
          <p className="mt-1 text-xs text-slate-400">Steady milestones & payments</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`rounded-xl border p-5 bg-slate-900 flex flex-col justify-between gap-4 transition-all hover:border-slate-700 ${
              client.healthScore < 50
                ? "border-red-900/30"
                : client.healthScore < 70
                ? "border-yellow-900/30"
                : "border-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{client.name}</h3>
                  <p className="text-xs text-slate-450 flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-slate-500" /> Project: <span className="font-semibold text-slate-200">{client.project}</span>
                  </p>
                </div>

                <div className={`flex items-center gap-2 border rounded-full pl-3 pr-2 py-1 ${getHealthBadgeColor(client.healthScore)}`}>
                  <span className="text-xs font-bold">{client.healthScore}%</span>
                  {getHealthEmoji(client.healthScore)}
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-800/80 py-3 my-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Feedback Turn</span>
                  <span
                    className={`font-semibold ${
                      client.feedbackSpeed === "Fast"
                        ? "text-emerald-400"
                        : client.feedbackSpeed === "Moderate"
                        ? "text-slate-300"
                        : "text-red-400"
                    }`}
                  >
                    {client.feedbackSpeed}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Payment Speed</span>
                  <span
                    className={`font-semibold ${
                      client.paymentBehavior === "Excellent"
                        ? "text-emerald-400"
                        : client.paymentBehavior === "Good"
                        ? "text-slate-350"
                        : "text-red-400"
                    }`}
                  >
                    {client.paymentBehavior}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Active Blockers</span>
                  <span className={`font-semibold ${client.blockersCount > 0 ? "text-yellow-400" : "text-slate-450"}`}>
                    {client.blockersCount} Blockers
                  </span>
                </div>
              </div>

              {/* Latest Notes preview */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> Recent Log Notes
                </span>
                <p className="text-xs text-slate-350 italic line-clamp-2 leading-relaxed">
                  "{client.notes[0] || "No touchpoint notes logged yet."}"
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-800/80 pt-3 mt-2 text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Last touched: {client.lastContact}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setTargetClientId(client.id);
                    setNewFeedbackSpeed(client.feedbackSpeed);
                    setNewPaymentBehavior(client.paymentBehavior);
                    setNewHealthScore(client.healthScore.toString());
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
                >
                  Log Touchpoint
                </button>
                <button
                  onClick={() => setSelectedClient(client)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-xs font-semibold text-white rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Drawer/Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              <XCircle className="h-4 w-4" />
            </button>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{selectedClient.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Project: {selectedClient.project}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold ${getHealthBadgeColor(selectedClient.healthScore)}`}>
                  Health: {selectedClient.healthScore}%
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Communication turnaround:</span>
                  <span className="text-slate-200 font-bold">{selectedClient.feedbackSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment punctuality:</span>
                  <span className="text-slate-200 font-bold">{selectedClient.paymentBehavior}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active timeline blockers:</span>
                  <span className="text-yellow-400 font-bold">{selectedClient.blockersCount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block border-b border-slate-800 pb-1">
                  Full Sentiment & Log History
                </span>
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {selectedClient.notes.map((note, index) => (
                    <div key={index} className="flex gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5 mt-0.5 text-teal-400 shrink-0" />
                      <p className="text-slate-300 leading-normal bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 flex-1">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedClient(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Touchpoint Modal */}
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
              <HeartPulse className="h-5 w-5 text-teal-400" />
              Log Touchpoint & Re-score
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter communication logs or meeting details to automatically calculate health indexes.
            </p>

            <form onSubmit={handleAddTouchpoint} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Client *</label>
                <select
                  required
                  value={targetClientId}
                  onChange={(e) => setTargetClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.project})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback speed</label>
                  <select
                    value={newFeedbackSpeed}
                    onChange={(e) => setNewFeedbackSpeed(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Fast">Fast</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Slow">Slow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Punctuality</label>
                  <select
                    value={newPaymentBehavior}
                    onChange={(e) => setNewPaymentBehavior(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subjective Score (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newHealthScore}
                    onChange={(e) => setNewHealthScore(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Touchpoint Notes *</label>
                <textarea
                  required
                  value={touchpointNote}
                  onChange={(e) => setTouchpointNote(e.target.value)}
                  placeholder="e.g. Conducted a weekly sync. Client loved the dashboard design but raised a question about Stripe settings. Next review set for Thursday."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 resize-none"
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
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs font-semibold text-white transition-colors"
                >
                  Register Touchpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
