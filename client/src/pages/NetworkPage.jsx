import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const developers = [
  { 
    name: 'Sarah Chen', 
    username: 'sarahdev', 
    skills: ['React', 'TypeScript', 'GraphQL'], 
    followers: 2300,
    following: 850,
    bio: 'Frontend architect passionate about React ecosystem and modern web development',
    location: 'San Francisco, CA',
    company: 'Tech Startup',
    githubStats: { repos: 47, stars: 892 },
    isOnline: true,
    verified: true
  },
  { 
    name: 'Alex Rodriguez', 
    username: 'alexcodes', 
    skills: ['Node.js', 'DevOps', 'Docker', 'AWS'], 
    followers: 1800,
    following: 620,
    bio: 'Full-stack engineer and DevOps enthusiast. Building scalable cloud solutions',
    location: 'New York, NY',
    company: 'Enterprise Corp',
    githubStats: { repos: 63, stars: 1247 },
    isOnline: false,
    verified: true
  },
  { 
    name: 'Priya Anand', 
    username: 'priyacodes', 
    skills: ['Python', 'AI/ML', 'TensorFlow', 'Data Science'], 
    followers: 2750,
    following: 340,
    bio: 'ML Engineer working on computer vision and NLP. PhD in Computer Science',
    location: 'Toronto, CA',
    company: 'AI Research Lab',
    githubStats: { repos: 29, stars: 2103 },
    isOnline: true,
    verified: true
  },
  { 
    name: 'Jon Park', 
    username: 'jonbuilds', 
    skills: ['Go', 'Kubernetes', 'Microservices'], 
    followers: 950,
    following: 420,
    bio: 'Backend developer specializing in distributed systems and container orchestration',
    location: 'Seattle, WA',
    company: 'Cloud Provider',
    githubStats: { repos: 34, stars: 567 },
    isOnline: false,
    verified: false
  },
  {
    name: 'Maya Patel',
    username: 'mayacodes',
    skills: ['Vue.js', 'Nuxt', 'CSS', 'Design Systems'],
    followers: 1650,
    following: 780,
    bio: 'Frontend developer with a passion for design systems and user experience',
    location: 'London, UK',
    company: 'Design Agency',
    githubStats: { repos: 52, stars: 734 },
    isOnline: true,
    verified: false
  },
  {
    name: 'Carlos Silva',
    username: 'carlosdev',
    skills: ['Rust', 'WebAssembly', 'Systems Programming'],
    followers: 1200,
    following: 290,
    bio: 'Systems programmer exploring the future of web performance with Rust and WASM',
    location: 'São Paulo, BR',
    company: 'Open Source',
    githubStats: { repos: 23, stars: 1456 },
    isOnline: false,
    verified: true
  }
];

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const breadcrumbs = [
    { label: 'Home', href: '/', icon: 'fas fa-home' },
    { label: 'DevNetwork', icon: 'fas fa-users-cog' }
  ];

  const filters = [
    { id: 'all', label: 'All Developers', icon: 'fas fa-users' },
    { id: 'online', label: 'Online', icon: 'fas fa-circle' },
    { id: 'verified', label: 'Verified', icon: 'fas fa-check-circle' },
    { id: 'following', label: 'Following', icon: 'fas fa-user-friends' },
  ];

  const filteredDevelopers = developers.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dev.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    switch (selectedFilter) {
      case 'online': return dev.isOnline;
      case 'verified': return dev.verified;
      case 'following': return false; // Would check actual following status
      default: return true;
    }
  });

  const getSkillColor = (skill) => {
    const colors = {
      'React': 'bg-blue-100 text-blue-700 border-blue-200',
      'Vue.js': 'bg-green-100 text-green-700 border-green-200',
      'TypeScript': 'bg-blue-100 text-blue-700 border-blue-200',
      'JavaScript': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Python': 'bg-green-100 text-green-700 border-green-200',
      'Go': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Rust': 'bg-orange-100 text-orange-700 border-orange-200',
      'Node.js': 'bg-green-100 text-green-700 border-green-200',
      'DevOps': 'bg-purple-100 text-purple-700 border-purple-200',
      'AI/ML': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return colors[skill] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <Layout 
      title="Developer Network" 
      breadcrumbs={breadcrumbs}
      className="py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Connect with talented developers from around the world. Build your professional network and discover new collaboration opportunities.
          </p>
          
          {/* Network Stats */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{developers.length}</div>
              <div className="text-sm text-gray-500">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{developers.filter(d => d.isOnline).length}</div>
              <div className="text-sm text-gray-500">Online Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{developers.filter(d => d.verified).length}</div>
              <div className="text-sm text-gray-500">Verified</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-3 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 transition-all duration-200"
                placeholder="Search developers, skills, locations..."
              />
              <i className="fas fa-search absolute left-4 top-4 text-gray-400"></i>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium">
              <i className="fas fa-search mr-2"></i>
              Search
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
                  selectedFilter === filter.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                }`}
              >
                <i className={`${filter.icon} mr-2 text-sm`}></i>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <div key={dev.username} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 group">
              {/* Developer Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-lg">
                      {dev.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                    </div>
                    {dev.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {dev.name}
                      </h3>
                      {dev.verified && (
                        <i className="fas fa-check-circle text-blue-500 text-sm" title="Verified Developer"></i>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{dev.username}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{dev.location}</span>
                      <span>•</span>
                      <span>{dev.company}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                {dev.bio}
              </p>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {dev.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium border ${getSkillColor(skill)}`}>
                    {skill}
                  </span>
                ))}
                {dev.skills.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                    +{dev.skills.length - 3} more
                  </span>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mb-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-users"></i>
                    <span>{dev.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fab fa-github"></i>
                    <span>{dev.githubStats.stars}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  dev.isOnline ? 'text-green-500' : 'text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    dev.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs">{dev.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm">
                  <i className="fas fa-user-plus mr-2"></i>
                  Follow
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm">
                  <i className="fas fa-comment mr-2"></i>
                  Message
                </button>
              </div>
              
              {/* View Profile Link */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                <Link 
                  to={`/profile/${dev.username}`} 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium hover:underline transition-colors duration-200"
                >
                  <i className="fas fa-user mr-1"></i>
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDevelopers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-search text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No developers found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more developers.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-refresh mr-2"></i>
              Reset Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-handshake text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Join the Community</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Connect with these amazing developers and expand your professional network
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <i className="fas fa-users mr-2"></i>
            Invite Friends
          </button>
        </div>
      </div>
    </Layout>
  );
}

