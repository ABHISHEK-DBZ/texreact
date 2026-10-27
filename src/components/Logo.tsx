import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8', showText = false }) => (
  <div className="flex items-center gap-2.5 select-none">
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="StudyHub Logo"
    >
      <defs>
        <linearGradient id="studyhub-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="logo-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#2563eb" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Background Rounded Squircle */}
      <rect width="36" height="36" rx="10" fill="url(#studyhub-grad)" filter="url(#logo-shadow)" />

      {/* Graduation Cap Mortarboard */}
      <path
        d="M18 9L8 14.5L18 20L28 14.5L18 9Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Cap Skull Underneath */}
      <path
        d="M12 17V22C12 24.2 14.7 26 18 26C21.3 26 24 24.2 24 22V17"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />
      {/* Tassel & Ribbon */}
      <path
        d="M26.5 15.5V22.5M26.5 22.5L25 24.5M26.5 22.5L28 24.5"
        stroke="#fde047"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small golden accent dot on cap center */}
      <circle cx="18" cy="14.5" r="1.3" fill="#fde047" />
    </svg>
    {showText && (
      <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300">
        StudyHub
      </span>
    )}
  </div>
);
