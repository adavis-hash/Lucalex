'use client';

import React, { useState } from 'react';
import { Package, Layers } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export interface AdminOrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  user_id: string;
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
  order_items: AdminOrderItem[];
}

interface AdminOrderManagerProps {
  initialOrders: AdminOrder[];
}

export default function AdminOrderManager({ initialOrders }: AdminOrderManagerProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateMsg, setUpdateMsg] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  const handleUpdateStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    setUpdatingId(orderId);
    setUpdateMsg(null);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        setUpdateMsg({ id: orderId, msg: error.message, type: 'error' });
      } else {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setUpdateMsg({ id: orderId, msg: `Status updated to ${newStatus}`, type: 'success' });
        setTimeout(() => setUpdateMsg(null), 3000);
      }
    } catch {
      setUpdateMsg({ id: orderId, msg: 'Update failed', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

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
        return { label: 'Pending', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        backgroundColor: '#ffffff',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => {
          const isSelected = statusFilter === tab;
          const count = tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                color: isSelected ? '#1e40af' : '#64748b',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textTransform: 'capitalize'
              }}
            >
              <span>{tab}</span>
              <span style={{
                backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                color: isSelected ? '#ffffff' : '#475569',
                fontSize: '0.6875rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '9999px'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '40px',
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <Package size={36} style={{ margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 600, color: '#475569' }}>No orders found matching filter &quot;{statusFilter}&quot;</p>
        </div>
      ) : (
        filteredOrders.map((order) => {
          const badge = getStatusBadge(order.status);
          const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={order.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}
            >
              {/* Header */}
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '14px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    backgroundColor: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}>
                    {badge.label}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                    #{order.id.slice(0, 8)}...{order.id.slice(-4)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>• {orderDate}</span>
                </div>

                {/* Status Switcher Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Change status:</span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as AdminOrder['status'])}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Status Message */}
              {updateMsg && updateMsg.id === order.id && (
                <div style={{
                  padding: '8px 20px',
                  backgroundColor: updateMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: updateMsg.type === 'success' ? '#15803d' : '#991b1b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  {updateMsg.msg}
                </div>
              )}

              {/* Body */}
              <div style={{ padding: '18px 20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px'
                }}>
                  {/* Products purchased */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Ordered Concept Sets ({order.order_items.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {order.order_items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>
                            {item.quantity}× {item.product_name}
                          </span>
                          <span style={{ color: '#64748b' }}>
                            ${(item.quantity * Number(item.unit_price)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer and shipping */}
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Customer & Shipping Details
                    </div>
                    {order.shipping_address ? (
                      <div style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.45 }}>
                        <strong>{order.shipping_address.fullName}</strong><br />
                        {order.shipping_address.street}<br />
                        {order.shipping_address.postalCode} {order.shipping_address.city}, {order.shipping_address.country}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>User ID: {order.user_id}</div>
                    )}
                  </div>

                  {/* Totals */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                      <Layers size={13} color="#2563eb" /> {order.total_pieces.toLocaleString()} pieces
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                      ${Number(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
