import React, { useState } from 'react';
import { useChatStore } from '@/lib/store';

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, addMessage } = useChatStore();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({ role: 'user', content: input });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: input }] 
        })
      });

      const data = await response.json();
      
      // Add AI response
      addMessage(data.message);
    } catch (error) {
      console.error('Chat error:', error);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-100 self-end text-right' 
                : 'bg-gray-100 self-start text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-grow p-2 border rounded-l-lg"
          placeholder="Type your message..."
        />
        <button 
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;