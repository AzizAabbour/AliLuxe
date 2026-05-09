import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some(item => item.product_id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product_id: product.id, quantity: 1 }));
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const primaryImage = product.primary_image?.image_path || 
                       (product.images && product.images.length > 0 ? product.images[0].image_path : 'https://via.placeholder.com/400');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary transition-all group"
      style={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '0.5rem', overflow: 'hidden', transition: 'all 0.3s' }}
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden" style={{ display: 'block', position: 'relative', aspectRatio: '1/1', backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
        <img 
          src={primaryImage} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Quick Actions - Floating */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
          style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all ${isWishlisted ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:text-primary'}`}
            style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: isWishlisted ? 'var(--color-primary)' : '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            <FiHeart fill={isWishlisted ? "currentColor" : "none"} size={14} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 bg-white text-gray-600 rounded-full shadow-md flex items-center justify-center hover:text-primary transition-all"
            style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            <FiShoppingBag size={14} />
          </button>
        </div>

        {product.compare_price > product.price && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '10px', padding: '0.125rem 0.5rem', borderRadius: '2px' }}>
            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
          </span>
        )}
      </Link>

      <div className="p-3" style={{ padding: '0.75rem' }}>
        <Link to={`/product/${product.slug}`} className="block text-sm text-gray-800 font-medium h-10 line-clamp-2 mb-2 group-hover:text-primary transition-colors" 
          style={{ display: 'block', fontSize: '13px', lineHeight: '1.4', height: '2.5rem', overflow: 'hidden', color: '#333' }}>
          {product.name}
        </Link>
        
        <div className="flex flex-col gap-0.5" style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          <div className="flex items-baseline gap-1" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span className="text-lg font-black text-gray-900" style={{ fontSize: '1.125rem', fontWeight: 900 }}>{product.price} DH</span>
            <span className="text-xs text-gray-400 font-medium" style={{ fontSize: '11px', color: '#888' }}>/ Piece</span>
          </div>
          <p className="text-[11px] text-gray-500" style={{ fontSize: '11px', color: '#999' }}>1 Piece (Min. Order)</p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between" style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600" style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', fontSize: '11px', color: '#555' }}>
            <span className="text-orange-400">★</span> {product.rating}
          </div>
          <span className="text-[11px] text-gray-400" style={{ fontSize: '11px', color: '#999' }}>94% positive</span>
        </div>
      </div>
    </motion.div>
  );
}
