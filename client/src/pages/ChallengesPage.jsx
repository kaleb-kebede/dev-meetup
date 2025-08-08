import React from 'react';
import Layout from '../components/Layout';

const challengeData = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers and a target, return indices of two numbers that sum to target.',
    difficulty: 'Easy',
    difficultyColor: 'bg-green-100 text-green-700',
    tags: ['algorithms', 'arrays', 'hash-map'],
    completions: 1247,
    likes: 89
  },
  {
    id: 2,
    title: 'Binary Tree Traversal',
    description: 'Implement inorder, preorder, and postorder traversal of a binary tree.',
    difficulty: 'Medium',
    difficultyColor: 'bg-yellow-100 text-yellow-700',
    tags: ['trees', 'recursion', 'data-structures'],
    completions: 834,
    likes: 156
  },
  {
    id: 3,
    title: 'Merge K Sorted Lists',
    description: 'Merge k sorted linked lists and return it as one sorted list.',
    difficulty: 'Hard',
    difficultyColor: 'bg-red-100 text-red-700',
    tags: ['linked-lists', 'divide-conquer', 'heap'],
    completions: 421,
    likes: 203
  },
  {
    id: 4,
    title: 'Valid Palindrome',
    description: 'Check if a string is a valid palindrome, considering only alphanumeric characters.',
    difficulty: 'Easy',
    difficultyColor: 'bg-green-100 text-green-700',
    tags: ['strings', 'two-pointers'],
    completions: 2103,
    likes: 67
  },
  {
    id: 5,
    title: 'Design LRU Cache',
    description: 'Design a data structure that follows the constraints of a Least Recently Used cache.',
    difficulty: 'Medium',
    difficultyColor: 'bg-yellow-100 text-yellow-700',
    tags: ['design', 'hash-map', 'linked-list'],
    completions: 612,
    likes: 289
  },
  {
    id: 6,
    title: 'Word Ladder',
    description: 'Transform one word into another word one letter at a time using valid words.',
    difficulty: 'Hard',
    difficultyColor: 'bg-red-100 text-red-700',
    tags: ['bfs', 'graph', 'strings'],
    completions: 298,
    likes: 178
  }
];

export default function ChallengesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/', icon: 'fas fa-home' },
    { label: 'Challenges', icon: 'fas fa-rocket' }
  ];

  return (
    <Layout 
      title="Coding Challenges" 
      breadcrumbs={breadcrumbs}
      className="py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Sharpen your coding skills with curated challenges designed by and for developers
          </p>
          
          {/* Challenge Stats */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-500">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12.5k</div>
              <div className="text-sm text-gray-500">Solutions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3.2k</div>
              <div className="text-sm text-gray-500">Developers</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 font-medium">
              <i className="fas fa-filter mr-2"></i>All
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors duration-200 font-medium">
              Easy
            </button>
            <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors duration-200 font-medium">
              Medium
            </button>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200 font-medium">
              Hard
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-200 font-medium">
              <i className="fas fa-fire mr-2"></i>Popular
            </button>
          </div>
        </div>
        
        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challengeData.map((challenge) => (
            <div key={challenge.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 group">
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-2">
                    {challenge.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${challenge.difficultyColor}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="fas fa-code text-white text-lg"></i>
                  </div>
                </div>
              </div>
              
              {/* Challenge Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                {challenge.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mb-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <i className="fas fa-users mr-1"></i>
                  {challenge.completions.toLocaleString()} solved
                </div>
                <div className="flex items-center">
                  <i className="fas fa-heart mr-1 text-red-500"></i>
                  {challenge.likes}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
                  <i className="fas fa-play mr-2"></i>
                  Start
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium">
                  <i className="fas fa-comments mr-2"></i>
                  Discuss
                </button>
              </div>
              
              {/* Progress Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Completion Rate</span>
                  <span>{Math.round((challenge.completions / 5000) * 100)}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round((challenge.completions / 5000) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-trophy text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready for More?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Join our community challenges and compete with developers worldwide
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <i className="fas fa-bolt mr-2"></i>
            Join Weekly Contest
          </button>
        </div>
      </div>
    </Layout>
  );
}
