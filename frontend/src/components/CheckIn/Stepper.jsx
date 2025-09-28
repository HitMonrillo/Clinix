import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScreenContext } from '../../Layouts/RootLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical, faCalendarCheck, faMoneyCheck, faCircleQuestion, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const Stepper = () => {
  const stepItems = [
    { name: "Appointments", path: "appointments", icon: faCalendarCheck },
    { name: "Insurance", path: "insurance", icon: faMoneyCheck },
    { name: "Records", path: "records", icon: faNotesMedical },
    { name: "Questions", path: "questions", icon: faCircleQuestion },
  ];

  const { isMobile } = useContext(ScreenContext);
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const stepperRef = useRef(null);
  const stepRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgStyle, setBgStyle] = useState({ top: 0, height: 0 });

  const currentStep = stepItems.find(step => location.pathname.includes(step.path)) || stepItems[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobile && stepperRef.current && !stepperRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) setIsExpanded(false);
  }, [isMobile]);

  useEffect(() => {
    const index = stepItems.findIndex(step => location.pathname.includes(step.path));
    if (index >= 0) setActiveIndex(index);
  }, [location.pathname]);

  useEffect(() => {
    const el = stepRefs.current[activeIndex];
    if (el) {
      setBgStyle({
        top: el.offsetTop,
        height: el.offsetHeight,
      });
    }
  }, [activeIndex, isExpanded]);

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
      className={`fixed top-20 left-5 z-40 flex flex-col py-3 px-2 border bg-gray-900 backdrop-blur-sm mt-15 shadow-lg rounded-4xl`}
      style={{
        width: isExpanded ? '14rem' : '4rem', // same as before
        transition: 'width 0.15s ease-out',
      }}
    >
      {/* Toggle button */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-300/40 rounded-full transition-all duration-300"
      >
        <span className={`${isExpanded ? 'font-medium text-white' : 'sr-only'}`}>
          {currentStep.name}
        </span>
        <FontAwesomeIcon
          icon={faCaretRight}
          className={`text-white transform transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
        />
      </div>

      {/* Steps drawer */}
      <div className="relative mt-2 flex flex-col gap-5 overflow-hidden">
        <span
          className="absolute left-0 right-0 bg-gray-900 rounded-full transition-all duration-500 ease-out"
          style={{ top: bgStyle.top, height: bgStyle.height }}
        />

        <div
          className="flex flex-col gap-2 transform transition-transform duration-300"
          style={{ transform: isExpanded ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          {stepItems.map((step, index) => (
            <Link
              key={step.path}
              to={step.path}
              ref={el => (stepRefs.current[index] = el)}
              className={`relative z-10 flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-150 text-sm h-10
                ${step.path === currentStep.path ? 'text-white font-semibold' : 'text-gray-300 hover:text-white hover:bg-gray-700'}
                ${!isExpanded ? 'justify-center p-3 w-12 h-10' : ''} cursor-pointer`}
              onClick={() => setActiveIndex(index)}
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
