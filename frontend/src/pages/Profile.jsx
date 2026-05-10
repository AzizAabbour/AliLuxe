import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPackage, FiMapPin, FiSettings, FiCamera, FiEdit2, FiPlus, FiTrash2, FiCheck, FiX, FiLock, FiLogOut } from 'react-icons/fi';
import { updateProfile, fetchUser, logout } from '../store/slices/authSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({ 
    address_line1: '', 
    city: '', 
    state: '', 
    postal_code: '', 
    country: 'Morocco',
    is_default: false 
  });
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/addresses');
      setAddresses(data);
    } catch (err) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data || data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }

    const data = new FormData();
    data.append('avatar', file);
    
    toast.loading('Uploading avatar...', { id: 'avatar-upload' });
    const result = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Avatar updated!', { id: 'avatar-upload' });
    } else {
      toast.error('Upload failed', { id: 'avatar-upload' });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', newAddress);
      toast.success('Address added successfully');
      setShowAddressModal(false);
      fetchAddresses();
      setNewAddress({ address_line1: '', city: '', state: '', postal_code: '', country: 'Morocco', is_default: false });
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const tabs = [
    { id: 'account', name: 'Account Details', icon: FiUser },
    { id: 'orders', name: 'My Orders', icon: FiPackage },
    { id: 'addresses', name: 'Addresses', icon: FiMapPin },
    // { id: 'security', name: 'Security', icon: FiLock },
  ];

  return (
    <div className="bg-[#f2f3f7] min-h-screen pt-40 pb-20" style={{ backgroundColor: '#f2f3f7', paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8" style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
          
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-72" style={{ width: '18rem' }}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: '#fff', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div className="p-8 text-center border-b border-gray-50" style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid #f9f9f9' }}>
                <div className="relative inline-block mb-4" style={{ display: 'inline-block', position: 'relative', marginBottom: '1rem' }}>
                  <div className="w-24 h-24 rounded-full bg-orange-50 overflow-hidden flex items-center justify-center text-primary text-3xl font-black shadow-lg border-4 border-white" style={{ width: '6rem', height: '6rem', borderRadius: '50%', backgroundColor: 'rgba(255, 102, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 900, overflow: 'hidden', border: '4px solid #fff' }}>
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0]
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary transition-all cursor-pointer" style={{ position: 'absolute', bottom: 0, right: 0, width: '2rem', height: '2rem', backgroundColor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiCamera size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
                <h2 className="font-bold text-lg" style={{ fontWeight: 700, fontSize: '1.125rem' }}>{user?.name}</h2>
                <p className="text-sm text-gray-500" style={{ fontSize: '14px', color: '#888' }}>{user?.email}</p>
                <div className="mt-4 inline-flex px-3 py-1 bg-orange-50 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest" style={{ marginTop: '1rem', display: 'inline-flex', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(255, 102, 0, 0.05)', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 800, borderRadius: '9999px' }}>
                  Standard Member
                </div>
              </div>

              <div className="p-3 space-y-1" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-lg transition-all text-sm font-bold ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderRadius: '0.5rem', fontSize: '14px', fontWeight: 700, transition: 'all 0.2s' }}
                  >
                    <tab.icon size={18} />
                    {tab.name}
                  </button>
                ))}
                
                <div className="my-2 border-t border-gray-50" style={{ margin: '0.5rem 0', borderTop: '1px solid #f9f9f9' }} />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 rounded-lg transition-all text-sm font-bold text-danger hover:bg-red-50"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderRadius: '0.5rem', fontSize: '14px', fontWeight: 700, color: 'var(--color-danger)', transition: 'all 0.2s' }}
                >
                  <FiLogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow" style={{ flexGrow: 1 }}>
            <div className="bg-white rounded-xl shadow-sm p-10 min-h-[600px]" style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '2.5rem', minHeight: '600px' }}>
              <AnimatePresence mode="wait">
                
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex justify-between items-center mb-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Account Details</h3>
                      {!isEditing && (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 text-primary font-bold hover:underline"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700, backgroundColor: '#fff' }}
                        >
                          <FiEdit2 /> Edit Profile 
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-xl" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '36rem' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 800 }}>Full Name</label>
                          <input 
                            type="text" 
                            disabled={!isEditing}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:border-primary disabled:opacity-50"
                            style={{ width: '100%', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '14px' }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 800 }}>Email Address</label>
                          <input 
                            type="email" 
                            disabled
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm opacity-50 cursor-not-allowed"
                            style={{ width: '100%', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '14px' }}
                            value={user?.email}
                          />
                        </div>
                      </div>

                      <div className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 800 }}>Phone Number</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:border-primary disabled:opacity-50"
                          style={{ width: '100%', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '14px' }}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+212 ..."
                        />
                      </div>

                      {isEditing && (
                        <div className="flex gap-4 pt-4" style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                          <button 
                            type="submit" 
                            className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20"
                            style={{ backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: '9999px', padding: '0.75rem 2rem', fontWeight: 700 }}
                          >
                            Save Changes
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-100 text-gray-600 px-8 py-3 rounded-full font-bold"
                            style={{ backgroundColor: '#f5f5f5', color: '#666', borderRadius: '9999px', padding: '0.75rem 2rem', fontWeight: 700 }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                )}

                {activeTab === 'addresses' && (
                  <motion.div
                    key="addresses"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex justify-between items-center mb-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                      <h3 className="text-2xl font-bold text-gray-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>My Addresses</h3>
                      <button 
                        onClick={() => setShowAddressModal(true)}
                        className="bg-primary text-white px-6 py-2 rounded-full font-bold flex items-center gap-2"
                        style={{ backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: '9999px', padding: '0.5rem 1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <FiPlus /> Add New
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-100 rounded-xl p-6 relative group" style={{ border: '1px solid #eee', borderRadius: '0.75rem', padding: '1.5rem', position: 'relative' }}>
                          {address.is_default && (
                            <span className="absolute top-4 right-4 bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(27, 157, 94, 0.1)', color: '#1b9d5e', fontSize: '10px', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>DEFAULT</span>
                          )}
                          <p className="font-bold text-gray-800 mb-2" style={{ fontWeight: 700, color: '#333', marginBottom: '0.5rem' }}>{address.address_line1}</p>
                          <p className="text-sm text-gray-500" style={{ fontSize: '14px', color: '#666' }}>{address.city}, {address.state} {address.postal_code}</p>
                          <p className="text-sm text-gray-500 mb-4" style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}>{address.country}</p>
                          <button 
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-gray-400 hover:text-danger transition-all opacity-0 group-hover:opacity-100"
                            style={{ background: 'none', color: '#ccc', transition: 'all 0.3s' }}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {addresses.length === 0 && !loading && (
                      <div className="text-center py-20 text-gray-400" style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <FiMapPin size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No addresses found. Add one to speed up checkout!</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-10" style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '2.5rem' }}>Order History</h3>
                    
                    <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6" style={{ border: '1px solid #eee', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                           <div className="flex items-center gap-6" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                             <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300" style={{ width: '4rem', height: '4rem', backgroundColor: '#f9f9f9', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               <FiPackage size={24} />
                             </div>
                             <div>
                               <p className="font-bold text-gray-800" style={{ fontWeight: 700 }}>Order #{order.order_number}</p>
                               <p className="text-xs text-gray-400" style={{ fontSize: '12px' }}>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                             </div>
                           </div>
                           <div className="text-center md:text-right" style={{ textAlign: 'right' }}>
                             <p className="font-black text-lg" style={{ fontWeight: 900, fontSize: '1.125rem' }}>{order.total_amount} DH</p>
                             <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest status-${order.status}`} style={{ fontSize: '10px', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                               {order.status}
                             </span>
                           </div>
                        </div>
                      ))}
                    </div>

                    {orders.length === 0 && !loading && (
                      <div className="text-center py-20 text-gray-400" style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <FiPackage size={48} className="mx-auto mb-4 opacity-20" />
                        <p>You haven't placed any orders yet.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Address Modal Placeholder - Inline Simple */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
            style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '32rem' }}
          >
            <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h4 className="text-xl font-bold">Add New Address</h4>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                placeholder="Street Address" 
                className="input-field" 
                required 
                value={newAddress.address_line1}
                onChange={(e) => setNewAddress({...newAddress, address_line1: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  placeholder="City" 
                  className="input-field" 
                  required 
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                />
                <input 
                  placeholder="State/Province" 
                  className="input-field" 
                  required 
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  placeholder="Postal Code" 
                  className="input-field" 
                  required 
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                />
                <input 
                  placeholder="Country" 
                  className="input-field" 
                  required 
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full btn btn-primary mt-4 py-4" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Save Address</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
