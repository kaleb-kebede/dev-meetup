import React, { useState } from 'react';
import toast from 'react-hot-toast';

// Dev-friendly share menu for posts and code
// Props:
// - postId: string
// - post: full post object (optional)
// - codeSnippet: { code: string, language?: string, title?: string } | null
// - getPostUrl: (postId) => string  // function to generate a shareable URL
// - onCreateGist?: (code, opts) => Promise<string>  // optional integration
// - onOpenStackBlitz?: (code, language) => void     // optional integration
export default function ShareMenu({ postId, post, codeSnippet, getPostUrl, onCreateGist, onOpenStackBlitz }) {
  const [open, setOpen] = useState(false);
  const url = getPostUrl ? getPostUrl(postId) : window.location.origin + '/posts/' + postId;

  const copyToClipboard = async (text, successMessage) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage || 'Copied to clipboard');
    } catch (e) {
      toast.error('Failed to copy');
    }
  };

  const copyPostLink = () => copyToClipboard(url, 'Post link copied');

  const copyCode = () => {
    if (codeSnippet?.code?.trim()) {
      copyToClipboard(codeSnippet.code, 'Code copied');
    } else {
      toast('No code in this post');
    }
  };

  const toMarkdown = () => {
    const parts = [];
    if (post?.content) parts.push(post.content);
    if (codeSnippet?.code?.trim()) {
      const lang = codeSnippet.language || 'txt';
      parts.push('```' + lang + '\n' + codeSnippet.code + '\n```');
    }
    parts.push('\nLink: ' + url);
    return parts.join('\n\n');
  };

  const copyMarkdown = () => copyToClipboard(toMarkdown(), 'Markdown copied');

  const createGist = async () => {
    if (!codeSnippet?.code?.trim()) {
      toast('No code to gist');
      return;
    }
    if (!onCreateGist) {
      toast('Gist integration not configured');
      return;
    }
    try {
      const gistUrl = await onCreateGist(codeSnippet.code, { filename: (codeSnippet.title || 'snippet') + getExt(codeSnippet.language) });
      await copyToClipboard(gistUrl, 'Gist URL copied');
    } catch (e) {
      toast.error('Failed to create gist');
    }
  };

  const openStackBlitz = () => {
    if (!codeSnippet?.code?.trim()) {
      toast('No code to open');
      return;
    }
    if (onOpenStackBlitz) {
      try {
        onOpenStackBlitz(codeSnippet.code, codeSnippet.language || 'javascript');
      } catch (e) {
        toast.error('Failed to open StackBlitz');
      }
    } else {
      toast('StackBlitz integration not configured');
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-2 py-3 w-full text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 font-mono text-sm px-3 rounded-md"
      >
        <i className="fas fa-share text-gray-400" />
        <span>share</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 border border-gray-200">
          <div className="py-1 text-sm">
            <button onClick={copyPostLink} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
              <i className="fas fa-link text-gray-500" />
              Copy post link
            </button>
            <button onClick={copyMarkdown} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
              <i className="fas fa-file-markdown text-gray-500" />
              Copy as Markdown
            </button>
            <button onClick={copyCode} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
              <i className="fas fa-code text-gray-500" />
              Copy code
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button onClick={createGist} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
              <i className="fab fa-github text-gray-600" />
              Create Gist (stub)
            </button>
            <button onClick={openStackBlitz} className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
              <i className="fas fa-bolt text-yellow-500" />
              Open in StackBlitz (stub)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getExt(language) {
  switch ((language || '').toLowerCase()) {
    case 'javascript':
    case 'js':
      return '.js';
    case 'typescript':
    case 'ts':
      return '.ts';
    case 'python':
    case 'py':
      return '.py';
    case 'java':
      return '.java';
    case 'cpp':
    case 'c++':
      return '.cpp';
    case 'csharp':
    case 'c#':
      return '.cs';
    case 'php':
      return '.php';
    case 'html':
      return '.html';
    case 'css':
      return '.css';
    case 'sql':
      return '.sql';
    case 'bash':
    case 'sh':
      return '.sh';
    default:
      return '.txt';
  }
}

