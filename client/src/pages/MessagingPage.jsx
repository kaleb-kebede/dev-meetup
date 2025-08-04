import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getProfileImageUrl } from '../utils/imageUtils';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function MessagingPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      // Set up polling for real-time updates
      const interval = setInterval(() => {
        fetchMessages(selectedUser._id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      const allUsers = response.data.filter(user => user._id !== currentUser?._id);
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await api.get(`/messages/${otherUserId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setSending(true);
      await api.post('/messages', {
        receiver: selectedUser._id,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedUser._id);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content - Non-scrollable container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          
          {/* Left Sidebar - 3/4 width */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-full flex flex-col">
              <div className="grid grid-cols-4 h-full">
                
                {/* User Selection Column - 1/4 width, scrollable */}
                <div className="col-span-1 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-1">
                              <div className="h-3 bg-gray-200 rounded w-20"></div>
                              <div className="h-2 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2">
                        {users.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                              selectedUser?._id === user._id
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <img
                              src={getProfileImageUrl(user.profileImageUrl, user.username)}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = `https://placehold.co/40x40/E2E8F0/475569?text=${user.username.charAt(0)}`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {user.username}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.bio || 'Software Developer'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Messaging Column - 3/4 width */}
                <div className="col-span-3 flex flex-col h-full">
                  {selectedUser ? (
                    <div className="flex flex-col h-full">
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 flex-shrink-0">
                        <img
                          src={getProfileImageUrl(selectedUser.profileImageUrl, selectedUser.username)}
                          alt={selectedUser.username}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/40x40/E2E8F0/475569?text=${selectedUser.username.charAt(0)}`;
                          }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {selectedUser.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedUser.bio || 'Software Developer'}
                          </div>
                        </div>
                      </div>

                      {/* Messages Area - Scrollable */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${message.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === currentUser._id
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white'
                              }`}
                            >
                              <div className="text-sm">{message.content}</div>
                              <div className="text-xs opacity-70 mt-1">
                                {formatTime(message.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input - Always visible at bottom */}
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={sending}
                          />
                          <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                          >
                            {sending ? 'Sending...' : 'Send'}
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Select a conversation
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Choose a user from the list to start messaging
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 1/4 width */}
          <div className="lg:col-span-1 h-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 h-full">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  New Message
                </button>
                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Search Messages
                </button>
                <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Message Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
} 