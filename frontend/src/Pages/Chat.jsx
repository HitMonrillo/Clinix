import React from 'react';
import { ChatBot } from '../components/ChatBot';

export const Chat = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden font-inter">
      
      <div className="absolute inset-0 z-0 bg-[#F5F5F5] backdrop-blur-lg flex items-center justify-center">
        
        <div className="w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      
      <div className="relative z-10 w-full h-full mt-30">
        <ChatBot />
      </div>
    </div>
  );
};
