"use client";

import React, { useState, useEffect } from "react";
import { HeroNumber } from "@/components/ui/hero-number";
import { Plus, X, Calendar, Loader2 } from "lucide-react";
import { getDelays, logDelay } from "@/actions/delay-ledger";

interface DelayEntry {
  id: string;
  project: string;
  reason: string;
  days: number;
  impactAmount: number;
  severity: "Low" | "Medium" | "High";
  date: string;
}

export default function DelayLedgerPage() {
  const [entries, setEntries] = useState<DelayEntry[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for adding new delay log
  const [projectInput, setProjectInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [impactInput, setImpactInput] = useState("");
  const [severityInput, setSeverityInput] = useState<"Low" | "Medium" | "High">("Low");
  const [dateInput, setDateInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const res = await getDelays();
      if (res.success && res.data) {
        setEntries(res.data.entries);
        setProjects(res.data.projects);
        if (res.data.projects.length > 0 && !projectInput) {
          setProjectInput(res.data.projects[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load delays data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogDelay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectInput || !reasonInput || !daysInput || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await logDelay({
        projectId: projectInput,
        reason: reasonInput,
        days: parseInt(daysInput) || 0,
        impactAmount: parseFloat(impactInput) || 0,
        severity: severityInput,
        date: dateInput || new Date().toISOString().split("T")[0],
      });

      if (res.success) {
        // Reload table
        await loadData();
        setIsModalOpen(false);
        // Reset inputs
        setReasonInput("");
        setDaysInput("");
        setImpactInput("");
        setSeverityInput("Low");
        setDateInput("");
      } else {
        alert(res.error || "Failed to log delay");
      }
    } catch (err) {
      console.error("Error logging delay", err);
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <HeroNumber value={`${totalDays} days`} label="total delay across all projects" />
        <button
          onClick={() => {
            if (projects.length > 0) {
              setProjectInput(projects[0].id);
            }
            setIsModalOpen(true);
          }}
          className="bg-accent hover:bg-accent-hover text-white text-[13px] px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer"
        >
          + Log Delay
        </button>
      </div>

      {/* Timeline container */}
      <div className="max-w-3xl ml-2 relative border-l border-border pl-6 space-y-8 py-2">
        {entries.length === 0 ? (
          <div className="text-text-faint text-[13px] italic p-4 pl-0">No delays logged yet.</div>
        ) : (
          entries.map((entry) => {
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
          })
        )}
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
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
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
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-sm bg-accent hover:bg-accent-hover text-white transition-colors cursor-pointer font-medium disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
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
