'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Layers, ArrowRight, Box } from 'lucide-react';
import { PRODUCTS, ProductItem } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
  products?: ProductItem[];
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
  products = PRODUCTS,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === '' 
    ? products.slice(0, 4) 
    : products.filter((p) => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.collectionName.toLowerCase().includes(query.toLowerCase()) ||
        p.setNumber.toLowerCase().includes(query.toLowerCase()) ||
        p.tagline.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '80vh',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 200ms ease-out'
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#f8fafc'
        }}>
          <Search size={20} color="#2563eb" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sets, collections, or piece counts (e.g., Pavilion, Rover)..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: '#0f172a',
              outline: 'none',
              fontWeight: 500
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              style={{ color: '#94a3b8', padding: '4px' }}
            >
              <X size={16} />
            </button>
          )}
          <button 
            onClick={handleClose}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#e2e8f0',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#475569'
            }}
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div style={{
          padding: '16px 20px',
          overflowY: 'auto',
          maxHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            {query.trim() === '' ? 'Suggested Concept Sets' : `Search Results (${results.length})`}
          </div>

          {results.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#64748b' }}>
              <Box size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontWeight: 600 }}>No concept sets matching &quot;{query}&quot;</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>Try searching for &quot;Architecture&quot;, &quot;Space&quot;, or &quot;Kinetic&quot;.</p>
            </div>
          ) : (
            results.map((product) => (
              <div 
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  handleClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #f1f5f9',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#f1f5f9';
                }}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{
                    width: '56px',
                    height: '56px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    backgroundColor: '#0f172a'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                      {product.setNumber}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>
                      {product.collectionName}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                    {product.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                    <span><Layers size={11} style={{ display: 'inline' }} /> {product.pieces.toLocaleString()} pcs</span>
                    <span>•</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>${product.price.toFixed(2)}</span>
                  </div>
                </div>

                <ArrowRight size={16} color="#94a3b8" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
