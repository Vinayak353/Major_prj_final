import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, success, error } = useToast();

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      success('Welcome back!');
      setTimeout(() => navigate(data.user?.role === 'ADMIN' ? '/admin' : from, { replace: true }), 800);
    } catch (err) {
      error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <ToastContainer toasts={toasts} />

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,107,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 40, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'var(--orange)', clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--black)' }}>⚙</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
            MOTO<span style={{ color: 'var(--orange)' }}>PARTS</span>
          </span>
        </Link>

        <div className="card" style={{ padding: 40 }}>
          <h3 style={{ marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>SIGN IN</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.9rem' }}>Welcome back. Enter your credentials.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" name="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                style={{ borderColor: errors.email ? 'var(--danger)' : undefined }}
              />
              {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" name="password"
                className="form-control"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                style={{ borderColor: errors.password ? 'var(--danger)' : undefined }}
              />
              {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8, height: 48 }}>
              {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Signing In...</> : 'SIGN IN'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 700 }}>Create one</Link>
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/admin/login" style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            Admin Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
