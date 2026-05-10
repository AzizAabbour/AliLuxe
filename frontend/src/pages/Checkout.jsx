import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTruck, FiCheckCircle, FiLock, FiArrowRight } from 'react-icons/fi';
import { clearCart } from '../store/slices/cartSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_first_name: user?.name?.split(' ')[0] || '',
    shipping_last_name: user?.name?.split(' ')[1] || '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_phone: user?.phone || '',
    payment_method: 'card',
  });

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders', formData);
      dispatch(clearCart());
      toast.success(data.message);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = total;
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.2;
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className="page pt-32 pb-20" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container">
        <header className="page-header mb-16 text-center" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800 }}>Complete Purchase</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Secure checkout powered by LuxeStore Encryption.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3rem' }}>
          {/* Left: Shipping & Payment */}
          <div className="lg:col-span-3 space-y-10" style={{ gridColumn: 'span 3 / span 3', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Shipping Info */}
            <section className="glass-card p-10 rounded-3xl" style={{ padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiTruck className="text-primary" /> Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>First Name</label>
                  <input required className="input-field" value={formData.shipping_first_name} onChange={(e) => setFormData({...formData, shipping_first_name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input required className="input-field" value={formData.shipping_last_name} onChange={(e) => setFormData({...formData, shipping_last_name: e.target.value})} />
                </div>
                <div className="md:col-span-2 input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Full Address</label>
                  <input required className="input-field" placeholder="123 Luxury Street, Apartment 4B" value={formData.shipping_address} onChange={(e) => setFormData({...formData, shipping_address: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input required className="input-field" value={formData.shipping_city} onChange={(e) => setFormData({...formData, shipping_city: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Postal Code</label>
                  <input required className="input-field" value={formData.shipping_postal_code} onChange={(e) => setFormData({...formData, shipping_postal_code: e.target.value})} />
                </div>
                <div className="md:col-span-2 input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Phone Number</label>
                  <input required className="input-field" placeholder="+212 ..." value={formData.shipping_phone} onChange={(e) => setFormData({...formData, shipping_phone: e.target.value})} />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="glass-card p-10 rounded-3xl" style={{ padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiCreditCard className="text-primary" /> Payment Method
              </h2>

              <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
                  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
                  { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
                ].map(method => (
                  <label key={method.id} className={`flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.payment_method === method.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/2'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '1rem', border: '2px solid transparent' }}>
                    <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input type="radio" name="payment" checked={formData.payment_method === method.id} onChange={() => setFormData({...formData, payment_method: method.id})} className="w-5 h-5 accent-primary" />
                      <span className="text-2xl" style={{ fontSize: '1.5rem' }}>{method.icon}</span>
                      <span className="font-bold" style={{ fontWeight: 700 }}>{method.name}</span>
                    </div>
                  </label>
                ))}
              </div>

              {formData.payment_method === 'card' && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div className="md:col-span-2 input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Card Number</label>
                    <input disabled className="input-field opacity-50" placeholder="•••• •••• •••• ••••" />
                  </div>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input disabled className="input-field opacity-50" placeholder="MM / YY" />
                  </div>
                  <div className="input-group">
                    <label>CVV</label>
                    <input disabled className="input-field opacity-50" placeholder="•••" />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right: Summary & Action */}
          <aside className="lg:col-span-2" style={{ gridColumn: 'span 2 / span 2' }}>
            <div className="glass-card p-10 rounded-3xl sticky top-32" style={{ padding: '2.5rem', borderRadius: '1.5rem', position: 'sticky', top: '8rem', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <h3 className="text-2xl font-bold mb-10" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>Order Confirmation</h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem' }}>
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="w-16 h-16 rounded-xl bg-white/5 flex-shrink-0" style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
                      <img src={item.product.primary_image?.image_path ? `http://localhost:8000/storage/${item.product.primary_image.image_path}` : (item.product.images?.[0]?.image_path ? `http://localhost:8000/storage/${item.product.images[0].image_path}` : 'https://via.placeholder.com/100')} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0" style={{ flexGrow: 1 }}>
                      <h4 className="text-sm font-bold truncate" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{item.product.name}</h4>
                      <p className="text-xs text-text-muted" style={{ fontSize: '0.75rem' }}>Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm" style={{ fontWeight: 700, fontSize: '0.875rem' }}>{(item.product.price * item.quantity).toFixed(2)} DH</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5 mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
                <div className="flex justify-between text-text-secondary" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium" style={{ color: '#000' }}>{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-text-secondary" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span className="text-gray-900 font-medium" style={{ color: '#000' }}>{shipping.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-text-secondary" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>TVA (20%)</span>
                  <span className="text-gray-900 font-medium" style={{ color: '#000' }}>{tax.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/5" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-3xl font-black text-primary" style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--color-primary)' }}>{finalTotal.toFixed(2)} DH</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-success mb-10" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.75rem', marginBottom: '2.5rem' }}>
                <FiLock /> <span>Your payment data is encrypted and secure.</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary btn-lg w-full py-5 h-16"
                style={{ width: '100%', height: '4rem' }}
              >
                {loading ? 'Processing...' : 'Place Secure Order'}
                {!loading && <FiArrowRight className="ml-2" />}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
