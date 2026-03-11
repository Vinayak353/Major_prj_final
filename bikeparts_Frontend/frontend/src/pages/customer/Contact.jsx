import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Contact = () => {
  const [form, setForm]   = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app this would call an API
    setSent(true);
  };

  const INFO = [
    { icon: '📧', label: 'Email',   value: 'support@motoparts.in' },
    { icon: '📞', label: 'Phone',   value: '+91 98765 43210' },
    { icon: '🕐', label: 'Hours',   value: 'Mon–Sat, 9 AM – 7 PM IST' },
    { icon: '📍', label: 'Address', value: 'Pune, Maharashtra, India' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>

        {/* Header */}
        <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(249,115,22,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.03) 1px,transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>Get in Touch</div>
            <h2 style={{ marginBottom: 16 }}>CONTACT <span style={{ color: 'var(--orange)' }}>US</span></h2>
            <p style={{ color: 'var(--muted)', maxWidth: 480, fontSize: '1.05rem' }}>Have a question about a part, an order, or anything else? We're here to help.</p>
          </div>
        </div>

        <div className="container" style={{ padding: '72px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' }}>

            {/* Info */}
            <div>
              <h4 style={{ marginBottom: 28, fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>REACH US AT</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 44 }}>
                {INFO.map(({ icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{
                      width: 48, height: 48, background: 'var(--orange-glow)', border: '1px solid rgba(249,115,22,0.3)',
                      borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0,
                    }}>{icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                      <div style={{ color: 'var(--white)', fontSize: '1rem', fontWeight: 600 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Response Time</div>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                  We typically respond within <strong style={{ color: 'var(--white)' }}>2–4 hours</strong> during business hours. For urgent order issues, please call us directly.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="card" style={{ padding: 40 }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>✅</div>
                  <h3 style={{ marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ color: 'var(--muted)' }}>We'll get back to you within 2–4 hours.</p>
                  <button className="btn btn-outline" style={{ marginTop: 28 }} onClick={() => setSent(false)}>Send Another</button>
                </div>
              ) : (
                <>
                  <h4 style={{ marginBottom: 28, fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>SEND A MESSAGE</h4>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input className="form-control" placeholder="Rohan Sharma" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-control" placeholder="you@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input className="form-control" placeholder="Order issue, Part inquiry..." value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea className="form-control" rows={5} placeholder="Describe your issue or question in detail..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required style={{ resize: 'vertical', minHeight: 130 }} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" style={{ height: 52, fontSize: '1.05rem' }}>Send Message →</button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;