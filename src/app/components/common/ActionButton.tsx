import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
  gradient?: string;
}

export function ActionButton({ 
  icon: Icon, 
  label, 
  onClick,
  variant = 'outline',
  fullWidth = false,
  gradient = 'linear-gradient(135deg, #FFA500, #FF8C00)'
}: ActionButtonProps) {
  if (variant === 'primary') {
    return (
      <Button 
        onClick={onClick}
        className={`${fullWidth ? 'w-full' : ''} px-8`}
        style={{ background: gradient }}
      >
        <Icon className="size-4 mr-2" />
        {label}
      </Button>
    );
  }

  return (
    <Button 
      className={`${fullWidth ? 'w-full' : ''} justify-start h-12 text-base border-2 hover:shadow-md transition-all`}
      variant="outline"
      onClick={onClick}
      style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
    >
      <div className="p-2 rounded-lg mr-3" style={{ background: gradient }}>
        <Icon className="size-4 text-white" />
      </div>
      <span style={{ color: '#4A3728' }}>{label}</span>
    </Button>
  );
}
