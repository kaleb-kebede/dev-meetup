import React from 'react';

export default function SavedSnippetsCard() {
  const snippets = [
    { title: 'Fetch with retries', lang: 'ts' },
    { title: 'Debounce helper', lang: 'js' },
    { title: 'SQL pagination', lang: 'sql' },
  ];
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <i className="fas fa-code mr-2" /> Saved Snippets
      </h3>
      <ul className="space-y-1 text-sm">
        {snippets.map((s, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="text-gray-700 truncate">{s.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s.lang}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
