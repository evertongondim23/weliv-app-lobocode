import React from 'react';
import { WelivLogo } from './WelivLogo';

export function LoadingScreen() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE5B4 50%, #cfeef7 100%)' }}
    >
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <WelivLogo size="lg" showText={true} />
        </div>
        
        {/* Loading spinner */}
        <div className="flex justify-center mb-4">
          <div className="relative size-12">
            <div className="absolute inset-0 rounded-full border-4 border-transparent"
                 style={{ 
                   borderTopColor: '#FFA500',
                   borderRightColor: '#FFC700',
                   animation: 'spin 1s linear infinite'
                 }} 
            />
          </div>
        </div>
        
        <p className="text-lg font-medium" style={{ color: '#6B5D53' }}>
          Carregando...
        </p>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
