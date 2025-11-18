import React, { useState, useRef, useEffect, useContext } from 'react';
import { ScreenContext } from '../Layouts/RootLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { sendChat } from '../services/api';

/**
 * A minimalist, full-screen dark-themed chat bot component with rounded chat bubbles.
 */
export const ChatBot = () => {
  const { isMobile } = useContext(ScreenContext);
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handler for sending a message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [
      ...prev,
      { id: prev.length + 1, from: 'user', text: userMessage },
    ]);
    setInput('');

    try {
      const res = await sendChat(userMessage);
      const reply =
        (typeof res === 'string' && res) ||
        res?.message ||
        res?.reply ||
        res?.answer ||
        res?.data?.message ||
        res?.raw ||
        'Sorry, I do not have an answer right now.';

      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, from: 'ai', text: reply },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, from: 'ai', text: 'Sorry, I could not process that.' },
      ]);
    }
  };

  // Handler for Enter key press
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-950 text-gray-100 font-sans antialiased">

      {/* Main Chat Area - Flexible height to fill screen */}
      <div className="flex-1 overflow-y-auto pt-25 pb-32 px-4 md:px-8 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`
                px-4 py-2 rounded-3xl max-w-[85%] break-words whitespace-pre-wrap 
                text-base leading-relaxed shadow-lg
                ${
                  msg.from === 'ai'
                    ? 'bg-gray-800 text-gray-200 self-start ' // AI Bubble
                    : 'bg-blue-800 text-white self-end ' // User Bubble
                }
              `}
            >
              {msg.text}
            </div>
          ))}
          {/* Scroll anchor */}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* Input Bar - Fixed at bottom, Centered, Rounded-3xl */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center p-4 md:p-6 bg-gradient-to-t from-gray-950/95 via-gray-950/90 to-transparent">
        <div className="flex items-end gap-2 w-full max-w-3xl border border-gray-700/60 rounded-3xl bg-gray-900/90 backdrop-blur-sm shadow-2xl">
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Send a message..."
            rows={1}
            className="
              flex-1 font-sans max-h-40 resize-none bg-transparent text-gray-100 
              rounded-3xl px-4 py-3 outline-none focus:ring-0 text-base placeholder-gray-500
            "
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`
              px-3 py-1.5 mr-1.5 mb-1.5 rounded-full transition-colors duration-200 flex-shrink-0
              ${
                input.trim()
                  ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                  : 'bg-transparent text-gray-600 cursor-not-allowed'
              }
            `}
          >
            <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
          </button>
          
        </div>
      </div>
    </div>
  );
};