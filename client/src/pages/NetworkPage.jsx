import React from 'react';
import { Link } from 'react-router-dom';

const people = [
  { name: 'Sarah Chen', username: 'sarahdev', skills: ['React', 'TypeScript'], followers: 2300 },
  { name: 'Alex Rodriguez', username: 'alexcodes', skills: ['Node.js', 'DevOps'], followers: 1800 },
  { name: 'Priya Anand', username: 'priyacodes', skills: ['Python', 'AI/ML'], followers: 2750 },
  { name: 'Jon Park', username: 'jonbuilds', skills: ['Go', 'Kubernetes'], followers: 950 },
];

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developer Network</h1>
            <p className="text-sm text-gray-600">Discover and connect with developers</p>
          </div>
          <div className="flex items-center gap-2">
            <input className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" placeholder="Search developers..."/>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg">Search</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((p) => (
            <div key={p.username} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center">
                  {p.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-500">@{p.username}</div>
                </div>
                <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">Follow</button>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex gap-2 flex-wrap">
                  {p.skills.map(s => (
                    <span key={s} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{s}</span>
                  ))}
                </div>
                <div className="text-blue-600 font-medium">{p.followers.toLocaleString()} followers</div>
              </div>
              <div className="mt-3 text-right">
                <Link to={`/profile/${p.username}`} className="text-sm text-cyan-600 hover:underline">View profile</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

