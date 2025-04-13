import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { Experience } from './components/Experience';
import { UI } from './components/UI';
import Main from './components/Main';
import Home from './components/Home';
import M1 from "./components/M1";
import M2 from "./components/M2";
import Cart from "./components/Cart";
import Cart1 from "./components/Cart1";
import StakeToken from './components/stackToken';

import { v4 as uuidv4 } from 'uuid';


// Modern ChatViewer Component with draggable link previews
function StoredChatViewer() {
  const [chatHistory, setChatHistory] = useState([]);
  const [htmlResponses, setHtmlResponses] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [previewLink, setPreviewLink] = useState(null);
  const chatViewerRef = useRef(null);
  const linkPreviewRef = useRef(null);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Show/hide the chat widget
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to load data from localStorage
  const loadStoredData = useCallback(() => {
    try {
      // Get the current conversation ID
      const currentId = localStorage.getItem('currentConversationId') || '';
      setConversationId(currentId);
      
      // Get the user messages
      const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
      
      // Get the HTML responses
      const storedHtmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');
      
      // If we have HTML responses, format them for display
      if (storedHtmlResponses.length > 0) {
        setHtmlResponses(storedHtmlResponses);
      }
      
      // Combine user queries and HTML responses into a single timeline
      // based on timestamps for display
      const combinedChat = [];
      
      // Add user messages
      userQueries.forEach(query => {
        combinedChat.push({
          type: 'user',
          content: query.query,
          timestamp: query.timestamp
        });
      });
      
      // Add HTML responses
      storedHtmlResponses.forEach(response => {
        combinedChat.push({
          type: 'bot',
          content: response.html_response,
          timestamp: response.timestamp
        });
      });
      
      // Sort by timestamp
      combinedChat.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      setChatHistory(combinedChat);
    } catch (error) {
      console.error("Error loading chat data from localStorage:", error);
    }
  }, []);

  // Clear chat history
  const clearChat = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      localStorage.removeItem('userQueries');
      localStorage.removeItem('htmlResponses');
      localStorage.removeItem('chatHistory');
      localStorage.removeItem('lastHtmlResponse');
      localStorage.removeItem('lastUserQuery');
      localStorage.removeItem('lastAiMessages');
      localStorage.removeItem('aiMessages');
      
      // Generate a new conversation ID
      const newConversationId = uuidv4();
      localStorage.setItem('currentConversationId', newConversationId);
      setConversationId(newConversationId);
      
      // Clear the local state
      setChatHistory([]);
      setHtmlResponses([]);
    }
  };

  // Initial load
  useEffect(() => {
    loadStoredData();
    
    // Scroll to bottom on initial load
    if (chatViewerRef.current) {
      chatViewerRef.current.scrollTop = chatViewerRef.current.scrollHeight;
    }
  }, [loadStoredData]);
  
  // Setup a listener to detect localStorage changes
  useEffect(() => {
    // Poll for changes
    const intervalId = setInterval(loadStoredData, 1000);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [loadStoredData]);
  
  // Scroll to bottom when chat history changes
  useEffect(() => {
    if (chatViewerRef.current) {
      chatViewerRef.current.scrollTop = chatViewerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle mouse events for dragging
  useEffect(() => {
    if (!previewLink) return;
    
    const handleMouseMove = (e) => {
      if (isDragging && previewLink) {
        setPreviewLink(prev => ({
          ...prev,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }));
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, previewLink]);

  // Process HTML content to add link preview functionality
  const processHtmlContent = (htmlContent) => {
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Find all links and add event handlers
    const links = tempDiv.querySelectorAll('a');
    links.forEach((link) => {
      // Replace with a span that we can style better
      const url = link.getAttribute('href');
      const text = link.textContent;
      
      // Create a replacement element
      const replacementSpan = document.createElement('span');
      replacementSpan.innerHTML = `<span class="link-text cursor-pointer text-blue-300 hover:text-blue-100 underline" data-url="${url}">${text}</span>`;
      
      link.parentNode.replaceChild(replacementSpan, link);
    });
    
    return tempDiv.innerHTML;
  };

  // Handle link hover to show preview
  const handleLinkHover = (e) => {
    if (e.target.classList.contains('link-text')) {
      const url = e.target.getAttribute('data-url');
      // Only show preview if it's not already showing for this URL
      if (!previewLink || previewLink.url !== url) {
        setPreviewLink({
          url,
          x: e.clientX + 20,
          y: e.clientY - 100
        });
      }
    }
  };

  // Handle link click
  const handleLinkClick = (e) => {
    if (e.target.classList.contains('link-text')) {
      const url = e.target.getAttribute('data-url');
      window.open(url, '_blank');
    }
  };
  
  // Start dragging the preview
  const startDragging = (e) => {
    if (previewLink) {
      // Only start dragging from the header
      if (e.target.closest('.preview-header')) {
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - previewLink.x,
          y: e.clientY - previewLink.y
        });
        e.preventDefault();
      }
    }
  };

  return (
    <div className={`fixed bottom-8 left-8 z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16 h-16' : 'w-[400px] h-[600px]'}`}>
      {/* Chat header/toggle button */}
      <div 
        className={`
          bg-gradient-to-r from-purple-700 to-pink-600 rounded-t-xl p-3 flex justify-between items-center cursor-pointer
          ${isCollapsed ? 'rounded-full shadow-lg' : 'rounded-t-xl shadow-md'}
        `}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed && (
          <>
            <h2 className="text-lg font-bold text-white">Virtual Girlfriend</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <button 
                className="text-white opacity-80 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </>
        )}
        {isCollapsed && (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Chat body */}
      {!isCollapsed && (
        <div className="bg-gradient-to-b from-gray-900 to-purple-900 backdrop-blur-md rounded-b-xl p-4 flex flex-col h-[calc(100%-48px)] shadow-xl border border-purple-800/30">
          {/* Top actions bar */}
          <div className="flex justify-between items-center mb-3">
            {/* Conversation ID tag */}
            {conversationId && (
              <div className="bg-purple-800/30 text-xs rounded-full px-3 py-1 text-purple-300 w-max">
                Chat #{conversationId.substring(0, 6)}
              </div>
            )}
            
            {/* Clear chat button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearChat();
              }}
              className="text-xs bg-red-600/70 hover:bg-red-500 text-white px-3 py-1 rounded-full transition-colors duration-150"
            >
              Clear Chat
            </button>
          </div>
          
          {/* Chat messages */}
          <div 
            ref={chatViewerRef}
            className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent mb-4 px-2"
            onMouseOver={handleLinkHover}
            onClick={handleLinkClick}
          >
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-purple-300 opacity-70 space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-800/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-center">Start chatting with your virtual girlfriend...</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message mb-4 ${msg.type === 'bot' ? 'bot-message' : 'user-message text-right'}`}
                >
                  {msg.type === 'user' ? (
                    <div className="rounded-2xl rounded-tr-none bg-blue-600/70 p-3 max-w-[85%] inline-block shadow-md border border-blue-500/20">
                      {msg.content}
                      <span className="block text-xs mt-1 opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-2xl rounded-tl-none bg-purple-600/70 p-3 max-w-[85%] inline-block shadow-md border border-purple-500/20">
                      <div 
                        className="bot-content text-sm"
                        dangerouslySetInnerHTML={{ __html: processHtmlContent(msg.content) }} 
                      />
                      <span className="block text-xs mt-1 opacity-50">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Small notice at bottom */}
          <div className="text-xs text-center text-purple-400/60 mt-2">
            Responses updated automatically from storage
          </div>
        </div>
      )}
      
      {/* Draggable Link preview popup */}
      {previewLink && (
        <div 
          ref={linkPreviewRef}
          className={`fixed z-50 bg-gray-900 rounded-lg shadow-xl border border-purple-500/50 overflow-hidden w-[500px] h-[350px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{
            left: `${Math.max(0, Math.min(previewLink.x, window.innerWidth - 500))}px`,
            top: `${Math.max(0, Math.min(previewLink.y, window.innerHeight - 350))}px`
          }}
          onMouseDown={startDragging}
        >
          <div className="preview-header bg-gradient-to-r from-purple-800 to-blue-800 p-2 text-xs text-white flex justify-between items-center">
            <div className="flex items-center space-x-2 flex-grow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span className="truncate max-w-[380px]">{previewLink.url}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="hover:bg-blue-700 p-1 rounded"
                onClick={() => window.open(previewLink.url, '_blank')}
                title="Open in new tab"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
              <button 
                className="hover:bg-red-700 p-1 rounded"
                onClick={() => setPreviewLink(null)}
                title="Close preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <iframe 
            src={previewLink.url} 
            className="w-full h-[calc(100%-32px)]" 
            title="Link Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </div>
  );
}

// AI Agent Component (updated to use the new StoredChatViewer)
function AIAgent() {
  useEffect(() => {
    // Extract the `userid` from the URL
    const urlParts = window.location.pathname.split('/');
    const userid = urlParts[1];
    console.log(userid, urlParts);
    if (userid) {
      localStorage.setItem('gfuserid', userid);
      console.log('userid stored in localStorage: ', userid);
    } else {
      console.log('User not found..!');
    }
  }, []);

  return (
    <>
      <Loader />
      <Leva hidden />
      {/* Main 3D scene */}
      <div className="relative w-full h-full">
        <Canvas
          shadows
          camera={{ position: [0, 0, 1], fov: 30 }}
          className="absolute inset-0 z-0"
        >
          <Experience />
        </Canvas>
        
        {/* Ensure UI is layered above the Canvas */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <UI />
        </div>
        
        {/* Modern chat viewer as a floating widget */}
        <StoredChatViewer />
      </div>
    </>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Home />} />
        <Route path="/m1" element={<M1 />} />
        <Route path="/m2" element={<M2 />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/home/:id" element={<Cart1 />} />
        <Route path="/ai-agent" element={<AIAgent />} />
        <Route path="/stake-token" element={<StakeToken />} />
      </Routes>
    </Router>
  );
}

export default App;