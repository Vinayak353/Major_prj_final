import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useCart } from '../../context/CartContext';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';
import { productService } from '../../services/authService';

const ProductDetail = () => {
  const { id }                 = useParams();
  const navigate               = useNavigate();
  const [product, setProduct]  = useState(null);
  const [loading, setLoading]  = useState(true);
  const [qty, setQty]          = useState(1);
  const { addToCart }          = useCart();
  const { toasts, success, error } = useToast();

  useEffect(() => {
    setLoading(true);
    productService.getById(id)
      .then(data => setProduct(data))
      .catch(() => error('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product || product.stock === 0) return;
    addToCart(product, qty);
    success(`${product.name} × ${qty} added to cart!`);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <div style={{ paddingTop: 68, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <div style={{ paddingTop: 120, textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>⚙</div>
        <h3>Product not found</h3>
        <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    </div>
  );

  const isOutOfStock = !product.stock || product.stock === 0;

  const specs = [
    product.modelCompatibility && ['Compatible With', product.modelCompatibility],
    product.brand               && ['Brand',           product.brand],
    product.category            && ['Category',        product.category.charAt(0).toUpperCase() + product.category.slice(1)],
    ['Availability', isOutOfStock ? 'Currently Out of Stock' : `${product.stock} units in stock`],
  ].filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />
      <ToastContainer toasts={toasts} />
      <div style={{ paddingTop: 68 }}>

        {/* Breadcrumb */}
        <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
          <div className="container" style={{ display: 'flex', gap: 8, fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', alignItems: 'center' }}>
            <Link to="/"         style={{ color: 'var(--muted)' }}>Home</Link>
            <span>/</span>
            <Link to="/products" style={{ color: 'var(--muted)' }}>Products</Link>
            <span>/</span>
            <span style={{ color: 'var(--orange)' }}>{product.name}</span>
          </div>
        </div>

        <div className="container" style={{ padding: '52px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>

            {/* Image */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', paddingTop: '80%', position: 'relative',
            }}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ fontSize: '6rem', color: 'var(--border)' }}>⚙</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {product.category}
                  </div>
                </div>
              )}
              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.55)', borderRadius: 'var(--radius-lg)',
                }}>
                  <div style={{
                    background: 'var(--danger)', color: 'white', padding: '10px 28px',
                    fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.1em',
                    borderRadius: 'var(--radius)',
                  }}>OUT OF STOCK</div>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="badge badge-orange">{product.category?.toUpperCase()}</span>
                {isOutOfStock
                  ? <span className="badge badge-danger">Out of Stock</span>
                  : <span className="badge badge-success">In Stock ({product.stock})</span>}
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--orange)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {product.brand}
              </div>

              <h2 style={{ marginBottom: 16, fontFamily: 'var(--font-display)', fontSize: '2.6rem' }}>
                {product.name}
              </h2>

              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'var(--orange)', marginBottom: 20 }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </div>

              {/* Out of stock notice */}
              {isOutOfStock && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 20,
                }}>
                  <span style={{ fontSize: '1.3rem' }}>⚠️</span>
                  <div>
                    <div style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '1rem' }}>Currently Out of Stock</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 2 }}>This item is not available for purchase right now. Check back soon.</div>
                  </div>
                </div>
              )}

              {product.description && (
                <p style={{ color: 'var(--text)', lineHeight: 1.85, marginBottom: 28, fontSize: '1.05rem' }}>
                  {product.description}
                </p>
              )}

              {/* Specs */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 28 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>
                  Specifications
                </div>
                {specs.map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', gap: 16 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>{key}</span>
                    <span style={{
                      color: key === 'Availability' && isOutOfStock ? 'var(--danger)' : 'var(--text)',
                      textAlign: 'right', fontSize: '0.95rem', fontWeight: 600,
                    }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Add to cart / out of stock */}
              {isOutOfStock ? (
                <button className="btn btn-full" disabled style={{
                  height: 54, fontSize: '1.05rem',
                  background: 'var(--surface2)', color: 'var(--muted)',
                  border: '1.5px solid var(--border)', cursor: 'not-allowed',
                  borderRadius: 'var(--radius)',
                }}>
                  ⚠ Out of Stock — Cannot Add to Cart
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="qty-input">
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                    <span className="qty-value">{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                  </div>
                  <button className="btn btn-primary btn-lg" onClick={handleAdd} style={{ flex: 1, height: 54 }}>
                    Add to Cart — ₹{(Number(product.price) * qty).toLocaleString('en-IN')}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;