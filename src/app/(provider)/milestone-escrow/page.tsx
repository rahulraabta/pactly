"use client";

import React, { useState } from "react";
import { HeroNumber } from "@/components/ui/hero-number";

interface Milestone {
  id: string;
  project: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "LOCKED" | "PENDING" | "RELEASED";
}

const initialMockCards: Milestone[] = [
  {
    id: "ME-1",
    project: "Sunrise Portal",
    title: "Database Architecture & Replica Setup",
    amount: 120000,
    dueDate: "Jun 10, 2026",
    status: "LOCKED",
  },
  {
    id: "ME-2",
    project: "Neon Labs",
    title: "Biometric Login UX & Integration",
    amount: 140000,
    dueDate: "Jun 15, 2026",
    status: "LOCKED",
  },
  {
    id: "ME-3",
    project: "Prism Media",
    title: "Checkout Localization & Subscriptions",
    amount: 100000,
    dueDate: "Jun 20, 2026",
    status: "LOCKED",
  },
  {
    id: "ME-4",
    project: "Aether Branding",
    title: "Brand Strategy Deck & Vector Guidelines",
    amount: 75000,
    dueDate: "Jun 28, 2026",
    status: "PENDING",
  },
  {
    id: "ME-5",
    project: "TechFlow API",
    reason: "",
    title: "API Auth Flow Security Verification",
    amount: 50000,
    dueDate: "Jul 05, 2026",
    status: "PENDING",
  } as any,
  {
    id: "ME-6",
    project: "Sunrise Portal",
    title: "Wireframes Signoff & Initial Design Prototype",
    amount: 95000,
    dueDate: "May 25, 2026",
    status: "RELEASED",
  },
];

export default function MilestoneEscrowPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMockCards);
  const [selectedProject, setSelectedProject] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Calculate counts for status bar
  const lockedCount = milestones.filter((m) => m.status === "LOCKED").length;
  const pendingCount = milestones.filter((m) => m.status === "PENDING").length;
  const releasedCount = milestones.filter((m) => m.status === "RELEASED").length;

  // Filter milestones
  const filteredMilestones = milestones.filter((m) => {
    const projectMatch = selectedProject === "All" || m.project === selectedProject;
    const statusMatch = selectedStatus === "All" || m.status === selectedStatus;
    return projectMatch && statusMatch;
  });

  // Calculate locked total dynamically for HeroNumber
  const lockedTotal = milestones
    .filter((m) => m.status === "LOCKED")
    .reduce((sum, m) => sum + m.amount, 0);

  const formattedLockedTotal = `₹${lockedTotal.toLocaleString("en-IN")}`;
  const uniqueProjects = Array.from(new Set(milestones.map((m) => m.project)));

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <HeroNumber value={formattedLockedTotal} label="currently locked in escrow" />

        {/* 3-segment status bar (inline flex pills) */}
        <div className="inline-flex items-center gap-2 bg-surface border border-border p-1 rounded-full text-[12px] font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-danger/10 text-danger rounded-full">
            <span>🔒 LOCKED</span>
            <span className="bg-danger/20 px-1.5 py-0.2 rounded-full text-[10px] text-danger font-mono">
              {lockedCount}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning rounded-full">
            <span>⏳ PENDING</span>
            <span className="bg-warning/20 px-1.5 py-0.2 rounded-full text-[10px] text-warning font-mono">
              {pendingCount}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full">
            <span>✅ RELEASED</span>
            <span className="bg-accent/20 px-1.5 py-0.2 rounded-full text-[10px] text-accent font-mono">
              {releasedCount}
            </span>
          </div>
        </div>
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
          <option value="LOCKED">🔒 LOCKED</option>
          <option value="PENDING">⏳ PENDING</option>
          <option value="RELEASED">✅ RELEASED</option>
        </select>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMilestones.length === 0 ? (
          <div className="col-span-full bg-surface border border-border rounded-md p-12 text-center text-text-faint text-[13px]">
            No milestone escrow records found matching the filters.
          </div>
        ) : (
          filteredMilestones.map((card) => (
            <div
              key={card.id}
              className="bg-surface border border-border rounded-md p-5 flex flex-col justify-between hover:border-border/80 transition-all duration-200"
            >
              <div className="space-y-2">
                <div className="text-[13px] text-text-muted font-medium">
                  {card.project}
                </div>
                <h4 className="text-[15px] font-semibold text-text leading-snug">
                  {card.title}
                </h4>
              </div>

              <div className="mt-6 pt-4 border-t border-border/30 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[24px] font-display font-normal text-text leading-none">
                    ₹{card.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[12px] text-text-muted font-mono">
                    Due {card.dueDate}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-text-muted font-medium">Status</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      card.status === "LOCKED"
                        ? "bg-danger/10 text-danger"
                        : card.status === "PENDING"
                        ? "bg-warning/10 text-warning"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {card.status === "LOCKED" && "🔒 LOCKED"}
                    {card.status === "PENDING" && "⏳ PENDING"}
                    {card.status === "RELEASED" && "✅ RELEASED"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
