import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GradientIconProps {
  icon: LucideIcon;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { container: 'p-2', icon: 'size-4' },
  md: { container: 'p-3', icon: 'size-5' },
  lg: { container: 'p-4', icon: 'size-6' },
  xl: { container: 'p-4', icon: 'size-12' },
};

export function GradientIcon({ 
  icon: Icon, 
  gradient = 'linear-gradient(135deg, #FFA500, #FF8C00)',
  size = 'md',
  className = ''
}: GradientIconProps) {
  const { container, icon } = sizeMap[size];
  
  return (
    <div 
      className={`${container} rounded-xl ${className}`}
      style={{ background: gradient }}
    >
      <Icon className={`${icon} text-white`} />
    </div>
  );
}
