import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count for badge
  useEffect(() => {
    api.get('/admin/messages/unread-count')
      .then(r => setUnreadCount(r.data?.count || 0))
      .catch(() => {});
  }, [location.pathname]); // refresh on nav

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const NAV = [
    { path: '/admin',          label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products',  icon: '⚙' },
    { path: '/admin/orders',   label: 'Orders',    icon: '📦' },
    { path: '/admin/users',    label: 'Users',     icon: '👥' },
    { path: '/admin/messages', label: 'Messages',  icon: '✉', badge: unreadCount },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, background: 'var(--dark)',
        borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
            MOTO<span style={{ color: 'var(--orange)' }}>PARTS</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4 }}>
            Admin Portal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', marginBottom: 4, borderRadius: 'var(--radius)',
                textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700,
                fontSize: '0.95rem', letterSpacing: '0.03em',
                color: active ? 'var(--orange)' : 'var(--text)',
                background: active ? 'var(--orange-glow)' : 'transparent',
                borderLeft: active ? '3px solid var(--orange)' : '3px solid transparent',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {/* Unread badge */}
                {item.badge > 0 && (
                  <span style={{
                    background: '#EF4444', color: '#fff',
                    borderRadius: '999px', fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                    padding: '1px 7px', minWidth: 20, textAlign: 'center',
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: 'var(--white)', fontSize: '0.9rem' }}>{user?.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--orange)', textTransform: 'uppercase' }}>Administrator</div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm btn-full" style={{ color: 'var(--danger)' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, overflow: 'auto' }}>
        <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '20px 32px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>{title}</h3>
          {subtitle && <p style={{ color: 'var(--muted)', marginTop: 4 }}>{subtitle}</p>}
        </div>
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;