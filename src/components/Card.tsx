import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div
      className={`
        bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6
        ${hover ? 'hover:bg-slate-800/80 hover:border-slate-600/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;