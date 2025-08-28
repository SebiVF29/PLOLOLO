import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-card text-card-foreground p-6 rounded-2xl shadow-lg transition-all duration-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
