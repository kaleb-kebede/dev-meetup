import React from 'react';

const items = [
  { id: 1, type: 'mention', text: 'You were mentioned in a thread about TypeScript best practices', time: '2m', unread: true },
  { id: 2, type: 'comment', text: 'Alex commented on your post', time: '1h', unread: true },
  { id: 3, type: 'like', text: 'Priya liked your code snippet', time: '3h', unread: false },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600">Stay up to date with your network</p>
          </div>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 text-sm">Mark all as read</button>
        </div>

        <div className="space-y-3">
          {items.map(n => (
            <div key={n.id} className={`p-4 rounded-xl border shadow-sm bg-white flex items-start gap-3 ${n.unread ? 'border-blue-200' : 'border-gray-200'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                n.type === 'mention' ? 'bg-blue-100 text-blue-600' : n.type === 'comment' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'
              }`}>
                <i className={`fas ${n.type === 'mention' ? 'fa-at' : n.type === 'comment' ? 'fa-comment' : 'fa-heart'}`} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-800">{n.text}</div>
                <div className="text-xs text-gray-500 mt-1">{n.time} ago</div>
              </div>
              {n.unread && <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

