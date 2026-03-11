import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const Profile = () => {
  const { user } = useAuth();
  const { toasts, success } = useToast();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // mock save
    success('Profile updated successfully!');
    setSaving(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <ToastContainer toasts={toasts} />
      <div style={{ paddingTop: 80 }}>
        <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
          <div className="container"><h2>MY <span style={{ color: 'var(--orange)' }}>PROFILE</span></h2></div>
        </div>
        <div className="container-sm" style={{ padding: '40px 24px' }}>
          <div className="card" style={{ padding: 40 }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--black)' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>{user?.name}</h3>
                <span className="badge badge-orange">Customer</span>
              </div>
            </div>

            <form onSubmit={handleSave}>
              {[
                { name: 'name', label: 'Full Name', type: 'text' },
                { name: 'email', label: 'Email Address', type: 'email' },
                { name: 'phone', label: 'Phone Number', type: 'tel' },
              ].map(f => (
                <div className="form-group" key={f.name}>
                  <label className="form-label">{f.label}</label>
                  <input
                    type={f.type} name={f.name}
                    className="form-control"
                    value={form[f.name]}
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
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
