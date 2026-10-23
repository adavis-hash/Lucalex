'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 600);
  };

  return (
    <section className="section-padding" style={{
      backgroundColor: '#f1f5f9',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div className="container-narrow">
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: 'clamp(32px, 5vw, 64px)',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle top accent bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2563eb, #f59e0b, #10b981)'
          }} />

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            marginBottom: '20px'
          }}>
            <Mail size={26} />
          </div>

          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '12px',
            fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
          }}>
            Join the Builder&apos;s Dispatch
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            maxWidth: '540px',
            margin: '0 auto 32px',
            lineHeight: 1.6
          }}>
            Receive confidential production updates, inaugural series release dates, and exclusive architectural blueprint downloads directly to your inbox.
          </p>

          {status === 'success' ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 28px',
              borderRadius: '12px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontWeight: 600,
              fontSize: '0.9375rem',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <CheckCircle2 size={20} color="#059669" />
              <span>You&apos;re on the list! Welcome to the MODULO founding dispatch.</span>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit}
              style={{
                maxWidth: '480px',
                margin: '0 auto',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: '1 1 280px', position: 'relative' }}>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9375rem',
                    color: '#0f172a',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    transition: 'border-color 150ms ease, box-shadow 150ms ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="btn btn-primary"
                style={{
                  flex: '0 0 auto',
                  padding: '14px 24px',
                  fontWeight: 700
                }}
              >
                {status === 'submitting' ? 'Subscribing...' : (
                  <>
                    Subscribe <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '20px'
          }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Zero spam. Unsubscribe at any time. Demonstration form preview.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
