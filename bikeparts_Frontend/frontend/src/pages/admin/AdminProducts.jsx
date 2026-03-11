import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productService } from '../../services/authService';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Performance Brake Pads', brand: 'Brembo', category: 'brakes', price: 1299, stock: 12 },
  { id: 2, name: 'Air Filter Element', brand: 'K&N', category: 'engine', price: 899, stock: 8 },
  { id: 3, name: 'Chain & Sprocket Kit', brand: 'D.I.D', category: 'drivetrain', price: 2499, stock: 5 },
  { id: 4, name: 'Spark Plug (Iridium)', brand: 'NGK', category: 'electrical', price: 349, stock: 30 },
  { id: 5, name: 'Front Fork Oil Seals', brand: 'Moto Master', category: 'suspension', price: 650, stock: 0 },
];

const EMPTY_FORM = { name: '', brand: '', category: 'engine', price: '', stock: '', modelCompatibility: '', description: '', imageUrl: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const { toasts, success, error } = useToast();

  useEffect(() => {
    productService.getAll()
      .then(data => setProducts(data.content || data))
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      stock: p.stock,
      modelCompatibility: p.modelCompatibility || '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editProduct) {
        await productService.update(editProduct.id, payload);
        setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...payload } : p));
        success('Product updated!');
      } else {
        const created = await productService.create(payload);
        setProducts(prev => [...prev, created || { ...payload, id: Date.now() }]);
        success('Product added!');
      }
      setModalOpen(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      success('Product deleted.');
    } catch {
      error('Failed to delete product.');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="PRODUCTS" subtitle="Manage your spare parts catalog">
      <ToastContainer toasts={toasts} />

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <input type="text" className="form-control" placeholder="Search products..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700, color: 'var(--white)' }}>{p.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--orange)' }}>{p.brand}</td>
                  <td><span className="tag" style={{ textTransform: 'capitalize', cursor: 'default' }}>{p.category}</span></td>
                  <td style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>₹{p.price?.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{ color: p.stock === 0 ? 'var(--danger)' : p.stock <= 5 ? 'var(--warning)' : 'var(--success)', fontWeight: 700 }}>
                      {p.stock}
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
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, padding: 36, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{editProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h4>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              {[
                { name: 'name', label: 'Product Name', type: 'text', required: true },
                { name: 'brand', label: 'Brand', type: 'text', required: true },
                { name: 'modelCompatibility', label: 'Model Compatibility', type: 'text' },
              ].map(f => (
                <div className="form-group" key={f.name}>
                  <label className="form-label">{f.label}</label>
                  <input type={f.type} className="form-control" value={form[f.name]} required={f.required}
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {['engine', 'brakes', 'electrical', 'suspension', 'drivetrain', 'body'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-control" value={form.price} required min={1}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input type="number" className="form-control" value={form.stock} required min={0}
                    onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://res.cloudinary.com/.../image.jpg"
                  value={form.imageUrl}
                  onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                />
                <small style={{ display: 'block', marginTop: 4, color: 'var(--muted)', fontSize: '0.75rem' }}>
                  Use a hosted image (for example, from Cloudinary). Recommended size around 800×600px.
                </small>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
