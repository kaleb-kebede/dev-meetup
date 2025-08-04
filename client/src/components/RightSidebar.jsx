import React from 'react';
import InfoCard from './InfoCard';
import SuggestionsCard from './SuggestionsCard';

export default function RightSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <InfoCard />
      <SuggestionsCard />
    </div>
  );
}