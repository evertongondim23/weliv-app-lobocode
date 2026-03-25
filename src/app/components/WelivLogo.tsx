import React from 'react';

interface WelivLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function WelivLogo({ size = 'md', showText = true, className = '' }: WelivLogoProps) {
  const logoSrc = '/src/assets/weliv.png';
  const sizeClasses = {
    sm: 'size-10',
    md: 'size-14',
    lg: 'size-20',
  };

  const fullLogoHeightClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showText ? (
        <img
          src={logoSrc}
          alt="Weliv"
          className={`w-auto object-contain flex-shrink-0 ${fullLogoHeightClasses[size]}`}
        />
      ) : (
        <img
          src={logoSrc}
          alt="Weliv"
          className={`${sizeClasses[size]} object-cover object-left flex-shrink-0`}
        />
      )}
    </div>
  );
}

// Compatibilidade para imports antigos.
export const StayFlowLogo = WelivLogo;