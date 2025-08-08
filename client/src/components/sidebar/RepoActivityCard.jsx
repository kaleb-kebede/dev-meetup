import React from 'react';

export default function RepoActivityCard() {
  const items = [
    { repo: 'you/awesome-devtools', event: '⭐ Starred', time: '2h' },
    { repo: 'you/api-starter', event: '⬆ Pushed 3 commits', time: '1d' },
    { repo: 'you/k8s-deploy-kit', event: '🔀 Opened PR #12', time: '3d' },
  ];
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <i className="fab fa-github mr-2" /> Repo Activity
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="text-gray-700">{i.event} <span className="text-gray-500">at</span> {i.repo}</span>
            <span className="text-xs text-gray-500">{i.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
