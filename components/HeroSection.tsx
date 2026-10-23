import React from 'react';
import { ArrowRight, Layers, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onDiscoverClick?: () => void;
  onInspectFlagship?: () => void;
}

export default function HeroSection({
  onExploreClick,
  onDiscoverClick,
  onInspectFlagship,
}: HeroSectionProps) {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0a0e17',
      color: '#ffffff',
      paddingTop: '64px',
      paddingBottom: '88px',
      borderBottom: '1px solid #1e293b'
    }}>
      {/* Subtle ambient lighting gradients */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(10, 14, 23, 0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        left: '5%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(10, 14, 23, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Column: Brand Statement & CTAs */}
          <div style={{ maxWidth: '620px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#93c5fd',
              marginBottom: '24px',
              letterSpacing: '0.04em'
            }}>
              <Sparkles size={14} color="#f59e0b" />
              <span>THE NEW STANDARD IN MODULAR BRICKCRAFT</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              marginBottom: '22px',
              fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
            }}>
              Engineered for imagination.{' '}
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Built for wonder.
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              lineHeight: 1.65,
              color: '#94a3b8',
              marginBottom: '36px'
            }}>
              MODULO creates high-precision, architectural-grade interlocking construction systems. Crafted for thinkers, creators, and master builders who appreciate timeless engineering.
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '40px'
            }}>
              <a 
                href="#collections"
                onClick={onExploreClick}
                className="btn btn-white"
                style={{ fontWeight: 700 }}
              >
                Explore the collection <ArrowRight size={18} />
              </a>

              <a 
                href="#about"
                onClick={onDiscoverClick}
                className="btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Compass size={18} /> Discover our world
              </a>
            </div>

            {/* Key Engineering Badges */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#60a5fa" />
                <span>±0.003mm Micro-Tolerance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                <Layers size={16} color="#f59e0b" />
                <span>Infinite Modular Grid</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Matte Anti-Glare Composite</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Plinth */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(37, 99, 235, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: '#111827'
            }}>
              <img 
                src="/images/hero_showcase.jpg" 
                alt="MODULO Flagship Biosphera Modular Construction Toy Pavilion" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transform: 'scale(1.01)',
                  transition: 'transform 0.5s ease'
                }}
              />

              {/* Bottom Metadata Plaque Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 24px',
                background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.7) 65%, transparent 100%)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#f59e0b',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}>
                    Flagship Master Build // Set No. 0101
                  </div>
                  <div style={{
                    fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff'
                  }}>
                    The Biosphera Geodesic Pavilion
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                    2,840 Pieces • Geodesic Amber Domes • Advanced Architectural Series
                  </div>
                </div>

                <button 
                  onClick={onInspectFlagship}
                  className="btn btn-sm btn-white"
                  style={{
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    fontWeight: 700
                  }}
                >
                  Quick View
                </button>
              </div>
            </div>

            {/* Floating Badge */}
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '24px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              Concept Edition 01
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
