import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const languages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php', 'html', 'css', 'sql', 'bash'
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [codeTitle, setCodeTitle] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !code.trim() && !imageUrl.trim()) {
      toast.error('Please add some content, code, or an image URL.');
      return;
    }

    const postData = {
      content: content.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      codeSnippet: code.trim() ? { code, language: codeLanguage, title: codeTitle || undefined } : undefined,
    };

    try {
      setSubmitting(true);
      const res = await api.post('/posts', postData);
      toast.success('Post created');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to create post';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create a Post</h1>
            <p className="text-sm text-gray-500">Share text, code, or an image. Fields are optional—add what you need.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              {imageUrl.trim() && (
                <div className="mt-3">
                  <img src={imageUrl} alt="preview" className="max-h-64 rounded-lg border border-gray-200 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-800">Code Snippet (optional)</label>
                <span className="text-xs text-gray-500">Add code to make your post developer-friendly</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={codeTitle}
                  onChange={(e) => setCodeTitle(e.target.value)}
                  placeholder="Snippet title (optional)"
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <textarea
                rows={10}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Paste your ${codeLanguage} code...`}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

