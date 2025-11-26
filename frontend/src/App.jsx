import React, { useEffect, useState } from 'react';
import { Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import './App.css';

import { RootLayout } from './Layouts/RootLayout';
import HomePage from './Pages/HomePage';
import CheckIn from './Pages/CheckIn';
import { Appointments } from './components/CheckIn/Appointments';
import { Insurance } from './components/CheckIn/Insurance';
import { Records } from './components/CheckIn/Records';
import { Questions } from './components/CheckIn/Questions';
import { Chat } from './Pages/Chat';

function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  const toggleTheme = () => setIsDark(prev => !prev);

  // Sync DOM & localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout isDark={isDark} toggleTheme={toggleTheme} />}>
          <Route index element={<HomePage isDark={isDark} toggleTheme={toggleTheme} />}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path="/checkin" element={<CheckIn />}>
              <Route path="appointments" element={<Appointments/>} />
              <Route path="insurance" element={<Insurance/>} />
              <Route path="records" element={<Records/>} />
              <Route path="questions" element={<Questions/>} />
          </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
