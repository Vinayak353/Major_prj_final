import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import api from '../../services/api';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const orderId = location.state?.orderId;

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    api.get(`/orders/${orderId}`)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <div style={{ paddingTop: 68, maxWidth: 640, margin: '0 auto', padding: '80px 24px' }}>

        {/* Success hero */}
        <div className="card" style={{ padding: '48px 40px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            ORDER <span style={{ color: 'var(--orange)' }}>PLACED!</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 6 }}>
            Your order has been placed successfully.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Order ID: <strong style={{ color: 'var(--white)' }}>#{orderId}</strong>
          </p>

          {/* COD reminder */}
          <div style={{ marginTop: 24, padding: '14px 18px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.5rem' }}>💵</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#86EFAC', fontSize: '0.9rem' }}>Cash on Delivery</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Keep cash ready when your order arrives</div>
            </div>
          </div>
        </div>

        {/* Order details card */}
        {order && (
          <div className="card" style={{ padding: 28, marginBottom: 24 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>ORDER DETAILS</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                ['Status',      order.status],
                ['Payment',     order.paymentMode || 'COD'],
                ['Total',       `₹${Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
                ['Date',        new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
              ].map(([label, val]) => (
                <div key={label} style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontWeight: 700, color: label === 'Status' ? 'var(--orange)' : 'var(--white)', fontSize: '0.9rem' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(order.items || []).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {item.product?.imageUrl
                        ? <img src={item.product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                        : <span>⚙</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)' }}>{item.product?.name || 'Product'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>×{item.quantity} · ₹{Number(item.unitPrice).toLocaleString('en-IN')}/pc</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>
                    ₹{(Number(item.unitPrice) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping */}
            {order.shippingAddress && (
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Shipping To</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{order.shippingAddress}</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/orders" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
            📋 My Orders
          </Link>
          <Link to="/products" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
            🛒 Continue Shopping
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccess;