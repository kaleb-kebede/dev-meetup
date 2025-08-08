import React from 'react';

export default function AnalyticsPage() {
  const metrics = [
    { label: 'Total Posts', value: 42, color: 'blue' },
    { label: 'Total Likes', value: 356, color: 'green' },
    { label: 'Total Comments', value: 128, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">Track engagement across your posts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="text-sm text-gray-500">{m.label}</div>
              <div className={`text-3xl font-bold text-${m.color}-600`}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="font-semibold text-gray-900 mb-2">Engagement trend (mock)</div>
          <div className="h-40 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            Chart goes here
          </div>
        </div>
      </div>
    </div>
  );
}
