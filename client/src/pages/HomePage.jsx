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
  const [posts] = useState([]); // Placeholder for posts count

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
        {/* Developer Dashboard Style Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Developer Tools & Stats */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="sticky top-24">
              <LeftSidebar />
              
              {/* Code Activity Card */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center">
                    <i className="fas fa-code mr-2"></i>
                    Code Activity
                  </h3>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <i className="fab fa-github text-sm"></i>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-100">Commits this week</span>
                    <span className="font-bold">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-100">Active repositories</span>
                    <span className="font-bold">7</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                    <div className="bg-white rounded-full h-2" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-xs text-green-100 mt-1">68% more active than last week</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-bolt text-yellow-500 mr-2"></i>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 group">
                    <i className="fas fa-plus text-blue-600 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
                    <span className="text-xs font-medium text-blue-700">New Post</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 group">
                    <i className="fab fa-github text-green-600 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
                    <span className="text-xs font-medium text-green-700">GitHub</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 group">
                    <i className="fas fa-search text-purple-600 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
                    <span className="text-xs font-medium text-purple-700">Explore</span>
                  </button>
                  <button className="flex flex-col items-center p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-200 group">
                    <i className="fas fa-trophy text-orange-600 text-lg mb-1 group-hover:scale-110 transition-transform"></i>
                    <span className="text-xs font-medium text-orange-700">Events</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content - Developer Feed */}
          <div className="col-span-12 lg:col-span-6">
            {/* Terminal-style Feed Header */}
            <div className="bg-gray-900 rounded-t-2xl p-4 mb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-green-400 font-mono text-sm">
                    <span className="text-gray-400">dev@meetup:</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-green-400">$ community --feed</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-800 transition-colors">
                    <i className="fas fa-filter mr-1"></i>filter
                  </button>
                  <button className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-800 transition-colors">
                    <i className="fas fa-sync mr-1"></i>refresh
                  </button>
                </div>
              </div>
            </div>
            
            {/* Feed Content with terminal styling */}
            <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl border-x border-b border-gray-200/50 shadow-lg">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">●</span>
                  <span className="text-gray-600">Connected to developer community</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600">{posts?.length || 0} active threads</span>
                </div>
              </div>
              <div className="p-4">
                <MainFeed />
              </div>
            </div>
          </div>
          
          {/* Right Panel - Community & Resources */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="sticky top-24">
              {/* Live Activity */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-pulse text-red-500 mr-2"></i>
                  Live Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">23 developers online</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">5 new posts in last hour</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">12 repositories updated</span>
                  </div>
                </div>
              </div>
              
              {/* Tech Stack Radar */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg p-5">
                <h3 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-radar-dish mr-2"></i>
                  Tech Radar
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'React', level: 85, color: 'bg-cyan-400' },
                    { name: 'TypeScript', level: 92, color: 'bg-blue-400' },
                    { name: 'Next.js', level: 78, color: 'bg-gray-300' },
                    { name: 'Node.js', level: 90, color: 'bg-green-400' }
                  ].map((tech, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{tech.name}</span>
                        <span className="font-bold">{tech.level}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className={`${tech.color} rounded-full h-2 transition-all duration-1000`}
                          style={{ width: `${tech.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <RightSidebar />
              
              {/* Code Challenges */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg p-5">
                <h3 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-trophy mr-2"></i>
                  Daily Challenge
                </h3>
                <div className="text-sm opacity-90 mb-3">
                  Build a recursive function that finds the maximum depth of a binary tree
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <i className="fas fa-users mr-1"></i>
                    47 participants
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                    Join Challenge
                  </button>
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
