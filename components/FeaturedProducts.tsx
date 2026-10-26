import React from 'react';
import { Eye, Plus, Check, Sparkles, Layers, User } from 'lucide-react';
import { PRODUCTS, ProductItem } from '../data/products';

interface FeaturedProductsProps {
  products?: ProductItem[];
  onQuickView: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  selectedCollectionId: string | null;
  onResetCollectionFilter: () => void;
  cartItemIds?: string[];
}

export default function FeaturedProducts({
  products = PRODUCTS,
  onQuickView,
  onAddToCart,
  selectedCollectionId,
  onResetCollectionFilter,
  cartItemIds = [],
}: FeaturedProductsProps) {
  const filteredProducts = selectedCollectionId 
    ? products.filter(p => p.collectionId === selectedCollectionId)
    : products;

  return (
    <section id="featured-sets" className="section-padding" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div className="section-label section-label-amber">
            <Sparkles size={14} /> CONCEPT SHOWCASE
          </div>
          
          <h2 className="section-title">
            Featured Modular Sets
          </h2>
          
          <p className="section-subtitle">
            Precision building kits engineered with architectural fidelity and collectors in mind. Fictional concept models for demonstration.
          </p>

          {/* Collection Filter Indicator if active */}
          {selectedCollectionId && (
            <div style={{
              marginTop: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              backgroundColor: '#e2e8f0',
              borderRadius: '9999px',
              fontSize: '0.8125rem'
            }}>
              <span>Filtering by: <strong>{selectedCollectionId.toUpperCase()}</strong></span>
              <button 
                onClick={onResetCollectionFilter}
                style={{
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textDecoration: 'underline'
                }}
              >
                Show All ({PRODUCTS.length})
              </button>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '28px'
        }}>
          {filteredProducts.map((product) => {
            const inCart = cartItemIds.includes(product.id);

            return (
              <div 
                key={product.id}
                className="product-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
                }}
              >
                {/* Visual Area */}
                <div style={{
                  position: 'relative',
                  paddingTop: '80%',
                  overflow: 'hidden',
                  backgroundColor: '#0f172a'
                }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-img"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 400ms ease'
                    }}
                  />

                  {/* Top Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <span style={{
                      padding: '4px 9px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
                      letterSpacing: '0.04em'
                    }}>
                      {product.setNumber}
                    </span>

                    {product.badge && (
                      <span style={{
                        padding: '4px 9px',
                        borderRadius: '6px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Quick View Hover Trigger */}
                  <div className="product-overlay">
                    <button 
                      onClick={() => onQuickView(product)}
                      className="btn btn-white btn-sm"
                      style={{ fontWeight: 700, gap: '6px' }}
                    >
                      <Eye size={14} /> Quick View
                    </button>
                  </div>
                </div>

                {/* Card Content Area */}
                <div style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}>
                  <div>
                    {/* Collection Category */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '6px'
                    }}>
                      {product.collectionName}
                    </div>

                    {/* Product Name */}
                    <h3 
                      onClick={() => onQuickView(product)}
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.35,
                        marginBottom: '12px',
                        cursor: 'pointer'
                      }}
                      className="product-title"
                    >
                      {product.name}
                    </h3>

                    {/* Metadata specs: Pieces and Age */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '0.8125rem',
                      color: '#475569',
                      marginBottom: '18px',
                      paddingBottom: '14px',
                      borderBottom: '1px solid #f1f5f9'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Layers size={14} color="#2563eb" />
                        <strong>{product.pieces.toLocaleString()}</strong> pcs
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={14} color="#64748b" />
                        Ages <strong>{product.age}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action row */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                          Illustrative Price
                        </div>
                        <div style={{
                          fontSize: '1.35rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
                        }}>
                          ${product.price.toFixed(2)}
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: '#64748b',
                        background: '#f1f5f9',
                        padding: '3px 7px',
                        borderRadius: '4px'
                      }}>
                        Prototype Only
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                      <button 
                        onClick={() => onAddToCart(product)}
                        className={`btn btn-sm ${inCart ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ width: '100%', fontWeight: 600 }}
                      >
                        {inCart ? (
                          <>
                            <Check size={14} color="#10b981" /> In Concept Bag
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Add to Bag
                          </>
                        )}
                      </button>

                      <button 
                        onClick={() => onQuickView(product)}
                        className="btn btn-sm btn-secondary"
                        aria-label="Inspect set details"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prototype Transparency Notice */}
        <div style={{
          marginTop: '44px',
          padding: '16px 20px',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: '#64748b'
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#f59e0b',
            flexShrink: 0
          }} />
          <span>
            <strong>Demonstration Showcase:</strong> These construction-toy models, piece counts, and prices are concept presentations created for Phase 1 preview. Not currently available for retail sale.
          </span>
        </div>
      </div>

      <style>{`
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 30px -4px rgba(15, 23, 42, 0.1);
          border-color: #cbd5e1;
        }
        .product-card:hover .product-img {
          transform: scale(1.04);
        }
        .product-title:hover {
          color: #2563eb;
        }
        .product-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          backdrop-filter: blur(2px);
          transition: opacity 200ms ease;
        }
        .product-card:hover .product-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
