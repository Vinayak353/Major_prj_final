import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--dark)', borderTop: '1px solid var(--border)', padding: '48px 0 24px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--white)', marginBottom: 12 }}>
            MOTO<span style={{ color: 'var(--orange)' }}>PARTS</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Premium two-wheeler spare parts delivered to your doorstep. Quality guaranteed.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--orange)', marginBottom: 16 }}>Shop</div>
          {['Engine Parts', 'Brakes & Suspension', 'Electrical', 'Body Parts', 'Filters & Fluids'].map(item => (
            <div key={item} style={{ marginBottom: 8 }}>
              <Link to="/products" style={{ color: 'var(--muted)', fontSize: '0.9rem', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--white)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
              >{item}</Link>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--orange)', marginBottom: 16 }}>Account</div>
          {[['Login', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['Profile', '/profile']].map(([label, to]) => (
            <div key={label} style={{ marginBottom: 8 }}>
              <Link to={to} style={{ color: 'var(--muted)', fontSize: '0.9rem', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--white)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
              >{label}</Link>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--orange)', marginBottom: 16 }}>Contact</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 8 }}>support@motoparts.in</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 8 }}>+91 98765 43210</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Mon–Sat, 9 AM – 7 PM</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
          © 2025 MOTOPARTS. ALL RIGHTS RESERVED.
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Privacy', 'Terms', 'Refunds'].map(item => (
            <Link key={item} to="#" style={{ color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>{item}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
