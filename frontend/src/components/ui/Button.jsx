import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-clinix-blue focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-poppins";
  
  const variants = {
    primary: "bg-blue-600 text-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600  border border-transparent",
    secondary: "bg-clinix-teal text-white hover:bg-teal-700 hover:-translate-y-0.5 border border-transparent",
    outline: "border border-clinix-blue text-clinix-blue bg-transparent hover:bg-clinix-lightBlue/30 dark:border-white dark:text-white dark:hover:bg-blue-900/20",
    ghost: "text-clinix-blue hover:bg-clinix-lightBlue/50 dark:text-blue-400 dark:hover:bg-blue-900/20",
  };

  const sizes = {
    sm: "text-sm px-5 py-2",
    md: "text-base px-6 py-2.5",
    lg: "text-md px-8 py-2.5",
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
