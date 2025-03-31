import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { AiOutlineMinusCircle, AiOutlineExpandAlt } from 'react-icons/ai';
import { BsDatabaseCheck } from 'react-icons/bs';
import axios from 'axios';

// Define the message interface with support for different content types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'sql' | 'drug' | 'error';
  sqlQuery?: string;
  data?: any[];
}

// Define props interface
interface AgentChatProps {
  isOpen: boolean;
  isMinimized: boolean;
  onToggle: () => void;
  position: Record<string, any>;
}

const AgentChat: React.FC<AgentChatProps> = ({ isOpen, isMinimized, onToggle, position }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSqlQuery, setPendingSqlQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Replace with your deployed API Gateway URL
  const API_ENDPOINT = 'https://mced872dm6.execute-api.us-east-1.amazonaws.com/dev';

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Add welcome message when the component first loads
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          content: "Hello, I'm your AI Assistant. I can help you find patient information quickly and provide FDA published medication information. How can I assist you today?",
          sender: 'agent',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    }
  }, []);

  // Add a function to simulate the fake inquiry for demo purposes
  const simulateDrugInteractionQuery = (queryText: string) => {
    // Log the query for future reference/debugging
    console.log('Drug interaction query received:', queryText);
    
    // Show loading indicator for initial processing
    const loadingMessage: Message = {
      id: Date.now().toString(),
      content: "Processing...",
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
  // After a short delay, show the thinking status
  setTimeout(() => {
    // Update the loading message to show "thinking"
    setMessages(prev => 
      prev.map(msg => 
        msg.content === "Processing..." 
          ? {...msg, content: "Analyzing patient medication history..."}
          : msg
      )
    );
      
      // Show more detailed processing
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.content === "Analyzing patient medication history..." 
              ? {...msg, content: "Checking drug interaction database..."}
              : msg
          )
        );
        
        // Final response after processing
        setTimeout(() => {
          // Remove the loading message
          setMessages(prev => prev.filter(msg => msg.content !== "Checking drug interaction database..."));
          
          // Add the response
          const responseMessage: Message = {
            id: Date.now().toString(),
            content: "The patient has been prescribed (omeprazole) Prilosec to treat Gastroesophageal Reflux Disease (GERD). It is generally considered safe to take (omeprazole) Prilosec and ibuprofen together. However, the patient has a history of Gastroesophageal Reflux Disease (GERD) and Motrin (ibuprofen) is known to exacerbate symptoms.",
            sender: 'agent',
            timestamp: new Date(),
            type: 'drug',
            data: [
              { 
                medication: "Motrin (ibuprofen)", 
                interactsWith: "Prilosec (omeprazole)", 
                severity: "Moderate", 
                recommendation: "Use with caution due to GERD history"
              }
            ]
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }, 1500);
      }, 1200);
    }, 800);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Check if this is a request to execute a pending SQL query
      if (pendingSqlQuery && (
          inputValue.toLowerCase().includes('yes') || 
          inputValue.toLowerCase().includes('execute') || 
          inputValue.toLowerCase().includes('run'))) {
        await executeSqlQuery(pendingSqlQuery);
      } else {
        // Normal text to SQL conversion
        await processUserMessage(userMessage.content);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addAgentMessage({
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const processUserMessage = async (message: string) => {
    try {
      // For demo purposes, directly trigger the drug interaction flow if the message contains relevant keywords
      if (message.toLowerCase().includes('motrin') && 
          (message.toLowerCase().includes('interaction') || message.toLowerCase().includes('check'))) {
        simulateDrugInteractionQuery(message);
        return;
      }
      
      // Clear pending SQL query when starting a new conversation
      setPendingSqlQuery(null);
      
      // Add typing indicator
      addAgentMessage({
        content: '...',
        type: 'text'
      });
      
      const response = await axios.post(API_ENDPOINT, {
        userMessage: message,
        requestType: 'textToSql'
      });
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.content !== '...'));
      
      const { sqlQuery, mockResult, queryType, message: responseMessage } = response.data;
      
      // Add agent response with SQL query
      addAgentMessage({
        content: responseMessage || `I can help with that. Here's a SQL query I would use:`,
        type: queryType === 'drug' ? 'drug' : 'sql',
        sqlQuery: sqlQuery,
        data: mockResult
      });
      
      // Store the SQL query for potential execution
      if (sqlQuery && queryType === 'sql') {
        setPendingSqlQuery(sqlQuery);
        
        // Ask user if they want to execute
        setTimeout(() => {
          addAgentMessage({
            content: 'Would you like me to execute this query against the healthcare database?',
            type: 'text'
          });
        }, 500);
      }
      
    } catch (error) {
      console.error('Error calling API:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.content !== '...'));
      
      addAgentMessage({
        content: 'Sorry, I encountered an error generating a SQL query. Please try rephrasing your question.',
        type: 'error'
      });
    }
  };
  
  const executeSqlQuery = async (sqlQuery: string) => {
    try {
      // Add typing indicator
      addAgentMessage({
        content: '...',
        type: 'text'
      });
      
      const response = await axios.post(API_ENDPOINT, {
        sqlQuery,
        requestType: 'executeSql'
      });
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.content !== '...'));
      
      const { rows, message } = response.data;
      
      // Add agent response with query results
      addAgentMessage({
        content: message || 'Query executed successfully. Here are the results:',
        type: 'sql',
        sqlQuery,
        data: rows
      });
      
      // Clear pending SQL
      setPendingSqlQuery(null);
      
    } catch (error) {
      console.error('Error executing SQL:', error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.content !== '...'));
      
      addAgentMessage({
        content: 'Sorry, there was an error executing the SQL query. The database might be unavailable or the query is invalid.',
        type: 'error'
      });
    }
  };
  
  const addAgentMessage = (params: {
    content: string;
    type: 'text' | 'sql' | 'drug' | 'error';
    sqlQuery?: string;
    data?: any[];
  }) => {
    const agentMessage: Message = {
      id: Date.now().toString(),
      content: params.content,
      sender: 'agent',
      timestamp: new Date(),
      type: params.type,
      sqlQuery: params.sqlQuery,
      data: params.data
    };
    
    setMessages(prev => [...prev, agentMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Modified to better handle drug interaction display
  const renderSqlContent = (message: Message) => {
    return (
      <div className="space-y-2 w-full">
        <p>{message.content}</p>
        
        {message.sqlQuery && (
          <div className="bg-gray-800 text-green-300 p-3 rounded text-xs font-mono overflow-x-auto">
            {message.sqlQuery}
          </div>
        )}
        
        {message.data && message.data.length > 0 && (
          <div className="mt-2 bg-white border border-gray-200 rounded-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(message.data[0]).map((key) => (
                    <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {message.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                  {Object.entries(row).map(([_, value], cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  {String(value)}
                   </td>
          ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        ...position,
        width: '450px',
        height: '550px',
      }}
      className={`fixed transition-all duration-300 ease-in-out z-50
      ${!isOpen || isMinimized
          ? 'opacity-0 pointer-events-none scale-95 translate-y-98'
          : 'opacity-100 scale-100 translate-y-0'
        } bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col`}
    >
      <div className="flex justify-between items-center bg-gradient-to-r from-sky-700 to-teal-600 text-white p-3 rounded-t-lg">
        <div className="flex items-center">
          <BsDatabaseCheck className="w-5 h-5 mr-2" />
          <h3 className="text-sm font-semibold">Nurse AI Assistant</h3>
        </div>
        <button
          onClick={onToggle}
          className="hover:bg-teal-700 p-1 rounded transition-colors"
        >
          {isMinimized ? <AiOutlineExpandAlt className="w-4 h-4" /> : <AiOutlineMinusCircle className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-teal-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : message.type === 'drug'
                    ? 'bg-yellow-50 text-gray-700 border border-yellow-200'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {message.type === 'sql' || message.type === 'drug' 
                  ? renderSqlContent(message)
                  : message.content === '...'
                  ? <div className="typing-indicator"><span></span><span></span><span></span></div>
                  : <p className="text-sm font-medium">{message.content}</p>
                }
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`px-3 py-2 bg-teal-600 text-white rounded-r-md ${
              isLoading || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
            }`}
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </div>
      
{/* Add some CSS for the typing indicator */}
<style>
        {`
        .typing-indicator {
          display: flex;
          align-items: center;
          height: 20px;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #999;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: bounce 1.5s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
        `}
      </style>
    </div>
  );
};

export default AgentChat;