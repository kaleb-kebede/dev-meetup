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
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200">
      {title && (
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700">
            {title}
          </h4>
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={tomorrow}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '14px',
            lineHeight: '1.5',
            maxHeight: isCodeExpanded ? 'none' : '400px',
            overflow: 'hidden',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {displayCode}
        </SyntaxHighlighter>
        
        {/* Language Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {language || 'javascript'}
          </span>
        </div>
        
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-16 bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded transition-colors duration-200 flex items-center space-x-1"
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