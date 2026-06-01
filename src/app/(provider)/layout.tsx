// src/app/(provider)/layout.tsx

import type { ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShieldCheck,
  Timer,
  WalletCards,
  Activity,
  KanbanSquare,
  HeartPulse,
  Sparkles,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scope-shield", label: "ScopeShield", icon: ShieldCheck },
  { href: "/delay-ledger", label: "DelayLedger", icon: Timer },
  { href: "/milestone-escrow", label: "MilestoneEscrow", icon: WalletCards },
  { href: "/runway", label: "RunwayPM", icon: Activity },
  { href: "/board", label: "Board", icon: KanbanSquare },
  { href: "/client-pulse", label: "ClientPulse", icon: HeartPulse },
  { href: "/post-project", label: "PostProject", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/90 flex flex-col">
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="text-lg font-semibold tracking-tight">Pactly Studio</div>
          <p className="mt-1 text-xs text-slate-400">Client–safe project management</p>
          <button className="mt-4 inline-flex items-center rounded-md bg-slate-100 text-slate-900 px-3 py-1.5 text-xs font-medium hover:bg-slate-200">
            + New Project
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-50"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
          Signed in as <span className="font-medium">you@example.com</span>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="text-sm text-slate-400">
            Workspace: <span className="font-medium text-slate-100">Pactly Studio</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <button
              type="button"
              className="rounded-full border border-slate-700 px-2 py-1 hover:bg-slate-800"
            >
              Theme
            </button>
            <div className="h-7 w-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-semibold">
              RR
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 py-6 bg-slate-950">{children}</main>
      </div>
    </div>
  );
}