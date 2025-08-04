import React from 'react';

export default function InfoCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-100 rounded flex items-center justify-center">
          <i className="fas fa-puzzle-piece text-cyan-600 text-xl" />
        </div>
        <div>
          <div className="font-semibold text-gray-800">Today's puzzle</div>
          <div className="text-xs text-gray-500">Zip - a quick brain teaser</div>
        </div>
      </div>
      <i className="fas fa-chevron-right text-gray-400 text-lg" />
    </div>
  );
}