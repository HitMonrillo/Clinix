import React, { useState, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../Layouts/RootLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { sendChat } from '../services/api';

export const ChatBot = () => {
  const { isDark } = useContext(ThemeContext);

  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

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

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col w-full h-full font-sans antialiased
        ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-100 text-gray-900'}
      `}
    >

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto pt-25 pb-32 px-4 md:px-8 max-w-3xl mx-auto w-full">
        <div className="flex flex-col gap-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`
                px-4 py-2 rounded-3xl max-w-[85%] break-words whitespace-pre-wrap text-base 
                leading-relaxed shadow-lg
                ${
                  msg.from === 'ai'
                    ? isDark
                      ? 'bg-gray-800 text-gray-200 self-start'
                      : 'bg-white text-gray-800 self-start border border-gray-300'
                    : 'bg-blue-700 text-white self-end'
                }
              `}
            >
              {msg.text}
            </div>
          ))}

          {/* Anchor */}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* Input Bar */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-20 flex justify-center p-4 md:p-6
          bg-gradient-to-t 
          ${isDark 
            ? 'from-gray-950/95 via-gray-950/90 to-transparent'
            : 'from-gray-200/95 via-gray-200/90 to-transparent'
          }
        `}
      >
        <div
          className={`
            flex items-end gap-2 w-full max-w-3xl rounded-3xl backdrop-blur-sm shadow-2xl border
            ${isDark 
              ? 'bg-gray-900/90 border-gray-700/60'
              : 'bg-white/90 border-gray-300'
            }
          `}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Send a message..."
            rows={1}
            className={`
              flex-1 font-sans max-h-40 resize-none rounded-3xl px-4 py-3 
              outline-none text-base 
              ${isDark ? 'bg-transparent text-gray-100 placeholder-gray-500' : 'bg-transparent text-gray-900 placeholder-gray-500'}
            `}
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
                  : isDark
                    ? 'bg-transparent text-gray-600 cursor-not-allowed'
                    : 'bg-transparent text-gray-400 cursor-not-allowed'
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
