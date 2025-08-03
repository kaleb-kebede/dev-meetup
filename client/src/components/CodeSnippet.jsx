import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeSnippet = ({ code, language, title }) => {
  if (!code || !code.trim()) return null;

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {title && (
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
        <div className="absolute top-2 right-2">
          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {language || 'javascript'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippet; 