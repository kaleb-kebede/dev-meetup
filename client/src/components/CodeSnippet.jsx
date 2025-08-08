import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

const CodeSnippet = ({ code, language, title }) => {
  const [copied, setCopied] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

  if (!code || !code.trim()) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Function to determine if code should be collapsed
  const shouldCollapseCode = (code) => {
    const lines = code.split('\n');
    return lines.length > 15; // Collapse if more than 15 lines
  };

  // Function to get truncated code
  const getTruncatedCode = (code) => {
    const lines = code.split('\n');
    if (lines.length <= 15) return code;
    return lines.slice(0, 15).join('\n') + '\n// ... (truncated)';
  };

  const displayCode = isCodeExpanded ? code : getTruncatedCode(code);
  const needsCollapsing = shouldCollapseCode(code);

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white">
      {/* Terminal-style Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-gray-300 text-sm font-mono">
            <i className="fas fa-terminal mr-2"></i>
            {title || `main.${language || 'js'}`}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Language Badge */}
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-mono font-semibold flex items-center">
            <i className="fas fa-code mr-1"></i>
            {language || 'javascript'}
          </span>
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 font-mono"
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
      </div>
      
      <div className="relative bg-gray-50">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={tomorrow}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            maxHeight: isCodeExpanded ? 'none' : '400px',
            overflow: 'hidden',
            background: '#1a1b26',
            padding: '1.5rem',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {displayCode}
        </SyntaxHighlighter>

        {/* Show More/Less Button for Code */}
        {needsCollapsing && (
          <div className="absolute bottom-2 right-2">
            <button
              onClick={() => setIsCodeExpanded(!isCodeExpanded)}
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded transition-colors duration-200 flex items-center space-x-1"
            >
              {isCodeExpanded ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>Show more</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSnippet; 