import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getProfileImageUrl } from '../utils/imageUtils';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';
import { Link } from 'react-router-dom';

export default function MessagingPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // New state variables for enhanced features
  const [onlineUsers] = useState(new Set(['user123', 'user456', 'user789'])); // Mock online users
  const [searchTerm, setSearchTerm] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('// Type your code here\nfunction helloWorld() {\n  console.log("Hello, Developer!");\n  return true;\n}');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [syntaxHighlight, setSyntaxHighlight] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [viewMode, setViewMode] = useState('terminal'); // 'terminal' or 'chat'
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

    // Handle special commands
    if (newMessage.startsWith('/')) {
      handleTerminalCommand(newMessage);
      return;
    }

    try {
      setSending(true);
      await api.post('/messages', {
        receiver: selectedUser._id,
        content: newMessage
      });
      
      // Add to command history
      setCommandHistory(prev => [...prev, newMessage]);
      setHistoryIndex(-1);
      
      setNewMessage('');
      fetchMessages(selectedUser._id);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTerminalCommand = (command) => {
    const cmd = command.toLowerCase();
    
    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Process commands
    if (cmd === '/clear') {
      setMessages([]);
    } else if (cmd === '/help') {
      addSystemMessage(
        "Available commands:\n" +
        "/clear - Clear current conversation\n" +
        "/code - Toggle code editor\n" +
        "/theme - Toggle light/dark theme\n" +
        "/syntax - Toggle syntax highlighting\n" +
        "/view - Toggle between terminal and chat view\n" +
        "/font [size] - Change font size (e.g., /font 16)\n" +
        "/help - Show this help message"
      );
    } else if (cmd === '/code') {
      setShowCodeEditor(!showCodeEditor);
      addSystemMessage(showCodeEditor ? "Code editor closed" : "Code editor opened");
    } else if (cmd === '/theme') {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      addSystemMessage(`Theme switched to ${newTheme} mode`);
    } else if (cmd === '/syntax') {
      setSyntaxHighlight(!syntaxHighlight);
      addSystemMessage(syntaxHighlight ? "Syntax highlighting disabled" : "Syntax highlighting enabled");
    } else if (cmd === '/view') {
      const newView = viewMode === 'terminal' ? 'chat' : 'terminal';
      setViewMode(newView);
      addSystemMessage(`View mode switched to ${newView}`);
    } else if (cmd.startsWith('/font')) {
      const size = parseInt(cmd.split(' ')[1]);
      if (!isNaN(size) && size > 8 && size < 24) {
        setFontSize(size);
        addSystemMessage(`Font size changed to ${size}px`);
      } else {
        addSystemMessage("Invalid font size. Please specify a size between 8 and 24.");
      }
    } else {
      addSystemMessage(`Unknown command: ${command}. Type /help for available commands.`);
    }
    
    setNewMessage('');
  };

  const addSystemMessage = (content) => {
    const systemMessage = {
      _id: `system-${Date.now()}`,
      sender: 'system',
      content: content,
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleKeyDown = (e) => {
    // Handle command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setNewMessage(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setNewMessage(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setNewMessage('');
      }
    }
  };

  const handleCodeSnippetChange = (e) => {
    setCodeSnippet(e.target.value);
  };

  const sendCodeSnippet = () => {
    if (!codeSnippet.trim() || !selectedUser) return;

    const formattedCode = '```javascript\n' + codeSnippet + '\n```';
    setNewMessage(formattedCode);
    
    // Focus back to input field
    inputRef.current.focus();
    setShowCodeEditor(false);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Function to format messages with markdown and code highlighting
  const formatMessage = (content) => {
    // Check if the message is a code block
    if (content.startsWith('```') && content.endsWith('```')) {
      const code = content.substring(content.indexOf('\n') + 1, content.lastIndexOf('```'));
      const language = content.substring(3, content.indexOf('\n'));
      
      return (
        <div className="font-mono text-xs overflow-x-auto bg-gray-900 rounded-md p-3 my-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">{language || 'code'}</span>
            <button 
              className="text-gray-400 hover:text-white text-xs"
              onClick={() => {navigator.clipboard.writeText(code)}}
            >
              copy
            </button>
          </div>
          <pre className={syntaxHighlight ? "text-green-400" : "text-gray-300"}>
            {code}
          </pre>
        </div>
      );
    }
    
    // If not a code block, just return the content
    return <span>{content}</span>;
  };

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <Header />
      
      {/* Main Content - Fixed height container */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 flex overflow-hidden">
        <div className="w-full h-full flex gap-4">
          
          {/* Left Panel - User Selection - Fixed width and height */}
          <div className="w-80 h-full flex-shrink-0">
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm h-full flex flex-col`}>
              {/* Terminal-style header - Fixed */}
              <div className="bg-gray-900 text-white p-3 flex justify-between items-center flex-shrink-0">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs font-mono">developers.list</span>
              </div>
              
              {/* Search input - Fixed */}
              <div className="p-3 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center bg-gray-700 rounded-md px-3 py-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search developers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white w-full px-2 py-1 focus:outline-none text-sm"
                  />
                </div>
              </div>
              
              {/* User list - Scrollable area only */}
              <div className="flex-1 overflow-y-auto p-1 font-mono text-sm">
                {loading ? (
                  <div className="p-3">
                    <div className="animate-pulse">
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                      </div>
                      <div className="h-3 bg-gray-700 rounded w-1/2 ml-5 mb-4"></div>
                      
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      </div>
                      <div className="h-3 bg-gray-700 rounded w-2/3 ml-5 mb-4"></div>
                      
                      <div className="flex items-center mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="h-3 bg-gray-700 rounded w-1/3 ml-5"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors duration-150 ${
                          selectedUser?._id === user._id ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-2 h-2 ${onlineUsers.has(user._id) ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                          <span className={`${onlineUsers.has(user._id) ? 'text-green-400' : 'text-gray-300'}`}>
                            {user.username}
                          </span>
                        </div>
                        <div className="ml-4 text-gray-500 text-xs">{user.bio || 'Developer'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Status bar - Fixed at bottom */}
              <div className="p-2 border-t border-gray-700 bg-gray-800 text-gray-400 text-xs font-mono flex justify-between flex-shrink-0">
                <span>{filteredUsers.length} developers</span>
                <span>{onlineUsers.size} online</span>
              </div>
            </div>
          </div>
          
          {/* Main Terminal Chat Area - Flex remaining space */}
          <div className="flex-1 h-full">
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border shadow-sm h-full flex flex-col`}>
              {/* Terminal header - Fixed */}
              <div className="bg-gray-900 p-3 flex justify-between items-center flex-shrink-0">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  {selectedUser ? (
                    <span className="font-mono text-xs text-gray-400">
                      <span className="text-green-400">~</span>/chats/
                      <span className="text-blue-400">{selectedUser.username}</span>.js
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-gray-400">~/chats/new.js</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setViewMode(viewMode === 'terminal' ? 'chat' : 'terminal')}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    {viewMode === 'terminal' ? 'Chat View' : 'Terminal View'}
                  </button>
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </div>
              </div>
              
              {/* Connection info bar - Fixed */}
              {selectedUser && (
                <div className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} font-mono text-xs flex items-center flex-shrink-0`}>
                  <div className={`w-2 h-2 ${onlineUsers.has(selectedUser._id) ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                  <span>
                    {onlineUsers.has(selectedUser._id) 
                      ? `Connected to ${selectedUser.username}@devmeetup.io:~$ via SSH` 
                      : `No active connection to ${selectedUser.username} - messages will be delivered when they come online`}
                  </span>
                </div>
              )}
              
              {/* Messages area - Properly constrained scrolling */}
              <div 
                className={`flex-1 overflow-y-auto p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} font-mono`}
                style={{ fontSize: `${fontSize}px`, minHeight: 0 }}
              >
                {selectedUser ? (
                  <>
                    {/* Terminal welcome message */}
                    <div className="text-green-400 mb-6">
                      <div>Welcome to DevMeetup Terminal v2.0.4</div>
                      <div className="text-gray-500">Type /help for available commands</div>
                      <div className="text-gray-600 text-xs mt-1">Connection established at {new Date().toLocaleString()}</div>
                      <div className="border-b border-gray-700 my-3"></div>
                    </div>
                    
                    {/* Messages */}
                    {viewMode === 'terminal' ? (
                      /* Terminal view */
                      <div className="space-y-2">
                        {messages.map((message) => (
                          <div key={message._id} className="leading-relaxed">
                            {message.sender === 'system' ? (
                              /* System message */
                              <div className="text-yellow-300 whitespace-pre-line">
                                <span className="text-gray-500">[SYSTEM] </span>
                                {message.content}
                              </div>
                            ) : message.sender === currentUser._id ? (
                              /* User messages */
                              <div>
                                <span className="text-blue-400">{currentUser.username}@devmeetup:~$ </span>
                                {formatMessage(message.content)}
                                <span className="text-gray-600 text-xs ml-2">({formatTime(message.createdAt)})</span>
                              </div>
                            ) : (
                              /* Recipient messages */
                              <div>
                                <span className="text-green-400">{selectedUser.username}@devmeetup:~$ </span>
                                {formatMessage(message.content)}
                                <span className="text-gray-600 text-xs ml-2">({formatTime(message.createdAt)})</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Chat view - more like a traditional chat but with code styling */
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div 
                            key={message._id} 
                            className={`flex ${
                              message.sender === 'system' ? 'justify-center' : 
                              message.sender === currentUser._id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.sender === 'system' ? (
                              <div className="bg-yellow-500 bg-opacity-20 text-yellow-300 px-4 py-2 rounded-lg max-w-md">
                                {message.content}
                              </div>
                            ) : (
                              <div 
                                className={`${
                                  message.sender === currentUser._id 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-700 text-gray-100'
                                } px-4 py-2 rounded-lg max-w-md`}
                              >
                                {formatMessage(message.content)}
                                <div className="text-xs opacity-50 text-right mt-1">
                                  {formatTime(message.createdAt)}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-400 mb-2">No active terminal session</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                      Select a developer from the list to initiate a secure terminal connection
                    </p>
                    <div className="mt-6 p-3 bg-gray-800 rounded-lg">
                      <pre className="text-xs text-gray-400">$ ssh connect --user [username] --secure</pre>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Code editor (hidden by default) - Fixed positioning */}
              {showCodeEditor && selectedUser && (
                <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'} flex-shrink-0`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-mono text-gray-400">Code Snippet Editor</div>
                    <button 
                      onClick={() => setShowCodeEditor(false)}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <textarea
                      value={codeSnippet}
                      onChange={handleCodeSnippetChange}
                      className={`w-full h-32 ${theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-white text-gray-800'} font-mono text-sm p-3 rounded-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} resize-none`}
                    />
                    <div className="flex justify-between">
                      <select 
                        className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} text-xs rounded-md px-2 py-1 border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                        value="javascript"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                      </select>
                      <button
                        onClick={sendCodeSnippet}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md"
                      >
                        Send Code Snippet
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Message input - Fixed at bottom */}
              {selectedUser && (
                <div className={`p-3 ${theme === 'dark' ? 'border-t border-gray-700 bg-gray-800' : 'border-t border-gray-200 bg-white'} flex-shrink-0`}>
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} rounded-md px-3 py-2 flex items-center`}>
                      <span className={`font-mono ${theme === 'dark' ? 'text-green-400' : 'text-gray-500'} mr-2`}>$</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message or command (try /help)..."
                        className={`flex-1 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} border-none focus:outline-none font-mono text-sm`}
                        disabled={sending}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCodeEditor(!showCodeEditor)}
                        className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} p-2 rounded-md flex-shrink-0`}
                        title="Code Snippet"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </button>
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className={`${
                          !newMessage.trim() || sending
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-4 py-2 rounded-md font-mono text-sm transition-colors duration-200 flex-shrink-0`}
                      >
                        {sending ? 'Sending...' : 'Execute'}
                      </button>
                    </div>
                  </form>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {commandHistory.length > 0 && 'Use ↑↓ to navigate command history'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
} 