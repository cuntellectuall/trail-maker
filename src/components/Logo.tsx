import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-6 h-6" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} transition-all duration-305`}
    >
      <defs>
        <linearGradient id="logo-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Symmetrical Outer letter "D" outline */}
      <path
        d="M 24 72 L 24 28 A 4 4 0 0 1 28 24 L 56 24 A 26 26 0 0 1 56 76 L 28 76 A 4 4 0 0 1 24 72 Z"
        stroke="url(#logo-brand-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner circular dot */}
      <circle 
        cx="39" 
        cy="38" 
        r="4.5" 
        fill="url(#logo-brand-gradient)" 
      />
      {/* Diagonal Q-tail slider */}
      <path
        d="M 46 46 L 76 76"
        stroke="url(#logo-brand-gradient)"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
