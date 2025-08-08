import React from 'react';
import { Link } from 'react-router-dom';

export default function DevQuickLinks() {
  const links = [
    { to: '/create', label: 'New Post', icon: 'fas fa-plus', color: 'text-blue-600' },
    { to: '/projects', label: 'Projects', icon: 'fas fa-code-branch', color: 'text-green-600' },
    { to: '/network', label: 'Dev Network', icon: 'fas fa-users-cog', color: 'text-purple-600' },
    { to: '/analytics', label: 'Analytics', icon: 'fas fa-chart-line', color: 'text-indigo-600' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <i className="fas fa-bolt text-yellow-500 mr-2" /> Quick Links
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <i className={`${l.icon} ${l.color}`} />
            <span>{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

