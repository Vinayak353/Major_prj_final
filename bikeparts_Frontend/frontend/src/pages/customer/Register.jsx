import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

function getError(name, value, form) {
  switch (name) {
    case 'name':            return value.trim() ? '' : 'Full name is required';
    case 'email':           return /\S+@\S+\.\S+/.test(value) ? '' : 'Enter a valid email';
    case 'phone':           return /^[6-9]\d{9}$/.test(value) ? '' : 'Enter valid 10-digit mobile number';
    case 'password':        return value.length >= 8 ? '' : 'Minimum 8 characters';
    case 'confirmPassword': return value === form.password ? '' : 'Passwords do not match';
    case 'address':         return value.trim() ? '' : 'Address is required';
    case 'city':            return value.trim() ? '' : 'City is required';
    case 'pincode':         return /^\d{6}$/.test(value) ? '' : 'Enter valid 6-digit PIN code';
    default:                return '';
  }
}

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    address: '', city: '', state: 'Maharashtra', pincode: '',
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [showPwd, setShowPwd] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toasts, success, error } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone'   && !/^\d{0,10}$/.test(value)) return;
    if (name === 'pincode' && !/^\d{0,6}$/.test(value))  return;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name]) {
      const errs = { ...errors, [name]: getError(name, value, next) };
      if (name === 'password' && touched.confirmPassword)
        errs.confirmPassword = getError('confirmPassword', next.confirmPassword, next);
      setErrors(errs);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: getError(name, value, form) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = ['name','email','phone','password','confirmPassword','address','city','pincode'];
    const errs = {};
    fields.forEach(k => { const m = getError(k, form[k], form); if (m) errs[k] = m; });
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map(k => [k, true])));
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, address: form.address, city: form.city, state: form.state, pincode: form.pincode });
      success('Account created! Welcome to MotoParts!');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const err = (name) => errors[name] ? <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 3, display: 'block' }}>{errors[name]}</span> : null;
  const borderOf = (name) => ({ borderColor: errors[name] ? 'var(--danger)' : undefined });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <ToastContainer toasts={toasts} />
      <div style={{ width: '100%', maxWidth: 580, position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 36, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'var(--orange)', clipPath: 'polygon(10% 0%,90% 0%,100% 50%,90% 100%,10% 100%,0% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--black)' }}>⚙</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
            MOTO<span style={{ color: 'var(--orange)' }}>PARTS</span>
          </span>
        </Link>

        <div className="card" style={{ padding: 40 }}>
          <h3 style={{ marginBottom: 4, fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>CREATE ACCOUNT</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: '0.9rem' }}>Join thousands of riders. Get parts delivered fast.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input name="name" type="text" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} onBlur={handleBlur} style={borderOf('name')} />
                {err('name')}
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input name="phone" type="tel" className="form-control" placeholder="9876543210" value={form.phone} onChange={handleChange} onBlur={handleBlur} style={borderOf('phone')} />
                {err('phone')}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input name="email" type="email" className="form-control" placeholder="you@example.com" autoComplete="off" value={form.email} onChange={handleChange} onBlur={handleBlur} style={borderOf('email')} />
              {err('email')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input name="password" type={showPwd.password ? 'text' : 'password'} className="form-control" placeholder="Min. 8 characters" autoComplete="new-password" value={form.password} onChange={handleChange} onBlur={handleBlur} style={{ ...borderOf('password'), paddingRight: 42 }} />
                  <button type="button" onClick={() => setShowPwd(p => ({ ...p, password: !p.password }))} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem', padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showPwd.password ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {err('password')}
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input name="confirmPassword" type={showPwd.confirmPassword ? 'text' : 'password'} className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} style={{ ...borderOf('confirmPassword'), paddingRight: 42 }} />
                  <button type="button" onClick={() => setShowPwd(p => ({ ...p, confirmPassword: !p.confirmPassword }))} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem', padding: 0, display: 'flex', alignItems: 'center' }}>
                    {showPwd.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {err('confirmPassword')}
              </div>
            </div>

            <div style={{ margin: '12px 0 20px', padding: '10px 14px', background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📍</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Default Delivery Address</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', marginLeft: 4 }}>— can be changed per order at checkout</span>
            </div>

            <div className="form-group">
              <label className="form-label">Address Line *</label>
              <input name="address" type="text" className="form-control" placeholder="House No., Street, Locality" value={form.address} onChange={handleChange} onBlur={handleBlur} style={borderOf('address')} />
              {err('address')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">City / Town *</label>
                <input name="city" type="text" className="form-control" placeholder="e.g. Barshi" value={form.city} onChange={handleChange} onBlur={handleBlur} style={borderOf('city')} />
                {err('city')}
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <select name="state" className="form-control" value={form.state} onChange={handleChange}>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code *</label>
                <input name="pincode" type="text" className="form-control" placeholder="6 digits" value={form.pincode} onChange={handleChange} onBlur={handleBlur} style={borderOf('pincode')} />
                {err('pincode')}
              </div>
            </div>

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