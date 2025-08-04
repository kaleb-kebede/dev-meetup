import React from 'react';
import ProfileCard from './ProfileCard';
import PageLinkCard from './PageLinkCard';

export default function LeftSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <ProfileCard />
      <PageLinkCard />
    </div>
  );
}