'use client';

import React from 'react';
import { X, Layers, User, Ruler, Award, Check, Plus, ShieldCheck } from 'lucide-react';
import { ProductItem } from '../data/products';

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  inCart: boolean;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  inCart,
}: QuickViewModalProps) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          animation: 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            zIndex: 10,
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e2e8f0';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#475569';
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
        }}>
          {/* Product Image Column */}
          <div style={{
            backgroundColor: '#0a0e17',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '340px'
          }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              backdropFilter: 'blur(4px)'
            }}>
              {product.setNumber}
            </div>
          </div>

          {/* Details Column */}
          <div style={{ padding: 'clamp(24px, 4vw, 36px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Category & Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  {product.collectionName}
                </span>
                {product.badge && (
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8'
                  }}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.25,
                marginBottom: '12px',
                fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
              }}>
                {product.name}
              </h2>

              <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                {product.tagline}
              </p>

              {/* Specs Pills */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                marginBottom: '20px',
                fontSize: '0.8125rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <Layers size={16} color="#2563eb" />
                  <span><strong>{product.pieces.toLocaleString()}</strong> Pieces</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <User size={16} color="#f59e0b" />
                  <span>Age: <strong>{product.age}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <Ruler size={16} color="#059669" />
                  <span>{product.dimensions || 'Modular Format'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <Award size={16} color="#8b5cf6" />
                  <span>Level: <strong>{product.difficulty || 'Advanced'}</strong></span>
                </div>
              </div>

              {/* Features List */}
              {product.features && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Key Engineering Features
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {product.features.map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8125rem', color: '#475569' }}>
                        <Check size={14} color="#2563eb" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price & Action row */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                    Illustrative Concept Price
                  </div>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
                  }}>
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  backgroundColor: '#f1f5f9',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  <ShieldCheck size={14} color="#10b981" /> Demonstration Set
                </div>
              </div>

              <button 
                onClick={() => onAddToCart(product)}
                className={`btn ${inCart ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', fontWeight: 700, padding: '14px' }}
              >
                {inCart ? (
                  <>
                    <Check size={16} color="#10b981" /> Added to Concept Bag
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Add to Concept Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
