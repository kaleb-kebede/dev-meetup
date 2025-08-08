import React from 'react';

const data = [
  { name: 'awesome-devtools', stars: 1240, issues: 12, language: 'TypeScript' },
  { name: 'api-starter', stars: 860, issues: 3, language: 'JavaScript' },
  { name: 'k8s-deploy-kit', stars: 210, issues: 18, language: 'Go' },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-600">Showcase, track stars, and discover contributions</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg">New project</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.language}</div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">★ {p.stars}</span>
              </div>
              <div className="mt-3 text-sm text-gray-600">Open issues: {p.issues}</div>
              <div className="mt-4 flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">View</button>
                <button className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200">Contribute</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

