import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: LucideIcon;
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', icon: Icon, size = 'md' }) => {
  const variants = {
    default: 'bg-slate-700/50 text-slate-200 border border-slate-600/50',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {text}
    </span>
  );
};

export default Badge;