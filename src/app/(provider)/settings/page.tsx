"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { saveAIConfig, getAIConfig } from "@/actions/ai-config";
import { Sliders, User, ShieldAlert, Sparkles } from "lucide-react";

type TabName =
  | "Profile"
  | "Workspace"
  | "Billing"
  | "Notifications"
  | "AI Settings"
  | "Integrations"
  | "Danger Zone";

const tabsList: TabName[] = [
  "Profile",
  "Workspace",
  "Billing",
  "Notifications",
  "AI Settings",
  "Integrations",
  "Danger Zone",
];

const tabQueryMapping: Record<string, TabName> = {
  profile: "Profile",
  workspace: "Workspace",
  billing: "Billing",
  notifications: "Notifications",
  ai: "AI Settings",
  "ai-settings": "AI Settings",
  integrations: "Integrations",
  danger: "Danger Zone",
};

function SettingsForm() {
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get("tab");
  const initialTab =
    tabQuery && tabQueryMapping[tabQuery.toLowerCase()]
      ? tabQueryMapping[tabQuery.toLowerCase()]
      : "AI Settings";

  const [activeTab, setActiveTab] = useState<TabName>(initialTab);

  // AI settings states
  const [selectedProvider, setSelectedProvider] = useState<
    "google" | "anthropic" | "openai"
  >("google");
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load existing AI settings on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await getAIConfig("mock-user");
        if (res.success && res.data) {
          setSelectedProvider(
            (res.data.provider as "google" | "anthropic" | "openai") || "google"
          );
          setApiKey(res.data.apiKey || "");
          if (res.data.apiKey) {
            setIsConnected(true);
            setStatusMsg("✓ Connected");
          }
        }
      } catch (err) {
        console.error("Failed to load AI config", err);
      }
    }
    loadConfig();
  }, []);

  const handleSaveAIConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg("");

    let model = "gemini-2.0-flash";
    if (selectedProvider === "anthropic") model = "claude-3.5-haiku";
    if (selectedProvider === "openai") model = "gpt-4o-mini";

    try {
      const res = await saveAIConfig(
        "mock-user",
        selectedProvider,
        model,
        apiKey
      );
      if (res.success) {
        setIsConnected(!!apiKey);
        setStatusMsg(apiKey ? "✓ Connected" : "Not connected");
      } else {
        setStatusMsg(`Failed: ${res.error}`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err?.message || "Something went wrong"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start min-h-[500px]">
      {/* Left tab nav */}
      <div className="w-full md:w-[180px] flex flex-col space-y-1 shrink-0">
        {tabsList.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setStatusMsg("");
              }}
              className={`w-full text-left py-2 px-3 text-[13px] font-medium border-l-[3px] transition-colors cursor-pointer rounded-r-sm ${
                isActive
                  ? "border-accent text-text bg-surface"
                  : "border-transparent text-text-muted hover:text-text hover:bg-surface/30"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Right pane content */}
      <div className="flex-1 bg-surface border border-border rounded-md p-6 min-h-[400px]">
        {activeTab === "AI Settings" ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-semibold text-text flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-accent" />
                AI Intelligence
              </h2>
              <p className="text-[13px] text-text-muted mt-1 leading-normal">
                Connect an AI model to unlock smart insights. Your API key is never shared.
              </p>
            </div>

            {/* 3 Radio selection cards in a row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Google Card */}
              <div
                onClick={() => setSelectedProvider("google")}
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedProvider === "google"
                    ? "border-accent bg-surface-elevated"
                    : "border-border hover:border-border/85"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[14px] font-semibold text-text">
                    Gemini 2.0 Flash
                  </span>
                  <span className="bg-accent/10 border border-accent/20 text-accent font-semibold text-[8px] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-[12px] text-text-muted font-medium mb-2">
                  Google
                </div>
                <div className="text-[11px] text-text-faint italic mb-3">
                  Free tier · Recommended
                </div>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-accent hover:underline font-medium inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  How to get a key →
                </a>
              </div>

              {/* Anthropic Card */}
              <div
                onClick={() => setSelectedProvider("anthropic")}
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedProvider === "anthropic"
                    ? "border-accent bg-surface-elevated"
                    : "border-border hover:border-border/85"
                }`}
              >
                <div className="text-[14px] font-semibold text-text mb-1">
                  Claude 3.5 Haiku
                </div>
                <div className="text-[12px] text-text-muted font-medium mb-2">
                  Anthropic
                </div>
                <div className="text-[11px] text-text-faint italic mb-3">
                  Excellent for analysis
                </div>
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-accent hover:underline font-medium inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  How to get a key →
                </a>
              </div>

              {/* OpenAI Card */}
              <div
                onClick={() => setSelectedProvider("openai")}
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  selectedProvider === "openai"
                    ? "border-accent bg-surface-elevated"
                    : "border-border hover:border-border/85"
                }`}
              >
                <div className="text-[14px] font-semibold text-text mb-1">
                  GPT-4o Mini
                </div>
                <div className="text-[12px] text-text-muted font-medium mb-2">
                  OpenAI
                </div>
                <div className="text-[11px] text-text-faint italic mb-3">
                  Reliable, widely used
                </div>
                <a
                  href="https://platform.openai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-accent hover:underline font-medium inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  How to get a key →
                </a>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSaveAIConfig} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[12px] font-semibold text-text-muted">
                  API Key for {selectedProvider === "google" ? "Google" : selectedProvider === "anthropic" ? "Anthropic" : "OpenAI"}
                </label>
                <input
                  type="password"
                  placeholder="Paste your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-surface border border-border text-text placeholder:text-text-faint text-[13px] p-2.5 rounded-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-accent hover:bg-accent-hover text-white text-[13px] px-4 py-2 rounded-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save API Key"}
                </button>

                {/* Status line */}
                <div className="text-[13px]">
                  {isConnected ? (
                    <span className="text-success font-semibold">✓ Connected</span>
                  ) : (
                    <span className="text-text-muted">Not connected</span>
                  )}
                  {statusMsg && statusMsg !== "✓ Connected" && statusMsg !== "Not connected" && (
                    <span className="ml-2 font-medium text-text-muted">{statusMsg}</span>
                  )}
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4 py-6 text-center md:text-left">
            <h2 className="text-[16px] font-semibold text-text flex items-center justify-center md:justify-start gap-1.5">
              {activeTab === "Profile" && <User className="h-4 w-4 text-text-muted" />}
              {activeTab === "Danger Zone" && <ShieldAlert className="h-4 w-4 text-danger" />}
              {!["Profile", "Danger Zone"].includes(activeTab) && <Sparkles className="h-4 w-4 text-text-muted" />}
              {activeTab}
            </h2>
            <p className="text-[13px] text-text-muted italic">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-[13px] text-text-muted">Loading settings...</div>}>
      <SettingsForm />
    </Suspense>
  );
}
