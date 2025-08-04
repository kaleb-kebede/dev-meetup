import React from 'react';

export default function PageLinkCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gray-200 rounded">
          {/* Placeholder for page logo */}
        </div>
        <div>
          <div className="font-semibold text-gray-800">dichotech</div>
          <div className="text-xs text-gray-500">Managed Page</div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-2 mt-2 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Activity</span>
          <span className="font-semibold text-blue-700">0</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Page visitors</span>
          <span className="font-semibold text-blue-700">5</span>
        </div>
      </div>
    </div>
  );
}