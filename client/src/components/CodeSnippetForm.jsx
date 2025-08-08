import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CodeSnippetForm = ({ onCodeSnippetChange, codeSnippet }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  return (
    <div className="space-y-4">
      {/* Basic Code Input - Always Visible */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code (optional)
        </label>
        <textarea
          value={codeSnippet.code || ''}
          onChange={handleCodeChange}
          placeholder="Paste your code here..."
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Advanced Options */}
      {codeSnippet.code && (
        <div className="space-y-3 border-t border-gray-200 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                value={codeSnippet.title || ''}
                onChange={handleTitleChange}
                placeholder="e.g., React Hook"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Language
              </label>
              <select
                value={codeSnippet.language || 'javascript'}
                onChange={handleLanguageChange}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {programmingLanguages.slice(0, 10).map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSnippetForm; 