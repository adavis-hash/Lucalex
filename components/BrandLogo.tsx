import React from 'react';

interface BrandLogoProps {
  light?: boolean;
  size?: 'default' | 'small';
}

export default function BrandLogo({ light = false, size = 'default' }: BrandLogoProps) {
  const isSmall = size === 'small';
  
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isSmall ? '8px' : '12px',
      textDecoration: 'none',
      userSelect: 'none'
    }}>
      {/* Original Interlocking Modular Stud Icon */}
      <svg 
        width={isSmall ? '28' : '36'} 
        height={isSmall ? '28' : '36'} 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="36" height="36" rx="8" fill={light ? '#ffffff' : '#0f172a'} />
        <rect x="7" y="7" width="9" height="9" rx="2.5" fill="#2563eb" />
        <rect x="20" y="7" width="9" height="9" rx="2.5" fill="#f59e0b" />
        <rect x="7" y="20" width="9" height="9" rx="2.5" fill="#10b981" />
        <rect x="20" y="20" width="9" height="9" rx="2.5" fill="#ea580c" />
        <circle cx="18" cy="18" r="2" fill={light ? '#0f172a' : '#ffffff'} />
      </svg>
      
      {/* Brand Typography */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
          fontSize: isSmall ? '1.15rem' : '1.45rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: light ? '#ffffff' : '#0f172a',
          textTransform: 'uppercase'
        }}>
          MODULO
        </span>
        <span style={{
          fontFamily: "var(--font-sans), sans-serif",
          fontSize: isSmall ? '0.55rem' : '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: light ? '#94a3b8' : '#64748b',
          textTransform: 'uppercase',
          marginTop: '3px'
        }}>
          Modular Craft
        </span>
      </div>
    </div>
  );
}
