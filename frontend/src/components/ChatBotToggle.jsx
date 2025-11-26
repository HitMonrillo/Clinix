import React, { useState, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../Layouts/RootLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faComment } from '@fortawesome/free-solid-svg-icons';
import { sendChat } from '../services/api';

export const ChatBotToggle = () => {
  const { isDark } = useContext(ThemeContext);

  const [messages, setMessages] = useState([
    { id: 1, from: 'ai', text: 'Hello! How can I assist you today?' },
  ]);

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

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

    if (isExpanded) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, [isExpanded]);


  // Auto scroll
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

    setMessages(prev => [
      ...prev,
      { id: prev.length + 1, from: 'user', text: input.trim() }
    ]);

    const content = input.trim();
    setInput('');

    try {
      const res = await sendChat(content);

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
        { id: prev.length + 1, from: 'ai', text: reply }
      ]);

    } catch {
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, from: 'ai', text: 'Sorry, I could not process that.' }
      ]);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  // Dynamic theme-aware colors
  const bg = isDark ? '#1f2937' : '#ffffff';
  const bubbleAI = isDark ? 'bg-gray-700/70 text-white' : 'bg-gray-200 text-gray-900';
  const bubbleUser = isDark ? 'bg-blue-700/70 text-white' : 'bg-blue-600 text-white';
  const inputBg = isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';


  return (
    <div
      ref={chatRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col shadow-xl backdrop-blur-md overflow-hidden transition-all duration-500 ease-in-out"
      style={{
        width: isExpanded ? '20rem' : '3rem',
        height: isExpanded ? '70vh' : '3rem',
        borderRadius: isExpanded ? '1.5rem' : '50%',
        backgroundColor: bg
      }}
    >

      {/* Closed button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-full flex items-center justify-center text-white rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      )}


      {/* Expanded chat */}
      {isExpanded && (
        <>
          {/* Header */}
          <div
            onClick={() => setIsExpanded(false)}
            className="flex items-center justify-end px-4 py-3 cursor-pointer hover:bg-gray-300/20 dark:hover:bg-gray-800/50 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faComment} className={isDark ? "text-white" : "text-gray-800"} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap ${
                  msg.from === 'ai'
                    ? bubbleAI + ' self-start'
                    : bubbleUser + ' self-end'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input area */}
          <div className={`flex px-4 py-3 border-t ${borderColor} gap-2`}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className={`flex-1 resize-none rounded-2xl px-4 py-2 border ${borderColor} focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-150 ${inputBg}`}
            />
            <button
              onClick={handleSend}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-150"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
