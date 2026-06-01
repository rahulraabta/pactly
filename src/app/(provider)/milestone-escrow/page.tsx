"use client";

import { useState } from "react";
import {
  WalletCards,
  Plus,
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  DollarSign,
  ArrowRight,
  XCircle,
} from "lucide-react";

interface Milestone {
  id: string;
  project: string;
  title: string;
  amount: number;
  status: "Funded" | "In_Progress" | "Reviewing" | "Released" | "Disputed";
  dueDate: string;
  fundingTx?: string;
}

const initialMilestones: Milestone[] = [
  {
    id: "MS-101",
    project: "Dashboard Redesign",
    title: "Wireframes & Style Guide",
    amount: 15000,
    status: "Released",
    dueDate: "2026-05-15",
    fundingTx: "tx_901389",
  },
  {
    id: "MS-102",
    project: "Dashboard Redesign",
    title: "Main Dashboard UI Dev",
    amount: 25000,
    status: "Reviewing",
    dueDate: "2026-06-05",
    fundingTx: "tx_904721",
  },
  {
    id: "MS-103",
    project: "Dashboard Redesign",
    title: "Analytics Integration & Handover",
    amount: 20000,
    status: "Funded",
    dueDate: "2026-06-25",
    fundingTx: "tx_907489",
  },
  {
    id: "MS-201",
    project: "Mobile App Development",
    title: "Authentication & User Profiling",
    amount: 30000,
    status: "Released",
    dueDate: "2026-05-20",
    fundingTx: "tx_883012",
  },
  {
    id: "MS-202",
    project: "Mobile App Development",
    title: "Push Notification Service Setup",
    amount: 15000,
    status: "In_Progress",
    dueDate: "2026-06-12",
    fundingTx: "tx_891390",
  },
  {
    id: "MS-301",
    project: "E-Commerce Website",
    title: "Cart & Checkout Flow Optimization",
    amount: 25000,
    status: "Disputed",
    dueDate: "2026-05-30",
    fundingTx: "tx_879201",
  },
];

export default function MilestoneEscrowPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [activeTab, setActiveTab] = useState<"All" | "Funded" | "Active" | "Completed" | "Disputed">("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject || !newTitle || !newAmount || !newDueDate) return;

    const newMs: Milestone = {
      id: `MS-${Math.floor(100 + Math.random() * 900)}`,
      project: newProject,
      title: newTitle,
      amount: Number(newAmount) || 0,
      status: "Funded",
      dueDate: newDueDate,
      fundingTx: `tx_${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setMilestones([...milestones, newMs]);
    setIsModalOpen(false);

    setNewProject("");
    setNewTitle("");
    setNewAmount("");
    setNewDueDate("");
  };

  const handleRequestReview = (id: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, status: "Reviewing" } : m))
    );
  };

  const handleRelease = (id: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, status: "Released" } : m))
    );
  };

  const handleRaiseDispute = (id: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, status: "Disputed" } : m))
    );
  };

  const handleResolveDispute = (id: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, status: "In_Progress" } : m))
    );
  };

  // Metrics calculation
  const totalContract = milestones.reduce((sum, m) => sum + m.amount, 0);
  const releasedTotal = milestones.filter((m) => m.status === "Released").reduce((sum, m) => sum + m.amount, 0);
  const fundedTotal = milestones.filter((m) => m.status === "Funded").reduce((sum, m) => sum + m.amount, 0);
  const activeReviewTotal = milestones.filter((m) => m.status === "Reviewing").reduce((sum, m) => sum + m.amount, 0);
  const disputedTotal = milestones.filter((m) => m.status === "Disputed").reduce((sum, m) => sum + m.amount, 0);

  // Total secured in escrow right now (Funded + Reviewing + In Progress + Disputed)
  const securedInEscrow = totalContract - releasedTotal;

  const filteredMilestones = milestones.filter((m) => {
    if (activeTab === "All") return true;
    if (activeTab === "Funded") return m.status === "Funded";
    if (activeTab === "Active") return m.status === "In_Progress" || m.status === "Reviewing";
    if (activeTab === "Completed") return m.status === "Released";
    if (activeTab === "Disputed") return m.status === "Disputed";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <WalletCards className="h-6 w-6 text-teal-400" />
            MilestoneEscrow
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Secure client deposits in trusted contractual milestones. Work only when funds are locked.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Milestone Schedule
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Contract Value</span>
            <div className="p-2 rounded-lg bg-teal-400/10">
              <TrendingUp className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{totalContract.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-400">Across all milestones</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Locked in Escrow</span>
            <div className="p-2 rounded-lg bg-emerald-400/10">
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            ₹{securedInEscrow.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-emerald-400">Guaranteed client funds</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Released Payout</span>
            <div className="p-2 rounded-lg bg-blue-400/10">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            ₹{releasedTotal.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-blue-400">Paid out to bank account</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Escrow in Dispute</span>
            <div className="p-2 rounded-lg bg-red-400/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">
            ₹{disputedTotal.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-red-400">Subject to arbitration review</p>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          {(["All", "Funded", "Active", "Completed", "Disputed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-teal-500 text-slate-950 shadow"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Shield className="h-3.5 w-3.5 text-teal-400" />
          Escrow Engine Active: <span className="font-semibold text-emerald-400">100% Secure</span>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
            <WalletCards className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No milestones in this category.</p>
            <p className="text-xs text-slate-500 mt-1">Create a schedule or check other filter options.</p>
          </div>
        ) : (
          filteredMilestones.map((ms) => (
            <div
              key={ms.id}
              className={`rounded-xl border p-5 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                ms.status === "Released"
                  ? "border-emerald-900/40 bg-emerald-950/5"
                  : ms.status === "Disputed"
                  ? "border-red-900/40 bg-red-950/5"
                  : ms.status === "Reviewing"
                  ? "border-yellow-900/40 bg-yellow-950/5"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {ms.id}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                      ms.status === "Released"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : ms.status === "Reviewing"
                        ? "bg-yellow-400/10 text-yellow-400"
                        : ms.status === "Disputed"
                        ? "bg-red-400/10 text-red-400"
                        : ms.status === "Funded"
                        ? "bg-sky-400/10 text-sky-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {ms.status === "Reviewing" ? "Awaiting Client Review" : ms.status}
                  </span>
                  {ms.fundingTx && (
                    <span className="text-[10px] font-mono text-slate-500 hover:underline cursor-pointer">
                      TX: {ms.fundingTx}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-100">{ms.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Project: <span className="text-slate-200 font-semibold">{ms.project}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Target Date: <span className="text-slate-300">{ms.dueDate}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Value locked</div>
                  <div className="text-xl font-bold text-slate-100">₹{ms.amount.toLocaleString()}</div>
                </div>

                <div className="flex gap-2">
                  {ms.status === "In_Progress" && (
                    <button
                      onClick={() => handleRequestReview(ms.id)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      Request Release <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {ms.status === "Funded" && (
                    <button
                      onClick={() => {
                        setMilestones(
                          milestones.map((m) => (m.id === ms.id ? { ...m, status: "In_Progress" } : m))
                        );
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
                    >
                      Start Work
                    </button>
                  )}

                  {ms.status === "Reviewing" && (
                    <>
                      <button
                        onClick={() => handleRelease(ms.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        Approve Release
                      </button>
                      <button
                        onClick={() => handleRaiseDispute(ms.id)}
                        className="px-3 py-1.5 bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Raise Dispute
                      </button>
                    </>
                  )}

                  {ms.status === "Disputed" && (
                    <button
                      onClick={() => handleResolveDispute(ms.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-yellow-500 rounded-lg border border-slate-700 transition-colors"
                    >
                      Resolve Dispute
                    </button>
                  )}

                  {ms.status === "Released" && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Disbursed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
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
              <Shield className="h-5 w-5 text-teal-400" />
              Add Milestone Escrow
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Set up a structured deliverable with locked client funds in a smart billing flow.
            </p>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Core Page Development & QA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deposit Amount (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">₹</span>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 leading-normal">
                <span className="font-semibold text-teal-400 flex items-center gap-1.5 mb-1">
                  <Shield className="h-3.5 w-3.5" /> Client Deposit Terms
                </span>
                Upon logging, this milestone assumes deposit funding. The client must authorize the deposit or fund it via their Pactly client dashboard before work commences.
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
                  Create & Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
