import React from 'react';

interface WashiTapeProps {
  color?: string;
  className?: string;
  rotation?: number;
}

export const WashiTape: React.FC<WashiTapeProps> = ({ 
  color = "bg-primary/90", 
  className = "",
  rotation = 0
}) => {
  return (
    <div 
      className={`absolute h-8 ${color} tape-edge shadow-sm z-20 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
};