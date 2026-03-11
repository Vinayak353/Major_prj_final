import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useCart();
  const outOfStock = !product.stock || product.stock === 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product);
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column',
        transition: 'all 0.25s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.boxShadow = 'var(--shadow-orange)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '65%', background: 'var(--surface2)' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', color: 'var(--border)' }}>⚙</div>
          )}

          {/* Stock badge */}
          {outOfStock ? (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--danger)', color: 'white', padding: '4px 12px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700 }}>
              OUT OF STOCK
            </div>
          ) : product.stock <= 5 ? (
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--warning)', color: 'var(--black)', padding: '4px 12px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700 }}>
              ONLY {product.stock} LEFT
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {product.brand}
            </span>
          </div>
          <h4 style={{ fontSize: '1.05rem', marginBottom: 6, color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 700, lineHeight: 1.3 }}>
            {product.name}
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 16, flex: 1, lineHeight: 1.6 }}>
            {product.modelCompatibility}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--white)', letterSpacing: '0.03em' }}>
              ₹{Number(product.price)?.toLocaleString('en-IN')}
            </span>
            <button
              className={`btn btn-sm ${outOfStock ? 'btn-ghost' : 'btn-primary'}`}
              onClick={handleAdd}
              disabled={outOfStock}
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              {outOfStock ? 'Sold Out' : '+ Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;