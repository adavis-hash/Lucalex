import React from 'react';
import Link from 'next/link';
import { ArrowLeft, DollarSign, ShoppingBag, Layers, AlertTriangle, ShieldCheck, Box, UserCheck, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import AdminOrderManager, { AdminOrder } from '@/components/AdminOrderManager';

export const metadata = {
  title: 'MODULO — Admin Command Center & KPIs',
  description: 'Protected server-side administrator dashboard for MODULO modular systems.',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is not authenticated
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          border: '1px solid #334155',
          padding: '40px',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>
            Admin Authentication Required
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '24px' }}>
            This command dashboard is protected server-side. Please sign in to an authenticated account with administrator privileges.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              Sign In from Storefront
            </Link>
            <Link href="/" style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '4px' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Verify role in profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = profile?.role === 'admin';

  // If authenticated but not admin
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          border: '1px solid #334155',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(248, 113, 113, 0.3)'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '10px' }}>
            Access Restricted (RBAC)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px' }}>
            You are signed in as <strong style={{ color: '#f8fafc' }}>{user.email}</strong>, but your assigned role is <span style={{ color: '#fbbf24', fontWeight: 700 }}>{profile?.role || 'customer'}</span>.
          </p>
          <div style={{
            backgroundColor: '#0f172a',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid #334155',
            textAlign: 'left',
            fontSize: '0.75rem',
            color: '#cbd5e1',
            fontFamily: 'monospace',
            marginBottom: '24px'
          }}>
            -- To promote this user in Supabase SQL Editor:<br />
            UPDATE public.profiles<br />
            SET role = &apos;admin&apos;<br />
            WHERE id = &apos;{user.id}&apos;;
          </div>
          <Link href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <ArrowLeft size={16} /> Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // Fetch Orders and Products for KPIs
  const [ordersRes, productsRes] = await Promise.all([
    supabase
      .from('orders')
      .select(`
        id,
        user_id,
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
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('*')
      .order('name')
  ]);

  const orders = (ordersRes.data || []) as unknown as AdminOrder[];
  const products = productsRes.data || [];

  // Calculate KPIs
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + Number(o.total_amount), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const totalPiecesSold = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.total_pieces || 0), 0);
  const aov = totalOrders > 0 ? totalRevenue / (totalOrders - orders.filter(o => o.status === 'cancelled').length || 1) : 0;
  const lowStockCount = products.filter(p => (p.stock ?? 0) < 25).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a' }}>
      {/* Top Admin Header */}
      <header style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderBottom: '1px solid #1e293b',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link 
              href="/" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#94a3b8',
                fontSize: '0.8125rem',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}
            >
              <ArrowLeft size={14} /> Storefront
            </Link>
            <div style={{ height: '20px', width: '1px', backgroundColor: '#334155' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  MODULO Command
                </span>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                  Operational Dashboard
                </h1>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8125rem',
              color: '#cbd5e1',
              backgroundColor: '#1e293b',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <UserCheck size={16} color="#38bdf8" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: '32px 24px', maxWidth: '1200px' }}>
        {/* KPI Overview Cards */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{
            fontSize: '0.875rem',
            fontWeight: 800,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px'
          }}>
            Real-Time Store Performance Metrics
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {/* KPI 1: Total Revenue */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>Gross Sales</span>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px', fontWeight: 600 }}>
                Across {totalOrders} recorded orders
              </div>
            </div>

            {/* KPI 2: Pending Orders */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>Pending Fulfillment</span>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706' }}>
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                {pendingOrders}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                {completedOrders} completed deliveries
              </div>
            </div>

            {/* KPI 3: Total Pieces Allocated */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>Pieces in Circulation</span>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                  <Layers size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                {totalPiecesSold.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                Avg {totalOrders > 0 ? Math.round(totalPiecesSold / (totalOrders || 1)).toLocaleString() : 0} pcs / order
              </div>
            </div>

            {/* KPI 4: Average Order Value */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>Average Order Value</span>
                <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669' }}>
                  <Box size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                ${aov.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.75rem', color: lowStockCount > 0 ? '#ea580c' : '#16a34a', marginTop: '4px', fontWeight: 600 }}>
                {lowStockCount > 0 ? `${lowStockCount} sets low on stock` : 'All sets healthy in inventory'}
              </div>
            </div>
          </div>
        </section>

        {/* Orders Management Section */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
                Orders Dispatch & Status Control
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
                Update order statuses directly. Restricted to administrator privileges via database RLS.
              </p>
            </div>
          </div>

          <AdminOrderManager initialOrders={orders} />
        </section>

        {/* Real-time Inventory Health Section */}
        <section>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "var(--font-space), 'Space Grotesk', sans-serif" }}>
              Warehouse Inventory Health
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '2px' }}>
              Real-time stock counts deducted atomically by the PostgreSQL <code>create_order</code> transaction.
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Set Number</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Model Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Universe</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Pieces</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Price</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700 }}>Stock Remaining</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const stock = p.stock ?? 0;
                  const isLow = stock < 25;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>
                        {p.set_number}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                        {p.name}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b' }}>
                        {p.collection_name || p.collection_id}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#475569' }}>
                        {p.pieces} pcs
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0f172a' }}>
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isLow ? '#fef2f2' : '#f0fdf4',
                          color: isLow ? '#b91c1c' : '#15803d',
                          border: `1px solid ${isLow ? '#fecaca' : '#bbf7d0'}`
                        }}>
                          {isLow && <AlertTriangle size={12} />}
                          {stock} units left
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
