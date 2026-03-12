import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const About = () => (
  <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
    <Navbar />
    <div style={{ paddingTop: 68 }}>

      {/* Hero */}
      <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(249,115,22,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.03) 1px,transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse,rgba(249,115,22,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>About Us</div>
          <h2 style={{ marginBottom: 16 }}>ABOUT <span style={{ color: 'var(--orange)' }}>MOTOPARTS</span></h2>

          <p style={{ color: 'var(--muted)', maxWidth: 600, fontSize: '1.1rem', lineHeight: 1.85 }}>
            MotoParts is the online extension of <strong>Vinod Auto Parts</strong>, a trusted spare parts shop serving riders in Barshi. 
            Our goal is to bring the same reliability and genuine parts available in our physical store to customers through a simple and convenient online platform.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '72px 28px' }}>

        {/* Mission */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginBottom: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Our Mission</div>

            <h3 style={{ marginBottom: 20 }}>Keeping India's Riders <span style={{ color: 'var(--orange)' }}>Moving</span></h3>

            <p style={{ color: 'var(--muted)', marginBottom: 16, fontSize: '1.05rem', lineHeight: 1.85 }}>
              Finding genuine spare parts for your bike shouldn't be a hassle. MotoParts was built to make it simple — one trusted platform, thousands of verified parts, delivered fast.
            </p>

            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.85 }}>
              Our store, Vinod Auto Parts, has been serving riders locally for years by providing reliable bike components, accessories, and replacement parts. 
              With MotoParts, we aim to expand that trust online and help riders easily find the parts they need without visiting multiple shops.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['50+', 'Parts Listed'], ['50+', 'Brands Stocked'], ['1000+', 'Satisfied Customers'], ['100%', 'Customer Satisfaction']].map(([val, label]) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--orange)', marginBottom: 6 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Store */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h3>Our <span style={{ color: 'var(--orange)' }}>Store</span></h3>
            <span className="accent-line" style={{ margin: '12px auto' }} />
          </div>

          <div className="card" style={{ padding: 30 }}>
            <h4 style={{ marginBottom: 10 }}>Vinod Auto Parts</h4>

            <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
              Vinod Auto Parts is a well-known spare parts shop located in Barshi, Maharashtra. 
              For years, the store has been supplying high-quality motorcycle spare parts for major brands like Hero, Honda, Bajaj, TVS, and Yamaha.
            </p>

            <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
              <strong>Address:</strong><br/>
              Vinod Auto Parts, Near Market Yard Gate, Tuljapur Road,<br/>
              Sambhaji Nagar, Barshi – 413401, Maharashtra
            </p>

            <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
              Riders and mechanics from across the region trust Vinod Auto Parts for genuine components, fair pricing, and knowledgeable service.
            </p>
          </div>
        </div>

        {/* Values */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h3>Our <span style={{ color: 'var(--orange)' }}>Values</span></h3>
          <span className="accent-line" style={{ margin: '12px auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 72 }}>
          {[
            { icon: '🎯', title: 'Authenticity', desc: 'We focus on genuine and reliable spare parts sourced from trusted manufacturers and distributors.' },
            { icon: '⚡', title: 'Speed', desc: 'Fast order processing and efficient delivery so riders can get back on the road quickly.' },
            { icon: '🤝', title: 'Trust', desc: 'Built on honest pricing, transparent information, and long-standing customer relationships.' },
            { icon: '🏍', title: 'Rider First', desc: 'Everything we do is designed to make finding bike spare parts easier for riders and mechanics.' },
          ].map((v, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{v.icon}</div>
              <h5 style={{ marginBottom: 10, fontFamily: 'var(--font-body)', fontWeight: 700 }}>{v.title}</h5>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.75 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: 16 }}>Ready to find your part?</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '1.05rem' }}>
            Browse genuine spare parts available for all major motorcycle brands in India.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop All Parts →</Link>
        </div>

      </div>
    </div>
    <Footer />
  </div>
);

export default About;