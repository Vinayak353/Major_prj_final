import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCount }     = useCart();
  const navigate         = useNavigate();
  const location         = useLocation();
  const [scrolled, setScrolled]     = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDropOpen(false); setMobileOpen(false); }, [location]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const cartCount = getCount();

  const links = [
    { label: 'Home',     to: '/' },
    { label: 'Shop',     to: '/products' },
    { label: 'About Us', to: '/about' },
    { label: 'Contact',  to: '/contact' },
  ];

  const linkStyle = (to) => ({
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: '1rem',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: isActive(to) ? 'var(--orange)' : 'var(--text)',
    textDecoration: 'none',
    padding: '6px 4px',
    borderBottom: isActive(to) ? '2px solid var(--orange)' : '2px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(7,9,12,0.97)' : 'rgba(7,9,12,0.75)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'rgba(255,255,255,0.06)'}`,
        backdropFilter: 'blur(18px)',
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 38, height: 38, background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              clipPath: 'polygon(10% 0%,90% 0%,100% 50%,90% 100%,10% 100%,0% 50%)',
            }}>
              <span style={{ fontSize: '1.1rem', color: 'var(--black)', fontWeight: 900 }}>⚙</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', color: 'var(--white)', letterSpacing: '0.08em' }}>
              MOTO<span style={{ color: 'var(--orange)' }}>PARTS</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
            {links.map(({ label, to }) => (
              <Link key={to} to={to} style={linkStyle(to)}
                onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = 'var(--white)'; }}
                onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = 'var(--text)'; }}
              >{label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Cart — always visible to everyone */}
            <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: '9px 13px', fontSize: '1.15rem', position: 'relative' }}>
                🛒
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -7, right: -7,
                    background: 'var(--orange)', color: 'var(--black)',
                    borderRadius: '50%', width: 22, height: 22,
                    fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                  }}>{cartCount}</span>
                )}
              </button>
            </Link>

            {/* Auth */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setDropOpen(o => !o)} style={{ fontSize: '0.95rem' }}>
                  {user.name?.split(' ')[0]} ▾
                </button>
                {dropOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '8px 0',
                    minWidth: 190, boxShadow: 'var(--shadow)', zIndex: 200,
                  }}>
                    {[['My Profile', '/profile'], ['My Orders', '/orders']].map(([lbl, href]) => (
                      <Link key={href} to={href} style={{
                        display: 'block', padding: '12px 20px',
                        color: 'var(--text)', textDecoration: 'none',
                        fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--orange)'; e.currentTarget.style.background = 'var(--surface2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'none'; }}
                      >{lbl}</Link>
                    ))}
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                    <button onClick={() => { logout(); navigate('/'); }} style={{
                      width: '100%', padding: '12px 20px', background: 'none', border: 'none',
                      color: 'var(--danger)', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700,
                    }}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost   btn-sm" style={{ fontSize: '0.95rem' }}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ fontSize: '0.95rem' }}>Sign Up</Link>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(o => !o)} className="ham-btn"
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--white)', fontSize: '1.6rem', cursor: 'pointer', padding: 4 }}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 999,
          background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '12px 0',
        }}>
          {links.map(({ label, to }) => (
            <Link key={to} to={to} style={{
              display: 'block', padding: '13px 28px',
              color: isActive(to) ? 'var(--orange)' : 'var(--text)',
              fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .ham-btn { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;