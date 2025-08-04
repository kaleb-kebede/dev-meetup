import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import MainFeed from '../components/MainFeed';
import RightSidebar from '../components/RightSidebar';
import MobileNav from '../components/MobileNav';

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[225px_1fr_300px] md:grid-cols-[225px_1fr] gap-x-6 gap-y-6 pt-6 px-4 pb-20 md:pb-6">
        {/* Left Sidebar - Hidden on mobile, visible on md+ */}
        <div className="hidden md:block lg:block">
          <div className="sticky top-20">
            <LeftSidebar />
          </div>
        </div>
        
        {/* Main Feed - Always visible */}
        <div className="min-w-0">
          <MainFeed />
        </div>
        
        {/* Right Sidebar - Hidden on mobile and tablet, visible on lg+ */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <RightSidebar />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
