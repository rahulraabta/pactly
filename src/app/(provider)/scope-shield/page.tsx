export default function ScopeShieldPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ScopeShield</h1>
        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map(filter => (
            <button key={filter} className="px-3 py-1 text-sm border border-gray-800 rounded-md hover:bg-gray-800">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Project</th>
              <th className="p-4">Summary</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-800">
              <td className="p-4">Sunrise Exports</td>
              <td className="p-4">Dashboard Redesign</td>
              <td className="p-4">Extra reporting module</td>
              <td className="p-4">₹25,000</td>
              <td className="p-4"><span className="text-yellow-400">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
