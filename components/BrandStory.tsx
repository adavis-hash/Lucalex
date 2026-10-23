'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck, Cpu, Sparkles, Check } from 'lucide-react';
import { BRAND_PILLARS } from '../data/products';

export default function BrandStory() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="about" className="section-padding" style={{
      backgroundColor: '#0f172a',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background graphic subtle elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Header */}
        <div style={{ maxWidth: '780px', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#60a5fa',
            background: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            padding: '6px 14px',
            borderRadius: '9999px',
            marginBottom: '20px'
          }}>
            <Sparkles size={14} color="#60a5fa" />
            THE MODULO PHILOSOPHY
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
            fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
          }}>
            Constructing clarity out of complexity.
          </h2>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#94a3b8'
          }}>
            We believe that the tactile act of assembling interlocking modules is not merely pastime—it is an architectural dialogue between human imagination and physical form. MODULO was founded on a simple conviction: construction toys should honor the intelligence, design taste, and unconstrained curiosity of builders of all ages.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px',
          marginBottom: '64px'
        }}>
          {BRAND_PILLARS.map((pillar, idx) => (
            <div 
              key={pillar.number}
              onClick={() => setActiveTab(idx)}
              style={{
                backgroundColor: activeTab === idx ? '#1e293b' : 'rgba(30, 41, 59, 0.45)',
                border: `1px solid ${activeTab === idx ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '16px',
                padding: '32px 28px',
                transition: 'all 250ms ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <span style={{
                    fontFamily: "var(--font-space), 'Space Grotesk', sans-serif",
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: activeTab === idx ? '#60a5fa' : '#64748b'
                  }}>
                    {pillar.number}
                  </span>
                  
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: activeTab === idx ? 'rgba(37, 99, 235, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeTab === idx ? '#93c5fd' : '#94a3b8'
                  }}>
                    {idx === 0 && <ShieldCheck size={18} />}
                    {idx === 1 && <Layers size={18} />}
                    {idx === 2 && <Cpu size={18} />}
                  </div>
                </div>

                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: '#ffffff',
                  fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
                }}>
                  {pillar.title}
                </h3>

                <p style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: '#94a3b8'
                }}>
                  {pillar.description}
                </p>
              </div>

              {activeTab === idx && (
                <div style={{
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  color: '#60a5fa',
                  fontWeight: 700
                }}>
                  <Check size={14} /> Core Engineering Standard
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Studio Craftsmanship Callout Banner */}
        <div style={{
          backgroundColor: '#162032',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#f59e0b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              DESIGNED IN EUROPE • CRAFTED FOR GENERATIONS
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              Beyond standard toys: The Art of Modular Play.
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              color: '#94a3b8'
            }}>
              Unlike throwaway plastic kits, MODULO parts are dimensioned to last decades. Clean architectural geometry, zero superficial stickers, and printed micro-reliefs ensure that your builds look stunning on an executive desk, museum display, or living room showcase.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            paddingLeft: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#e2e8f0' }}>
              <Check size={16} color="#10b981" /> 100% Original Industrial Design
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#e2e8f0' }}>
              <Check size={16} color="#10b981" /> Scratch-Resistant Micro-Textured Finish
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#10b981' }}>
              <Check size={16} color="#10b981" /> Non-Toxic, Certified Plant-Based Resins
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#e2e8f0' }}>
              <Check size={16} color="#10b981" /> Universal Interoperability Across All Themes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
