import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiMail, FiPhone, FiShield, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success('User removed');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>Customer Directory</h1>
        <p className="text-text-secondary">View and manage all registered users and their accounts.</p>
      </header>

      <div className="glass-card p-8" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="mb-8 relative" style={{ marginBottom: '2rem' }}>
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder="Search by name, email..." className="input-field w-full pl-12" style={{ width: '100%', paddingLeft: '3rem' }} />
        </div>

        <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
          <table className="w-full" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-left border-b border-white/5" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>User</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Contact</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Role</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Status</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Joined</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black text-right" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {user.name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user.name}</p>
                        <p className="text-[10px] text-text-muted font-black uppercase" style={{ fontSize: '10px' }}>ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <div className="flex flex-col gap-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <p className="text-sm flex items-center gap-2" style={{ fontSize: '0.875rem' }}><FiMail size={12} className="text-primary" /> {user.email}</p>
                      {user.phone && <p className="text-xs text-text-secondary flex items-center gap-2" style={{ fontSize: '0.75rem' }}><FiPhone size={12} /> {user.phone}</p>}
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiShield className={user.role === 'admin' ? 'text-primary' : 'text-text-muted'} />
                      <span className={`text-xs font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-primary' : 'text-text-secondary'}`} style={{ fontSize: '10px', fontWeight: 800 }}>{user.role}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <span className={`badge py-1 px-3 text-[10px] uppercase font-bold ${user.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '10px' }}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary" style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right" style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleDelete(user.id)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-danger" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem' }}><FiTrash2 size={14} /></button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem' }}><FiMoreVertical size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
