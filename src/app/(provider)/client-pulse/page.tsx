"use client";

import React, { useState, useEffect } from "react";
import { HeroNumber } from "@/components/ui/hero-number";
import { KpiCard } from "@/components/ui/kpi-card";
import { Users, Smile, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { getClients } from "@/actions/client-pulse";

interface Client {
  id: string;
  name: string;
  healthScore: number;
  lastActivity: string;
  riskFlags: string[];
}

export default function ClientPulsePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getClients();
        if (res.success && res.data) {
          setClients(res.data);
        }
      } catch (err) {
        console.error("Failed to load clients data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Health ranges helpers
  const getHealthColor = (score: number) => {
    if (score >= 80) return "var(--success)";
    if (score >= 50) return "var(--warning)";
    return "var(--danger)";
  };

  // Aggregated totals
  const totalCount = clients.length;
  const healthyCount = clients.filter((c) => c.healthScore >= 80).length;
  const atRiskCount = clients.filter((c) => c.healthScore >= 50 && c.healthScore < 80).length;
  const criticalCount = clients.filter((c) => c.healthScore < 50).length;

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
      <HeroNumber
        value={`${atRiskCount + criticalCount} clients`}
        label="at risk right now"
        color="danger"
      />

      {/* 4 KpiCards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Clients" value={totalCount.toString()} icon={Users} />
        <KpiCard title="Healthy" value={healthyCount.toString()} icon={Smile} />
        <KpiCard title="At-Risk" value={atRiskCount.toString()} icon={AlertTriangle} />
        <KpiCard title="Critical" value={criticalCount.toString()} icon={AlertCircle} />
      </div>

      {/* Grid: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.length === 0 ? (
          <div className="col-span-full bg-surface border border-border rounded-md p-12 text-center text-text-faint text-[13px]">
            No client records found.
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="bg-surface border border-border rounded-md p-5 flex flex-col justify-between hover:border-border/80 transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Client Name */}
                <h3 className="text-[16px] font-semibold text-text">
                  {client.name}
                </h3>

                {/* Health Score display */}
                <div className="space-y-1">
                  <span
                    className="text-[2.5rem] font-bold leading-none tracking-tight block"
                    style={{ color: getHealthColor(client.healthScore) }}
                  >
                    {client.healthScore}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold block">
                    Health Score
                  </span>
                </div>

                {/* Last Activity */}
                <div className="text-[12px] text-text-muted">
                  Last activity: <span className="text-text-muted font-mono">{client.lastActivity}</span>
                </div>

                {/* Risk Flags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {client.riskFlags.map((flag) => (
                    <span
                      key={flag}
                      className="bg-surface-elevated border border-border/40 text-text-muted text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <div className="mt-6 pt-4 border-t border-border/20">
                <button
                  onClick={() => console.log(`Viewing details for ${client.name}`)}
                  className="w-full text-center text-[12px] py-2 border border-border rounded-sm text-text hover:bg-surface-elevated transition-colors cursor-pointer font-medium bg-transparent"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
