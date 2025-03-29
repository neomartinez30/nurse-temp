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
  
  // API endpoint from API Gateway
  const API_ENDPOINT = 'https://ps10dpwkh0.execute-api.us-east-1.amazonaws.com/dev1/';

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
          content: "Hello, I'm your NURSE Assistant. I can help with healthcare database queries and medication information. How can I assist you today?",
          sender: 'agent',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
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
      // Clear pending SQL query when starting a new conversation
      setPendingSqlQuery(null);
      
      const response = await axios.post(API_ENDPOINT, {
        userMessage: message,
        requestType: 'textToSql'
      });
      
      const { sqlQuery, mockResult, queryType, message: responseMessage } = response.data;
      
      // Extract SQL query - handle possible Claude formatting
      let cleanSqlQuery = sqlQuery;
      // If Claude returns a code block, extract just the SQL
      if (sqlQuery.includes('```sql')) {
        const sqlMatch = sqlQuery.match(/```sql\s*([\s\S]*?)\s*```/);
        if (sqlMatch && sqlMatch[1]) {
          cleanSqlQuery = sqlMatch[1].trim();
        }
      } else if (sqlQuery.includes('```')) {
        const codeMatch = sqlQuery.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch && codeMatch[1]) {
          cleanSqlQuery = codeMatch[1].trim();
        }
      }
      
      // Add agent response with SQL query
      addAgentMessage({
        content: `I can help with that. Here's a SQL query I would use:`,
        type: queryType === 'drug' ? 'drug' : 'sql',
        sqlQuery: cleanSqlQuery,
        data: mockResult
      });
      
      // Store the SQL query for potential execution
      setPendingSqlQuery(cleanSqlQuery);
      
      // Ask user if they want to execute
      setTimeout(() => {
        addAgentMessage({
          content: 'Would you like me to execute this query against the healthcare database?',
          type: 'text'
        });
      }, 500);
      
    } catch (error) {
      console.error('Error calling API:', error);
      addAgentMessage({
        content: 'Sorry, I encountered an error generating a SQL query. Please try rephrasing your question.',
        type: 'error'
      });
    }
  };
  
  const executeSqlQuery = async (sqlQuery: string) => {
    try {
      const response = await axios.post(API_ENDPOINT, {
        sqlQuery,
        requestType: 'executeSql'
      });
      
      const { columns, rows, message } = response.data;
      
      // Add agent response with query results
      addAgentMessage({
        content: 'Query executed successfully. Here are the results:',
        type: 'sql',
        sqlQuery,
        data: rows
      });
      
      // Clear pending SQL
      setPendingSqlQuery(null);
      
    } catch (error) {
      console.error('Error executing SQL:', error);
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
  
  // Render SQL query and results in a nice format
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
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        {value as string}
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
        width: '350px',
        height: '450px',
      }}
      className={`fixed transition-all duration-300 ease-in-out 
      ${!isOpen || isMinimized
          ? 'opacity-0 pointer-events-none scale-95 translate-y-98'
          : 'opacity-100 scale-100 translate-y-0'
        } bg-white rounded-t-lg shadow-lg border border-gray-200 flex flex-col`}
    >
      {/* Rest of component remains the same */}
      {/* ... */}
    </div>
  );
};

export default AgentChat;