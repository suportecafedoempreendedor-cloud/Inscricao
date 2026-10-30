import React from 'react';

interface GeometricDecorationProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
  variant?: 'diamonds' | 'polygons' | 'diagonal-stripes' | 'triangles-cluster' | 'corner-burst';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GeometricDecoration: React.FC<GeometricDecorationProps> = ({
  position = 'top-right',
  variant = 'polygons',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24 sm:w-32 sm:h-32',
    md: 'w-40 h-40 sm:w-56 sm:h-56',
    lg: 'w-56 h-56 sm:w-80 sm:h-80',
    xl: 'w-72 h-72 sm:w-96 sm:h-96',
  }[size];

  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-6 -translate-y-6',
    'top-right': 'top-0 right-0 translate-x-6 -translate-y-6',
    'bottom-left': 'bottom-0 left-0 -translate-x-6 translate-y-6',
    'bottom-right': 'bottom-0 right-0 translate-x-6 translate-y-6',
    'center-left': 'top-1/2 left-0 -translate-x-8 -translate-y-1/2',
    'center-right': 'top-1/2 right-0 translate-x-8 -translate-y-1/2',
  }[position];

  if (variant === 'diamonds') {
    return (
      <div
        className={`absolute pointer-events-none select-none z-0 overflow-visible opacity-85 ${positionClasses} ${sizeClasses} ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Overlapping diamonds in official 79th edition palette */}
          <g transform="rotate(45 100 100)">
            <rect x="30" y="30" width="70" height="70" fill="#032877" fillOpacity="0.9" />
            <rect x="70" y="30" width="70" height="70" fill="#0152D9" fillOpacity="0.9" />
            <rect x="50" y="70" width="70" height="70" fill="#0173EF" fillOpacity="0.92" />
            <rect x="80" y="80" width="50" height="50" fill="#F8D21C" fillOpacity="0.95" />
            <rect x="15" y="65" width="45" height="45" fill="#65A6F4" fillOpacity="0.85" />
            <rect x="65" y="15" width="45" height="45" fill="#0152D9" fillOpacity="0.8" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'triangles-cluster') {
    return (
      <div
        className={`absolute pointer-events-none select-none z-0 overflow-visible opacity-90 ${positionClasses} ${sizeClasses} ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Official 79.ª Edição Blue & Gold Palette */}
          <polygon points="0,0 120,0 60,104" fill="#032877" />
          <polygon points="120,0 240,0 180,104" fill="#0152D9" />
          <polygon points="60,104 180,104 120,208" fill="#0173EF" />
          <polygon points="0,0 60,104 0,208" fill="#F8D21C" />
          <polygon points="180,104 240,0 240,208" fill="#65A6F4" />
          <polygon points="60,104 120,208 0,208" fill="#0152D9" />
          <polygon points="120,208 180,104 240,208" fill="#032877" />
        </svg>
      </div>
    );
  }

  if (variant === 'diagonal-stripes') {
    return (
      <div
        className={`absolute pointer-events-none select-none z-0 overflow-hidden opacity-30 ${positionClasses} ${sizeClasses} ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <line x1="-50" y1="50" x2="150" y2="-150" stroke="#0152D9" strokeWidth="12" />
          <line x1="-30" y1="90" x2="190" y2="-130" stroke="#0173EF" strokeWidth="12" />
          <line x1="-10" y1="130" x2="230" y2="-110" stroke="#F8D21C" strokeWidth="12" />
          <line x1="10" y1="170" x2="270" y2="-90" stroke="#032877" strokeWidth="12" />
          <line x1="30" y1="210" x2="310" y2="-70" stroke="#65A6F4" strokeWidth="12" />
        </svg>
      </div>
    );
  }

  // Default: corner-burst / polygons
  return (
    <div
      className={`absolute pointer-events-none select-none z-0 overflow-visible ${positionClasses} ${sizeClasses} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Abstract Overlapping Polygons in Official Blue & Gold Palette */}
        <path d="M0 0 L160 0 L100 100 L0 80 Z" fill="#032877" fillOpacity="0.85" />
        <path d="M160 0 L260 40 L180 140 L100 100 Z" fill="#0152D9" fillOpacity="0.9" />
        <path d="M180 140 L260 200 L160 240 L120 160 Z" fill="#0173EF" fillOpacity="0.95" />
        <path d="M100 100 L180 140 L120 160 L60 140 Z" fill="#65A6F4" fillOpacity="0.9" />
        <path d="M0 80 L100 100 L60 140 L0 180 Z" fill="#F8D21C" fillOpacity="0.95" />
        <path d="M60 140 L120 160 L160 240 L80 260 Z" fill="#0152D9" fillOpacity="0.8" />
        <path d="M120 160 L180 140 L220 220 L160 240 Z" fill="#032877" fillOpacity="0.85" />
      </svg>
    </div>
  );
};
