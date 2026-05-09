import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/shop/ProductCard';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="page pt-32 pb-20" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container">
        <header className="page-header mb-16" style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800 }}>My Wishlist</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Items you've saved for later.</p>
        </header>

        {items.length > 0 ? (
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProductCard product={item.product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="empty-state py-20 text-center" style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-primary/30 mx-auto mb-8" style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <FiHeart size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-text-secondary mb-10">Save your favorite items here to easily find them later.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">Browse Shop</Link>
          </div>
        )}
      </div>
    </div>
  );
}
