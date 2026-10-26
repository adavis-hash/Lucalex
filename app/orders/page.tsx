'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar, MapPin, Layers, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';

interface OrderItemRow {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
}

interface OrderRow {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  total_pieces: number;
  shipping_address: {
    fullName?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  } | null;
  created_at: string;
  order_items: OrderItemRow[];
}

export default function OrdersPage() {
  const { user, openAuthModal, loading: authLoading } = useAuth();
  const { cartOpen, setCartOpen } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }

      try {
        setLoadingOrders(true);
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            status,
            total_amount,
            total_pieces,
            shipping_address,
            created_at,
            order_items (
              id,
              product_id,
              product_name,
              unit_price,
              quantity
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data as unknown as OrderRow[]);
        }
      } catch (err) {
        console.warn('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading, supabase]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
      case 'shipped':
        return { label: 'Shipped', bg: '#e0e7ff', color: '#4338ca', border: '#c7d2fe' };
      case 'processing':
        return { label: 'Processing', bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'cancelled':
        return { label: 'Cancelled', bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' };
      case 'pending':
      default:
        return { label: 'Pending Production', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="container section-padding" style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb & Navigation */}
        <div style={{ marginBottom: '28px' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#64748b', 
              fontSize: '0.875rem', 
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            color: '#0f172a', 
            marginTop: '12px',
            fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" 
          }}>
            Order History & Builds
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '4px' }}>
            Review your authenticated MODULO orders, shipping allocations, and architectural set fulfillment.
          </p>
        </div>

        {/* Unauthenticated State */}
        {!authLoading && !user && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Package size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Sign In to View Your Orders
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto 20px' }}>
              Your order history is securely tied to your MODULO account and protected by Row Level Security.
            </p>
            <button
              onClick={() => openAuthModal('signin')}
              className="btn btn-primary"
              style={{ padding: '12px 28px' }}
            >
              Sign In to Account
            </button>
          </div>
        )}

        {/* Loading State */}
        {(authLoading || loadingOrders) && user && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 0',
            color: '#64748b'
          }}>
            <Clock size={32} className="animate-spin" style={{ color: '#2563eb', marginBottom: '12px' }} />
            <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Loading your authenticated orders...</p>
          </div>
        )}

        {/* Empty Orders State */}
        {!loadingOrders && user && orders.length === 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <Package size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              No Orders Placed Yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto 20px' }}>
              You haven&apos;t placed any orders yet. Explore our curated collections and place your first build reservation.
            </p>
            <Link href="/#featured-sets" className="btn btn-primary">
              Explore Available Sets
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loadingOrders && user && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={order.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Order Card Top Bar */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '16px 24px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Order Ref
                      </div>
                      <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                        #{order.id.slice(0, 8)}...{order.id.slice(-4)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#475569' }}>
                      <Calendar size={15} color="#64748b" /> {orderDate}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        textTransform: 'uppercase'
                      }}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div style={{ padding: '24px' }}>
                    {/* Line Items Table */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {order.order_items.map((item) => (
                        <div 
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '10px',
                            border: '1px solid #f1f5f9'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a' }}>
                              {item.product_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                              Quantity: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                            </div>
                          </div>

                          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                            ${(item.quantity * Number(item.unit_price)).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Metrics and Shipping Info */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      {/* Shipping Info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                          <MapPin size={14} color="#2563eb" /> Delivery Address
                        </div>
                        {order.shipping_address ? (
                          <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.45 }}>
                            <strong>{order.shipping_address.fullName}</strong><br />
                            {order.shipping_address.street}<br />
                            {order.shipping_address.postalCode} {order.shipping_address.city}, {order.shipping_address.country}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Standard Digital Fulfillment</div>
                        )}
                      </div>

                      {/* Summary Metrics */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#64748b', marginBottom: '4px' }}>
                          <Layers size={14} color="#2563eb" />
                          <span>Total Pieces: <strong>{order.total_pieces.toLocaleString()} pcs</strong></span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                          Total: <span style={{ color: '#2563eb' }}>${Number(order.total_amount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelectProduct={() => {}} />
    </div>
  );
}
