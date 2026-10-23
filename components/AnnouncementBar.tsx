'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      backgroundColor: '#0a0e17',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      color: '#f8fafc',
      fontSize: '0.8125rem',
      fontWeight: 500,
      padding: '8px 16px',
      position: 'relative',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        textAlign: 'center'
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(37, 99, 235, 0.25)',
          color: '#60a5fa',
          border: '1px solid rgba(37, 99, 235, 0.4)',
          borderRadius: '9999px',
          padding: '2px 8px',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          <Sparkles size={11} /> Phase 1 Preview
        </span>

        <span>
          MODULO Architecture & Kinetic Systems — Inaugural concept prototypes now showcased.
        </span>

        <a 
          href="#collections" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: '#f59e0b',
            fontWeight: 600,
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Explore Series <ArrowRight size={13} />
        </a>
      </div>

      <button 
        onClick={() => setVisible(false)}
        aria-label="Dismiss banner"
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          borderRadius: '4px',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
      >
        <X size={14} />
      </button>
    </div>
  );
}
