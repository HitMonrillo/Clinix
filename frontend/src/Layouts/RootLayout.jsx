import React, { useState, useEffect, createContext } from 'react';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import { ChatBotToggle } from '../components/ChatBotToggle';

// Create context so children can access dark mode + screen mode
export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  isMobile: false
});

export const RootLayout = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle dark mode by toggling <html> class
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [isDark]);

  // Toggle theme mode
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isMobile }}>
      <NavBar isDark={isDark} toggleTheme={toggleTheme} isMobile={isMobile} />
      <ChatBotToggle />
      <Outlet />
    </ThemeContext.Provider>
  );
};
