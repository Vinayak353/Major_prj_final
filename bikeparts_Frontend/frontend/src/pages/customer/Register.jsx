import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toasts, success, error } = useToast();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone) errs.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter valid 10-digit mobile number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      success('Account created! Welcome to MotoParts!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
    { name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '9876543210' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <ToastContainer toasts={toasts} />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,107,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 40, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'var(--orange)', clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--black)' }}>⚙</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
            MOTO<span style={{ color: 'var(--orange)' }}>PARTS</span>
          </span>
        </Link>

        <div className="card" style={{ padding: 40 }}>
          <h3 style={{ marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>CREATE ACCOUNT</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.9rem' }}>Join thousands of riders. Get parts delivered fast.</p>

          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div className="form-group" key={f.name}>
                <label className="form-label">{f.label}</label>
                <input
                  type={f.type} name={f.name}
                  className="form-control"
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  style={{ borderColor: errors[f.name] ? 'var(--danger)' : undefined }}
                />
                {errors[f.name] && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors[f.name]}</span>}
              </div>
            ))}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8, height: 48 }}>
              {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Creating Account...</> : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 700 }}>Sign in</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
