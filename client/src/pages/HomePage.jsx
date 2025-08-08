import React, { useState } from 'react';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import MainFeed from '../components/MainFeed';
import RightSidebar from '../components/RightSidebar';
import MobileNav from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Floating background elements for visual interest */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/8 to-purple-400/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl"></div>
      </div>

      <Header />
      
      {/* Welcome Banner - Shows for new users or can be dismissed */}
      {showWelcome && (
        <div className="relative z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className="fas fa-code text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Welcome to Dev Meetup, {user?.username}! 👋</h2>
                  <p className="text-blue-100 text-sm">Connect with fellow developers, share your projects, and grow together</p>
                </div>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] md:grid-cols-[280px_1fr] gap-6">
          {/* Left Sidebar - Enhanced */}
          <div className="hidden md:block">
            <div className="sticky top-24 space-y-4">
              <LeftSidebar />
              
              {/* Quick Actions Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-rocket text-blue-600 mr-2"></i>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center">
                    <i className="fas fa-plus text-blue-600 mr-2"></i>
                    Create Post
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200 flex items-center">
                    <i className="fab fa-github text-green-600 mr-2"></i>
                    Connect GitHub
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors duration-200 flex items-center">
                    <i className="fas fa-users text-purple-600 mr-2"></i>
                    Find Developers
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Feed - Enhanced */}
          <div className="min-w-0">
            {/* Feed Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <i className="fas fa-stream text-blue-600 mr-3"></i>
                    Developer Feed
                  </h1>
                  <p className="text-gray-600 mt-1">Latest updates from your developer community</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
                    <i className="fas fa-filter mr-2"></i>
                    Filter
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <i className="fas fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Feed Content */}
            <MainFeed />
          </div>
          
          {/* Right Sidebar - Enhanced */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Developer Stats Card */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-chart-line mr-2"></i>
                  Your Dev Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Posts this month</span>
                    <span className="font-bold text-xl">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Profile views</span>
                    <span className="font-bold text-xl">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Connections</span>
                    <span className="font-bold text-xl">43</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400/30">
                  <button className="text-sm text-blue-100 hover:text-white flex items-center">
                    <i className="fas fa-arrow-right mr-2"></i>
                    View detailed analytics
                  </button>
                </div>
              </div>
              
              <RightSidebar />
              
              {/* Trending Technologies */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-fire text-orange-500 mr-2"></i>
                  Trending Tech
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'React', growth: '+15%' },
                    { name: 'TypeScript', growth: '+12%' },
                    { name: 'Next.js', growth: '+18%' },
                    { name: 'Tailwind CSS', growth: '+9%' }
                  ].map((tech, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-700">{tech.name}</span>
                      <span className="text-xs text-green-600 font-medium">{tech.growth}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
