import React from 'react';

const Card = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-white hover:shadow-md transition-shadow duration-200',
    elevated: 'bg-white shadow-lg hover:shadow-xl transition-shadow duration-200',
    outlined: 'bg-white border-2 border-black hover:shadow-md transition-shadow duration-200',
    filled: 'bg-gray-50 hover:bg-gray-100 transition-colors duration-200'
  };

  return (
    <div
      className={`
        rounded-lg overflow-hidden
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
Card.Header = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-b border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card Body Component
Card.Body = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Card Footer Component
Card.Footer = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-t border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card; 