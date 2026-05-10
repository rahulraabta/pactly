export default function BoardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Board</h1>
      <div className="grid grid-cols-4 gap-4">
        {['Backlog', 'In Progress', 'In Review', 'Done'].map(col => (
          <div key={col} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <h3 className="font-semibold mb-4">{col}</h3>
            <div className="space-y-2">
                <div className="p-3 bg-gray-800 rounded text-sm">Example card</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
