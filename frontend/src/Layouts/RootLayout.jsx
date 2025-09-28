import React, { createContext } from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ChatBot } from '../components/ChatBot';
import { ChatBotToggle } from '../components/ChatBotToggle';

export const ScreenContext = createContext({isMobile:false});

export const RootLayout = () => {

  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScreenContext.Provider value={{isMobile}}>
        <NavBar/>
        <ChatBotToggle/>
        <Outlet/>
    </ScreenContext.Provider>
  )
}
