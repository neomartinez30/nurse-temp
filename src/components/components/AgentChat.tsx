import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { AiOutlineMinusCircle, AiOutlineExpandAlt } from 'react-icons/ai';

// Define the message interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
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
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a sample agent response.',
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        } bg-white rounded-t-lg shadow-lg border border-gray-200`}
    >
      {/* Chat Header */}
      <div className="flex justify-between items-center p-2 bg-gradient-to-r from-sky-700 to-teal-600 text-white rounded-t-lg">
        <span className="text-sm font-semibold">NURSE Assistant</span>
        <div className="flex gap-2">
          <button onClick={onToggle}>
            {isMinimized ?
              <AiOutlineExpandAlt className="w-4 h-4" /> :
              <AiOutlineMinusCircle className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex flex-col h-[calc(100%-80px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block px-4 py-2 rounded-lg bg-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t border-gray-200 p-3 bg-white">
          <div className="flex">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 resize-none border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`bg-gradient-to-t from-sky-700 to-teal-600 text-white px-4 rounded-r-md ${
                !inputValue.trim() || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
            >
              <IoSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
