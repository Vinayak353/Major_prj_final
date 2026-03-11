import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/customer/ProductCard';
import productService from '../../services/productService';

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Engine Parts',   value: 'engine' },
  { label: 'Brakes',         value: 'brakes' },
  { label: 'Electrical',     value: 'electrical' },
  { label: 'Suspension',     value: 'suspension' },
  { label: 'Drivetrain',     value: 'drivetrain' },
  { label: 'Body Parts',     value: 'body' },
];

const SORT_OPTIONS = [
  { label: 'Newest First',    value: 'createdAt,desc' },
  { label: 'Price: Low→High', value: 'price,asc' },
  { label: 'Price: High→Low', value: 'price,desc' },
  { label: 'Name A→Z',        value: 'name,asc' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch   = searchParams.get('search')   || '';
  const urlCategory = searchParams.get('category') || '';
  const urlPage     = parseInt(searchParams.get('page') || '0', 10);
  const urlSort     = searchParams.get('sort') || 'createdAt,desc';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [products,    setProducts]    = useState([]);
  const [totalPages,  setTotalPages]  = useState(0);
  const [totalItems,  setTotalItems]  = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [dim,         setDim]         = useState(false);

  // Keep search box in sync with URL (browser back/forward)
  useEffect(() => { setSearchInput(urlSearch); }, [urlSearch]);

  useEffect(() => {
    let cancelled = false;
    setDim(true);
    setLoading(true);

    const [field, dir] = urlSort.split(',');
    productService.getAll({
      page:     urlPage,
      size:     12,
      search:   urlSearch || undefined,
      category: urlCategory || undefined,
      sort:     `${field},${dir}`,
    })
      .then(data => {
        if (cancelled) return;
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
          setTotalItems(data.length);
        } else {
          setProducts(data.content || []);
          setTotalPages(data.totalPages  || 1);
          setTotalItems(data.totalElements || 0);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('Products fetch error:', err);
          setProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) { setDim(false); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [urlSearch, urlCategory, urlPage, urlSort]);

  const push = (overrides) => {
    const m = { search: urlSearch, category: urlCategory, page: '0', sort: urlSort, ...overrides };
    const next = {};
    if (m.search)                    next.search   = m.search;
    if (m.category)                  next.category = m.category;
    if (m.page && m.page !== '0')    next.page     = m.page;
    if (m.sort !== 'createdAt,desc') next.sort     = m.sort;
    setSearchParams(next);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Navbar />

      {/* Page header */}
      <div style={{ paddingTop: 68, background: 'var(--dark)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '36px 28px 28px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 6 }}>
            Catalogue
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ marginBottom: 2 }}>ALL <span style={{ color: 'var(--orange)' }}>PARTS</span></h2>
              <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', minHeight: 20 }}>
                {totalItems > 0 && <>{totalItems} products</>}
                {(urlSearch || urlCategory) && (
                  <>
                    {' · '}
                    <button
                      onClick={() => { setSearchInput(''); setSearchParams({}); }}
                      style={{ background: 'none', border: 'none', color: 'var(--orange)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: 0 }}
                    >
                      Clear filters ×
                    </button>
                  </>
                )}
              </p>
            </div>

            <select
              value={urlSort}
              onChange={e => push({ sort: e.target.value })}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 14px', borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', cursor: 'pointer', outline: 'none' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 28px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>

          {/* ── Sidebar ── */}
          <aside style={{ position: 'sticky', top: 84 }}>
            <form
              onSubmit={e => { e.preventDefault(); push({ search: searchInput.trim() }); }}
              style={{ display: 'flex', marginBottom: 24 }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search parts…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                style={{ borderRadius: 'var(--radius) 0 0 var(--radius)', flex: 1, borderRight: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 var(--radius) var(--radius) 0', padding: '0 13px' }}>
                🔍
              </button>
            </form>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
              Category
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {CATEGORIES.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => push({ category: opt.value })}
                  style={{
                    background: urlCategory === opt.value ? 'rgba(249,115,22,0.12)' : 'transparent',
                    border:     `1px solid ${urlCategory === opt.value ? 'var(--orange)' : 'transparent'}`,
                    color:      urlCategory === opt.value ? 'var(--orange)' : 'var(--muted)',
                    padding: '9px 12px', borderRadius: 'var(--radius)', textAlign: 'left',
                    cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.83rem',
                    transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div style={{ transition: 'opacity 0.2s', opacity: dim ? 0.4 : 1 }}>
            {loading && products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚙</div>
                Loading products…
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 12, color: 'var(--border)' }}>⚙</div>
                <h4 style={{ marginBottom: 8 }}>No products found</h4>
                <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Try a different filter or search term.</p>
                <button
                  onClick={() => { setSearchInput(''); setSearchParams({}); }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-3" style={{ marginBottom: 36 }}>
                  {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={urlPage === 0}
                      onClick={() => { push({ page: String(urlPage - 1) }); window.scrollTo({ top: 160, behavior: 'smooth' }); }}
                    >
                      ← Prev
                    </button>

                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => { push({ page: String(i) }); window.scrollTo({ top: 160, behavior: 'smooth' }); }}
                        style={{
                          background:  urlPage === i ? 'var(--orange)' : 'var(--surface)',
                          border:      `1px solid ${urlPage === i ? 'var(--orange)' : 'var(--border)'}`,
                          color:       urlPage === i ? 'white' : 'var(--muted)',
                          padding:     '6px 14px', borderRadius: 'var(--radius)',
                          cursor:      'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.83rem',
                          transition:  'all 0.15s',
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      className="btn btn-outline btn-sm"
                      disabled={urlPage >= totalPages - 1}
                      onClick={() => { push({ page: String(urlPage + 1) }); window.scrollTo({ top: 160, behavior: 'smooth' }); }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;