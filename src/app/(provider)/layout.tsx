"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scope-shield", label: "Scope Shield", icon: ShieldCheck },
  { href: "/delay-ledger", label: "Delay Ledger", icon: Timer },
  { href: "/milestone-escrow", label: "Milestone Escrow", icon: WalletCards },
  { href: "/runway", label: "Runway PM", icon: Activity },
  { href: "/board", label: "Board", icon: KanbanSquare },
  { href: "/client-pulse", label: "Client Pulse", icon: HeartPulse },
  { href: "/post-project", label: "Post Project", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function ProviderLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format date only on client-side to prevent hydration mismatch
  const currentDateString = mounted
    ? new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Jun 1, 2026"; // Fallback matching system date

  // Find active nav item to display title
  const activeItem = navItems.find(
    (item) => pathname === item.href || pathname?.startsWith(item.href + "/")
  );
  const pageTitle = activeItem ? activeItem.label : "Dashboard";

  return (
    <div className="min-h-screen flex bg-bg text-text font-body">
      {/* Sidebar - fixed, 220px wide */}
      <aside className="w-[220px] fixed top-0 bottom-0 left-0 bg-bg border-r border-border flex flex-col justify-between z-10">
        <div>
          {/* Top: Wordmark */}
          <div className="px-5 py-6">
            <Link href="/dashboard" className="text-[20px] font-display text-text font-normal tracking-tight block">
              Verivo
            </Link>
          </div>

          {/* Nav links */}
          <nav className="px-2 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium transition-colors rounded-sm ${
                    isActive
                      ? "border-l-[3px] border-accent text-text bg-surface pl-[9px]"
                      : "border-l-[3px] border-transparent text-text-muted hover:text-text hover:bg-surface/50 pl-[9px]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Clerk mock UserButton + user email */}
        <div className="p-4 border-t border-border flex items-center gap-3">
          {/* Mock Clerk UserButton */}
          <div className="h-7 w-7 rounded-full bg-accent text-text flex items-center justify-center text-[11px] font-semibold border border-border">
            U
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-medium text-text truncate">User</span>
            <span className="text-[10px] text-text-muted truncate">you@example.com</span>
          </div>
        </div>
      </aside>

      {/* Main area - margin-left 220px, padding 32px */}
      <div className="ml-[220px] flex-1 flex flex-col bg-bg min-h-screen">
        {/* Top bar */}
        <header className="h-[56px] border-b border-border flex items-center justify-between px-8 bg-bg/50 backdrop-blur-sm sticky top-0 z-20">
          <h1 className="text-[16px] font-semibold text-text tracking-tight">
            {pageTitle}
          </h1>
          <span className="text-[13px] text-text-muted font-medium">
            {currentDateString}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 bg-bg">{children}</main>
      </div>
    </div>
  );
}
