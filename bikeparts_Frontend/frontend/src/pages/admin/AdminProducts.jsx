import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import productService from '../../services/productService';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const EMPTY_FORM = {
  name: '', brand: '', category: '', price: '', stock: '',
  modelCompatibility: '', description: '', imageUrl: '',
};

const CATEGORIES = ['engine','brakes','electrical','suspension','drivetrain','body'];

const AdminProducts = () => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);   // null = add, product = edit
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');
  const { toasts, success, error } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const first = await productService.getAll({ page: 0, size: 50 });
      const firstPage = Array.isArray(first) ? first : (first.content || []);
      const totalPages = first.totalPages || 1;
      if (totalPages <= 1) {
        setProducts(firstPage);
      } else {
        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            productService.getAll({ page: i + 1, size: 50 })
              .then(d => Array.isArray(d) ? d : (d.content || []))
          )
        );
        setProducts([...firstPage, ...rest.flat()]);
      }
    } catch {
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name:               p.name || '',
      brand:              p.brand || '',
      category:           p.category || '',
      price:              p.price || '',
      stock:              p.stock ?? '',
      modelCompatibility: p.modelCompatibility || '',
      description:        p.description || '',
      imageUrl:           p.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.category || !form.price) {
      error('Name, brand, category, and price are required.'); return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock || '0', 10),
    };
    try {
      if (editing) {
        await productService.update(editing.id, payload);
        success('Product updated!');
      } else {
        await productService.create(payload);
        success('Product added!');
      }
      setShowModal(false);
      load();
    } catch (e) {
      error(e.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      success('Product deleted.');
      load();
    } catch { error('Delete failed.'); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const inp = (field, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-control" placeholder={placeholder}
        value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
    </div>
  );

  return (
    <AdminLayout>
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Inventory</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>PRODUCTS</h3>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input className="form-control" placeholder="Search products…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220, fontSize: '0.9rem' }} />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  {/* Thumbnail */}
                  <td>
                    <div style={{ width: 52, height: 52, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'var(--border)', flexShrink: 0 }}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '⚙'; }} />
                        : '⚙'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--white)' }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--orange)' }}>{p.brand}</div>
                  </td>
                  <td><span className="badge badge-orange">{p.category}</span></td>
                  <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--white)' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} units`}
                    </span>
                  </td>
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

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 3, height: 28, background: 'var(--orange)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem' }}>
                  {editing ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Row 1: Name + Brand */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {inp('name',  'Product Name', 'text', 'e.g. Performance Brake Pads')}
              {inp('brand', 'Brand',        'text', 'e.g. Brembo')}
            </div>

            {/* Row 2: Category + Price + Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              {inp('price', 'Price (₹)', 'number', '0.00')}
              {inp('stock', 'Stock',     'number', '0')}
            </div>

            {/* Model Compatibility */}
            {inp('modelCompatibility', 'Compatible Models', 'text', 'e.g. Royal Enfield Classic 350, Bajaj Pulsar 150')}

            {/* ── IMAGE URL FIELD ── */}
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="url" className="form-control"
                placeholder="https://res.cloudinary.com/your-cloud/image/upload/v.../part.jpg"
                value={form.imageUrl}
                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: 6 }}>
                Upload to Cloudinary → copy the URL → paste here. Recommended: 800×800px JPG/WebP, under 500KB.
              </div>
            </div>

            {/* Live image preview */}
            {form.imageUrl && (
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={form.imageUrl} alt="Preview"
                  onError={e => { e.target.style.display = 'none'; }}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--success)' }}>✓ Image preview loaded</div>
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={3} placeholder="Describe the product…"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving…</> : (editing ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;