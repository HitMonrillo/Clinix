import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, UserCheck, Menu, X, CircleDot, Sun, Moon } from 'lucide-react';

 const NavBar = ({ isDark, toggleTheme }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to Center (Clinix)
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track hover state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Animation state for the sliding background
  const [bgStyle, setBgStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRefs = useRef([]);

  // Navigation Items based on user request
  const navItems = [
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: null, label: 'Clinix', path: '/' }, // Center Logo/Home
    { icon: UserCheck, label: 'Check-In', path: '/checkin' },
  ];

  // The index that should currently be highlighted (hovered takes precedence over active)
  const targetIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  // Function to move the white highlight pill
  const moveHighlightTo = (index) => {
    const el = navRefs.current[index];
    if (!el) return;
    
    // We need the parent container's rect to calculate the relative position
    const parent = el.parentElement;
    if (!parent) return;

    const rect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    setBgStyle({
      left: rect.left - parentRect.left, // Position relative to container
      width: rect.width,
      opacity: 1,
    });
  };

  // Update highlight position when targetIndex changes or on resize
  useEffect(() => {
    // Small timeout to ensure DOM is ready and layout is settled
    const timer = setTimeout(() => moveHighlightTo(targetIndex), 50);
    return () => clearTimeout(timer);
  }, [targetIndex]);

  useEffect(() => {
    const handleResize = () => moveHighlightTo(targetIndex);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetIndex]);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full px-4 pointer-events-none font-poppins">
        <div className="flex items-center gap-3 pointer-events-auto">
          
          {/* Main Floating Pill - Hidden on Mobile */}
          <div className="hidden md:flex relative items-center bg-[#100C08]/90 backdrop-blur-md px-2 py-0 rounded-full border border-white/10 shadow-xl transition-all duration-300">
            
            {/* Animated Sliding Background (White Pill) */}
            <div
              className="absolute top-1.5 bottom-1.5 bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ 
                left: bgStyle.left, 
                width: bgStyle.width, 
                opacity: bgStyle.opacity 
              }}
            />

            {navItems.map((item, index) => {
              // Determine if this specific item is the one currently highlighted (by hover or selection)
              const isHighlighted = index === targetIndex;
              const isCenter = index === 1; // Clinix center item

                return (
                  <Link
                    key={index}
                    to={item.path}   // <-- use 'to' instead of href
                    ref={(el) => { navRefs.current[index] = el; }}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 select-none cursor-pointer
                      ${isHighlighted ? 'text-black font-semibold' : 'text-white/70 hover:text-white'}
                    `}
                  >
                    {item.icon && !isCenter && <item.icon size={16} strokeWidth={2.5} />}
                    {isCenter ? (
                      <span className="flex items-center gap-2 text-lg tracking-tight">
                        <span className="font-bold">Clinix</span>
                      </span>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </Link>
                );
              })}
          </div>

          {/* Theme Toggle (External Circle) */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-[#100C08]/80 backdrop-blur-md cursor-pointer text-white/80 hover:text-white border border-white/10 shadow-lg hover:scale-110 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>


          {/* Mobile Menu Button (External Circle) */}
          <button
            className="md:hidden p-3 cursor-pointer rounded-full bg-[#100C08]/80 backdrop-blur-md text-white/80 hover:text-white border border-white/10 shadow-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-6 right-6 bg-[#100C08]/95 backdrop-blur-xl p-6 rounded-[2rem] z-40 shadow-2xl md:hidden border border-white/10 animate-fade-up font-poppins">
          <div className="flex flex-col gap-2">
             <div className="text-white/50 text-xs font-bold uppercase tracking-widest px-2 mb-2">Navigation</div>
             {navItems.map((item, i) => (
                <a 
                  key={i} 
                  href={item.path} 
                  className={`flex items-center gap-4 text-lg font-medium p-3 rounded-2xl transition-colors ${activeIndex === i ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
                  onClick={() => {
                    setActiveIndex(i);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.icon ? <item.icon size={20} /> : <CircleDot size={20} />}
                  {item.label}
                </a>
             ))}
             
             <div className="h-px bg-white/10 my-4"></div>
             
             <button className="w-full py-3.5 bg-clinix-blue text-white rounded-full font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-transform">
               Book Appointment
             </button>
          </div>
        </div>
      )}
    </>
  );
};
export default NavBar;
