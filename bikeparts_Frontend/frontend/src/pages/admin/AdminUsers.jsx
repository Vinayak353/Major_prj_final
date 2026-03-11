import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/authService';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../utils/useToast';

// const MOCK_USERS = [
//   { id: 1, name: 'Arjun Mehta', email: 'arjun@example.com', phone: '9876543210', role: 'CUSTOMER', active: true, ordersCount: 5, createdAt: '2024-10-01' },
//   { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '8765432109', role: 'CUSTOMER', active: true, ordersCount: 3, createdAt: '2024-11-15' },
//   { id: 3, name: 'Rohit Kumar', email: 'rohit@example.com', phone: '7654321098', role: 'CUSTOMER', active: false, ordersCount: 1, createdAt: '2024-12-01' },
//   { id: 4, name: 'Admin User', email: 'admin@motoparts.in', phone: '9999999999', role: 'ADMIN', active: true, ordersCount: 0, createdAt: '2024-09-01' },
// ];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toasts, success, error } = useToast();

  useEffect(() => {
    adminService.getUsers()
      .then(data => setUsers(data.content || data))
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (user) => {
    try {
      await adminService.updateUserStatus(user.id, !user.active);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
      success(`${user.name} ${!user.active ? 'activated' : 'deactivated'}.`);
    } catch {
      error('Failed to update user status.');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="USERS" subtitle="Manage registered customers and admins">
      <ToastContainer toasts={toasts} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <input type="text" className="form-control" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
          {filtered.length} users
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Orders</th><th>Joined</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : filtered.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: user.role === 'ADMIN' ? 'var(--orange)' : 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: user.role === 'ADMIN' ? 'var(--black)' : 'var(--text)', flexShrink: 0 }}>
                        {user.name[0]}
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--white)' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>{user.email}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{user.phone}</td>
                  <td>
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-orange' : 'badge-info'}`}>{user.role}</span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{user.ordersCount}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>{user.createdAt}</td>
                  <td>
                    <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {user.role !== 'ADMIN' && (
                      <button
                        className={`btn btn-sm ${user.active ? 'btn-ghost' : 'btn-outline'}`}
                        style={{ color: user.active ? 'var(--danger)' : 'var(--success)' }}
                        onClick={() => toggleStatus(user)}
                      >
                        {user.active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
