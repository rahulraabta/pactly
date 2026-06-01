"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Sliders,
  Bell,
  Link2,
  Check,
  Shield,
  Save,
  Globe,
  Trash2,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  logo: string;
  isConnected: boolean;
}

export default function SettingsPage() {
  // Profile settings
  const [profileName, setProfileName] = useState("Rahul");
  const [profileEmail, setProfileEmail] = useState("rahul@example.com");
  const [targetRate, setTargetRate] = useState("2000");
  const [currency, setCurrency] = useState("INR");

  // Portal/Workspace preferences
  const [themeColor, setThemeColor] = useState<"Teal" | "Blue" | "Indigo" | "Violet">("Teal");
  const [allowClientCR, setAllowClientCR] = useState(true);
  const [enforceEscrow, setEnforceEscrow] = useState(true);
  const [delayMultiplier, setDelayMultiplier] = useState("1.5");

  // Notifications
  const [notifyOnBlock, setNotifyOnBlock] = useState(true);
  const [notifyOnDeposit, setNotifyOnDeposit] = useState(true);
  const [notifyOnReview, setNotifyOnReview] = useState(false);

  // Integrations state
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: "int-1",
      name: "Stripe Escrow Connect",
      description: "Secure project deposits and automate milestone payouts.",
      logo: "💳",
      isConnected: true,
    },
    {
      id: "int-2",
      name: "Slack Notifications",
      description: "Ping clients automatically on Slack when feedback is overdue.",
      logo: "💬",
      isConnected: false,
    },
    {
      id: "int-3",
      name: "WhatsApp Alerts",
      description: "Send instant SMS/WhatsApp alerts for change requests.",
      logo: "📱",
      isConnected: false,
    },
  ]);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((item) =>
        item.id === id ? { ...item, isConnected: !item.isConnected } : item
      )
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-teal-400" />
            Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure your workspace rules, customized client portal appearance, and payout integrations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Settings */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-100 border-b border-slate-850 pb-2">
            <User className="h-4 w-4 text-teal-400" />
            Account & Freelancer Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-350 mb-1">Freelancer / Agency Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-350 mb-1">Notification Email</label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-350 mb-1">Target Hourly Rate (Base)</label>
              <input
                type="number"
                required
                value={targetRate}
                onChange={(e) => setTargetRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-350 mb-1">Business Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="INR">INR (₹) Indian Rupee</option>
                <option value="USD">USD ($) US Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="GBP">GBP (£) British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client Portal & Workspace Rules */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-100 border-b border-slate-850 pb-2">
            <Sliders className="h-4 w-4 text-teal-400" />
            Client Portal & Scope Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">Portal Accent Color</label>
                <div className="flex gap-2.5">
                  {(["Teal", "Blue", "Indigo", "Violet"] as const).map((color) => {
                    const bgClass =
                      color === "Teal"
                        ? "bg-teal-500"
                        : color === "Blue"
                        ? "bg-blue-500"
                        : color === "Indigo"
                        ? "bg-indigo-500"
                        : "bg-violet-500";
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setThemeColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                          themeColor === color
                            ? "border-slate-50 text-slate-900 bg-slate-50 font-bold"
                            : "border-slate-800 text-slate-400 bg-slate-950 hover:border-slate-700"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${bgClass}`} />
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1">Delay Ledger Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={delayMultiplier}
                  onChange={(e) => setDelayMultiplier(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
                <p className="mt-1 text-[10px] text-slate-500 leading-normal">
                  Attributed client delay multiplier (e.g. 1.5x extends project timeline by 1.5 days for every 1 day of delay).
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="allowClientCR"
                  checked={allowClientCR}
                  onChange={(e) => setAllowClientCR(e.target.checked)}
                  className="h-4 w-4 accent-teal-500 rounded border-slate-850 mt-0.5"
                />
                <div>
                  <label htmlFor="allowClientCR" className="text-xs font-semibold text-slate-200 cursor-pointer block">
                    Allow Clients to Request Changes
                  </label>
                  <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">
                    Clients can submit scope expansions directly inside their Client Portal.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="enforceEscrow"
                  checked={enforceEscrow}
                  onChange={(e) => setEnforceEscrow(e.target.checked)}
                  className="h-4 w-4 accent-teal-500 rounded border-slate-850 mt-0.5"
                />
                <div>
                  <label htmlFor="enforceEscrow" className="text-xs font-semibold text-slate-200 cursor-pointer block">
                    Enforce Active Escrow Lock
                  </label>
                  <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">
                    Blocks starting any task unless deposit funds are fully locked in the escrow pipeline.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-100 border-b border-slate-850 pb-2">
            <span className="p-1 rounded bg-teal-400/10 text-teal-400">
              <Bell className="h-4 w-4" />
            </span>
            Real-time Alerts & Notifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-850">
              <input
                type="checkbox"
                id="notifyOnBlock"
                checked={notifyOnBlock}
                onChange={(e) => setNotifyOnBlock(e.target.checked)}
                className="h-4 w-4 accent-teal-500 rounded border-slate-800 mt-0.5"
              />
              <div>
                <label htmlFor="notifyOnBlock" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Client Blocker Alerts
                </label>
                <p className="text-[10px] text-slate-550 mt-0.5">Email me the instant a client delays asset delivery or reviews.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-850">
              <input
                type="checkbox"
                id="notifyOnDeposit"
                checked={notifyOnDeposit}
                onChange={(e) => setNotifyOnDeposit(e.target.checked)}
                className="h-4 w-4 accent-teal-500 rounded border-slate-800 mt-0.5"
              />
              <div>
                <label htmlFor="notifyOnDeposit" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Escrow Deposit Pings
                </label>
                <p className="text-[10px] text-slate-550 mt-0.5">Ping me when a client funds or requests release of milestone deposits.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-850">
              <input
                type="checkbox"
                id="notifyOnReview"
                checked={notifyOnReview}
                onChange={(e) => setNotifyOnReview(e.target.checked)}
                className="h-4 w-4 accent-teal-500 rounded border-slate-800 mt-0.5"
              />
              <div>
                <label htmlFor="notifyOnReview" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Task Complete Pings
                </label>
                <p className="text-[10px] text-slate-550 mt-0.5">Alert on slack whenever a task status updates to Completed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-5">
          <div className="text-xs text-slate-400">
            {saveSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="h-4 w-4" /> Workspace preferences updated!
              </span>
            ) : (
              <span>Last saved: Just now</span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </form>

      {/* Integrations Module */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-100 border-b border-slate-850 pb-2">
          <Link2 className="h-4 w-4 text-teal-400" />
          Workspace Connections & Integrations
        </h3>

        <div className="space-y-3">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-850 hover:border-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-1 bg-slate-900 border border-slate-850 rounded">{item.logo}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleToggleIntegration(item.id)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors border ${
                  item.isConnected
                    ? "bg-slate-900 border-slate-850 text-slate-400 hover:bg-red-950/20 hover:text-red-400 hover:border-red-950"
                    : "bg-teal-600 border-teal-600 text-white hover:bg-teal-700 hover:border-teal-700"
                }`}
              >
                {item.isConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
