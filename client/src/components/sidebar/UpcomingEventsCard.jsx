import React from 'react';

export default function UpcomingEventsCard() {
  const events = [
    { name: 'Dev Meetup: React 19', time: 'Fri 3:00 PM' },
    { name: 'Open Source Sprint', time: 'Sat 11:00 AM' },
  ];
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <i className="fas fa-calendar-alt mr-2" /> Upcoming Events
      </h3>
      <ul className="space-y-2 text-sm">
        {events.map((e, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="text-gray-700">{e.name}</span>
            <span className="text-xs text-gray-500">{e.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

