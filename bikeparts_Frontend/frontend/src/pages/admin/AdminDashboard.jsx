import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

// ── Bar Chart ─────────────────────────────────────────────────────────────────
const BarChart = ({ data = [], color = 'var(--orange)', prefix = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        No data yet
      </div>
    );
  }
  const max = Math.max(...data.map(d => Number(d.value) || 0), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, padding: '0 4px' }}>
      {data.map((d, i) => {
        const val = Number(d.value) || 0;
        const heightPct = Math.max((val / max) * 100, 2);
        const display = val >= 100000
          ? `${(val / 100000).toFixed(1)}L`
          : val >= 1000
            ? `${(val / 1000).toFixed(0)}k`
            : val;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
              {prefix}{display}
            </div>
            <div style={{
              width: '100%',
              background: color,
              height: `${heightPct}%`,
              borderRadius: '2px 2px 0 0',
              opacity: 0.55 + (i / Math.max(data.length - 1, 1)) * 0.45,
              transition: 'height 0.5s ease',
              minHeight: 3,
            }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%' }}>
              {d.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  PENDING:   { bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.35)',  text: '#FB923C' },
  CONFIRMED: { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)',  text: '#60A5FA' },
  SHIPPED:   { bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.35)',  text: '#C084FC' },
  DELIVERED: { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)',   text: '#4ADE80' },
  CANCELLED: { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)',   text: '#F87171' },
};

const Badge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.PENDING;
  return (
    <span style={{
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      padding: '2px 10px', borderRadius: 20,
      fontFamily: 'var(--font-mono)', fontSize: '0.67rem', fontWeight: 700,
      textTransform: 'uppercase',
    }}>{status}</span>
  );
};

// ── Skeleton loader ───────────────────────────────────────────────────────────
const Skeleton = ({ w = '100%', h = 16, mb = 0 }) => (
  <div style={{ width: w, height: h, background: 'var(--border)', borderRadius: 4, marginBottom: mb, opacity: 0.6 }} />
);

// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats,          setStats]         = useState(null);
  const [recentOrders,   setRecentOrders]  = useState([]);
  const [statsLoading,   setStatsLoading]  = useState(true);
  const [ordersLoading,  setOrdersLoading] = useState(true);
  const [statsError,     setStatsError]    = useState('');
  const [ordersError,    setOrdersError]   = useState('');

  // ── Fetch /api/admin/stats ─────────────────────────────────────────────────
  useEffect(() => {
    api.get('/admin/stats')
      .then(r => {
        console.log('Stats response:', r.data);
        setStats(r.data);
      })
      .catch(err => {
        console.error('Stats error:', err.response?.data || err.message);
        setStatsError(err.response?.data?.message || 'Failed to load stats');
      })
      .finally(() => setStatsLoading(false));
  }, []);

  // ── Fetch /api/admin/orders ────────────────────────────────────────────────
  useEffect(() => {
    api.get('/admin/orders')
      .then(r => {
        const all = Array.isArray(r.data) ? r.data : [];
        setRecentOrders(all.slice(0, 5));
      })
      .catch(err => {
        console.error('Orders error:', err.response?.data || err.message);
        setOrdersError(err.response?.data?.message || 'Failed to load orders');
      })
      .finally(() => setOrdersLoading(false));
  }, []);

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const fmtRevenue = (val) => {
    const n = Number(val);
    if (isNaN(n)) return '₹0';
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const statCards = stats ? [
    {
      label: 'TOTAL REVENUE',
      value: fmtRevenue(stats.totalRevenue),
      sub:   'All time (excl. cancelled)',
      color: 'var(--orange)',
    },
    {
      label: 'TOTAL ORDERS',
      value: String(stats.totalOrders ?? 0),
      sub:   `${stats.pendingOrders ?? 0} pending`,
      color: '#60A5FA',
    },
    {
      label: 'PRODUCTS',
      value: String(stats.totalProducts ?? 0),
      sub:   `${stats.lowStock ?? 0} low stock`,
      color: '#4ADE80',
    },
    {
      label: 'CUSTOMERS',
      value: String(stats.totalUsers ?? 0),
      sub:   'Registered users',
      color: '#C084FC',
    },
  ] : [];

  // ── Chart data from stats ──────────────────────────────────────────────────
  const monthlyChartData = (stats?.monthlyRevenue || []).map(row => ({
    label: row.month || '',
    value: Number(row.revenue) || 0,
  }));

  const statusChartData = (stats?.statusDistribution || [])
    .filter(row => Number(row.count) > 0)
    .map(row => ({
      label: (row.status || '').slice(0, 4),
      value: Number(row.count) || 0,
    }));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="DASHBOARD" subtitle="Overview of your store performance">

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      {statsError && (
        <div style={{ padding: '14px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', marginBottom: 24, color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
          ⚠ Stats error: {statsError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
        {statsLoading
          ? [1,2,3,4].map(i => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <Skeleton w="55%" h={10} mb={14} />
                <Skeleton w="75%" h={32} mb={10} />
                <Skeleton w="45%" h={10} />
              </div>
            ))
          : statCards.map(card => (
              <div key={card.label} className="card" style={{ padding: '22px 24px', borderLeft: `3px solid ${card.color}` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 10 }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: card.color, fontWeight: 700, lineHeight: 1.1, wordBreak: 'break-word' }}>
                  {card.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', marginTop: 8 }}>
                  {card.sub}
                </div>
              </div>
            ))
        }
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ padding: '22px 24px' }}>
          <h4 style={{ marginBottom: 20, fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.05em' }}>
            MONTHLY REVENUE
          </h4>
          {statsLoading
            ? <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>Loading…</div>
            : <BarChart data={monthlyChartData} color="var(--orange)" prefix="₹" />
          }
        </div>
        <div className="card" style={{ padding: '22px 24px' }}>
          <h4 style={{ marginBottom: 20, fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.05em' }}>
            SALES BY STATUS
          </h4>
          {statsLoading
            ? <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>Loading…</div>
            : <BarChart data={statusChartData} color="#60A5FA" />
          }
        </div>
      </div>

      {/* ── Recent Orders Table ─────────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.05em' }}>RECENT ORDERS</h4>
          <Link to="/admin/orders" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--orange)', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {ordersError && (
          <div style={{ padding: '16px 24px', color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
            ⚠ {ordersError}
          </div>
        )}

        {ordersLoading ? (
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1,2,3].map(i => <Skeleton key={i} h={20} />)}
          </div>
        ) : recentOrders.length === 0 && !ordersError ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📦</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              No orders yet. Place a test order to see it here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Order ID', 'Customer', 'Amount', 'Mode', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.63rem', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', color: 'var(--orange)', fontWeight: 700 }}>
                      #{order.id}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--white)', fontSize: '0.9rem' }}>
                        {order.user?.name || '—'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                        {order.user?.email || ''}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-display)', color: 'var(--white)', fontWeight: 700 }}>
                      ₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#86EFAC' }}>
                      {order.paymentMode || 'COD'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge status={order.status} />
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.73rem', whiteSpace: 'nowrap' }}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </AdminLayout>
  );
};


export default AdminDashboard;