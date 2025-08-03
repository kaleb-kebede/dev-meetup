import React, { useState } from 'react';

const CodeSnippetForm = ({ onCodeSnippetChange, codeSnippet }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const programmingLanguages = [
    'javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust',
    'swift', 'kotlin', 'typescript', 'html', 'css', 'sql', 'bash', 'json', 'xml',
    'yaml', 'markdown', 'dockerfile', 'shell', 'powershell', 'r', 'scala', 'perl'
  ];

  const handleCodeChange = (e) => {
    onCodeSnippetChange({
      ...codeSnippet,
      code: e.target.value
    });
  };

  const handleLanguageChange = (e) => {
    onCodeSnippetChange({
      ...codeSnippet,
      language: e.target.value
    });
  };

  const handleTitleChange = (e) => {
    onCodeSnippetChange({
      ...codeSnippet,
      title: e.target.value
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          💻 Code Snippet
        </h3>
        <button
          type="button"
          onClick={toggleExpanded}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Snippet Title (optional)
            </label>
            <input
              type="text"
              value={codeSnippet.title || ''}
              onChange={handleTitleChange}
              placeholder="e.g., React Hook Example"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Programming Language
            </label>
            <select
              value={codeSnippet.language || 'javascript'}
              onChange={handleLanguageChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {programmingLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Code
            </label>
            <textarea
              value={codeSnippet.code || ''}
              onChange={handleCodeChange}
              placeholder="Paste your code here..."
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Preview */}
          {codeSnippet.code && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview:
              </h4>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {codeSnippet.title || 'Untitled'} • {codeSnippet.language || 'javascript'}
                  </span>
                </div>
                <div className="bg-gray-900 text-gray-100 p-3 font-mono text-sm overflow-x-auto">
                  <pre>{codeSnippet.code}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeSnippetForm; 