import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiSearch, FiFilter, FiMoreVertical, FiEye, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data.data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
      if (selectedOrder) setShowDetailModal(false);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const getStatusBadge = (status) => {
    const base = "badge py-1 px-3 text-[10px] uppercase font-black tracking-widest rounded-full";
    switch (status) {
      case 'pending': return `${base} badge-warning`;
      case 'processing': return `${base} badge-info`;
      case 'shipped': return `${base} badge-primary`;
      case 'delivered': return `${base} badge-success`;
      case 'cancelled': return `${base} badge-danger`;
      default: return `${base} badge-secondary`;
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>Order Management</h1>
        <p className="text-text-secondary">Process orders, track shipments, and manage customer fulfillment.</p>
      </header>

      <div className="glass-card p-8" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="flex flex-col md:flex-row gap-6 mb-8" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="flex-grow relative" style={{ flexGrow: 1 }}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search by order number, customer name..." className="input-field w-full pl-12" style={{ width: '100%', paddingLeft: '3rem' }} />
          </div>
          <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary flex items-center gap-2"><FiFilter /> Filter</button>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
          <table className="w-full" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-left border-b border-white/5" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Order</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Customer</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Date</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Total</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Status</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black text-right" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <p className="font-bold text-sm" style={{ fontWeight: 700, fontSize: '0.875rem' }}>#{order.order_number}</p>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest" style={{ fontSize: '10px' }}>{order.items_count} items</p>
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <p className="text-sm font-bold" style={{ fontWeight: 700, fontSize: '0.875rem' }}>{order.user?.name}</p>
                    <p className="text-xs text-text-muted" style={{ fontSize: '0.75rem' }}>{order.user?.email}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-secondary" style={{ padding: '1rem', fontSize: '0.875rem' }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 font-black text-sm" style={{ padding: '1rem', fontWeight: 900, fontSize: '0.875rem' }}>
                    ${order.total}
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right" style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-primary transition-all"
                        style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem' }}
                      >
                        <FiEye size={16} />
                      </button>
                      <div className="relative group">
                        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem' }}>
                          <FiMoreVertical size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 glass-card border border-white/10 rounded-xl shadow-xl overflow-hidden py-2 hidden group-hover:block z-20" style={{ position: 'absolute', right: 0, marginTop: '0.5rem', width: '12rem', backgroundColor: 'var(--color-bg-card)', padding: '0.5rem 0', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <button onClick={() => handleUpdateStatus(order.id, 'processing')} className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-info" style={{ width: '100%', background: 'none' }}>Mark Processing</button>
                          <button onClick={() => handleUpdateStatus(order.id, 'shipped')} className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-primary" style={{ width: '100%', background: 'none' }}>Mark Shipped</button>
                          <button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-success" style={{ width: '100%', background: 'none' }}>Mark Delivered</button>
                          <hr className="my-2 border-white/5" />
                          <button onClick={() => handleUpdateStatus(order.id, 'cancelled')} className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 text-danger" style={{ width: '100%', background: 'none' }}>Cancel Order</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card p-10 rounded-[32px] border-white/10"
              style={{ backgroundColor: 'var(--color-bg-card)', padding: '2.5rem', borderRadius: '2rem', overflowY: 'auto', maxWidth: '56rem', width: '100%' }}
            >
              <div className="flex justify-between items-start mb-10" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <div>
                  <h2 className="text-3xl font-black mb-2" style={{ fontWeight: 900 }}>Order #{selectedOrder.order_number}</h2>
                  <p className="text-text-secondary">Placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <span className={getStatusBadge(selectedOrder.status)} style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>{selectedOrder.status}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem', marginBottom: '2.5rem' }}>
                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 className="text-xs uppercase font-black tracking-widest text-text-muted" style={{ fontSize: '10px' }}>Customer Info</h4>
                  <p className="font-bold text-lg" style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selectedOrder.user?.name}</p>
                  <p className="text-text-secondary">{selectedOrder.user?.email}</p>
                  <p className="text-text-secondary">{selectedOrder.shipping_phone}</p>
                </div>
                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 className="text-xs uppercase font-black tracking-widest text-text-muted" style={{ fontSize: '10px' }}>Shipping Address</h4>
                  <p className="font-bold" style={{ fontWeight: 700 }}>{selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</p>
                  <p className="text-text-secondary leading-relaxed">
                    {selectedOrder.shipping_address}<br />
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_postal_code}<br />
                    {selectedOrder.shipping_country}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-10" style={{ marginBottom: '2.5rem' }}>
                <h4 className="text-xs uppercase font-black tracking-widest text-text-muted" style={{ fontSize: '10px' }}>Items Summary</h4>
                <div className="glass-card p-6 divide-y divide-white/5" style={{ borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  {selectedOrder.items?.map(item => (
                    <div key={item.id} className="py-4 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
                      <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden" style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem' }}>
                          <img src={item.product?.primary_image?.image_path || `https://picsum.photos/seed/${item.id}/100`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ fontWeight: 700 }}>{item.product_name}</p>
                          <p className="text-xs text-text-muted">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black" style={{ fontWeight: 900 }}>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="pt-6 mt-2 flex justify-between items-end" style={{ borderTop: '2px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem' }}>
                    <span className="text-xl font-bold text-text-secondary">Grand Total</span>
                    <span className="text-3xl font-black text-primary" style={{ fontSize: '1.875rem', color: 'var(--color-primary)', fontWeight: 900 }}>${selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5" style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
                <button onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')} className="btn btn-secondary flex items-center gap-2"><FiCheckCircle /> Process Order</button>
                <button onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')} className="btn btn-primary flex items-center gap-2"><FiTruck /> Ship Order</button>
                <div className="flex-grow" />
                <button onClick={() => setShowDetailModal(false)} className="btn btn-secondary">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
