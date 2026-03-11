import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/customer/ProductCard';
import ToastContainer from '../../components/common/ToastContainer';
import { productService } from '../../services/authService';
import { useToast } from '../../utils/useToast';

const CATEGORIES = [
  { name: 'Engine Parts', slug: 'engine',    desc: 'Filters, pistons, gaskets', img: null },
  { name: 'Brakes',       slug: 'brakes',    desc: 'Pads, rotors, cables',      img: null },
  { name: 'Electrical',   slug: 'electrical',desc: 'Bulbs, wiring, batteries',  img: null },
  { name: 'Suspension',   slug: 'suspension',desc: 'Shocks, forks, springs',    img: null },
  { name: 'Drivetrain',   slug: 'drivetrain',desc: 'Chain, sprockets, clutch',  img: null },
  { name: 'Body Parts',   slug: 'body',      desc: 'Panels, mirrors, fairings', img: null },
];

const BIKE_BRANDS = [
  { name: 'Hero MotoCorp', img: null },
  { name: 'Bajaj',         img: null },
  { name: 'Honda',         img: null },
  { name: 'Yamaha',        img: null },
  { name: 'TVS',           img: null },
  { name: 'Royal Enfield', img: null },
  { name: 'KTM',           img: null },
  { name: 'Suzuki',        img: null },
];

const FEATURES = [
  { icon: '✓',  title: 'Genuine Parts Only',  desc: 'Sourced directly from authorized manufacturers and distributors. OEM quality guaranteed.' },
  { icon: '🚀', title: 'Fast Delivery',        desc: 'Same-day dispatch for orders before 2 PM. Delivered in 24–48 hours across India.' },
  { icon: '🔒', title: 'Secure Payments',      desc: 'Razorpay-powered checkout with SSL encryption. UPI, cards, wallets — all accepted.' },
  { icon: '↩',  title: 'Easy Returns',         desc: '7-day hassle-free return policy. Full refund if the part doesn\'t fit your bike.' },
];

const STATS = [
  ['5000+', 'Parts Listed'],
  ['50+',   'Top Brands'],
  ['24hr',  'Fast Delivery'],
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
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(249,115,22,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.04) 1px,transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '15%', right: '5%', width: 700, height: 700, background: 'radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 65%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 740 }}>
            {/* Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '100px', padding: '8px 20px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                India's Trusted Two-Wheeler Parts Store
              </span>
            </div>

            <h1 style={{ marginBottom: 24, lineHeight: 0.95 }}>
              YOUR RIDE,<br />
              <span style={{ color: 'var(--orange)', WebkitTextStroke: '1px rgba(249,115,22,0.3)' }}>PERFECTED.</span>
            </h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: 520, marginBottom: 44, lineHeight: 1.85 }}>
              Genuine spare parts for every two-wheeler. Fast delivery, verified quality, unbeatable prices — all in one place.
            </p>

            {/* Search bar */}
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

            {/* Stats row */}
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

        {/* Scroll indicator */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18 }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '28px 20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', transition: 'all 0.25s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-orange)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Image placeholder — replace img with actual category image later */}
                  <div style={{
                    width: 72, height: 72, borderRadius: '14px', marginBottom: 16,
                    background: 'var(--surface2)', border: '1px dashed var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {cat.img
                      ? <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IMG</span>
                    }
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--white)', fontSize: '1.05rem', marginBottom: 5 }}>{cat.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{cat.desc}</div>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18 }}>
            {BIKE_BRANDS.map(brand => (
              <Link key={brand.name} to={`/products?search=${encodeURIComponent(brand.name)}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '28px 20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', transition: 'all 0.25s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-orange)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Logo placeholder — replace img with actual brand logo later */}
                  <div style={{
                    width: 72, height: 72, borderRadius: '14px', marginBottom: 16,
                    background: 'var(--surface2)', border: '1px dashed var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {brand.img
                      ? <img src={brand.img} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOGO</span>
                    }
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--white)', fontSize: '1.05rem', marginBottom: 5 }}>{brand.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>View Parts →</div>
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
            No minimum order value. Delivery across India within 24–48 hours.
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
      <section className="section-sm" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2>WHAT RIDERS <span style={{ color: 'var(--orange)' }}>SAY</span></h2>
            <span className="accent-line" style={{ margin: '12px auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { name: 'Rohan Sharma',   bike: 'Royal Enfield Classic 350', text: 'Got my brake pads in less than a day. Genuine Brembo, perfect fit. Will order again!', rating: 5 },
              { name: 'Priya Nair',     bike: 'Honda CB300R',              text: 'Amazing prices on K&N filters. The quality is exactly what I expected. Very happy.', rating: 5 },
              { name: 'Arjun Mehta',    bike: 'KTM 390 Duke',              text: 'Chain kit arrived well-packaged. Installation was smooth. Highly recommend MotoParts.', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_, j) => <span key={j} style={{ color: 'var(--warning)', fontSize: '1rem' }}>★</span>)}
                </div>
                <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1rem' }}>{t.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)', marginTop: 3 }}>{t.bike}</div>
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