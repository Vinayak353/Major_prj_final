import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const AdminLogin = () => {
  const [form, setForm]                 = useState({ email: '', password: '' });
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin }                  = useAuth();
  const navigate                        = useNavigate();
  const { toasts, error }               = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      error('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const userObj = await adminLogin(form.email, form.password);
      if (!userObj || userObj.role !== 'ADMIN') {
        error('Access denied. Admin account required.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      error(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <ToastContainer toasts={toasts} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(rgba(255,107,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
            MOTO<span style={{ color: 'var(--orange)' }}>PARTS</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 6 }}>
            Admin Portal
          </div>
        </div>
        <div className="card" style={{ padding: 40, borderColor: 'var(--orange)', boxShadow: '0 0 40px rgba(255,107,26,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 3, height: 28, background: 'var(--orange)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>ADMIN SIGN IN</h3>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email" className="form-control" placeholder="admin@motoparts.in"
                autoComplete="new-password"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} className="form-control"
                  placeholder="Admin password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingRight: 42 }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ height: 48, marginTop: 8 }}>
              {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Authenticating...</> : 'ACCESS ADMIN PANEL'}
            </button>
          </form>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/login" style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>← Customer Login</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;