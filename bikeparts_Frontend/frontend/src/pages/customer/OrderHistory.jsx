import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../services/api';

const STATUS_COLORS = {
  PENDING:   { bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)',  text: '#FB923C' },
  CONFIRMED: { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  text: '#60A5FA' },
  SHIPPED:   { bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)',  text: '#C084FC' },
  DELIVERED: { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   text: '#4ADE80' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#F87171' },
};

const PROGRESS = { PENDING: 1, CONFIRMED: 2, SHIPPED: 3, DELIVERED: 4, CANCELLED: 0 };

const StatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      padding: '3px 10px', borderRadius: 20,
      fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {status}
    </span>
  );
};

const ProgressBar = ({ status }) => {
  const step = PROGRESS[status] || 0;
  const steps = ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'];
  if (status === 'CANCELLED') return (
    <div style={{ padding: '10px 0', textAlign: 'center', color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
      ✕ Order Cancelled
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '14px 0 6px' }}>
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < step ? 'var(--orange)' : 'var(--surface2)',
              border: `2px solid ${i < step ? 'var(--orange)' : 'var(--border)'}`,
              color: i < step ? 'white' : 'var(--muted)',
              fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
              transition: 'all 0.3s',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <div style={{ marginTop: 6, fontSize: '0.65rem', color: i < step ? 'var(--orange)' : 'var(--muted)', fontFamily: 'var(--font-mono)', textAlign: 'center', whiteSpace: 'nowrap' }}>
              {label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 2, height: 2, background: i < step - 1 ? 'var(--orange)' : 'var(--border)', transition: 'background 0.3s', marginBottom: 22 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrderHistory = () => {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [expanded,   setExpanded]   = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders(); // refresh list from server
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>

        {/* Header */}
        <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
          <div className="container">
            <h2>MY <span style={{ color: 'var(--orange)' }}>ORDERS</span></h2>
            <p style={{ color: 'var(--muted)', marginTop: 4 }}>Track and manage your orders</p>
          </div>
        </div>

        <div className="container" style={{ padding: '40px 28px 80px', maxWidth: 860 }}>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--muted)' }}>Loading your orders…</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠</div>
              <p style={{ color: '#F87171', marginBottom: 20 }}>{error}</p>
              <button onClick={fetchOrders} className="btn btn-outline">Retry</button>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: 16 }}>📦</div>
              <h3 style={{ marginBottom: 8 }}>No orders yet</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 24 }}>You haven't placed any orders. Start shopping!</p>
              <Link to="/products" className="btn btn-primary">Browse Parts</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {orders.map(order => (
                <div key={order.id} className="card" style={{ overflow: 'hidden' }}>

                  {/* Order header — always visible */}
                  <div
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
                  >
                    <div style={{ display: 'flex', align: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase' }}>Order ID</div>
                        <div style={{ fontWeight: 700, color: 'var(--white)', fontSize: '1rem' }}>#{order.id}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase' }}>Date</div>
                        <div style={{ color: 'var(--text)', fontSize: '0.88rem' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase' }}>Total</div>
                        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--orange)', fontWeight: 700 }}>
                          ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2, textTransform: 'uppercase' }}>Payment</div>
                        <div style={{ color: '#86EFAC', fontSize: '0.85rem', fontWeight: 600 }}>{order.paymentMode || 'COD'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <StatusBadge status={order.status} />
                      <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                        {expanded === order.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expanded === order.id && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px' }}>

                      {/* Progress bar */}
                      <ProgressBar status={order.status} />

                      <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

                      {/* Items */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>
                          Items ({(order.items || []).length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(order.items || []).map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 4, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                  {item.product?.imageUrl
                                    ? <img src={item.product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                    : <span>⚙</span>}
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)' }}>{item.product?.name || 'Product'}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                    {item.product?.brand && `${item.product.brand} · `}
                                    ×{item.quantity} · ₹{Number(item.unitPrice).toLocaleString('en-IN')}/pc
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', fontWeight: 700 }}>
                                ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping address */}
                      {order.shippingAddress && (
                        <div style={{ marginBottom: 16, padding: '12px 14px', background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Shipping To</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{order.shippingAddress}</div>
                        </div>
                      )}

                      {/* Cancel button */}
                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                          className="btn btn-outline"
                          style={{ borderColor: '#EF4444', color: '#F87171', fontSize: '0.85rem' }}
                        >
                          {cancelling === order.id ? 'Cancelling…' : '✕ Cancel Order'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;