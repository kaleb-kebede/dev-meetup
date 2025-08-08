import React from 'react';
import Layout from '../components/Layout';

export default function NavigationDemoPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/', icon: 'fas fa-home' },
    { label: 'Projects', href: '/projects', icon: 'fas fa-code-branch' },
    { label: 'Navigation Demo', icon: 'fas fa-compass' }
  ];

  const navigationFeatures = [
    {
      title: 'Enhanced Header Logo',
      description: 'The DevMeetup logo now includes a home icon and tooltip for clear homepage navigation',
      icon: 'fas fa-home',
      color: 'blue'
    },
    {
      title: 'Smart Breadcrumbs',
      description: 'Contextual breadcrumb navigation shows your path and provides quick links back',
      icon: 'fas fa-route',
      color: 'green'
    },
    {
      title: 'Layout Component',
      description: 'Consistent navigation across all pages with professional title bars and quick home access',
      icon: 'fas fa-th-large',
      color: 'purple'
    },
    {
      title: 'Mobile Navigation',
      description: 'Enhanced mobile nav with visual feedback and floating home button for easy access',
      icon: 'fas fa-mobile-alt',
      color: 'orange'
    },
    {
      title: 'Quick Actions',
      description: 'Page headers include quick navigation options to return home with one click',
      icon: 'fas fa-bolt',
      color: 'indigo'
    },
    {
      title: 'Developer Friendly',
      description: 'Terminal-inspired design elements that developers love with intuitive UX patterns',
      icon: 'fas fa-terminal',
      color: 'gray'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      gray: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <Layout 
      title="Navigation Demo" 
      breadcrumbs={breadcrumbs}
      className="py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-compass text-white text-3xl"></i>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            This page demonstrates the professional and developer-friendly navigation system 
            implemented across the DevMeetup platform. Every page now has consistent, 
            intuitive navigation back to the homepage and between sections.
          </p>
          
          {/* Quick Navigation Test */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Test Navigation</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <a 
                href="/" 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                <i className="fas fa-home mr-2"></i>
                Go to Homepage
              </a>
              <a 
                href="/projects" 
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                <i className="fas fa-code-branch mr-2"></i>
                View Projects
              </a>
              <a 
                href="/challenges" 
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                <i className="fas fa-rocket mr-2"></i>
                Try Challenges
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {navigationFeatures.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6">
              <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center mb-4 ${getColorClasses(feature.color)}`}>
                <i className={`${feature.icon} text-lg`}></i>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Implementation Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-code text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Implementation Highlights</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Header Enhancement</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                The main logo now uses a home icon with hover effects, tooltip, and enhanced visual feedback 
                to clearly indicate it's clickable and leads to the homepage.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Layout Component</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                A reusable Layout component ensures every page has consistent navigation, breadcrumbs, 
                and quick home access without code duplication.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mobile Experience</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Enhanced mobile navigation with visual feedback, floating action button for quick home access, 
                and touch-friendly interactions.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Developer UX</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Terminal-inspired design elements, keyboard navigation support, and familiar patterns 
                that developers expect and love.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Navigation Complete!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Professional and developer-friendly navigation is now implemented across the entire platform.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-home mr-2"></i>
            Return to Homepage
          </a>
        </div>
      </div>
    </Layout>
  );
}
