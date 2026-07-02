"use client";

import React, { useState, useEffect } from "react";
import { HeroNumber } from "@/components/ui/hero-number";
import { KpiCard } from "@/components/ui/kpi-card";
import { Percent, Layers, DollarSign, Loader2 } from "lucide-react";
import { getRetros } from "@/actions/post-project";

interface ProjectRetro {
  id: string;
  project: string;
  quote: number;
  actual: number;
  recommendedRate: number;
  notes: string;
}

export default function PostProjectPage() {
  const [retros, setRetros] = useState<ProjectRetro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getRetros();
        if (res.success && res.data) {
          setRetros(res.data);
        }
      } catch (err) {
        console.error("Failed to load retros data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate dynamic metrics
  const totalQuote = retros.reduce((sum, r) => sum + r.quote, 0);
  const totalActual = retros.reduce((sum, r) => sum + r.actual, 0);
  
  const avgMarginPercent = totalQuote > 0 
    ? Math.round(((totalActual - totalQuote) / totalQuote) * 100) 
    : 0;

  const avgRecommendedRate = retros.length > 0
    ? Math.round(retros.reduce((sum, r) => sum + r.recommendedRate, 0) / retros.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <HeroNumber value={`${avgMarginPercent}%`} label="average profit margin" />

      {/* Top Stat Row (3 KpiCards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Avg Margin %" value={`${avgMarginPercent}%`} icon={Percent} />
        <KpiCard title="Best Project Type" value="SaaS Integration" icon={Layers} />
        <KpiCard
          title="Recommended Rate"
          value={`₹${avgRecommendedRate.toLocaleString("en-IN")}/hr`}
          icon={DollarSign}
        />
      </div>

      {/* Retro Table */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-text-muted font-medium">
                <th className="p-3.5">Project</th>
                <th className="p-3.5 text-right">Quote</th>
                <th className="p-3.5 text-right">Actual</th>
                <th className="p-3.5 text-center">Profit/Loss</th>
                <th className="p-3.5 text-center">Recommended Rate</th>
                <th className="p-3.5 w-1/3">Notes</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {retros.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-faint">
                    No project retro entries found.
                  </td>
                </tr>
              ) : (
                retros.map((item) => {
                  const isProfit = item.actual >= item.quote;
                  return (
                    <tr key={item.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="p-3.5 font-medium text-text">{item.project}</td>
                      <td className="p-3.5 text-right font-mono text-text">
                        ₹{item.quote.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3.5 text-right font-mono text-text">
                        ₹{item.actual.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isProfit
                              ? "text-success bg-success/10 border border-success/15"
                              : "text-danger bg-danger/10 border border-danger/15"
                          }`}
                        >
                          {isProfit ? "✓ Profit" : "✗ Loss"}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-accent/10 text-accent border border-accent/15">
                          ₹{item.recommendedRate}/hr
                        </span>
                      </td>
                      <td className="p-3.5 text-text-muted leading-relaxed">
                        {item.notes}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => console.log(`Viewing report for project: ${item.project}`)}
                          className="bg-transparent border border-border hover:bg-surface-elevated text-text text-[12px] px-3 py-1 rounded-sm cursor-pointer transition-colors font-medium"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
