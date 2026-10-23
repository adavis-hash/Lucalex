'use client';

import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Layers, Info } from 'lucide-react';
import { ProductItem } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: ProductItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalPieces = items.reduce((acc, item) => acc + (item.pieces || 0), 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0), 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          boxShadow: '-10px 0 30px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          animation: 'slideInRight 250ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
              Concept Bag ({items.length})
            </h3>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close cart"
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Phase 1 Prototype Notice Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          padding: '12px 20px',
          borderBottom: '1px solid #dbeafe',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '0.75rem',
          color: '#1e40af',
          lineHeight: 1.45
        }}>
          <Info size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>
            <strong>Phase 1 Visual Demonstration:</strong> Checkout and payment processing are disabled. Fictional concept models are shown for presentation only.
          </span>
        </div>

        {/* Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              <ShoppingBag size={48} strokeWidth={1.5} style={{ marginBottom: '16px' }} />
              <p style={{ fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Your concept bag is empty</p>
              <p style={{ fontSize: '0.8125rem' }}>Browse the collection to add demonstration building sets.</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  position: 'relative'
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{
                    width: '72px',
                    height: '72px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    backgroundColor: '#0f172a',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {item.setNumber}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      <Layers size={12} color="#2563eb" /> {item.pieces.toLocaleString()} pieces
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                      ${item.price.toFixed(2)}
                    </span>

                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 150ms ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem', color: '#64748b' }}>
              <span>Total Demonstration Pieces</span>
              <strong style={{ color: '#0f172a' }}>{totalPieces.toLocaleString()} pcs</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              <span>Illustrative Subtotal</span>
              <span style={{ fontFamily: "var(--font-space), 'Space Grotesk', sans-serif", fontSize: '1.25rem' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Clear Bag and Checkout Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => alert("Phase 1 Prototype: Real checkout will be implemented in a subsequent phase.")}
                className="btn btn-primary"
                style={{ width: '100%', fontWeight: 700 }}
              >
                Proceed to Checkout (Disabled) <ArrowRight size={16} />
              </button>

              <button 
                onClick={onClearCart}
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textAlign: 'center',
                  padding: '6px',
                  textDecoration: 'underline'
                }}
              >
                Clear demonstration bag
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
