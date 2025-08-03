import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CodeSnippetForm = ({ onCodeSnippetChange, codeSnippet }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet.code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = codeSnippet.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
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
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preview:
                </h4>
                <button
                  onClick={handleCopy}
                  className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded flex items-center space-x-1 transition-colors duration-200"
                  title="Copy code"
                >
                  {copied ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
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