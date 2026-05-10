import { LayoutDashboard, ShieldCheck, Clock, Banknote, LineChart, KanbanSquare, Users, BookOpenText, Settings } from 'lucide-react'
import Link from 'next/link'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'ScopeShield', href: '/scope-shield', icon: ShieldCheck },
  { name: 'DelayLedger', href: '/delay-ledger', icon: Clock },
  { name: 'MilestoneEscrow', href: '/milestone-escrow', icon: Banknote },
  { name: 'RunwayPM', href: '/runway', icon: LineChart },
  { name: 'Board', href: '/board', icon: KanbanSquare },
  { name: 'ClientPulse', href: '/client-pulse', icon: Users },
  { name: 'PostProject', href: '/post-project', icon: BookOpenText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-gray-800">
        <div className="flex h-16 items-center px-6 font-bold text-xl text-teal-400">Pactly</div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-800 px-8">
          <div className="font-semibold">Pactly Studio</div>
          <div className="flex items-center gap-4">
            <button className="text-sm border border-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-800">
              + New Project
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-700" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}
