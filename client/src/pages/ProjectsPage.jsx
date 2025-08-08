import React from 'react';
import Layout from '../components/Layout';

const data = [
  { name: 'awesome-devtools', stars: 1240, issues: 12, language: 'TypeScript' },
  { name: 'api-starter', stars: 860, issues: 3, language: 'JavaScript' },
  { name: 'k8s-deploy-kit', stars: 210, issues: 18, language: 'Go' },
];

export default function ProjectsPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/', icon: 'fas fa-home' },
    { label: 'Projects', icon: 'fas fa-code-branch' }
  ];

  return (
    <Layout 
      title="Projects" 
      breadcrumbs={breadcrumbs}
      className="py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Showcase, track stars, and discover contributions</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <i className="fas fa-plus mr-2"></i>
              New project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((p) => (
            <div key={p.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    <i className="fab fa-github mr-2 text-gray-500 dark:text-gray-400"></i>
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      p.language === 'TypeScript' ? 'bg-blue-500' :
                      p.language === 'JavaScript' ? 'bg-yellow-500' :
                      'bg-cyan-500'
                    }`}></div>
                    {p.language}
                  </div>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-xs font-bold shadow-md">
                  ★ {p.stars}
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex items-center">
                <i className="fas fa-exclamation-circle mr-2 text-red-500"></i>
                Open issues: <span className="ml-1 font-semibold">{p.issues}</span>
              </div>
              
              <div className="mt-6 flex items-center gap-3">
                <button className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
                  <i className="fas fa-eye mr-2"></i>
                  View
                </button>
                <button className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
                  <i className="fas fa-code mr-2"></i>
                  Contribute
                </button>
              </div>
              
              {/* Developer-friendly status indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active
                </div>
                <div>Updated 2 days ago</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Developer-friendly empty state hint */}
        {data.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-code-branch text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start by creating your first project or importing from GitHub
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <i className="fas fa-plus mr-2"></i>
              Create First Project
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

