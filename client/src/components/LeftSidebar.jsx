import React from 'react';
import ProfileCard from './ProfileCard';
import DevQuickLinks from './sidebar/DevQuickLinks';
import RepoActivityCard from './sidebar/RepoActivityCard';
import SavedSnippetsCard from './sidebar/SavedSnippetsCard';
import UpcomingEventsCard from './sidebar/UpcomingEventsCard';
import MiniTechRadar from './sidebar/MiniTechRadar';

export default function LeftSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileCard />
      <DevQuickLinks />
      <RepoActivityCard />
      <SavedSnippetsCard />
      <UpcomingEventsCard />
      <MiniTechRadar />
    </div>
  );
}
