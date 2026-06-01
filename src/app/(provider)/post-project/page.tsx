"use client";

import { useState } from "react";
import {
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingDown,
  Trash2,
} from "lucide-react";

interface RetroProject {
  id: string;
  name: string;
  client: string;
  targetHourlyRate: number;
  quotedHours: number;
  actualHours: number;
  quotedBudget: number;
  actualRevenue: number;
  lessons: string[];
}

const initialProjects: RetroProject[] = [
  {
    id: "PRJ-901",
    name: "SaaS Mobile App Dev",
    client: "Neon Labs",
    targetHourlyRate: 2500,
    quotedHours: 80,
    actualHours: 72,
    quotedBudget: 200000,
    actualRevenue: 240000, // Includes approved change requests
    lessons: [
      "Secured biometric login scope expansion early, improving margins.",
      "Slack response times were under 1h, minimizing downtime.",
    ],
  },
  {
    id: "PRJ-902",
    name: "Landing Page Redesign",
    client: "Sunrise Exports",
    targetHourlyRate: 2000,
    quotedHours: 40,
    actualHours: 58,
    quotedBudget: 80000,
    actualRevenue: 105000, // Scope changes logged
    lessons: [
      "Underestimated layout approval loops. Next time, cap feedback cycles to 3.",
      "Delays in asset handovers caused context switching.",
    ],
  },
  {
    id: "PRJ-903",
    name: "API Payment Engine",
    client: "TechFlow",
    targetHourlyRate: 3000,
    quotedHours: 50,
    actualHours: 45,
    quotedBudget: 150000,
    actualRevenue: 150000,
    lessons: [
      "Stripe SDK setup was straightforward, done ahead of schedule.",
      "Standard database architecture reused, saving 10 hours.",
    ],
  },
];

export default function PostProjectPage() {
  const [retros, setRetros] = useState<RetroProject[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(retros[0].id);

  // New lesson input
  const [lessonInput, setLessonInput] = useState("");

  // Edit hour simulation
  const activeRetro = retros.find((r) => r.id === selectedProjectId) || retros[0];

  const handleUpdateHours = (hours: number) => {
    setRetros(
      retros.map((r) => (r.id === selectedProjectId ? { ...r, actualHours: hours } : r))
    );
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonInput) return;

    setRetros(
      retros.map((r) => {
        if (r.id === selectedProjectId) {
          return { ...r, lessons: [...r.lessons, lessonInput] };
        }
        return r;
      })
    );
    setLessonInput("");
  };

  const handleDeleteLesson = (index: number) => {
    setRetros(
      retros.map((r) => {
        if (r.id === selectedProjectId) {
          return { ...r, lessons: r.lessons.filter((_, i) => i !== index) };
        }
        return r;
      })
    );
  };

  // Calculations for Active Retro
  const quotedHourly = Math.round(activeRetro.quotedBudget / activeRetro.quotedHours);
  const actualHourly = Math.round(activeRetro.actualRevenue / activeRetro.actualHours);
  const hourlyDelta = actualHourly - activeRetro.targetHourlyRate;
  const isTargetMet = actualHourly >= activeRetro.targetHourlyRate;
  const hoursOverrun = activeRetro.actualHours - activeRetro.quotedHours;
  const hoursOverrunPercent = Math.round((hoursOverrun / activeRetro.quotedHours) * 100);
  const scopeCreepRevenue = activeRetro.actualRevenue - activeRetro.quotedBudget;
  const scopeCreepPercent = Math.round((scopeCreepRevenue / activeRetro.quotedBudget) * 100);

  // Generate automated coaching advice
  const getCoachAdvice = () => {
    const advices = [];
    if (hoursOverrun > 0) {
      advices.push({
        type: "warning",
        text: `Schedule Creep: You exceeded quoted hours by ${hoursOverrunPercent}%. For future web/mobile developments, pad original estimates by a 20% fallback buffer.`,
      });
    } else {
      advices.push({
        type: "success",
        text: "Efficiency Win: You finished ahead of your estimated hours. Keep this template saved for similar tech stack configurations.",
      });
    }

    if (scopeCreepRevenue > 0) {
      advices.push({
        type: "info",
        text: `Billed Expansion: ScopeShield successfully captured +₹${scopeCreepRevenue.toLocaleString()} (+${scopeCreepPercent}%) in change requests. Without this, your actual hourly rate would have dropped to ₹${Math.round(activeRetro.quotedBudget / activeRetro.actualHours)}/hr.`,
      });
    }

    if (actualHourly < activeRetro.targetHourlyRate) {
      advices.push({
        type: "danger",
        text: `Margin Leak: Your actual rate (₹${actualHourly}/hr) was below target (₹${activeRetro.targetHourlyRate}/hr). Next quote should include a higher baseline minimum or shift to a fixed-fee milestone model with strict delivery gates.`,
      });
    } else {
      advices.push({
        type: "success",
        text: `Top Tier Margin: Your actual rate (₹${actualHourly}/hr) exceeded your target rate by ₹${hourlyDelta}/hr! Consider scaling up quotes for similar clients.`,
      });
    }

    return advices;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-teal-400" />
            PostProject
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyze completed sprints to audit your real hourly rates, log client insights, and get smart pricing quotes.
          </p>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
        >
          {retros.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.client})
            </option>
          ))}
        </select>
      </div>

      {/* Pricing Coach Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Target Hourly Rate</span>
            <div className="p-2 rounded-lg bg-teal-400/10">
              <Award className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{activeRetro.targetHourlyRate.toLocaleString()}
            <span className="text-xs text-slate-400 font-normal">/hr</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Freelance business floor rate</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Actual Hourly Rate</span>
            <div className="p-2 rounded-lg bg-emerald-400/10">
              {isTargetMet ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
          <p className={`text-2xl font-bold ${isTargetMet ? "text-emerald-400" : "text-red-400"}`}>
            ₹{actualHourly.toLocaleString()}
            <span className="text-xs text-slate-450 font-normal">/hr</span>
          </p>
          <p className="mt-1 text-xs text-slate-450">
            {isTargetMet ? `+₹${hourlyDelta} over target` : `₹${Math.abs(hourlyDelta)} under target`}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Quoted vs Actual Hours</span>
            <div className="p-2 rounded-lg bg-sky-400/10">
              <Clock className="h-4 w-4 text-sky-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {activeRetro.actualHours}
            <span className="text-xs font-normal text-slate-400"> / {activeRetro.quotedHours} hrs</span>
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <input
              type="range"
              min="20"
              max="120"
              value={activeRetro.actualHours}
              onChange={(e) => handleUpdateHours(Number(e.target.value))}
              className="w-full accent-teal-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Scope Expansion Revenue</span>
            <div className="p-2 rounded-lg bg-indigo-400/10">
              <Layers className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{scopeCreepRevenue.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-indigo-400">+{scopeCreepPercent}% budget growth</p>
        </div>
      </div>

      {/* Pricing Coach recommendations & sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Award className="h-4 w-4 text-teal-400" />
            Pricing Coach Recommendation
          </h3>

          <div className="space-y-3">
            {getCoachAdvice().map((advice, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                  advice.type === "success"
                    ? "bg-emerald-950/15 border-emerald-900/40 text-emerald-350"
                    : advice.type === "warning"
                    ? "bg-yellow-950/15 border-yellow-900/40 text-yellow-350"
                    : advice.type === "danger"
                    ? "bg-red-950/15 border-red-900/40 text-red-350"
                    : "bg-indigo-950/15 border-indigo-900/40 text-indigo-350"
                }`}
              >
                {advice.type === "success" && <Sparkles className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />}
                {advice.type === "warning" && <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-400 mt-0.5" />}
                {advice.type === "danger" && <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />}
                {advice.type === "info" && <Layers className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />}
                <span>{advice.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons learned panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-400" />
              Retrospective Log
            </h3>
            <p className="text-xs text-slate-400">
              Document key lessons learned to automate proposal generation next time.
            </p>

            <form onSubmit={handleAddLesson} className="flex gap-2 border-t border-slate-800 pt-3">
              <input
                type="text"
                value={lessonInput}
                onChange={(e) => setLessonInput(e.target.value)}
                placeholder="Log a new lesson..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-teal-500 placeholder:text-slate-650"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 rounded-lg text-[11px] font-semibold text-white transition-colors"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {activeRetro.lessons.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-xs italic">
                  No lessons logged. Write one above!
                </div>
              ) : (
                activeRetro.lessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-1.5 p-2 bg-slate-950 rounded-lg border border-slate-850 text-[10px]">
                    <span className="text-slate-300 leading-normal">{lesson}</span>
                    <button
                      onClick={() => handleDeleteLesson(idx)}
                      className="text-slate-500 hover:text-red-400 transition-colors mt-0.5 shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Sprints Summary Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-800/10">
          <h3 className="text-sm font-semibold text-slate-100">Historical Sprints Audit</h3>
          <p className="text-xs text-slate-400">Summarized profitability performance records of completed projects.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="p-4">Project Name</th>
                <th className="p-4">Client</th>
                <th className="p-4 text-right">Quoted Budget</th>
                <th className="p-4 text-right">Actual Invoiced</th>
                <th className="p-4 text-center">Quoted / Actual Hours</th>
                <th className="p-4 text-right">Hourly Rate Achieved</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {retros.map((item) => {
                const actualHourlyRate = Math.round(item.actualRevenue / item.actualHours);
                const overrun = item.actualHours - item.quotedHours;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedProjectId(item.id)}
                    className={`cursor-pointer hover:bg-slate-850/50 transition-colors ${
                      selectedProjectId === item.id ? "bg-slate-800/40" : ""
                    }`}
                  >
                    <td className="p-4 font-semibold text-slate-200">{item.name}</td>
                    <td className="p-4 text-slate-400 text-xs">{item.client}</td>
                    <td className="p-4 text-right font-medium text-slate-350">
                      ₹{item.quotedBudget.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-100">
                      ₹{item.actualRevenue.toLocaleString()}
                    </td>
                    <td className="p-4 text-center text-xs">
                      <span className="text-slate-200">{item.quotedHours}h</span>
                      <span className="text-slate-500"> / </span>
                      <span className={overrun > 0 ? "text-red-400 font-semibold" : "text-emerald-400"}>
                        {item.actualHours}h
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`font-bold ${actualHourlyRate >= item.targetHourlyRate ? "text-emerald-400" : "text-yellow-500"}`}>
                        ₹{actualHourlyRate.toLocaleString()}/hr
                      </div>
                      <div className="text-[10px] text-slate-550">Target: ₹{item.targetHourlyRate}/hr</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center rounded-md bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/10">
                        Audit Done
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
