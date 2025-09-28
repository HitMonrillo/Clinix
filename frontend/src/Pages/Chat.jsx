import React from 'react';
import { ChatBot } from '../components/ChatBot';

export const Chat = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden font-inter">
      {/* Background like ChatBotToggle expanded */}
      <div className="absolute inset-0 z-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
        {/* Large blurred circle in the center */}
        <div className="w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* ChatBot full screen */}
      <div className="relative z-10 w-full h-full mt-30">
        <ChatBot />
      </div>
    </div>
  );
};
