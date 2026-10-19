import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Trash2, Bot } from 'lucide-react';
import { chatCacheService } from '../services/chatCacheService';

const INITIAL_MESSAGES = [
  { id: 1, sender: 'bot', text: 'Hello! I am AgriShield Assistant. How can I help you today?' }
];

export default function ChatbotSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Load chat memory from sessionStorage on mount
  useEffect(() => {
    const cachedMessages = chatCacheService.getStoredMessages();
    if (cachedMessages && cachedMessages.length > 0) {
      setMessages(cachedMessages);
    } else {
      setMessages(INITIAL_MESSAGES);
    }
  }, []);

  // Sync messages to local cache whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      chatCacheService.saveMessages(messages);
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');

    // Simulated API response delay (Connect to FastAPI here later)
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Thanks for asking. Regarding "${userMsg.text}", please check our crop database for detailed instructions.`
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  const handleClearHistory = () => {
    chatCacheService.clearHistory();
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary btn-circle btn-lg shadow-xl hover:scale-105 transition-transform"
          aria-label="Open Chatbot"
        >
          <Bot className="w-8 h-8 text-primary-content" />
        </button>
      )}

      {/* Floating Sidebar Container */}
      {isOpen && (
        <div className="card w-80 sm:w-96 h-[520px] bg-base-100 shadow-2xl border border-base-200 flex flex-col rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-primary text-primary-content p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Bot className="w-6 h-6" />
              <span>AgriShield Bot</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="btn btn-ghost btn-xs btn-circle text-primary-content opacity-80 hover:opacity-100"
                title="Clear Session Memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-xs btn-circle text-primary-content"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-base-200/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}
              >
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full bg-base-300 p-1 flex items-center justify-center">
                    {msg.sender === 'user' ? '👤' : <Bot className="w-5 h-5 text-primary" />}
                  </div>
                </div>
                <div
                  className={`chat-bubble text-sm ${
                    msg.sender === 'user'
                      ? 'chat-bubble-primary'
                      : 'chat-bubble-neutral'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-base-100 border-t border-base-200 flex gap-2">
            <input
              type="text"
              className="input input-bordered input-sm flex-1 rounded-full focus:outline-primary"
              placeholder="Ask something..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm btn-circle"
              disabled={!inputText.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}