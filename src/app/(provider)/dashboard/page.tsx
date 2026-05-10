import { Briefcase, CheckCircle, IndianRupee, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const kpis = [
  { label: "Active Projects", value: "12", icon: Briefcase },
  { label: "Revenue (INR)", value: "₹12,40,000", icon: IndianRupee },
  { label: "At Risk", value: "3", icon: TrendingUp },
  { label: "Unpaid Milestones", value: "4", icon: CheckCircle },
];

const deliveryTrend = [
  { week: "W1", deliveries: 18 },
  { week: "W2", deliveries: 25 },
  { week: "W3", deliveries: 22 },
  { week: "W4", deliveries: 30 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">{label}</span>
              <Icon className="h-5 w-5 text-teal-400" />
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-6">Burn Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={deliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Area type="monotone" dataKey="deliveries" stroke="#2dd4bf" fill="#0d9488" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-6">Critical Items</h2>
          <div className="space-y-4">
             {/* Mock list items */}
             <div className="p-3 bg-gray-800 rounded-lg text-sm">Sunrise Exports: Late Payment</div>
             <div className="p-3 bg-gray-800 rounded-lg text-sm">Mehta: Scope creep pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}
