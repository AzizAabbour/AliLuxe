import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingBag, FiHeart, FiShare2, FiMinus, FiPlus, 
  FiCheck, FiInfo, FiTruck, FiShield, FiMessageCircle, 
  FiPackage, FiCheckCircle, FiClock, FiStar, FiChevronRight 
} from 'react-icons/fi';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/shop/ProductCard';
import LoadingScreen from '../components/ui/LoadingScreen';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('product');
  
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = product && wishlistItems.some(item => item.product_id === product.id);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/800';
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/storage/${path}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/products/${slug}`)
      .then(res => {
        setProduct(res.data.product);
        setRelated(res.data.related);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product_id: product.id, quantity }));
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) return <LoadingScreen />;
  if (!product) return (
    <div style={{ minHeight: '100vh', paddingTop: '180px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '900' }}>Product not found</h1>
      <Link to="/shop" style={{ color: '#FF6600', fontWeight: 'bold' }}>Back to Shop</Link>
    </div>
  );

  const images = product.images || [];
  const mainImage = getImageUrl(images[selectedImage]?.image_path);

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Breadcrumbs */}
        <nav style={{ marginBottom: '32px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link> <FiChevronRight size={10} />
          <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Shop</Link> <FiChevronRight size={10} />
          <span style={{ color: '#111827', fontWeight: 'bold' }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
          
          {/* Main Product Section */}
          <div style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '40px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '48px' }}>
              
              {/* Left: Gallery */}
              <div style={{ width: '450px', flexShrink: 0 }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#f9fafb', marginBottom: '24px' }}>
                  <motion.img 
                    key={mainImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={mainImage} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button 
                    onClick={handleToggleWishlist}
                    style={{ position: 'absolute', top: '20px', right: '20px', width: '48px', height: '48px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isWishlisted ? '#ef4444' : '#111827' }}
                  >
                    <FiHeart fill={isWishlisted ? "currentColor" : "none"} size={20} />
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {images.map((img, i) => (
                      <button 
                        key={img.id}
                        onClick={() => setSelectedImage(i)}
                        style={{ width: '80px', height: '80px', borderRadius: '16px', border: selectedImage === i ? '2px solid #FF6600' : '2px solid transparent', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, padding: 0 }}
                      >
                        <img src={getImageUrl(img.image_path)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div style={{ flexGrow: 1 }}>
                <div style={{ marginBottom: '32px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#FF6600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {product.category?.name || 'Luxury Collection'}
                  </span>
                  <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#111827', margin: '8px 0 16px 0', lineHeight: '1.1' }}>{product.name}</h1>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                      <FiStar fill="currentColor" />
                      <span style={{ fontWeight: 'bold', color: '#111827' }}>{product.rating}</span>
                      <span style={{ color: '#9ca3af', fontWeight: 'normal', marginLeft: '4px' }}>({product.reviews_count} reviews)</span>
                    </div>
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#e5e7eb' }}></div>
                    <div style={{ color: '#059669', fontSize: '14px', fontWeight: 'bold' }}>{product.sales_count}+ sold</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9fafb', borderRadius: '24px', padding: '32px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '48px', fontWeight: '900', color: '#FF6600' }}>{product.price} DH</span>
                    <span style={{ fontSize: '16px', color: '#6b7280' }}>/ Piece</span>
                  </div>
                  {product.compare_price > product.price && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>{product.compare_price} DH</span>
                      <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                        SAVE {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <FiTruck size={20} color="#9ca3af" />
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>Free Shipping on orders over 500 DH</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <FiShield size={20} color="#9ca3af" />
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>2-Year Manufacturer Warranty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Tab Section */}
            <div style={{ marginTop: '64px', borderTop: '1px solid #f3f4f6', paddingTop: '40px' }}>
              <div style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
                <button onClick={() => setActiveTab('product')} style={{ border: 'none', backgroundColor: 'transparent', padding: '0 0 12px 0', fontSize: '16px', fontWeight: '900', color: activeTab === 'product' ? '#FF6600' : '#9ca3af', borderBottom: activeTab === 'product' ? '3px solid #FF6600' : '3px solid transparent', cursor: 'pointer' }}>PRODUCT DETAILS</button>
                <button onClick={() => setActiveTab('reviews')} style={{ border: 'none', backgroundColor: 'transparent', padding: '0 0 12px 0', fontSize: '16px', fontWeight: '900', color: activeTab === 'reviews' ? '#FF6600' : '#9ca3af', borderBottom: activeTab === 'reviews' ? '3px solid #FF6600' : '3px solid transparent', cursor: 'pointer' }}>REVIEWS ({product.reviews_count})</button>
              </div>
              
              <AnimatePresence mode="wait">
                {activeTab === 'product' ? (
                  <motion.div key="product" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#4b5563', lineHeight: '1.8', fontSize: '16px' }}>
                    {product.description || "No detailed description available for this luxury item."}
                  </motion.div>
                ) : (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                      <FiMessageCircle size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                      <p>Customer reviews are currently being verified.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Sidebar: Purchase Card */}
          <div style={{ position: 'sticky', top: '140px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '32px', border: '1px solid #f3f4f6', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '12px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', borderRadius: '16px', padding: '8px' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '48px', height: '48px', borderRadius: '12px', border: 'none', backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiMinus /></button>
                  <span style={{ fontSize: '20px', fontWeight: '900' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={{ width: '48px', height: '48px', borderRadius: '12px', border: 'none', backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiPlus /></button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button 
                  onClick={handleAddToCart}
                  style={{ width: '100%', backgroundColor: '#FF6600', color: '#fff', padding: '20px', borderRadius: '16px', border: 'none', fontSize: '18px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 15px -3px rgba(255, 102, 0, 0.25)' }}
                >
                  <FiShoppingBag /> Purchase Now
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  style={{ width: '100%', backgroundColor: '#fff', color: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '24px', border: '1px solid #f3f4f6' }}>
               <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '20px' }}>Supplier Info</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#FF6600', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px' }}>LX</div>
                 <div>
                   <p style={{ fontWeight: 'bold', margin: 0 }}>Luxe Store Official</p>
                   <p style={{ fontSize: '12px', color: '#059669', margin: 0, fontWeight: 'bold' }}>Verified Supplier</p>
                 </div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                 <span style={{ color: '#6b7280' }}>Service Rating</span>
                 <span style={{ fontWeight: 'bold' }}>4.9/5.0</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                 <span style={{ color: '#6b7280' }}>On-time Shipping</span>
                 <span style={{ fontWeight: 'bold' }}>100%</span>
               </div>
            </div>
          </div>
        </div>

        {/* Related Section */}
        {related.length > 0 && (
          <div style={{ marginTop: '100px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#111827', marginBottom: '32px' }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
