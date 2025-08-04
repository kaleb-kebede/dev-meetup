import React from 'react';

export default function FeedPost() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <img
            src="https://placehold.co/48x48/60a5fa/fff?text=B"
            alt="Author"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">Benjamin Oldén</div>
            <div className="text-xs text-gray-500">Helping 55+ software engineers land more interviews</div>
            <div className="text-xs text-gray-400">4d • 🌍</div>
          </div>
        </div>
        <button className="border border-blue-600 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold hover:bg-blue-50">+ Follow</button>
      </div>
      {/* Post Content */}
      <div className="mb-3 text-gray-800">
        I've noticed a pattern: Great developers aren't just great at writing code...
      </div>
      {/* Post Actions */}
      <div className="flex justify-between pt-2 border-t border-gray-100 text-gray-500 text-sm">
        <button className="flex items-center gap-1 hover:text-blue-600"><i className="far fa-thumbs-up" /> Like</button>
        <button className="flex items-center gap-1 hover:text-blue-600"><i className="far fa-comment" /> Comment</button>
        <button className="flex items-center gap-1 hover:text-blue-600"><i className="fas fa-share" /> Share</button>
      </div>
    </div>
  );
}