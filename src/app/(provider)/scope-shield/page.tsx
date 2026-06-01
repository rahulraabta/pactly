"use client";

import React, { useState } from "react";
import { HeroNumber } from "@/components/ui/hero-number";
import { Plus, X } from "lucide-react";

interface ChangeOrder {
  id: string;
  project: string;
  description: string;
  costImpact: number;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
}

const initialMockData: ChangeOrder[] = [
  {
    id: "CO-1",
    project: "Sunrise Portal",
    description: "Extra database backup replication node setup",
    costImpact: 45000,
    status: "Approved",
    date: "2026-05-28",
  },
  {
    id: "CO-2",
    project: "Neon Labs",
    description: "Biometrics login support (FaceID/Fingerprint)",
    costImpact: 60000,
    status: "Approved",
    date: "2026-05-24",
  },
  {
    id: "CO-3",
    project: "Prism Media",
    description: "Multi-currency checkout localization",
    costImpact: 50000,
    status: "Pending",
    date: "2026-05-20",
  },
  {
    id: "CO-4",
    project: "Aether Branding",
    description: "Animated logo variation iterations",
    costImpact: 25000,
    status: "Rejected",
    date: "2026-05-15",
  },
  {
    id: "CO-5",
    project: "Sunrise Portal",
    description: "Stripe invoice recurring sub-webhooks integration",
    costImpact: 140000,
    status: "Approved",
    date: "2026-05-10",
  },
];

export default function ScopeShieldPage() {
  const [data, setData] = useState<ChangeOrder[]>(initialMockData);
  const [selectedProject, setSelectedProject] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new change order
  const [projectInput, setProjectInput] = useState("Sunrise Portal");
  const [descInput, setDescInput] = useState("");
  const [costInput, setCostInput] = useState("");
  const [statusInput, setStatusInput] = useState<"Approved" | "Pending" | "Rejected">("Pending");
  const [dateInput, setDateInput] = useState("");

  const handleAddChangeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descInput || !costInput) return;

    const newOrder: ChangeOrder = {
      id: `CO-${data.length + 1}`,
      project: projectInput,
      description: descInput,
      costImpact: parseFloat(costInput) || 0,
      status: statusInput,
      date: dateInput || new Date().toISOString().split("T")[0],
    };

    setData([newOrder, ...data]);
    setIsModalOpen(false);

    // Reset fields
    setDescInput("");
    setCostInput("");
    setStatusInput("Pending");
    setDateInput("");
  };

  // Filtered rows
  const filteredData = data.filter((row) => {
    const projectMatch = selectedProject === "All" || row.project === selectedProject;
    const statusMatch = selectedStatus === "All" || row.status === selectedStatus;
    return projectMatch && statusMatch;
  });

  // Calculate approved total for the HeroNumber dynamically
  const approvedTotal = data
    .filter((row) => row.status === "Approved")
    .reduce((sum, row) => sum + row.costImpact, 0);

  // Formatting approved total for HeroNumber
  const formattedTotal = `₹${approvedTotal.toLocaleString("en-IN")}`;

  // Unique project names for filter dropdown
  const uniqueProjects = Array.from(new Set(data.map((item) => item.project)));

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <HeroNumber value={formattedTotal} label="in approved change orders" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white text-[13px] px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer"
        >
          + Add Change Order
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 justify-start items-center">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-surface border border-border text-text text-[13px] py-1.5 px-3 rounded-sm focus:outline-none focus:border-accent"
          style={{ boxShadow: "none" }}
        >
          <option value="All">All Projects</option>
          {uniqueProjects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-surface border border-border text-text text-[13px] py-1.5 px-3 rounded-sm focus:outline-none focus:border-accent"
          style={{ boxShadow: "none" }}
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-text-muted font-medium">
                <th className="p-3.5">Project</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 text-right">Cost Impact</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-faint">
                    No change orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="p-3.5 font-medium text-text">{row.project}</td>
                    <td className="p-3.5 text-text-muted">{row.description}</td>
                    <td className="p-3.5 text-right font-mono text-text">
                      ₹{row.costImpact.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          row.status === "Approved"
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : row.status === "Pending"
                            ? "bg-warning/10 text-warning border border-warning/20"
                            : "bg-danger/10 text-danger border border-danger/20"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-text-muted">
                      {row.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Row */}
      <div className="text-right text-[13px] text-text-muted font-medium pr-2">
        Total approved: <span className="text-text font-semibold">{formattedTotal}</span>
      </div>

      {/* Add Change Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-elevated border border-border rounded-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-text cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-[16px] font-semibold text-text mb-4">
              Add Scope Change Order
            </h3>

            <form onSubmit={handleAddChangeOrder} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-text-muted font-medium mb-1">Project</label>
                <select
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  className="w-full bg-surface border border-border rounded-sm p-2 text-text focus:outline-none focus:border-accent"
                >
                  <option value="Sunrise Portal">Sunrise Portal</option>
                  <option value="Neon Labs">Neon Labs</option>
                  <option value="Prism Media">Prism Media</option>
                  <option value="Aether Branding">Aether Branding</option>
                  <option value="TechFlow API">TechFlow API</option>
                </select>
              </div>

              <div>
                <label className="block text-text-muted font-medium mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extra reports page setup"
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full bg-surface border border-border rounded-sm p-2 text-text placeholder:text-text-faint focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-text-muted font-medium mb-1">Cost Impact (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                  className="w-full bg-surface border border-border rounded-sm p-2 text-text placeholder:text-text-faint focus:outline-none focus:border-accent font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted font-medium mb-1">Status</label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as any)}
                    className="w-full bg-surface border border-border rounded-sm p-2 text-text focus:outline-none focus:border-accent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full bg-surface border border-border rounded-sm p-2 text-text focus:outline-none focus:border-accent text-[12px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm bg-surface border border-border text-text hover:bg-surface-elevated transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-accent hover:bg-accent-hover text-white transition-colors cursor-pointer font-medium"
                >
                  Log Change Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
