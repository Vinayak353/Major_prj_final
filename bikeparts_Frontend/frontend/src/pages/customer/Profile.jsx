import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';
import api from '../../services/api';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

function getError(name, value) {
  switch (name) {
    case 'name':    return value.trim()              ? '' : 'Full name is required';
    case 'phone':   return /^[6-9]\d{9}$/.test(value) ? '' : 'Enter valid 10-digit mobile number';
    case 'address': return value.trim()              ? '' : 'Address is required';
    case 'city':    return value.trim()              ? '' : 'City is required';
    case 'pincode': return /^\d{6}$/.test(value)    ? '' : 'Enter valid 6-digit PIN code';
    default:        return '';
  }
}

const Profile = () => {
  const { user, updateUser } = useAuth();  // updateUser keeps React state + localStorage in sync
  const navigate = useNavigate();
  const { toasts, success, error } = useToast();

  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
    city:    user?.city    || '',
    state:   user?.state   || 'Maharashtra',
    pincode: user?.pincode || '',
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [saving,  setSaving]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone'   && !/^\d{0,10}$/.test(value)) return;
    if (name === 'pincode' && !/^\d{0,6}$/.test(value))  return;
    setForm(p => ({ ...p, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: getError(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    setErrors(p => ({ ...p, [name]: getError(name, value) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate all editable fields
    const fields = ['name', 'phone', 'address', 'city', 'pincode'];
    const errs = {};
    fields.forEach(k => { const m = getError(k, form[k]); if (m) errs[k] = m; });
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map(k => [k, true])));
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      // Step 1: Send update to DB
      await api.put('/users/profile', form);

      // Step 2: Fetch the confirmed saved data back from DB
      const { data: fresh } = await api.get('/users/me');

      // Step 3: Update React context state + localStorage with the DB-confirmed values
      updateUser({
        name:    fresh.name,
        phone:   fresh.phone,
        address: fresh.address,
        city:    fresh.city,
        state:   fresh.state,
        pincode: fresh.pincode,
      });

      // Step 4: Sync local form to what DB actually saved
      setForm({
        name:    fresh.name    || '',
        phone:   fresh.phone   || '',
        address: fresh.address || '',
        city:    fresh.city    || '',
        state:   fresh.state   || 'Maharashtra',
        pincode: fresh.pincode || '',
      });

      success('Profile updated successfully!');
      setTimeout(() => navigate('/'), 900);

    } catch (err) {
      error(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const errSpan  = (name) => errors[name]
    ? <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 3, display: 'block' }}>{errors[name]}</span>
    : null;
  const borderOf = (name) => ({ borderColor: errors[name] ? 'var(--danger)' : undefined });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <ToastContainer toasts={toasts} />
      <div style={{ paddingTop: 80 }}>

        <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
          <div className="container">
            <h2>MY <span style={{ color: 'var(--orange)' }}>PROFILE</span></h2>
          </div>
        </div>

        <div className="container-sm" style={{ padding: '40px 24px' }}>
          <div className="card" style={{ padding: 40 }}>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--black)', flexShrink: 0 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>{user?.name}</h3>
                <span className="badge badge-orange">Customer</span>
              </div>
            </div>

            <form onSubmit={handleSave} noValidate>

              {/* Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="name" type="text" className="form-control"
                    value={form.name} onChange={handleChange} onBlur={handleBlur}
                    style={borderOf('name')} />
                  {errSpan('name')}
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input name="phone" type="tel" className="form-control"
                    value={form.phone} onChange={handleChange} onBlur={handleBlur}
                    style={borderOf('phone')} />
                  {errSpan('phone')}
                </div>
              </div>

              {/* Email — read-only, cannot be changed */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control"
                  value={user?.email || ''} disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </div>

              {/* Address section header */}
              <div style={{ margin: '8px 0 20px', padding: '10px 14px', background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📍</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Default Delivery Address
                </span>
              </div>

              {/* Address line */}
              <div className="form-group">
                <label className="form-label">Address Line *</label>
                <input name="address" type="text" className="form-control"
                  placeholder="House No., Street, Locality"
                  value={form.address} onChange={handleChange} onBlur={handleBlur}
                  style={borderOf('address')} />
                {errSpan('address')}
              </div>

              {/* City / State / PIN */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">City / Town *</label>
                  <input name="city" type="text" className="form-control"
                    placeholder="e.g. Barshi"
                    value={form.city} onChange={handleChange} onBlur={handleBlur}
                    style={borderOf('city')} />
                  {errSpan('city')}
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select name="state" className="form-control"
                    value={form.state} onChange={handleChange}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input name="pincode" type="text" className="form-control"
                    placeholder="6 digits"
                    value={form.pincode} onChange={handleChange} onBlur={handleBlur}
                    style={borderOf('pincode')} />
                  {errSpan('pincode')}
                </div>
              </div>

              <button type="submit" className="btn btn-primary"
                disabled={saving} style={{ height: 44, minWidth: 160 }}>
                {saving
                  ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</>
                  : 'SAVE CHANGES'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;