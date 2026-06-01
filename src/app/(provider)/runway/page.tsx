"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  Plus,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  Sliders,
} from "lucide-react";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: "Software" | "Subcontractor" | "Marketing" | "Rent" | "Other";
}

const initialExpenses: ExpenseItem[] = [
  { id: "EXP-1", name: "AWS & Vercel Hosting", amount: 5000, category: "Software" },
  { id: "EXP-2", name: "Figma & Adobe CC", amount: 3500, category: "Software" },
  { id: "EXP-3", name: "Contract Designer", amount: 20000, category: "Subcontractor" },
  { id: "EXP-4", name: "Co-working Space Desk", amount: 10000, category: "Rent" },
  { id: "EXP-5", name: "Internet & Mobile", amount: 1500, category: "Other" },
];

export default function RunwayPage() {
  const [cashBalance, setCashBalance] = useState<number>(180000);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [scenario, setScenario] = useState<"conservative" | "baseline" | "optimistic">("baseline");

  // Custom user inputs to simulate scenario modifications
  const [customRevenueMonthly, setCustomRevenueMonthly] = useState<number>(60000);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseItem["category"]>("Software");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount) return;

    const newExp: ExpenseItem = {
      id: `EXP-${expenses.length + 1}`,
      name: newExpenseName,
      amount: Number(newExpenseAmount) || 0,
      category: newExpenseCategory,
    };

    setExpenses([...expenses, newExp]);
    setIsModalOpen(false);

    setNewExpenseName("");
    setNewExpenseCategory("Software");
    setNewExpenseAmount("");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Calculations
  const monthlyBurn = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Revenue adjustments based on scenarios
  const scenarioRevenueMultiplier = {
    conservative: 0.6,
    baseline: 1.0,
    optimistic: 1.5,
  };

  const activeRevenue = customRevenueMonthly * scenarioRevenueMultiplier[scenario];
  const netMonthlyCashFlow = activeRevenue - monthlyBurn;

  // Months of Runway
  const runwayMonths = monthlyBurn > 0
    ? Math.max(0, Number((cashBalance / (monthlyBurn - activeRevenue > 0 ? monthlyBurn - activeRevenue : 1)).toFixed(1)))
    : Infinity;

  const displayRunwayText = activeRevenue >= monthlyBurn
    ? "Infinite"
    : `${runwayMonths} Months`;

  // Projection Chart Data (Next 6 Months)
  const projectionData = Array.from({ length: 6 }).map((_, idx) => {
    const monthIndex = idx + 1;
    const monthNames = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

    // Simulate compounding cash projection
    let projectedCash = cashBalance + (netMonthlyCashFlow * monthIndex);
    if (projectedCash < 0) projectedCash = 0;

    return {
      month: monthNames[idx],
      CashBalance: Math.round(projectedCash),
      MonthlyBurn: monthlyBurn,
      MonthlyRevenue: Math.round(activeRevenue),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-teal-400" />
            RunwayPM
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyze your cash runway, simulate business pipelines, and budget subcontracting safely.
          </p>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Liquid Cash Balance</span>
            <div className="p-2 rounded-lg bg-teal-400/10">
              <DollarSign className="h-4 w-4 text-teal-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{cashBalance.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <input
              type="range"
              min="20000"
              max="500000"
              step="10000"
              value={cashBalance}
              onChange={(e) => setCashBalance(Number(e.target.value))}
              className="w-full accent-teal-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Monthly Burn Rate</span>
            <div className="p-2 rounded-lg bg-red-400/10">
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{monthlyBurn.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total recurring expenses</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Expected MTD Inflows</span>
            <div className="p-2 rounded-lg bg-emerald-400/10">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ₹{activeRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={customRevenueMonthly}
              onChange={(e) => setCustomRevenueMonthly(Number(e.target.value))}
              className="w-full accent-emerald-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Estimated Cash Runway</span>
            <div className="p-2 rounded-lg bg-indigo-400/10">
              <Calendar className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${netMonthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-yellow-500'}`}>
            {displayRunwayText}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {netMonthlyCashFlow >= 0 ? "Positive cash flow" : "Until zero balance"}
          </p>
        </div>
      </div>

      {/* Projection Chart & Scenario Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">6-Month Cash Projection</h3>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
              {(["conservative", "baseline", "optimistic"] as const).map((scen) => (
                <button
                  key={scen}
                  onClick={() => setScenario(scen)}
                  className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-colors ${
                    scenario === scen
                      ? "bg-teal-500 text-slate-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {scen}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, "Projected Cash"]}
              />
              <Area type="monotone" dataKey="CashBalance" stroke="#14b8a6" strokeWidth={2} fill="url(#cashGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Adjustments sidebar */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-1.5 text-slate-100">
              <Sliders className="h-4 w-4 text-teal-400" />
              Scenario Sandbox
            </h3>
            <p className="text-xs text-slate-400">
              Tweak parameters to understand your minimum survival metrics:
            </p>

            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Selected Scenario:</span>
                <span className="text-teal-400 uppercase">{scenario}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Estimated Income:</span>
                <span className="text-slate-200">₹{activeRevenue.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Expected Burn:</span>
                <span className="text-slate-200">₹{monthlyBurn.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between text-xs border-t border-slate-800/60 pt-2">
                <span className="text-slate-400">Net Monthly Flow:</span>
                <span className={`font-semibold ${netMonthlyCashFlow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {netMonthlyCashFlow >= 0 ? "+" : ""}₹{netMonthlyCashFlow.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400 mt-4">
            {netMonthlyCashFlow >= 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> Healthy Growth Curve
              </span>
            ) : (
              <span className="text-yellow-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> Runway Alert: Burn exceeds Inflow
              </span>
            )}
            <p className="mt-1 leading-normal">
              {netMonthlyCashFlow >= 0
                ? "Your current project inflows cover all operating expenses. Use extra buffer to invest in software upgrades or reserves."
                : "You are drawing down savings. Secure +₹" + Math.abs(netMonthlyCashFlow).toLocaleString() + " of monthly contracts or reduce expenses."}
            </p>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Monthly Operating Expenses</h3>
            <p className="text-xs text-slate-400">Configure your recurring freelancer tools & subcontractor rates.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Budget Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="p-4">Expense Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Cost (Monthly)</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                    No recurring expenses listed.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">{expense.name}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400 border border-slate-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-100">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
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

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-1">
              <Layers className="h-5 w-5 text-teal-400" />
              Add Recurring Expense
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Track custom tools or workspace costs in your runway metrics.
            </p>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  placeholder="e.g. Photoshop / Figma Suite"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Software">Software</option>
                    <option value="Subcontractor">Subcontractor</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    placeholder="e.g. 5000"
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
                  Add Budget Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
