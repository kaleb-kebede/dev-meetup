import React from 'react';

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Coding Challenges</h1>
          <p className="text-sm text-gray-600">Sharpen skills with daily dev challenges</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Challenge #{i}</div>
                  <div className="text-xs text-gray-500">Tags: algorithms, arrays</div>
                </div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">Easy</span>
              </div>
              <p className="mt-3 text-sm text-gray-700">Solve the described problem and share your solution in a post.</p>
              <div className="mt-4 flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200">Start</button>
                <button className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">Discuss</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
