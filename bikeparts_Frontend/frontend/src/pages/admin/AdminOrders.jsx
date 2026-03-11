import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS = {
  PENDING:   { bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)',  text: '#FB923C' },
  CONFIRMED: { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  text: '#60A5FA' },
  SHIPPED:   { bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)',  text: '#C084FC' },
  DELIVERED: { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   text: '#4ADE80' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#F87171' },
};

const Badge = ({ status }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: '3px 10px', borderRadius: 20,
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {status}
    </span>
  );
};

const AdminOrders = () => {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [expanded,   setExpanded]   = useState(null);
  const [updating,   setUpdating]   = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchText,   setSearchText]   = useState('');

  const fetchOrders = () => {
    setLoading(true);
    api.get('/admin/orders')
      .then(r => setOrders(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      // Update in-place so UI doesn't flash
      setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  // Filter by status and search (order id or customer name/email)
  const filtered = orders.filter(o => {
    const matchStatus = filterStatus ? o.status === filterStatus : true;
    const q = searchText.toLowerCase();
    const matchSearch = !q ||
      String(o.id).includes(q) ||
      (o.user?.name  || '').toLowerCase().includes(q) ||
      (o.user?.email || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Order ID or customer…"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 1, minWidth: 220, maxWidth: 340 }}
        />
        <select
          className="form-control"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={fetchOrders} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
          ↺ Refresh
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--muted)' }}>Loading orders…</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: '#F87171', marginBottom: 16 }}>{error}</p>
          <button onClick={fetchOrders} className="btn btn-outline">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
          <p style={{ color: 'var(--muted)' }}>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(order => (
            <div key={order.id} className="card" style={{ overflow: 'hidden' }}>

              {/* Row header */}
              <div
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
              >
                {/* Order ID */}
                <div style={{ minWidth: 70 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Order</div>
                  <div style={{ fontWeight: 700, color: 'var(--white)' }}>#{order.id}</div>
                </div>

                {/* Customer */}
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Customer</div>
                  <div style={{ fontWeight: 600, color: 'var(--white)', fontSize: '0.9rem' }}>{order.user?.name || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{order.user?.email || ''}</div>
                </div>

                {/* Date */}
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Date</div>
                  <div style={{ color: 'var(--text)', fontSize: '0.85rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* Items count */}
                <div style={{ minWidth: 60, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Items</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{(order.items || []).length}</div>
                </div>

                {/* Total */}
                <div style={{ minWidth: 110, textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Total</div>
                  <div style={{ fontFamily: 'var(--font-display)', color: 'var(--orange)', fontWeight: 700 }}>
                    ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Status badge */}
                <Badge status={order.status} />

                {/* Expand icon */}
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem', marginLeft: 'auto' }}>
                  {expanded === order.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded section */}
              {expanded === order.id && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '20px' }}>

                  {/* Status change */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                      Update Status:
                    </span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          onClick={e => { e.stopPropagation(); handleStatusChange(order.id, s); }}
                          disabled={order.status === s || updating === order.id}
                          style={{
                            background: order.status === s ? STATUS_COLORS[s]?.bg : 'var(--surface2)',
                            border: `1px solid ${order.status === s ? STATUS_COLORS[s]?.border : 'var(--border)'}`,
                            color: order.status === s ? STATUS_COLORS[s]?.text : 'var(--muted)',
                            padding: '5px 12px', borderRadius: 'var(--radius)',
                            cursor: order.status === s ? 'default' : 'pointer',
                            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                            fontWeight: order.status === s ? 700 : 400,
                            opacity: updating === order.id ? 0.6 : 1,
                            transition: 'all 0.15s',
                          }}
                        >
                          {updating === order.id && order.status !== s ? '…' : s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Items list */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                        Items
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(order.items || []).map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 3, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                {item.product?.imageUrl
                                  ? <img src={item.product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                  : '⚙'}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)' }}>{item.product?.name || 'Product'}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>×{item.quantity} · ₹{Number(item.unitPrice).toLocaleString('en-IN')}</div>
                              </div>
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.85rem' }}>
                              ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping + order meta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {order.shippingAddress && (
                        <div style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Shipping To</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{order.shippingAddress}</div>
                        </div>
                      )}

                      <div style={{ padding: '12px 14px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Order Info</div>
                        {[
                          ['Payment Mode', order.paymentMode || 'COD'],
                          ['Total Amount', `₹${Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
                          ['Placed On', new Date(order.createdAt).toLocaleString('en-IN')],
                          ['Last Updated', new Date(order.updatedAt).toLocaleString('en-IN')],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{k}</span>
                            <span style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;