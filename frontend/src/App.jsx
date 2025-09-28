import { useState } from 'react'
import { Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './App.css'

import { RootLayout } from './Layouts/RootLayout'
import Homepage from './Pages/HomePage' 
import CheckIn from './Pages/CheckIn'
import { Appointments } from './components/CheckIn/Appointments'
import { Insurance } from './components/CheckIn/Insurance'
import { Records } from './components/CheckIn/Records'
import { Questions } from './components/CheckIn/Questions'
import { Chat } from './Pages/Chat'



function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}>
          <Route index element={<Homepage/>}/>
          
          <Route path='/chat' element={<Chat/>}/>
          <Route path="/checkin" element={<CheckIn />}>
              <Route path="appointments" element={<Appointments/>} />
              <Route path="insurance" element={<Insurance/>} />
              <Route path="records" element={<Records/>} />
              <Route path="questions" element={<Questions/>} />
          </Route>
          
      </Route>
    )
  )

  return (
    
      <RouterProvider router={router}/>

    
  )
}


export default App
