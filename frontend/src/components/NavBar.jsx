import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleDot, faCommentDots, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { MobileNav } from './MobileNav';
import { ScreenContext } from '../Layouts/RootLayout';

const NavBar = () => {
  const navItems = [
    { icon: faUserCheck, label: 'Check-In', path: '/checkin' },
    { icon: faCommentDots, label: 'Chat', path: '/chat' },
  ];

  const { isMobile } = useContext(ScreenContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navRefs = useRef([]);

  
  const allItems = [
    { icon: faCommentDots, label: 'Chat', path: '/chat' },
    { label: 'Clinix', path: '/' }, 
    { icon: faUserCheck, label: 'Check-In', path: '/checkin' },
  ];

  const getInitialIndex = () => {
    const index = allItems.findIndex(item => item.path === location.pathname);
    return index >= 0 ? index : 1; 
  };

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const [bgStyle, setBgStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = navRefs.current[activeIndex];
    if (el) {
      setBgStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeIndex, isMobileOpen]);

  useEffect(() => {
    const index = allItems.findIndex(item => item.path === location.pathname);
    if (index >= 0) setActiveIndex(index);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const el = navRefs.current[activeIndex];
      if (el) {
        setBgStyle({ left: el.offsetLeft, width: el.offsetWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <>
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-none rounded w-full py-2">
        <div
          onClick={() => setIsMobileOpen(prev => !prev)}
          className={`flex items-center justify-between gap-6 bg-gray-900 ${isMobile ? 'hover:bg-zinc-600' : ''} cursor-pointer backdrop-blur-md rounded-full shadow-md px-4 py-1.5 w-auto max-w-lg pointer-events-auto relative`}
        >
          <div className="hidden lg:flex relative flex-row gap-6 justify-between w-full">
            
            <span
              className="absolute top-0 bottom-0 bg-white/90 rounded-full transition-all duration-500 ease-in-out"
              style={{ left: bgStyle.left, width: bgStyle.width }}
            />
                {allItems.map((item, index) => {
                  const Component = item.path === '/' ? Link : NavLink;

                  const isCenter = item.path === '/';
                  const isHome = location.pathname === '/';
                  const labelOrIcon = isCenter && !isHome
                    ? <FontAwesomeIcon icon={faCircleDot} className="w-4 h-4" />
                    : item.label;

                  return (
                    <Component
                      key={item.path}
                      to={item.path}
                      ref={el => (navRefs.current[index] = el)}
                      className={`relative z-10 flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-300 ${
                        activeIndex === index ? 'text-black bg-white' : 'text-white hover:scale-110'
                      }`}
                      onClick={() => setActiveIndex(index)}
                    >
                      {item.icon && index !== 1 && <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />}
                      <span className={`font-poppins ${isCenter && isHome ? 'font-semibold' : ''}`}>
                        {labelOrIcon}
                      </span>
                    </Component>
                  );
                })}
          </div>

          <div className="lg:hidden flex items-center">
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setIsMobileOpen(prev => !prev)}
              className="cursor-pointer rounded-full px-3 py-2 text-white transition-colors"
            />
          </div>
        </div>
      </nav>

      {isMobile && isMobileOpen && (
        <MobileNav navItems={navItems} onClose={() => setIsMobileOpen(false)} />
      )}
    </>
  );
};

export default NavBar;
