"use client";

import React, { useState } from "react";
import { HeroNumber } from "@/components/ui/hero-number";
import { Plus, X, Calendar } from "lucide-react";

interface DelayEntry {
  id: string;
  project: string;
  reason: string;
  days: number;
  impactAmount: number;
  severity: "Low" | "Medium" | "High";
  date: string;
}

const initialMockEntries: DelayEntry[] = [
  {
    id: "DL-1",
    project: "Sunrise Portal",
    reason: "Delayed feedback on dashboard wireframes & core portal layouts",
    days: 12,
    impactAmount: 85000,
    severity: "High",
    date: "2026-05-28",
  },
  {
    id: "DL-2",
    project: "Neon Labs",
    reason: "Client API credential handover and sandbox access latency",
    days: 8,
    impactAmount: 40000,
    severity: "Medium",
    date: "2026-05-24",
  },
  {
    id: "DL-3",
    project: "Prism Media",
    reason: "Marketing copy assets & product high-res media files overdue",
    days: 6,
    impactAmount: 25000,
    severity: "Medium",
    date: "2026-05-20",
  },
  {
    id: "DL-4",
    project: "Aether Branding",
    reason: "Brand focus group alignment workshop rescheduling requested",
    days: 5,
    impactAmount: 15000,
    severity: "Low",
    date: "2026-05-15",
  },
  {
    id: "DL-5",
    project: "TechFlow API",
    reason: "Partner API staging access verification bottleneck",
    days: 3,
    impactAmount: 0,
    severity: "Low",
    date: "2026-05-10",
  },
];

export default function DelayLedgerPage() {
  const [entries, setEntries] = useState<DelayEntry[]>(initialMockEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding new delay log
  const [projectInput, setProjectInput] = useState("Sunrise Portal");
  const [reasonInput, setReasonInput] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [impactInput, setImpactInput] = useState("");
  const [severityInput, setSeverityInput] = useState<"Low" | "Medium" | "High">("Low");
  const [dateInput, setDateInput] = useState("");

  const handleLogDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonInput || !daysInput) return;

    const newEntry: DelayEntry = {
      id: `DL-${entries.length + 1}`,
      project: projectInput,
      reason: reasonInput,
      days: parseInt(daysInput) || 0,
      impactAmount: parseFloat(impactInput) || 0,
      severity: severityInput,
      date: dateInput || new Date().toISOString().split("T")[0],
    };

    setEntries([newEntry, ...entries]);
    setIsModalOpen(false);

    // Reset inputs
    setReasonInput("");
    setDaysInput("");
    setImpactInput("");
    setSeverityInput("Low");
    setDateInput("");
  };

  // Calculate total delay days dynamically
  const totalDays = entries.reduce((sum, entry) => sum + entry.days, 0);

  // Helper for severity styles
  const getSeverityStyle = (sev: "Low" | "Medium" | "High") => {
    switch (sev) {
      case "Low":
        return { color: "var(--text-muted)", backgroundColor: "rgba(107, 106, 102, 0.1)", border: "1px solid rgba(107, 106, 102, 0.2)" };
      case "Medium":
        return { color: "var(--warning)", backgroundColor: "rgba(201, 124, 26, 0.1)", border: "1px solid rgba(201, 124, 26, 0.2)" };
      case "High":
        return { color: "var(--danger)", backgroundColor: "rgba(184, 64, 64, 0.1)", border: "1px solid rgba(184, 64, 64, 0.2)" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <HeroNumber value={`${totalDays} days`} label="total delay across all projects" />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white text-[13px] px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer"
        >
          + Log Delay
        </button>
      </div>

      {/* Timeline container */}
      <div className="max-w-3xl ml-2 relative border-l border-border pl-6 space-y-8 py-2">
        {entries.map((entry) => {
          const styleSev = getSeverityStyle(entry.severity);
          return (
            <div key={entry.id} className="relative group">
              {/* Absolute dot directly centered on the line */}
              <div
                className="absolute top-1.5 left-[-28px] w-2 h-2 rounded-full bg-accent ring-4 ring-bg transition-transform duration-200 group-hover:scale-125"
                style={{ left: "-28px" }}
              />

              {/* Box container for the timeline content */}
              <div className="bg-surface border border-border rounded-md p-4 transition-all duration-200 hover:border-border/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-text">
                      {entry.project}
                    </span>
                    <span className="bg-surface-elevated border border-border text-[11px] font-mono text-text-muted px-2 py-0.5 rounded-full">
                      {entry.days} days
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      style={styleSev}
                      className="px-2 py-0.5 rounded-full font-medium"
                    >
                      {entry.severity}
                    </span>
                    <span className="text-text-muted font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {entry.date}
                    </span>
                  </div>
                </div>

                <p className="text-[13px] text-text-muted leading-relaxed">
                  {entry.reason}
                </p>

                {entry.impactAmount > 0 && (
                  <div className="mt-3 text-[12px] text-text-muted font-medium border-t border-border/20 pt-2 flex justify-between items-center">
                    <span>Project financial buffer protection:</span>
                    <span className="text-text font-mono font-semibold">
                      ₹{entry.impactAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Delay Modal */}
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
              Log Delay Event
            </h3>

            <form onSubmit={handleLogDelay} className="space-y-4 text-[13px]">
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
                <label className="block text-text-muted font-medium mb-1">Delay Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Asset assets delayed, code review signature outstanding..."
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full bg-surface border border-border rounded-sm p-2 text-text placeholder:text-text-faint focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted font-medium mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5"
                    value={daysInput}
                    onChange={(e) => setDaysInput(e.target.value)}
                    className="w-full bg-surface border border-border rounded-sm p-2 text-text placeholder:text-text-faint focus:outline-none focus:border-accent font-mono"
                  />
                </div>
                <div>
                  <label className="block text-text-muted font-medium mb-1">Cost Impact (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000 (optional)"
                    value={impactInput}
                    onChange={(e) => setImpactInput(e.target.value)}
                    className="w-full bg-surface border border-border rounded-sm p-2 text-text placeholder:text-text-faint focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted font-medium mb-1">Severity</label>
                  <select
                    value={severityInput}
                    onChange={(e) => setSeverityInput(e.target.value as any)}
                    className="w-full bg-surface border border-border rounded-sm p-2 text-text focus:outline-none focus:border-accent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
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
