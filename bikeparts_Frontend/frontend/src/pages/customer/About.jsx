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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 12 }}>Our Story</div>
          <h2 style={{ marginBottom: 16 }}>ABOUT <span style={{ color: 'var(--orange)' }}>MOTOPARTS</span></h2>
          <p style={{ color: 'var(--muted)', maxWidth: 560, fontSize: '1.1rem', lineHeight: 1.85 }}>
            We're a team of passionate riders building the most reliable platform to source genuine two-wheeler spare parts in India.
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
              Whether you ride a Splendor or a KTM Duke, we stock parts for every bike on Indian roads.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['5000+', 'Parts Listed'], ['50+', 'Brands Stocked'], ['10K+', 'Happy Riders'], ['4.8★', 'Avg. Rating']].map(([val, label]) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--orange)', marginBottom: 6 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h3>Our <span style={{ color: 'var(--orange)' }}>Values</span></h3>
          <span className="accent-line" style={{ margin: '12px auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 72 }}>
          {[
            { icon: '🎯', title: 'Authenticity',   desc: 'Every part is sourced from authorized dealers. Zero counterfeit products, ever.' },
            { icon: '⚡', title: 'Speed',           desc: 'We understand downtime hurts. That\'s why we process orders within hours.' },
            { icon: '🤝', title: 'Trust',           desc: 'Built on honest pricing, accurate descriptions, and real customer reviews.' },
            { icon: '🌍', title: 'Accessibility',  desc: 'Pan-India delivery to every pin code. No rider left behind.' },
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
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '1.05rem' }}>Browse thousands of genuine parts for every bike.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop All Parts →</Link>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;