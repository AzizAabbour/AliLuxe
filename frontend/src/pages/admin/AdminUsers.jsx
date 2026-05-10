import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUserX, FiCheckCircle, FiMoreVertical, FiMail, FiCalendar, FiTrash2, FiCopy, FiX, FiSend } from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailData, setEmailData] = useState({
    subject: 'Message from AliLuxe Support',
    message: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(res => {
        const data = res.data.data || res.data.users || res.data;
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user account?')) {
      api.delete(`/admin/users/${id}`)
        .then(() => {
          toast.success('User deleted successfully');
          fetchUsers();
        })
        .catch(err => toast.error('Error deleting user'));
    }
  };

  const openEmailModal = (user) => {
    setSelectedUser(user);
    setEmailData({
      subject: 'Update regarding your account at AliLuxe',
      message: `Hello ${user.name},\n\n`
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    // Fallback mailto construction
    const mailtoUrl = `mailto:${selectedUser.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
    
    // Try to open it
    const win = window.open(mailtoUrl, '_blank');
    
    // Also copy to clipboard as safety
    navigator.clipboard.writeText(emailData.message);
    
    toast.success('Attempting to open email app and copied message to clipboard!');
    setShowEmailModal(false);
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : [];

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
    marginTop: '6px'
  };

  const labelStyle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  };

  if (loading && users.length === 0) return <LoadingScreen />;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '180px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: '0 0 8px 0' }}>Customer Database</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Manage your registered users and their account statuses.</p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '20px', border: '1px solid #f3f4f6', marginBottom: '32px', display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            style={{ width: '100%', padding: '14px 16px 14px 48px', backgroundColor: '#f9fafb', border: 'none', borderRadius: '14px', outline: 'none' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Joined Date</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '24px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid #f3f4f6' }}>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: '900' }}>
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: '900', color: '#111827', margin: 0 }}>{user.name}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>ID: #{user.id.toString().padStart(5, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px', color: '#4b5563', fontSize: '14px' }}>{user.email}</td>
                  <td style={{ padding: '24px', color: '#4b5563', fontSize: '14px' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '24px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: '900', backgroundColor: user.status === 'active' ? '#ecfdf5' : '#fef2f2', color: user.status === 'active' ? '#059669' : '#ef4444' }}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td style={{ padding: '24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button 
                        onClick={() => openEmailModal(user)}
                        style={{ padding: '8px', color: '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                      >
                        <FiMail size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ padding: '8px', color: '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>Contact Customer</h2>
              <button onClick={() => setShowEmailModal(false)} style={{ border: 'none', backgroundColor: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>To</label>
                <div style={{ ...inputStyle, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}>{selectedUser?.email}</div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Subject</label>
                <input 
                  type="text" 
                  style={inputStyle} 
                  value={emailData.subject} 
                  onChange={e => setEmailData({...emailData, subject: e.target.value})} 
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Message</label>
                <textarea 
                  rows="8" 
                  style={{ ...inputStyle, resize: 'none' }} 
                  value={emailData.message} 
                  onChange={e => setEmailData({...emailData, message: e.target.value})}
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <button 
                  type="button" 
                  onClick={() => { navigator.clipboard.writeText(emailData.message); toast.success('Message copied!'); }}
                  style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '16px', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                >
                  COPY MESSAGE
                </button>
                <button 
                  type="submit" 
                  style={{ backgroundColor: '#FF6600', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <FiSend /> OPEN IN MAIL
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '16px', textAlign: 'center' }}>
                Click "OPEN IN MAIL" to send using your email app, or "COPY" to use Gmail/Yahoo.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
