import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const GST_RATE = 0.18;

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

const Field = ({ label, name, type = 'text', placeholder = '', form, set }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
    <label
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'var(--muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {label}
    </label>
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      value={form[name]}
      onChange={(e) => set(name, e.target.value)}
    />
  </div>
);

const Checkout = () => {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = getTotal
    ? getTotal()
    : (items || []).reduce((s, i) => s + Number(i.price) * i.quantity, 0);

  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrorMsg('');
  };

  const validate = () => {
    if (!form.fullName.trim()) {
      setErrorMsg('Full name is required');
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setErrorMsg('Enter a valid 10-digit phone number');
      return false;
    }
    if (!form.address.trim()) {
      setErrorMsg('Address is required');
      return false;
    }
    if (!form.city.trim()) {
      setErrorMsg('City is required');
      return false;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setErrorMsg('Enter a valid 6-digit PIN code');
      return false;
    }
    if (!items || items.length === 0) {
      setErrorMsg('Your cart is empty');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrorMsg('');

    const shippingAddress =
      `${form.fullName}\n${form.address}\n${form.city}, ${form.state} - ${form.pincode}\nPhone: ${form.phone}`;

    try {
      const res = await api.post('/orders', {
        shippingAddress,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });

      const { orderId } = res.data;
      clearCart();
      navigate('/order-success', { state: { orderId } });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to place order. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p style={{ color: 'var(--muted)', margin: '12px 0 28px' }}>
            Add some parts before checking out.
          </p>
          <a href="/products" className="btn btn-primary">Browse Parts</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div
          style={{
            background: 'var(--dark)',
            borderBottom: '1px solid var(--border)',
            padding: '28px 0',
          }}
        >
          <div className="container">
            <h2>
              CHECK<span style={{ color: 'var(--orange)' }}>OUT</span>
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: 4 }}>
              Cash on Delivery · Free Shipping
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '44px 28px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: 36,
              alignItems: 'start',
            }}
          >
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div
                  style={{
                    width: 3,
                    height: 28,
                    background: 'var(--orange)',
                    flexShrink: 0,
                  }}
                />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>
                  SHIPPING ADDRESS
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* <Field
                  label="Full Name *"
                  name="fullName"
                  placeholder="As on ID"
                  form={form}
                  set={set}
                /> */}
                <Field
                  label="Phone Number *"
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile"
                  form={form}
                  set={set}
                />
              </div>

              <Field
                label="Address Line *"
                name="address"
                placeholder="House No., Street, Locality"
                form={form}
                set={set}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 16 }}>
                <Field
                  label="City / Town *"
                  name="city"
                  placeholder="e.g. Solapur"
                  form={form}
                  set={set}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    State
                  </label>
                  <select
                    className="form-control"
                    value={form.state}
                    onChange={(e) => set('state', e.target.value)}
                  >
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <Field
                  label="PIN Code *"
                  name="pincode"
                  placeholder="6 digits"
                  form={form}
                  set={set}
                />
              </div>

              {errorMsg && (
                <div
                  style={{
                    marginTop: 16,
                    padding: '14px 18px',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    borderLeft: '4px solid #EF4444',
                    borderRadius: 'var(--radius)',
                    color: '#FCA5A5',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-line',
                  }}
                >
                  <strong style={{ color: '#F87171', display: 'block', marginBottom: 4 }}>
                    ⚠ Error
                  </strong>
                  {errorMsg}
                </div>
              )}

              <div
                style={{
                  marginTop: 24,
                  padding: '14px 18px',
                  background: 'rgba(34,197,94,0.06)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>💵</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--white)', fontSize: '0.9rem' }}>
                    Cash on Delivery
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                    Pay when your order arrives at your doorstep
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'sticky', top: 88 }}>
              <div className="card" style={{ padding: 28 }}>
                <h4
                  style={{
                    marginBottom: 20,
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                  }}
                >
                  ORDER SUMMARY
                </h4>

                <div
                  style={{
                    maxHeight: 260,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 4,
                            background: 'var(--surface2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden',
                          }}
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: '1.1rem' }}>⚙</span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                            ×{item.quantity}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--white)',
                          flexShrink: 0,
                        }}
                      >
                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid var(--border)',
                    margin: '0 0 14px',
                  }}
                />

                {[
                  ['Subtotal', `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
                  ['GST (18%)', `₹${gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`],
                  ['Shipping', 'FREE'],
                  ['Payment', 'Cash on Delivery'],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}
                  >
                    <span style={{ color: 'var(--muted)' }}>{label}</span>
                    <span
                      style={{
                        color:
                          label === 'Shipping'
                            ? 'var(--success)'
                            : label === 'Payment'
                            ? '#86EFAC'
                            : 'var(--text)',
                        fontWeight: 600,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid var(--border)',
                    margin: '8px 0 16px',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 24,
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--white)', fontSize: '1.05rem' }}>
                    Total
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.9rem',
                      color: 'var(--orange)',
                    }}
                  >
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  className="btn btn-primary btn-full"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  style={{ height: 54, fontSize: '1.05rem' }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Placing Order…
                    </>
                  ) : (
                    '📦 Place Order (COD)'
                  )}
                </button>

                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    color: 'var(--muted)',
                    marginTop: 12,
                  }}
                >
                  By placing the order you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;