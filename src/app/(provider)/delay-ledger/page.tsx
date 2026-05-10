export default function DelayLedgerPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">DelayLedger</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Client', 'Team', 'External'].map(type => (
          <div key={type} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-gray-400">{type} Delays</h3>
            <p className="text-2xl font-bold mt-2">12 Days</p>
          </div>
        ))}
      </div>
    </div>
  )
}
