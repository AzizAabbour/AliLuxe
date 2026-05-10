import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiInfo } from 'react-icons/fi';
import { updateCartItem, removeCartItem, clearCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total, loading } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId));
    toast.success('Item removed from cart');
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="page pt-40" style={{ paddingTop: '10rem' }}>
        <div className="container text-center">
          <div className="empty-state max-w-md mx-auto" style={{ textAlign: 'center', maxWidth: '28rem', margin: '0 auto' }}>
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-primary/30 mx-auto mb-8" style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <FiShoppingBag size={48} />
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>Your Cart is Empty</h1>
            <p className="text-text-secondary mb-10" style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>
              Looks like you haven't added anything to your cart yet. Explore our collections and find something special.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg px-12" style={{ padding: '1rem 3rem' }}>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page pt-32 pb-20" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container">
        <header className="page-header mb-16" style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>You have {items.length} items in your bag.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6" style={{ gridColumn: 'span 2 / span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6"
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <Link to={`/product/${item.product.slug}`} className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ width: '6rem', height: '6rem', borderRadius: '0.75rem', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.product.primary_image?.image_path ? `http://localhost:8000/storage/${item.product.primary_image.image_path}` : (item.product.images?.[0]?.image_path ? `http://localhost:8000/storage/${item.product.images[0].image_path}` : 'https://via.placeholder.com/100')} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  
                  <div className="flex-grow text-center sm:text-left" style={{ flexGrow: 1, textAlign: 'left' }}>
                    <Link to={`/product/${item.product.slug}`} className="font-bold text-lg hover:text-primary transition-colors block mb-1" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-text-muted uppercase tracking-widest font-bold mb-2" style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 800 }}>{item.product.category?.name}</p>
                    <p className="text-gray-900 font-black" style={{ fontWeight: 900, color: '#000' }}>{item.product.price} DH</p>
                  </div>

                  <div className="flex items-center gap-6" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Qty Control */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden" style={{ display: 'flex', alignItems: 'center', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white/10" style={{ padding: '0.5rem', background: 'none' }}><FiMinus size={14} /></button>
                      <span className="w-8 text-center text-sm font-bold" style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white/10" style={{ padding: '0.5rem', background: 'none' }}><FiPlus size={14} /></button>
                    </div>
                    
                    <div className="w-24 text-right hidden sm:block" style={{ width: '6rem', textAlign: 'right' }}>
                      <p className="text-lg font-black text-primary" style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                        {(item.product.price * item.quantity).toFixed(2)} DH
                      </p>
                    </div>

                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-text-muted hover:text-danger transition-colors p-2"
                      style={{ color: 'var(--color-text-muted)', background: 'none' }}
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div className="pt-4 flex justify-between" style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <Link to="/shop" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                <FiArrowRight className="rotate-180" /> Continue Shopping
              </Link>
              <button onClick={() => dispatch(clearCart())} className="text-text-muted hover:text-danger text-sm font-medium">Clear Cart</button>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-1" style={{ gridColumn: 'span 1 / span 1' }}>
            <div className="glass-card p-8 rounded-3xl sticky top-32" style={{ padding: '2rem', borderRadius: '1.5rem', position: 'sticky', top: '8rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-2xl font-bold mb-8" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Order Summary</h3>
              
              <div className="space-y-4 mb-8 pb-8 border-b border-white/5" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between text-text-secondary" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium" style={{ color: '#000' }}>{total.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-text-secondary" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Shipping</span>
                  <span className="text-gray-900 font-medium" style={{ color: '#000' }}>{total > 500 ? 'Free' : '25.00 DH'}</span>
                </div>
                <div className="flex justify-between text-text-secondary" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>TVA (20%)</span>
                  <span className="text-gray-900 font-medium" style={{ color: '#000' }}>{(total * 0.2).toFixed(2)} DH</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                <span className="text-lg font-bold text-gray-900" style={{ color: '#000' }}>Total</span>
                <span className="text-4xl font-black text-primary" style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                  {(total + (total > 500 ? 0 : 25) + (total * 0.2)).toFixed(2)} DH
                </span>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 mb-8 flex gap-3 text-sm text-primary" style={{ backgroundColor: 'rgba(108, 92, 231, 0.05)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                <FiInfo className="flex-shrink-0 mt-0.5" />
                <p>Free shipping on orders over $500. Add more items to save!</p>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg w-full py-5" style={{ width: '100%', padding: '1.25rem' }}>
                Proceed to Checkout <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
