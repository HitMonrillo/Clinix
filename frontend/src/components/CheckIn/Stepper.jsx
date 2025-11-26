import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../Layouts/RootLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faCalendarCheck, faMoneyCheck, faCircleQuestion, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const Stepper = () => {
  const stepItems = [
    { name: "Appointments", path: "appointments", icon: faCalendarCheck },
    { name: "Insurance", path: "insurance", icon: faMoneyCheck },
    { name: "Records", path: "records", icon: faNotesMedical },
    { name: "Questions", path: "questions", icon: faCircleQuestion },
  ];

  const { isDark } = useContext(ThemeContext);
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(true); // always expanded – no ScreenContext
  const stepperRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgStyle, setBgStyle] = useState({ top: 0, height: 0 });

  const currentStep = stepItems.find(step => location.pathname.includes(step.path)) || stepItems[0];

  // Detect active step index
  useEffect(() => {
    const index = stepItems.findIndex(step => location.pathname.includes(step.path));
    if (index >= 0) setActiveIndex(index);
  }, [location.pathname]);

  // Move background highlight to selected step
  useEffect(() => {
    const el = stepRefs.current[activeIndex];
    if (el) {
      setBgStyle({
        top: el.offsetTop,
        height: el.offsetHeight,
      });
    }
  }, [activeIndex, isExpanded]);

  // Resize adjustment
  useEffect(() => {
    const handleResize = () => {
      const el = stepRefs.current[activeIndex];
      if (el) {
        setBgStyle({
          top: el.offsetTop,
          height: el.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <div
      ref={stepperRef}
      className={`
        fixed top-20 left-5 z-40 flex flex-col py-3 px-2 mt-15 shadow-lg rounded-4xl 
        backdrop-blur-sm transition-all duration-500 ease-in-out border 
        ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}
      `}
      style={{ width: isExpanded ? '14rem' : '4rem' }}
    >
      {/* Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center justify-between px-4 py-2 cursor-pointer rounded-full
          transition-all duration-300
          ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}
        `}
      >
        <span className={`${isExpanded ? 'font-medium' : 'sr-only'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {currentStep.name}
        </span>

        <FontAwesomeIcon
          icon={faCaretRight}
          className={`transform transition-transform duration-150 ${isExpanded ? "rotate-180" : ""} 
            ${isDark ? "text-white" : "text-gray-800"}
          `}
        />
      </div>

      {/* Steps */}
      <div className="relative mt-2 flex flex-col gap-5 overflow-hidden">

        {/* Background highlight */}
        <span
          className={`
            absolute left-0 right-0 rounded-full transition-all duration-500 ease-out
            ${isDark ? "bg-gray-800" : "bg-gray-100"}
          `}
          style={{ top: bgStyle.top, height: bgStyle.height }}
        />

        {/* Step Buttons */}
        <div
          className="flex flex-col gap-2 transition-transform duration-300"
          style={{ transform: isExpanded ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {stepItems.map((step, index) => (
            <Link
              key={step.path}
              to={step.path}
              ref={el => (stepRefs.current[index] = el)}
              onClick={() => setActiveIndex(index)}
              className={`
                relative z-10 flex items-center gap-3 px-4 py-2 rounded-full text-sm h-10
                transition-all duration-150 cursor-pointer
                ${step.path === currentStep.path ? 
                  `${isDark ? "text-white font-semibold" : "text-gray-900 font-semibold"}` :
                  `${isDark ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-black hover:bg-gray-200"}`}
                ${!isExpanded ? 'justify-center p-3 w-12 h-10' : ''}
              `}
            >
              <FontAwesomeIcon icon={step.icon} className="w-5 h-5" />
              {isExpanded && <span>{step.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
