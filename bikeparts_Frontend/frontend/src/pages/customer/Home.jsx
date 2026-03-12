import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/customer/ProductCard';
import ToastContainer from '../../components/common/ToastContainer';
import { productService } from '../../services/authService';
import { useToast } from '../../utils/useToast';

const CATEGORIES = [
  { name: 'Engine Parts', slug: 'engine',    desc: 'Filters, pistons, gaskets', img: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/6yzkl5mfd0s0rigynbvbb6p8zcr3' },
  { name: 'Brakes',       slug: 'brakes',    desc: 'Pads, rotors, cables',      img: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/lxyiqhbgjbr5jtv6h2czct6gjocr' },
  { name: 'Electrical',   slug: 'electrical',desc: 'Bulbs, wiring, batteries',  img: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/rrevnn8h1sqpobcqecxo8jotvyui' },
  { name: 'Suspension',   slug: 'suspension',desc: 'Shocks, forks, springs',    img: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/7ufy5g7u5y33x8x3q5qmm9y8vzui' },
  { name: 'Drivetrain',   slug: 'drivetrain',desc: 'Chain, sprockets, clutch',  img: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/591xgomf4ivyocziidzwylecjnvs' },
  { name: 'Body Parts',   slug: 'body',      desc: 'Panels, mirrors, fairings', img: 'https://imgproxy.attic.sh/insecure/f:png/plain/https://attic.sh/xhg7uvxpvhe3kam75sy912bj1w82' },
];

const BIKE_BRANDS = [
  { name: 'Hero',          color: '#dc2626',
    img: 'https://download.logo.wine/logo/Hero_MotoCorp/Hero_MotoCorp-Logo.wine.png' },
  { name: 'Bajaj',         color: '#2563eb',
    img: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%2070%22%3E%3Crect%20width%3D%22200%22%20height%3D%2270%22%20fill%3D%22%231e3a8a%22%20rx%3D%226%22/%3E%3Ctext%20x%3D%22100%22%20y%3D%2248%22%20font-family%3D%22Arial%20Black%2Csans-serif%22%20font-size%3D%2230%22%20font-weight%3D%22900%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20letter-spacing%3D%225%22%3EBAJAJ%3C/text%3E%3C/svg%3E' },
  { name: 'Honda',         color: '#b91c1c',
    img: 'https://download.logo.wine/logo/Honda/Honda-Logo.wine.png' },
  { name: 'Yamaha',        color: '#1d4ed8',
    img: 'https://download.logo.wine/logo/Yamaha_Motor_Company/Yamaha_Motor_Company-Logo.wine.png' },
  { name: 'TVS',           color: '#1d9e54',
    img: 'https://download.logo.wine/logo/TVS_Motor_Company/TVS_Motor_Company-Logo.wine.png' },
  { name: 'Royal Enfield', color: '#92400e',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNiEVRq5tXamxJ5xnarEAT1rnQI28kf2pcjw&s' },
  { name: 'KTM',           color: '#c2410c',
    img: 'https://download.logo.wine/logo/KTM/KTM-Logo.wine.png' },
  { name: 'Suzuki',        color: '#1e40af',
    img: 'https://download.logo.wine/logo/Suzuki/Suzuki-Logo.wine.png' },
];

const FEATURES = [
  { icon: '✓',  title: 'Genuine Parts Only',  desc: 'Sourced directly from authorized manufacturers and distributors. OEM quality guaranteed.' },
  { icon: '🚀', title: 'Fast Delivery',        desc: 'Same-day dispatch for orders before 2 PM. Delivered in 24–48 hours across India.' },
  { icon: '🔒', title: 'Secure Payments',      desc: 'Pay only when your order arrives at your doorstep. No online payment required — simple, secure, and convenient.' },
  { icon: '↩',  title: 'Easy Returns',         desc: '7-day hassle-free return policy. Full refund if the part doesn\'t fit your bike.' },
];

const STATS = [
  ['50+', 'Parts Listed'],
  ['50+',   'Top Brands'],
  ['24-48hr',  'Fast Delivery'],
  ['100%',  'Genuine Parts'],
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch]     = useState('');
  const navigate = useNavigate();
  const { toasts, success } = useToast();

  useEffect(() => {
    productService.getAll({ page: 0, size: 8 })
      .then(d => setProducts(Array.isArray(d) ? d : d.content || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
    else navigate('/products');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <ToastContainer toasts={toasts} />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 68 }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(249,115,22,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.04) 1px,transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        <div style={{ position: 'absolute', top: '15%', right: '5%', width: 700, height: 700, background: 'radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 65%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 740 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '100px', padding: '8px 20px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                 Trusted Two-Wheeler Parts Store
              </span>
            </div>

            <h1 style={{ marginBottom: 24, lineHeight: 0.95 }}>
              YOUR RIDE,<br />
              <span style={{ color: 'var(--orange)', WebkitTextStroke: '1px rgba(249,115,22,0.3)' }}>PERFECTED.</span>
            </h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: 520, marginBottom: 44, lineHeight: 1.85 }}>
              Genuine spare parts for every two-wheeler. Fast delivery, verified quality, unbeatable prices — all in one place.
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: 580, marginBottom: 56, boxShadow: '0 0 0 1px var(--border), 0 8px 32px rgba(0,0,0,0.4)', borderRadius: 'var(--radius)' }}>
              <input
                type="text" className="form-control"
                placeholder="Search by part name, brand, or bike model..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ borderRadius: 'var(--radius) 0 0 var(--radius)', flex: 1, borderRight: 'none', fontSize: '1rem', padding: '15px 18px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 var(--radius) var(--radius) 0', padding: '0 28px', fontSize: '1rem' }}>
                🔍 Search
              </button>
            </form>

            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {STATS.map(([val, label]) => (
                <div key={label} style={{ position: 'relative' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--orange)', letterSpacing: '0.05em' }}>{val}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Scroll</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--muted), transparent)' }} />
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div className="section-title">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>Browse By</div>
            <h2>SHOP BY <span style={{ color: 'var(--orange)' }}>CATEGORY</span></h2>
            <span className="accent-line" />
            <p style={{ color: 'var(--muted)', marginTop: 12 }}>Find parts organised by type — from engine internals to body panels</p>
          </div>

          {/* ── 3 equal columns, all cards same height ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '36px 28px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', transition: 'all 0.25s', cursor: 'pointer',
                    height: '100%', minHeight: 260,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-orange)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: 100, height: 100, borderRadius: '16px', marginBottom: 20,
                    background: 'var(--surface2)', border: '1px dashed var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', flexShrink: 0,
                  }}>
                    {cat.img
                      ? <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IMG</span>
                    }
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--white)', fontSize: '1.15rem', marginBottom: 8 }}>{cat.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY BIKE BRAND ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>Your Bike</div>
            <h2>SHOP BY <span style={{ color: 'var(--orange)' }}>BIKE BRAND</span></h2>
            <span className="accent-line" />
            <p style={{ color: 'var(--muted)', marginTop: 12 }}>Find parts compatible with your specific make and model</p>
          </div>

          {/* ── 4 equal columns, logo-only cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {BIKE_BRANDS.map(brand => (
              <Link key={brand.name} to={`/products?search=${encodeURIComponent(brand.name)}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                    transition: 'all 0.25s', cursor: 'pointer',
                    aspectRatio: '1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 24,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-orange)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {brand.img ? (
                    <img
                      src={brand.img}
                      alt={brand.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--orange)', letterSpacing: '0.08em' }}>{brand.name}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>Handpicked</div>
              <h2>FEATURED <span style={{ color: 'var(--orange)' }}>PARTS</span></h2>
              <span className="accent-line" />
            </div>
            <Link to="/products" className="btn btn-outline">View All Parts →</Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-4">
              {products.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={() => success(`${p.name} added to cart!`)} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 24 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', height: 280, opacity: 0.4 }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #0f1923 0%, #1a0a00 50%, #0f1923 100%)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(249,115,22,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.04) 1px,transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 300, background: 'radial-gradient(ellipse,rgba(249,115,22,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
            Limited Time Offer
          </div>
          <h2 style={{ marginBottom: 16 }}>FREE SHIPPING ON <span style={{ color: 'var(--orange)' }}>ALL ORDERS</span></h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
             Delivery across India within 24–48 hours.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
        </div>
      </section>

      {/* ── WHY MOTOPARTS ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>Why Us</div>
            <h2>WHY CHOOSE <span style={{ color: 'var(--orange)' }}>MOTOPARTS</span></h2>
            <span className="accent-line" style={{ margin: '12px auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {FEATURES.map((item, i) => (
              <div key={i} className="card" style={{ padding: '32px 28px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '12px',
                  background: 'var(--orange-glow)', border: '1px solid rgba(249,115,22,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', marginBottom: 20,
                }}>{item.icon}</div>
                <h4 style={{ marginBottom: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.2rem' }}>{item.title}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
<section className="section-sm" style={{ background: 'var(--dark)' }}>
  <div className="container">
    <div style={{ textAlign: 'center', marginBottom: 44 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>Simple Process</div>
      <h2>HOW IT <span style={{ color: 'var(--orange)' }}>WORKS</span></h2>
      <span className="accent-line" style={{ margin: '12px auto' }} />
      <p style={{ color: 'var(--muted)', marginTop: 12 }}>Get the right part at your door in 3 easy steps</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, position: 'relative' }}>
      {[
        { step: '01', icon: '🔍', title: 'Search Your Part',    desc: 'Search by part name, bike brand, or model. Our catalogue is organised to help you find the exact fit.' },
        { step: '02', icon: '🛒', title: 'Place Your Order',    desc: 'Add to cart and confirm. No online payment needed — Cash on Delivery available across India.' },
        { step: '03', icon: '📦', title: 'Receive & Ride',      desc: 'Your genuine part is dispatched same day and delivered within 24–48 hours. Install and hit the road.' },
      ].map((item, i, arr) => (
        <div key={i} style={{ position: 'relative' }}>
          {/* Connector line between steps */}
          {i < arr.length - 1 && (
            <div style={{
              position: 'absolute', top: 36, right: 0,
              width: '50%', height: 1,
              background: 'linear-gradient(to right, rgba(249,115,22,0.4), transparent)',
              zIndex: 0,
              display: window.innerWidth < 600 ? 'none' : 'block',
            }} />
          )}
          <div className="card" style={{ padding: '36px 28px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--orange)',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16,
              opacity: 0.6,
            }}>
              STEP {item.step}
            </div>
            <div style={{
              width: 64, height: 64, borderRadius: '16px', margin: '0 auto 20px',
              background: 'var(--orange-glow)', border: '1px solid rgba(249,115,22,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem',
            }}>
              {item.icon}
            </div>
            <h4 style={{ marginBottom: 12, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.1rem' }}>
              {item.title}
            </h4>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75 }}>
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};

export default Home;