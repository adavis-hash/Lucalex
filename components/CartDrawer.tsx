'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Layers, CheckCircle2, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, cartCount, totalPieces, subtotal, removeFromCart, clearCart, checkout } = useCart();
  const { user, profile, openAuthModal } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: profile?.full_name || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCheckout = () => {
    if (!user) {
      openAuthModal('signin');
      return;
    }
    setOrderError(null);
    setCheckoutStep('shipping');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    setIsSubmitting(true);

    try {
      const res = await checkout(shippingAddress);
      if (res.error) {
        setOrderError(res.error);
      } else if (res.orderId) {
        setConfirmedOrderId(res.orderId);
        setCheckoutStep('success');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCheckoutStep('cart');
    setConfirmedOrderId(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleResetAndClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '460px',
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
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
              {checkoutStep === 'cart' && `Shopping Bag (${cartCount})`}
              {checkoutStep === 'shipping' && 'Shipping Details'}
              {checkoutStep === 'success' && 'Order Confirmed'}
            </h3>
          </div>

          <button 
            onClick={handleResetAndClose}
            aria-label="Close cart"
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
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

        {/* Security Trust Badge */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '10px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: '#475569'
        }}>
          <ShieldCheck size={16} color="#059669" />
          <span>Server-verified prices & real-time stock allocation</span>
        </div>

        {/* Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* STEP 1: CART ITEMS LIST */}
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
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
                  <p style={{ fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Your shopping bag is empty</p>
                  <p style={{ fontSize: '0.8125rem' }}>Browse the MODULO catalog to add architectural sets.</p>
                </div>
              ) : (
                cartItems.map((item) => (
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
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          style={{
                            color: '#94a3b8',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'color 150ms ease',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
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
            </>
          )}

          {/* STEP 2: SHIPPING ADDRESS FORM */}
          {checkoutStep === 'shipping' && (
            <form id="checkout-form" onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', marginBottom: '4px' }}>
                <MapPin size={18} color="#2563eb" />
                <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Delivery Information</span>
              </div>

              {orderError && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{orderError}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  placeholder="e.g. Alex Davis"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Street Address
                </label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  placeholder="e.g. 14 Rue de la Paix"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    City
                  </label>
                  <input 
                    type="text" 
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="e.g. Paris"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Postal Code
                  </label>
                  <input 
                    type="text" 
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    placeholder="e.g. 75001"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Country
                </label>
                <input 
                  type="text" 
                  required
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', color: '#1e40af', marginTop: '6px' }}>
                <strong>Zero-Payment Prototype:</strong> Placing this order will atomically invoke the secure Supabase function <code>create_order</code>, deducting product stock and registering the order under your account.
              </div>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {checkoutStep === 'success' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '20px 0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                Order Successfully Placed!
              </h4>

              <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '320px', lineHeight: 1.5, marginBottom: '20px' }}>
                Your order has been recorded in Supabase. The warehouse module has begun assembling your custom MODULO package.
              </p>

              {confirmedOrderId && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  fontSize: '0.8125rem',
                  color: '#334155',
                  marginBottom: '24px',
                  width: '100%'
                }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Order Reference ID</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb', fontSize: '0.875rem', marginTop: '2px', wordBreak: 'break-all' }}>
                    {confirmedOrderId}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <Link
                  href="/orders"
                  onClick={handleResetAndClose}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  View My Order History
                </Link>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary (for step 'cart' and 'shipping') */}
        {checkoutStep !== 'success' && cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8125rem', color: '#64748b' }}>
              <span>Total Architectural Pieces</span>
              <strong style={{ color: '#0f172a' }}>{totalPieces.toLocaleString()} pcs</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              <span>Order Subtotal</span>
              <span style={{ fontFamily: "var(--font-space), 'Space Grotesk', sans-serif", fontSize: '1.25rem', color: '#2563eb' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {checkoutStep === 'cart' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={handleStartCheckout}
                  className="btn btn-primary"
                  style={{ width: '100%', fontWeight: 700, padding: '12px' }}
                >
                  {user ? 'Proceed to Delivery Details' : 'Sign In to Place Order'} <ArrowRight size={16} />
                </button>

                <button 
                  onClick={clearCart}
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    textAlign: 'center',
                    padding: '6px',
                    textDecoration: 'underline',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Empty bag
                </button>
              </div>
            )}

            {checkoutStep === 'shipping' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, fontWeight: 700, padding: '12px', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Validating Order...' : 'Confirm & Place Order'} <ShieldCheck size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
