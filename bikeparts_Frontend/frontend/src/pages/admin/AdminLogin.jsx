import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const AdminLogin = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { adminLogin }        = useAuth();
  const navigate              = useNavigate();
  const { toasts, error }     = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('=== ADMIN LOGIN ATTEMPT ===');
    console.log('Email:', form.email);
    try {
      const userObj = await adminLogin(form.email, form.password);
      console.log('=== LOGIN RESPONSE userObj ===', userObj);
      console.log('Role:', userObj?.role);
      console.log('localStorage token:', localStorage.getItem('token'));
      console.log('localStorage user:', localStorage.getItem('user'));

      if (!userObj || userObj.role !== 'ADMIN') {
        console.log('FAILED role check — role was:', userObj?.role);
        error('Access denied. Admin account required.');
        return;
      }
      console.log('SUCCESS — navigating to /admin');
      navigate('/admin', { replace: true });
    } catch (err) {
      console.log('=== LOGIN ERROR ===', err);
      console.log('Status:', err.response?.status);
      console.log('Response data:', err.response?.data);
      error(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <ToastContainer toasts={toasts} />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,107,26,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,107,26,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input type="email" className="form-control" placeholder="admin@motoparts.in"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Admin password"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
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
