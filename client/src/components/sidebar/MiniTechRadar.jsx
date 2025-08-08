import React from 'react';

export default function MiniTechRadar() {
  const items = [
    { name: 'React 19', level: 85, color: 'bg-cyan-400' },
    { name: 'TypeScript', level: 92, color: 'bg-blue-400' },
    { name: 'Node.js', level: 88, color: 'bg-green-400' },
  ];
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <i className="fas fa-radar mr-2" /> Tech Radar
      </h3>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.name}>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>{t.name}</span>
              <span className="font-medium text-gray-700">{t.level}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`${t.color} h-2 rounded-full`} style={{ width: `${t.level}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

