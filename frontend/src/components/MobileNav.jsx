import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export const MobileNav = ({ navItems, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <>
      <div className="fixed inset-0 z-60 flex items-end justify-center transition-colors lg:hidden w-screen ">
        
        <div
          className="absolute inset-0 bg-black/10 lg:hidden cursor-pointer"
          onClick={handleClose}
        ></div>

        
        <div
  className={`relative lg:hidden z-50 bg-white/80 rounded-t-4xl backdrop-blur-sm pt-5 px-6 pb-10 transition-all duration-300 flex flex-col gap-5 w-full max-w-lg
  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}
>
          <div className="self-end">
            <FontAwesomeIcon
              icon={faXmark}
              onClick={handleClose}
              className="cursor-pointer rounded-full px-2 py-2.25 mb-6 hover:bg-zinc-200 active:bg-zinc-300/75"
            />
          </div>

          {navItems.map(({ icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={handleClose}
              className={({ isActive }) =>
                `flex items-center gap-2 hover:cursor-pointer rounded-full px-6 py-3 transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-gray-900 hover:text-white'
                    : 'text-zinc-500 hover:text-white hover:bg-gray-900'
                } ${isVisible ? 'opacity-100' : 'opacity-0'}`
              }
            >
              <div className='flex gap-2 items-center'>
                 <FontAwesomeIcon icon={icon} />
              <span className="font-poppins ">{label}</span>
              </div>
             
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}
