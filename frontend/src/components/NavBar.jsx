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
  const [bgStyle, setBgStyle] = useState({ left: 0, width: 0, visible: true });


  // Moves the highlight under the active or hovered element
   const moveHighlightTo = el => {
     if (!el) return;
     const rect = el.getBoundingClientRect();
     const parentRect = el.parentElement.getBoundingClientRect();
     setBgStyle({
       // Use the element's full width
       width: rect.width,
       // Use the element's left position relative to the parent
       left: rect.left - parentRect.left,
       visible: true,
     });
   };

  // Initial highlight
  useEffect(() => {
    const el = navRefs.current[activeIndex];
    if (el) moveHighlightTo(el);
  }, [activeIndex, isMobileOpen]);

  // Update active nav when route changes
  useEffect(() => {
    const index = allItems.findIndex(item => item.path === location.pathname);
    if (index >= 0) setActiveIndex(index);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const el = navRefs.current[activeIndex];
      if (el) moveHighlightTo(el);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <>
      <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex justify-center pointer-events-none w-full py-2 font-poppins">
        <div className="flex items-center justify-between gap-6 bg-[#100C08] backdrop-blur-md rounded-full shadow-md px-3 py-2 w-auto max-w-lg pointer-events-auto relative border border-gray-700">
          <div className="hidden lg:flex relative flex-row gap-6 justify-between w-full">
            
            {/* Smooth animated background */}
            <span
              className={`absolute top-0 bottom-0 bg-white/90 rounded-full transition-[left,width,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                bgStyle.visible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ left: bgStyle.left, width: bgStyle.width }}
            />

            {/* Nav items */}
            {allItems.map((item, index) => {
              const Component = item.path === '/' ? Link : NavLink;
              const isCenter = item.path === '/';
              const isHome = location.pathname === '/';
              const labelOrIcon =
                isCenter && !isHome ? (
                  <FontAwesomeIcon icon={faCircleDot} className="w-4 h-4" />
                ) : (
                  item.label
                );

              return (
                <Component
                  key={item.path}
                  to={item.path}
                  ref={el => (navRefs.current[index] = el)}
                  className={`relative z-10 flex items-center text-sm gap-2 px-4 py-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'text-black font-semibold'
                      : 'text-white hover:text-black hover:scale-105'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => moveHighlightTo(navRefs.current[index])}
                  onMouseLeave={() => {
                    if (activeIndex >= 0 && navRefs.current[activeIndex]) {
                      moveHighlightTo(navRefs.current[activeIndex]);
                    }
                  }}
                >
                  {item.icon && index !== 1 && (
                    <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                  )}
                  <span>{labelOrIcon}</span>
                </Component>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setIsMobileOpen(prev => !prev)}
              className="cursor-pointer rounded-full px-3 py-2 text-white transition-colors"
            />
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      {isMobile && isMobileOpen && (
        <MobileNav navItems={navItems} onClose={() => setIsMobileOpen(false)} />
      )}
    </>
  );
};

export default NavBar;
