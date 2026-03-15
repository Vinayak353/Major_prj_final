import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import productService from '../../services/productService';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const EMPTY = { name: '', brand: '', category: '', price: '', stock: '', modelCompatibility: '', description: '', imageUrl: '' };
const CATEGORIES = ['engine','brakes','electrical','suspension','drivetrain','body'];

function getFieldError(field, value) {
  if (field === 'name'     && !value.trim()) return 'Product name is required';
  if (field === 'brand'    && !value.trim()) return 'Brand is required';
  if (field === 'category' && !value)        return 'Category is required';
  if (field === 'price'    && !(Number(value) > 0)) return 'Enter a valid price';
  if (field === 'stock'    && !(Number(value) >= 0 && value !== '')) return 'Stock must be 0 or more';
  return '';
}

const AdminProducts = () => {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [formErrors, setFormErrors] = useState({});
  const [saving,     setSaving]     = useState(false);
  const [search,     setSearch]     = useState('');
  const { toasts, success, error }  = useToast();
  const saveRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const first = await productService.getAll({ page: 0, size: 50 });
      const firstPage  = Array.isArray(first) ? first : (first.content || []);
      const totalPages = first.totalPages || 1;
      if (totalPages <= 1) { setProducts(firstPage); }
      else {
        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            productService.getAll({ page: i + 1, size: 50 }).then(d => Array.isArray(d) ? d : (d.content || []))
          )
        );
        setProducts([...firstPage, ...rest.flat()]);
      }
    } catch { error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setFormErrors({}); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name||'', brand: p.brand||'', category: p.category||'', price: p.price||'', stock: p.stock??'', modelCompatibility: p.modelCompatibility||'', description: p.description||'', imageUrl: p.imageUrl||'' });
    setFormErrors({});
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors(p => ({ ...p, [name]: getFieldError(name, value) }));
  };

  const handleFormBlur = (e) => {
    const { name, value } = e.target;
    setFormErrors(p => ({ ...p, [name]: getFieldError(name, value) }));
  };

  const handleSave = async () => {
    const required = ['name','brand','category','price','stock'];
    const errs = {};
    required.forEach(f => { const m = getFieldError(f, form[f]); if (m) errs[f] = m; });
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock||'0', 10) };
    try {
      if (editing) { await productService.update(editing.id, payload); success('Product updated!'); }
      else         { await productService.create(payload);             success('Product added!'); }
      closeModal();
      load();
    } catch (e) { error(e.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  // keep saveRef current so keydown handler always calls latest handleSave
  saveRef.current = handleSave;

  const handleModalKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
      e.preventDefault();
      saveRef.current();
    }
    if (e.key === 'Escape') closeModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await productService.delete(id); success('Product deleted.'); load(); }
    catch { error('Delete failed.'); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const be = (name) => ({ borderColor: formErrors[name] ? 'var(--danger)' : undefined });
  const fe = (name) => formErrors[name] ? <span style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 3, display: 'block' }}>{formErrors[name]}</span> : null;

  return (
    <AdminLayout>
      <ToastContainer toasts={toasts} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Inventory</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>PRODUCTS</h3>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input className="form-control" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 220, fontSize: '0.9rem' }} />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ width: 52, height: 52, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'var(--border)' }}>
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '⚙'; }} /> : '⚙'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--white)' }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)' }}>{p.brand}</div>
                  </td>
                  <td><span className="badge badge-orange">{p.category}</span></td>
                  <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--white)' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>{p.stock === 0 ? 'Out of Stock' : `${p.stock} units`}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          onKeyDown={handleModalKeyDown}
        >
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>

            {/* Header */}
            <div style={{ padding: '22px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 3, height: 28, background: 'var(--orange)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}>{editing ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h3>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
            </div>

            {/* Body — scrollable only if screen is very short */}
            <div style={{ padding: '20px 32px', overflowY: 'auto', flex: 1 }}>

              {/* Row 1: Name + Brand */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input name="name" type="text" className="form-control" placeholder="e.g. Performance Brake Pads" value={form.name} onChange={handleFormChange} onBlur={handleFormBlur} style={be('name')} />
                  {fe('name')}
                </div>
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input name="brand" type="text" className="form-control" placeholder="e.g. Brembo" value={form.brand} onChange={handleFormChange} onBlur={handleFormBlur} style={be('brand')} />
                  {fe('brand')}
                </div>
              </div>

              {/* Row 2: Category + Price + Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" className="form-control" value={form.category} onChange={handleFormChange} onBlur={handleFormBlur} style={be('category')}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                  {fe('category')}
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input name="price" type="number" className="form-control" placeholder="0.00" value={form.price} onChange={handleFormChange} onBlur={handleFormBlur} style={be('price')} />
                  {fe('price')}
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input name="stock" type="number" className="form-control" placeholder="0" value={form.stock} onChange={handleFormChange} onBlur={handleFormBlur} style={be('stock')} />
                  {fe('stock')}
                </div>
              </div>

              {/* Compatible Models */}
              <div className="form-group">
                <label className="form-label">Compatible Models</label>
                <input name="modelCompatibility" type="text" className="form-control" placeholder="e.g. Royal Enfield Classic 350, Bajaj Pulsar 150" value={form.modelCompatibility} onChange={handleFormChange} />
              </div>

              {/* Image URL — NO preview to save space */}
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="imageUrl" type="url" className="form-control" placeholder="https://res.cloudinary.com/…/part.jpg" value={form.imageUrl} onChange={handleFormChange} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: 6 }}>
                  Upload to Cloudinary → copy URL → paste here
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows={3} placeholder="Describe the product…" value={form.description} onChange={handleFormChange} style={{ resize: 'vertical' }} />
              </div>
            </div>

            {/* Footer — always visible */}
            <div style={{ padding: '16px 32px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0, background: 'var(--surface)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.78rem', marginRight: 'auto' }}>Press Enter to save · Esc to close</span>
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving…</> : editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;