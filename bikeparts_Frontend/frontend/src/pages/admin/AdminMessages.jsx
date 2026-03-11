import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';

const AdminMessages = () => {
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [expanded, setExpanded]   = useState(null);
  const [filter, setFilter]       = useState('ALL'); // ALL | UNREAD | READ
  const [search, setSearch]       = useState('');
  const [deleting, setDeleting]   = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    api.get('/admin/messages')
      .then(r => setMessages(Array.isArray(r.data) ? r.data : []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load messages'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleExpand = async (msg) => {
    if (expanded === msg.id) { setExpanded(null); return; }
    setExpanded(msg.id);
    // Mark as read when opened
    if (!msg.isRead) {
      try {
        await api.put(`/admin/messages/${msg.id}/read`);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      } catch (_) {}
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this message?')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/admin/messages/${id}/read`);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (_) {}
  };

  // Filter + search
  const filtered = messages.filter(m => {
    const matchFilter =
      filter === 'ALL'    ? true :
      filter === 'UNREAD' ? !m.isRead :
                             m.isRead;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  const fmt = (dt) => dt
    ? new Date(dt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <AdminLayout title="MESSAGES" subtitle="Customer inquiries from the contact form">

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total',  value: messages.length, color: 'var(--orange)' },
          { label: 'Unread', value: unreadCount,      color: '#F87171' },
          { label: 'Read',   value: messages.length - unreadCount, color: '#4ADE80' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '16px 24px', flex: '1 1 120px', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: s.color, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-control"
          placeholder="Search by name, email, subject…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320, flex: 1 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {['ALL', 'UNREAD', 'READ'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px', borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                border: filter === f ? '1px solid var(--orange)' : '1px solid var(--border)',
                background: filter === f ? 'rgba(249,115,22,0.12)' : 'var(--surface)',
                color: filter === f ? 'var(--orange)' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{ padding: '14px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', marginBottom: 20, color: '#F87171', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Messages list ─────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          Loading messages…
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
            {messages.length === 0 ? 'No messages yet.' : 'No messages match your filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(msg => (
            <div key={msg.id}
              onClick={() => handleExpand(msg)}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${!msg.isRead ? 'rgba(249,115,22,0.4)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}>

              {/* ── Row header ─────────────────────────────────────────────── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                {/* Unread dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: msg.isRead ? 'var(--border)' : 'var(--orange)', flexShrink: 0 }} />

                {/* Avatar */}
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--orange-glow)', border: '1px solid rgba(249,115,22,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--orange)', fontSize: '1rem', flexShrink: 0 }}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + email */}
                <div style={{ minWidth: 180, flex: '0 0 auto' }}>
                  <div style={{ fontWeight: 600, color: msg.isRead ? 'var(--muted)' : 'var(--white)', fontSize: '0.92rem' }}>{msg.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{msg.email}</div>
                </div>

                {/* Subject */}
                <div style={{ flex: 1, color: msg.isRead ? 'var(--muted)' : 'var(--white)', fontSize: '0.9rem', fontWeight: msg.isRead ? 400 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {msg.subject}
                </div>

                {/* Date */}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {fmt(msg.createdAt)}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  {!msg.isRead && (
                    <button onClick={(e) => handleMarkRead(msg.id, e)}
                      title="Mark as read"
                      style={{ padding: '5px 10px', borderRadius: 'var(--radius)', border: '1px solid rgba(74,222,128,0.4)', background: 'rgba(74,222,128,0.08)', color: '#4ADE80', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
                      ✓ Read
                    </button>
                  )}
                  <button onClick={(e) => handleDelete(msg.id, e)}
                    disabled={deleting === msg.id}
                    title="Delete"
                    style={{ padding: '5px 10px', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.08)', color: '#F87171', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', opacity: deleting === msg.id ? 0.5 : 1 }}>
                    🗑
                  </button>
                </div>

                {/* Expand chevron */}
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', transition: 'transform 0.2s', transform: expanded === msg.id ? 'rotate(180deg)' : 'none' }}>▼</div>
              </div>

              {/* ── Expanded message body ───────────────────────────────────── */}
              {expanded === msg.id && (
                <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ paddingTop: 16, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Message
                  </div>
                  <div style={{ background: 'var(--dark)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', color: 'var(--white)', fontSize: '0.95rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {msg.message}
                  </div>
                  <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
                    Reply to: <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      style={{ color: 'var(--orange)', textDecoration: 'none' }}
                      onClick={e => e.stopPropagation()}>
                      {msg.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;