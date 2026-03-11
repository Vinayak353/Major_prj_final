import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const GST_RATE = 0.18;

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const { toasts, success } = useToast();

  const subtotal = getTotal();
  const tax      = subtotal * GST_RATE;
  const total    = subtotal + tax;

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login, then come back to checkout
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="empty-state" style={{ minHeight: 'calc(100vh - 240px)' }}>
          <div style={{ fontSize: '5rem' }}>🛒</div>
          <h3>Your Cart is Empty</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Add some parts to get started!</p>
          <Link to="/products" className="btn btn-primary">Browse Parts</Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <ToastContainer toasts={toasts} />
      <div style={{ paddingTop: 68 }}>

        {/* Header */}
        <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
          <div className="container">
            <h2>SHOPPING <span style={{ color: 'var(--orange)' }}>CART</span></h2>
            <p style={{ color: 'var(--muted)', marginTop: 4 }}>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        <div className="container" style={{ padding: '44px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36, alignItems: 'start' }}>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.id} className="card" style={{ padding: '20px', display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{
                    width: 84, height: 84, flexShrink: 0,
                    background: 'var(--surface2)', borderRadius: 'var(--radius)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem', color: 'var(--border)',
                  }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius)' }} /> : '⚙'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--orange)', marginBottom: 4 }}>{item.brand}</div>
                    <Link to={`/products/${item.id}`} style={{ fontWeight: 700, color: 'var(--white)', fontSize: '1.05rem', textDecoration: 'none' }}>{item.name}</Link>
                    {item.modelCompatibility && <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 4 }}>{item.modelCompatibility}</div>}
                  </div>

                  <div className="qty-input">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 110 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)' }}>
                      ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>₹{Number(item.price).toLocaleString('en-IN')} each</div>
                  </div>

                  <button onClick={() => { removeFromCart(item.id); success('Item removed'); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1.2rem', padding: 8 }}>✕</button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 12 }}>
                <Link to="/products" className="btn btn-ghost btn-sm">← Continue Shopping</Link>
                <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: 'var(--danger)' }}>Clear Cart</button>
              </div>
            </div>

            {/* Summary */}
            <div className="card" style={{ padding: 32, position: 'sticky', top: 88 }}>
              <h4 style={{ marginBottom: 28, fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>ORDER SUMMARY</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {[
                  ['Subtotal', `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
                  [`GST (18%)`, `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
                  ['Shipping', 'FREE'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '1rem' }}>{label}</span>
                    <span style={{ color: label === 'Shipping' ? 'var(--success)' : 'var(--text)', fontWeight: 600, fontSize: '1rem' }}>{val}</span>
                  </div>
                ))}
              </div>

              <hr className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
                <span style={{ fontWeight: 700, color: 'var(--white)', fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--orange)' }}>
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button className="btn btn-primary btn-full" onClick={handleCheckout} style={{ fontSize: '1.05rem', height: 52 }}>
                {user ? 'Proceed to Checkout →' : 'Login to Checkout →'}
              </button>

              {/* Show login nudge if not logged in */}
              {!user && (
                <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.9rem', color: 'var(--muted)' }}>
                  <Link to="/login" state={{ from: { pathname: '/checkout' } }} style={{ color: 'var(--orange)' }}>Sign in</Link>
                  {' '}or{' '}
                  <Link to="/register" style={{ color: 'var(--orange)' }}>create an account</Link>
                  {' '}to place your order
                </p>
              )}

              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                {['UPI', 'VISA', 'Mastercard', 'Wallet'].map(p => (
                  <span key={p} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 3, color: 'var(--muted)' }}>{p}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;