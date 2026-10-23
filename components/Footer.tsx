'use client';

import React from 'react';
import BrandLogo from './BrandLogo';
import { ArrowUp, ShieldCheck, Globe } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: '#0a0e17',
      color: '#94a3b8',
      borderTop: '1px solid #1e293b',
      paddingTop: '80px',
      paddingBottom: '48px',
      fontSize: '0.875rem'
    }}>
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '64px'
        }}>
          {/* Brand Column */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ marginBottom: '20px' }}>
              <BrandLogo light={true} />
            </div>
            
            <p style={{ lineHeight: 1.6, marginBottom: '24px', color: '#64748b' }}>
              Precision-engineered modular construction systems. Bridging architectural discipline, kinetic mechanics, and limitless creative imagination.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a href="#instagram" aria-label="MODULO Instagram" className="footer-social-icon" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#youtube" aria-label="MODULO YouTube" className="footer-social-icon" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
              </a>
              <a href="#discord" aria-label="MODULO Discord Guild" className="footer-social-icon" title="Discord Community">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="#twitter" aria-label="MODULO Twitter / X" className="footer-social-icon" title="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
              fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
            }}>
              Collections
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#collections" className="footer-link">Architecture & Cities</a></li>
              <li><a href="#collections" className="footer-link">Space & Exploration</a></li>
              <li><a href="#collections" className="footer-link">Vehicles & Engineering</a></li>
              <li><a href="#collections" className="footer-link">Fantasy & Adventure</a></li>
              <li><a href="#featured-sets" className="footer-link">Master Builder Flagships</a></li>
              <li><a href="#featured-sets" className="footer-link">Parts & Expansion Packs</a></li>
            </ul>
          </div>

          {/* Column 3: The Builder Studio */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
              fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
            }}>
              Builder Studio
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#about" className="footer-link">Our Design Philosophy</a></li>
              <li><a href="#about" className="footer-link">Material Standards & Testing</a></li>
              <li><a href="#community" className="footer-link">Community Lab & Gallery</a></li>
              <li><a href="#community" className="footer-link">Open Geometry System (OGS)</a></li>
              <li><a href="#community" className="footer-link">Submit a Blueprint</a></li>
              <li><a href="#community" className="footer-link">Collector Club Dispatch</a></li>
            </ul>
          </div>

          {/* Column 4: Support & Policies */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
              fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
            }}>
              Customer Support
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#faq" className="footer-link">Frequently Asked Questions</a></li>
              <li><a href="#shipping" className="footer-link">Global Shipping & Delivery</a></li>
              <li><a href="#returns" className="footer-link">Returns & Replacements</a></li>
              <li><a href="#missing-parts" className="footer-link">Missing Piece Guarantee</a></li>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Prototype Transparency Notice Banner */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '40px',
          border: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          <ShieldCheck size={20} color="#60a5fa" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5, flex: 1 }}>
            <strong style={{ color: '#ffffff' }}>Original Concept Prototype Notice:</strong> This website represents an original brand and visual identity prototype created for concept demonstration. The MODULO brand, models, piece counts, and pricing are demonstration content. No affiliation with any existing trademarked building toy brand.
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '28px',
          borderTop: '1px solid #1e293b',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8125rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <span>© 2026 MODULO Systems Inc. All rights reserved.</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} /> Global Edition (EN / USD)
            </span>
          </div>

          <button 
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#162032',
              border: '1px solid #1e293b',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Back to Top <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: #94a3b8;
          transition: color 150ms ease, transform 150ms ease;
          display: inline-block;
        }
        .footer-link:hover {
          color: #ffffff;
          transform: translateX(3px);
        }
        .footer-social-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: #162032;
          border: 1px solid #1e293b;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 150ms ease;
        }
        .footer-social-icon:hover {
          color: #ffffff;
          background-color: #2563eb;
          border-color: #2563eb;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}
