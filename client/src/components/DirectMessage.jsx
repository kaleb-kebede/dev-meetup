import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../services/api';

const DirectMessage = ({ currentUserId, otherUserId, otherUserName }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function fetchMessages() {
      if (!otherUserId) return;
      
      setLoading(true);
      setError('');
      try {
        const msgs = await getMessages(otherUserId);
        setMessages(msgs);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();

    // Set up polling for new messages every 5 seconds
    const interval = setInterval(() => {
      if (otherUserId) {
        getMessages(otherUserId)
          .then(msgs => setMessages(msgs))
          .catch(err => console.error('Error polling messages:', err));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [otherUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !otherUserId) return;
    
    const messageContent = content.trim();
    setContent('');
    setSending(true);
    
    // Add temporary message to show it's being sent
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      content: messageContent,
      sender: currentUserId,
      createdAt: new Date().toISOString(),
      isSending: true
    };
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      await sendMessage(otherUserId, messageContent);
      // Remove temp message and fetch updated messages
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      const msgs = await getMessages(otherUserId);
      setMessages(msgs);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!otherUserId) {
    return (
      <div className="p-6 border rounded-lg max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 shadow-sm">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Select a user to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {otherUserName ? `Chat with ${otherUserName}` : 'Direct Messages'}
        </h2>
        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="mb-4 h-96 overflow-y-auto bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
                 ) : messages.length === 0 ? (
           <div className="text-center text-gray-500 dark:text-gray-400 py-8">
             <p>No messages yet. Start the conversation!</p>
           </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <div 
                key={msg._id} 
                className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                                 <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                   msg.sender === currentUserId 
                     ? 'bg-blue-500 text-white' 
                     : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-500 shadow-sm'
                 } ${msg.isSending ? 'opacity-70' : ''}`}>
                  <div className="text-sm flex items-center gap-2">
                    {msg.content}
                    {msg.isSending && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                    )}
                  </div>
                                     <div className={`text-xs mt-1 ${
                     msg.sender === currentUserId ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                   }`}>
                    {msg.isSending ? 'Sending...' : formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={e => {
            setContent(e.target.value);
            if (error) setError(''); // Clear error when user starts typing
          }}
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type a message... (Press Enter to send)"
          disabled={sending}
        />
        <button 
          type="submit" 
          disabled={!content.trim() || sending}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            !content.trim() || sending
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }`}
        >
          {sending ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending...
            </div>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
};

export default DirectMessage;
