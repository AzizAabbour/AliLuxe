import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiCalendar, FiMapPin, FiTruck, FiChevronRight, FiCheckCircle, FiClock, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import api from '../api/axios';
import LoadingScreen from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    api.get('/orders')
      .then(res => {
        setOrders(res.data.data || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleBuyAgain = (item) => {
    if (!item.product) {
      toast.error('Product not available');
      return;
    }
    dispatch(addToCart({
      id: item.product_id,
      product: item.product,
      quantity: 1
    }));
    toast.success(`${item.product_name} added to cart!`);
    navigate('/cart');
  };

  const handleAction = (action) => {
    toast(`${action} functionality coming soon!`, {
      icon: '🚀',
    });
  };

  if (loading) return <LoadingScreen />;

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return { color: '#10b981', bg: '#ecfdf5', icon: <FiCheckCircle /> };
      case 'shipped': return { color: '#3b82f6', bg: '#eff6ff', icon: <FiTruck /> };
      case 'pending': return { color: '#f59e0b', bg: '#fffbeb', icon: <FiClock /> };
      default: return { color: '#6b7280', bg: '#f9fafb', icon: <FiPackage /> };
    }
  };

  return (
    <div className="bg-[#f2f3f7] min-h-screen pt-40 pb-20" style={{ backgroundColor: '#f2f3f7', paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container max-w-5xl">
        <div className="flex items-center gap-4 mb-10" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <Link to="/profile" className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-primary transition-all">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight" style={{ fontWeight: 900, fontSize: '2.25rem' }}>My Orders</h1>
            <p className="text-gray-500 font-medium">Track and manage your recent purchases</p>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => {
              const style = getStatusStyle(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                  style={{ backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px solid #eee', overflow: 'hidden' }}
                >
                  {/* Order Top Bar */}
                  <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6" style={{ padding: '1.5rem 2rem', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex flex-wrap gap-10" style={{ display: 'flex', gap: '2.5rem' }}>
                      <div>
                        <p className="text-[11px] uppercase font-black text-gray-400 mb-1 tracking-wider">Order Placed</p>
                        <p className="text-sm font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-black text-gray-400 mb-1 tracking-wider">Total</p>
                        <p className="text-sm font-black text-primary">{(order.total_amount || order.total).toFixed(2)} DH</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase font-black text-gray-400 mb-1 tracking-wider">Ship To</p>
                        <p className="text-sm font-bold text-gray-700 hover:text-primary cursor-help transition-colors">{order.shipping_first_name} {order.shipping_last_name}</p>
                      </div>
                    </div>
                    <div className="text-right" style={{ textAlign: 'right' }}>
                       <p className="text-[11px] uppercase font-black text-gray-400 mb-1 tracking-wider">Order # {order.order_number}</p>
                       <Link to={`/orders/${order.id}`} className="text-sm text-primary font-black hover:underline inline-flex items-center gap-1">
                          View Details <FiChevronRight />
                       </Link>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-8 flex flex-col md:flex-row justify-between gap-10" style={{ padding: '2rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '2.5rem' }}>
                    <div className="flex-grow space-y-8" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full w-fit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: style.bg, color: style.color, padding: '0.5rem 1rem', borderRadius: '9999px', width: 'fit-content' }}>
                           <span className="text-lg">{style.icon}</span>
                           <h4 className="font-black text-xs uppercase tracking-widest">{order.status}</h4>
                        </div>
                        
                        {order.items?.map(item => (
                          <div key={item.id} className="flex gap-6 group" style={{ display: 'flex', gap: '1.5rem' }}>
                            <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm" style={{ width: '6rem', height: '6rem', borderRadius: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #eee', flexShrink: 0, overflow: 'hidden' }}>
                              <img src={item.product?.primary_image?.image_path || `https://picsum.photos/seed/${item.id}/200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.product_name} />
                            </div>
                            <div className="flex-grow" style={{ flexGrow: 1 }}>
                              <Link to={`/product/${item.product?.slug}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 leading-tight mb-2" style={{ fontWeight: 700, display: 'block' }}>{item.product_name}</Link>
                              <p className="text-sm text-gray-500 font-medium mb-4">Quantity: <span className="font-bold text-gray-900">{item.quantity}</span> | <span className="font-bold text-primary">{item.price} DH</span></p>
                              <button 
                                onClick={() => handleBuyAgain(item)}
                                className="flex items-center gap-2 text-xs font-black text-white bg-primary px-6 py-2 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all active:scale-95" 
                                style={{ backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: '0.75rem' }}
                              >
                                <FiShoppingBag size={14} /> Buy it again
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="w-full md:w-72 flex flex-col gap-3 pt-4" style={{ width: '18rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button onClick={() => handleAction('Package Tracking')} className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">Track package</button>
                        <button onClick={() => handleAction('Returns')} className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">Return or replace items</button>
                        <button onClick={() => handleAction('Product Review')} className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">Leave product review</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-24 text-center shadow-sm border border-gray-100" style={{ backgroundColor: '#fff', borderRadius: '2rem', padding: '6rem', textAlign: 'center' }}>
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FiPackage size={48} className="text-gray-200" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">No orders found</h2>
            <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">It looks like you haven't placed any orders yet. Start your shopping journey now!</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-white px-12 py-4 rounded-2xl font-black shadow-lg shadow-orange-500/30 hover:scale-105 transition-all active:scale-95">
              Start Shopping <FiChevronRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
