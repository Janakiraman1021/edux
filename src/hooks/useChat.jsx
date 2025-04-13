import { createContext, useContext, useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const backendUrl = "http://127.0.0.1:5000/chat";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const processingRef = useRef(false);

  // Load existing chat history from localStorage when component mounts
  useEffect(() => {
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory) {
      try {
        // We won't directly set messages here, as our queue system works differently
        // But we'll log that we found existing messages
        console.log("Found stored chat history:", JSON.parse(storedChatHistory));
      } catch (e) {
        console.error("Error parsing stored chat history:", e);
      }
    }
  }, []);

  // Generate new conversation ID on page load or use existing one
  useEffect(() => {
    const storedConversationId = localStorage.getItem('currentConversationId');
    if (storedConversationId) {
      setConversationId(storedConversationId);
    } else {
      const newConversationId = uuidv4();
      setConversationId(newConversationId);
      localStorage.setItem('currentConversationId', newConversationId);
    }
  }, []);

  // Save conversationId to localStorage whenever it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem('currentConversationId', conversationId);
    }
  }, [conversationId]);

  const chat = async (message) => {
    setLoading(true);
    
    // First, add the user message to the chat history in localStorage
    const userMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    // Add to the chat history in localStorage
    const storedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    storedChatHistory.push(userMessage);
    localStorage.setItem('chatHistory', JSON.stringify(storedChatHistory));
    
    // Store user query in localStorage
    localStorage.setItem('lastUserQuery', message);
    
    // Store all user queries in localStorage as an array
    const userQueries = JSON.parse(localStorage.getItem('userQueries') || '[]');
    userQueries.push({
      query: message,
      conversationId: conversationId,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('userQueries', JSON.stringify(userQueries));
    
    try {
      // Convert request to GET with query parameters
      const url = new URL(backendUrl);
      url.searchParams.append('query', message);
      url.searchParams.append('conversation_id', conversationId);
      
      const data = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Data:", data);

      const textResponse = await data.text(); // Get response as text first
      
      console.log("Text response:", textResponse);
      
      // Store raw API response for debugging/access
      localStorage.setItem('lastRawApiResponse', textResponse);
      
      let parsedMessages = [];
      let htmlResponse = null;
      
      try {
        // Try to parse the response as JSON
        const resp = JSON.parse(textResponse);
        console.log("Parsed response:", resp);
        
        // Extract HTML response if available
        if (resp.html_response) {
          htmlResponse = resp.html_response;
          localStorage.setItem('lastHtmlResponse', htmlResponse);
          
          // Store all html responses as an array
          const htmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');
          htmlResponses.push({
            html_response: htmlResponse,
            conversationId: conversationId,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('htmlResponses', JSON.stringify(htmlResponses));
        }
        
        // Check if resp.messages exists and is an array
        if (resp.messages && Array.isArray(resp.messages)) {
          parsedMessages = resp.messages;
          setMessages(prev => [...prev, ...resp.messages]);
          
          // Store the AI messages
          localStorage.setItem('lastAiMessages', JSON.stringify(parsedMessages));
          
          // Add formatted messages to chat history in localStorage
          const formattedAiMessages = parsedMessages.map(msg => ({
            sender: 'bot',
            text: msg.text,
            facialExpression: msg.facialExpression, 
            animation: msg.animation,
            timestamp: new Date().toISOString()
          }));
          
          // Update localStorage chat history with each AI message
          const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
          updatedChatHistory.push(...formattedAiMessages);
          localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
          
          // Store all AI message arrays
          const allAiMessages = JSON.parse(localStorage.getItem('aiMessages') || '[]');
          allAiMessages.push({
            messages: parsedMessages,
            conversationId: conversationId,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('aiMessages', JSON.stringify(allAiMessages));
        } else if (resp.error && resp.raw_response) {
          // Handle the case where the server returns an error with raw_response
          console.error("API Error:", resp.error);
          
          // Clean up the raw_response by removing the dashes and any other non-JSON prefix
          try {
            const cleanedResponse = resp.raw_response.replace(/^[^{]*/, '');
            const parsedRawResponse = JSON.parse(cleanedResponse);
            
            // Extract HTML response if available in the raw response
            if (parsedRawResponse.html_response) {
              htmlResponse = parsedRawResponse.html_response;
              localStorage.setItem('lastHtmlResponse', htmlResponse);
              
              // Store all html responses
              const htmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');
              htmlResponses.push({
                html_response: htmlResponse,
                conversationId: conversationId,
                timestamp: new Date().toISOString()
              });
              localStorage.setItem('htmlResponses', JSON.stringify(htmlResponses));
            }
            
            if (parsedRawResponse.messages && Array.isArray(parsedRawResponse.messages)) {
              parsedMessages = parsedRawResponse.messages;
              setMessages(prev => [...prev, ...parsedRawResponse.messages]);
              
              // Store the AI messages
              localStorage.setItem('lastAiMessages', JSON.stringify(parsedMessages));
              
              // Add formatted messages to chat history in localStorage
              const formattedAiMessages = parsedMessages.map(msg => ({
                sender: 'bot',
                text: msg.text,
                facialExpression: msg.facialExpression,
                animation: msg.animation,
                timestamp: new Date().toISOString()
              }));
              
              // Update localStorage chat history with each AI message
              const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
              updatedChatHistory.push(...formattedAiMessages);
              localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
              
              // Store all AI message arrays
              const allAiMessages = JSON.parse(localStorage.getItem('aiMessages') || '[]');
              allAiMessages.push({
                messages: parsedMessages,
                conversationId: conversationId,
                timestamp: new Date().toISOString()
              });
              localStorage.setItem('aiMessages', JSON.stringify(allAiMessages));
            } else {
              console.error("No valid messages in cleaned response:", parsedRawResponse);
              const errorMessage = {
                text: "Sorry, I couldn't process your message correctly.",
                facialExpression: "sad",
                animation: "Talking_0"
              };
              setMessages(prev => [...prev, errorMessage]);
              
              // Add error message to chat history
              const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
              updatedChatHistory.push({
                sender: 'bot',
                text: errorMessage.text,
                facialExpression: errorMessage.facialExpression,
                animation: errorMessage.animation,
                timestamp: new Date().toISOString()
              });
              localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
            }
          } catch (rawParseError) {
            console.error("Error parsing cleaned raw_response:", rawParseError);
            console.log("Cleaned response attempt failed, raw content:", resp.raw_response);
            const errorMessage = {
              text: "I encountered an error processing your message. Please try again.",
              facialExpression: "sad",
              animation: "Talking_0"
            };
            setMessages(prev => [...prev, errorMessage]);
            
            // Add error message to chat history
            const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            updatedChatHistory.push({
              sender: 'bot',
              text: errorMessage.text,
              facialExpression: errorMessage.facialExpression,
              animation: errorMessage.animation,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
          }
        } else {
          console.error("Unexpected response format:", resp);
          const errorMessage = {
            text: "I received an unexpected response format. Please try again.",
            facialExpression: "confused",
            animation: "Talking_0"
          };
          setMessages(prev => [...prev, errorMessage]);
          
          // Add error message to chat history
          const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
          updatedChatHistory.push({
            sender: 'bot',
            text: errorMessage.text,
            facialExpression: errorMessage.facialExpression,
            animation: errorMessage.animation,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        console.log("Raw response:", textResponse);
        
        // Try to directly extract and parse the response if initial parsing fails
        try {
          // Remove any non-JSON prefix (like dashes)
          const cleanedResponse = textResponse.replace(/^[^{]*/, '');
          const parsedResponse = JSON.parse(cleanedResponse);
          
          // Extract HTML response if available
          if (parsedResponse.html_response) {
            htmlResponse = parsedResponse.html_response;
            localStorage.setItem('lastHtmlResponse', htmlResponse);
            
            // Store all html responses
            const htmlResponses = JSON.parse(localStorage.getItem('htmlResponses') || '[]');
            htmlResponses.push({
              html_response: htmlResponse,
              conversationId: conversationId,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('htmlResponses', JSON.stringify(htmlResponses));
          }
          
          if (parsedResponse.messages && Array.isArray(parsedResponse.messages)) {
            parsedMessages = parsedResponse.messages;
            setMessages(prev => [...prev, ...parsedResponse.messages]);
            
            // Store the AI messages
            localStorage.setItem('lastAiMessages', JSON.stringify(parsedMessages));
            
            // Add formatted messages to chat history in localStorage
            const formattedAiMessages = parsedMessages.map(msg => ({
              sender: 'bot',
              text: msg.text,
              facialExpression: msg.facialExpression,
              animation: msg.animation,
              timestamp: new Date().toISOString()
            }));
            
            // Update localStorage chat history with each AI message
            const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            updatedChatHistory.push(...formattedAiMessages);
            localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
            
            // Store all AI message arrays
            const allAiMessages = JSON.parse(localStorage.getItem('aiMessages') || '[]');
            allAiMessages.push({
              messages: parsedMessages,
              conversationId: conversationId,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('aiMessages', JSON.stringify(allAiMessages));
          } else {
            const errorMessage = {
              text: "I had trouble understanding the response. Please try again.",
              facialExpression: "confused",
              animation: "Talking_0"
            };
            setMessages(prev => [...prev, errorMessage]);
            
            // Add error message to chat history
            const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
            updatedChatHistory.push({
              sender: 'bot',
              text: errorMessage.text,
              facialExpression: errorMessage.facialExpression,
              animation: errorMessage.animation,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
          }
        } catch (secondaryParseError) {
          console.error("Secondary parse attempt failed:", secondaryParseError);
          const errorMessage = {
            text: "I couldn't process the response correctly. Please try again.",
            facialExpression: "sad",
            animation: "Talking_0"
          };
          setMessages(prev => [...prev, errorMessage]);
          
          // Add error message to chat history
          const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
          updatedChatHistory.push({
            sender: 'bot',
            text: errorMessage.text,
            facialExpression: errorMessage.facialExpression,
            animation: errorMessage.animation,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        text: "Sorry, there was an error connecting to the server. Please check your connection and try again.",
        facialExpression: "sad",
        animation: "Talking_0"
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Add error message to chat history
      const updatedChatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      updatedChatHistory.push({
        sender: 'bot',
        text: errorMessage.text,
        facialExpression: errorMessage.facialExpression,
        animation: errorMessage.animation,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
    } finally {
      setLoading(false);
    }
  };

  // Process messages queue
  useEffect(() => {
    if (!isPlaying && messages.length > 0 && !processingRef.current) {
      processingRef.current = true;
      const nextMessage = messages[0];
      setMessage(nextMessage);
      setIsPlaying(true);
    }
  }, [messages, isPlaying]);

  const onMessagePlayed = () => {
    setIsPlaying(false);
    processingRef.current = false;
    setMessages(prev => prev.slice(1));
    setMessage(null);
  };

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        conversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
