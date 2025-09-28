import React, { useState, useRef, useEffect, useContext } from 'react';
import { ScreenContext } from '../Layouts/RootLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faComment } from '@fortawesome/free-solid-svg-icons';
import { sendChat } from '../services/api';

export const ChatBotToggle = () => {
  const { isMobile } = useContext(ScreenContext);
  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // start collapsed
  const chatRef = useRef(null);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Scroll to bottom on new messages
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
    setMessages((prev) => [...prev, { id: prev.length + 1, from: 'user', text: input.trim() }]);
    setInput('');

    try {
      const res = await sendChat(input.trim());
      const reply =
        (typeof res === 'string' && res) ||
        res?.message ||
        res?.reply ||
        res?.answer ||
        res?.data?.message ||
        res?.raw ||
        'Sorry, I do not have an answer right now.';
      setMessages((prev) => [...prev, { id: prev.length + 1, from: 'ai', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: prev.length + 1, from: 'ai', text: 'Sorry, I could not process that.' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      ref={chatRef}
      className={`fixed bottom-5 right-5 z-50 flex flex-col shadow-lg backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out`}
      style={{
        width: isExpanded ? '20rem' : '3rem',
        height: isExpanded ? '70vh' : '3rem',
        borderRadius: isExpanded ? '1.5rem' : '50%',
        backgroundColor: '#1f2937', // bg-gray-900
      }}
    >
      {/* Toggle button when collapsed */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full cursor-pointer h-full flex items-center justify-center text-white rounded-full bg-gray-900 shadow-md hover:bg-gray-800 active:bg-gray-900 transition-all duration-150"
        >
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      )}

      {/* Chat content */}
      {isExpanded && (
        <>
          {/* Collapse button */}
          <div
            onClick={() => setIsExpanded(false)}
            className="flex items-center justify-end px-4 py-3 cursor-pointer hover:bg-gray-800 rounded-full transition-all duration-300"
          >
            <FontAwesomeIcon icon={faComment} className="text-white" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`px-4 py-2 rounded-2xl max-w-[80%] break-words whitespace-pre-wrap
                  ${msg.from === 'ai'
                    ? 'bg-gray-700/60 text-white self-start'
                    : 'bg-sky-700/80 text-white self-end'}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input area */}
          <div className="flex px-4 py-3 border-t border-gray-800 gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none rounded-2xl px-4 py-2 bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all duration-150"
            />
            <button
              onClick={handleSend}
              className="px-3 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-full transition-all duration-150"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
