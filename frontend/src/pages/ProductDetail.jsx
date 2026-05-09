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
    <div className="min-h-screen pt-40 text-center">
      <h1 className="text-4xl font-black mb-4">Product not found</h1>
      <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  const images = product.images || [];
  const mainImage = images[selectedImage]?.image_path || 'https://via.placeholder.com/800';

  return (
    <div className="bg-[#f2f3f7] min-h-screen pt-40 pb-20" style={{ backgroundColor: '#f2f3f7', paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-[13px] text-gray-500 flex items-center gap-2" style={{ marginBottom: '2rem', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/" className="hover:text-primary transition-colors">Home</Link> <FiChevronRight size={10} />
          <Link to="/shop" className="hover:text-primary transition-colors">All Categories</Link> <FiChevronRight size={10} />
          <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-primary transition-colors">{product.category?.name}</Link> <FiChevronRight size={10} />
          <span className="text-gray-900 font-bold">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 mb-10" style={{ display: 'flex', flexDirection: 'row', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Left: Product Media & Summary */}
          <div className="flex-grow lg:w-[65%]" style={{ flexGrow: 1 }}>
            <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-100 flex flex-col md:flex-row gap-12" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2.5rem', display: 'flex', gap: '3rem', border: '1px solid #f0f0f0' }}>
               
               {/* Gallery */}
               <div className="md:w-[45%] space-y-6" style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-50 group cursor-zoom-in" style={{ aspectRatio: '1/1', borderRadius: '1rem', overflow: 'hidden', backgroundColor: '#f9f9f9', border: '1px solid #f5f5f5', position: 'relative' }}>
                    <motion.img 
                      key={mainImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={mainImage} 
                      className="w-full h-full object-contain"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                      {images.map((img, i) => (
                        <button 
                          key={img.id}
                          onClick={() => setSelectedImage(i)}
                          className={`w-20 h-20 rounded-xl border-2 transition-all flex-shrink-0 overflow-hidden ${selectedImage === i ? 'border-primary shadow-lg scale-105' : 'border-gray-100 hover:border-gray-300'}`}
                          style={{ width: '5rem', height: '5rem', borderRadius: '0.75rem', flexShrink: 0, overflow: 'hidden' }}
                        >
                          <img src={img.image_path} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
               </div>

               {/* Essential Info */}
               <div className="flex-grow space-y-8" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight" style={{ fontWeight: 900, fontSize: '1.875rem', color: '#111' }}>{product.name}</h1>
                    <div className="flex items-center gap-6 text-sm" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '14px' }}>
                      <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                        <FiStar className="fill-current" />
                        <span className="text-gray-900">{product.rating}</span>
                        <span className="text-gray-400 font-normal">({product.reviews_count} Reviews)</span>
                      </div>
                      <span className="text-gray-900 font-bold">{product.sales_count}+ Orders</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-8" style={{ backgroundColor: '#f9f9f9', padding: '2rem', borderRadius: '1rem' }}>
                     <div className="grid grid-cols-2 gap-10" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                        <div className="border-r border-gray-200" style={{ borderRight: '1px solid #eee' }}>
                           <p className="text-3xl font-black text-primary" style={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--color-primary)' }}>{product.price} DH</p>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1" style={{ fontSize: '10px', fontWeight: 800 }}>Retail Price</p>
                        </div>
                        <div>
                           <p className="text-3xl font-black text-gray-900" style={{ fontSize: '1.875rem', fontWeight: 900 }}>{(product.price * 0.85).toFixed(2)} DH</p>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1" style={{ fontSize: '10px', fontWeight: 800 }}>Bulk Price (10+ pcs)</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                     <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                        <span className="w-28 text-sm font-bold text-gray-400" style={{ width: '7rem', color: '#aaa' }}>Variations:</span>
                        <div className="flex gap-2 flex-wrap">
                           {['Black', 'White', 'Luxury Gold'].map(v => (
                             <button key={v} className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-bold hover:border-primary hover:text-primary transition-all">{v}</button>
                           ))}
                        </div>
                     </div>
                     <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                        <span className="w-28 text-sm font-bold text-gray-400" style={{ width: '7rem', color: '#aaa' }}>Shipping:</span>
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-gray-900" style={{ fontSize: '14px', fontWeight: 700 }}>25.00 DH via Luxe Express</p>
                           <p className="text-xs text-gray-400" style={{ fontSize: '12px' }}>Estimated delivery: 5-7 business days</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Supplier & Purchase Card */}
          <div className="lg:w-96 space-y-6" style={{ width: '24rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {/* Purchase Card */}
             <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem', border: '1px solid #f0f0f0' }}>
                <div className="mb-8" style={{ marginBottom: '2rem' }}>
                   <label className="block text-xs font-black text-gray-400 uppercase mb-4" style={{ display: 'block', fontSize: '10px', fontWeight: 900, marginBottom: '1rem' }}>Quantity</label>
                   <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2 border border-gray-100" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid #f0f0f0' }}>
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"><FiMinus /></button>
                      <input type="number" className="w-16 bg-transparent text-center font-black text-lg" value={quantity} readOnly />
                      <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"><FiPlus /></button>
                   </div>
                </div>

                <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <button 
                     onClick={handleAddToCart}
                     className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                     style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '1rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '1.125rem' }}
                   >
                     Purchase Now
                   </button>
                   <button 
                     onClick={handleToggleWishlist}
                     className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${isWishlisted ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                     style={{ padding: '1rem', borderRadius: '0.75rem', fontWeight: 700, border: isWishlisted ? '1px solid rgba(239, 68, 68, 0.1)' : '1px solid #eee' }}
                   >
                     <FiHeart className={isWishlisted ? 'fill-current' : ''} /> {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                   </button>
                </div>
             </div>

             {/* Supplier Card */}
             <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100" style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem', border: '1px solid #f0f0f0' }}>
                <h4 className="text-xs font-black text-gray-400 uppercase mb-6" style={{ fontSize: '10px', fontWeight: 900, marginBottom: '1.5rem' }}>Supplier Info</h4>
                <div className="flex items-center gap-4 mb-6" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-primary font-black text-xl border border-orange-100" style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'rgba(255, 102, 0, 0.05)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 900, border: '1px solid rgba(255, 102, 0, 0.1)' }}>LX</div>
                   <div>
                      <p className="font-bold text-gray-900" style={{ fontWeight: 700 }}>Luxe Store Official</p>
                      <p className="text-xs text-success font-bold" style={{ fontSize: '12px', color: '#10b981' }}>Verified Platinum Supplier</p>
                   </div>
                </div>
                <div className="space-y-4 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div className="flex justify-between items-center text-sm" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span className="text-gray-500">Service Rating</span>
                      <span className="font-bold text-gray-900">4.9/5.0</span>
                   </div>
                   <div className="flex justify-between items-center text-sm" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span className="text-gray-500">Fast Shipping</span>
                      <span className="font-bold text-gray-900">100%</span>
                   </div>
                </div>
                <button className="w-full py-3 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">Chat Now</button>
             </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-20" style={{ backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #f0f0f0', overflow: 'hidden', marginBottom: '5rem' }}>
           <div className="flex bg-gray-50/50 border-b border-gray-100 px-6" style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', padding: '0 1.5rem', backgroundColor: 'rgba(249, 249, 249, 0.5)' }}>
              {['Product Detail', 'Reviews', 'Specifications', 'Shipping'].map(tab => {
                const id = tab.toLowerCase().split(' ')[0];
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(id)}
                    className={`px-8 py-5 text-sm font-bold transition-all relative ${activeTab === id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    style={{ padding: '1.25rem 2rem', fontSize: '14px', fontWeight: 700 }}
                  >
                    {tab}
                    {activeTab === id && (
                      <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--color-primary)' }} />
                    )}
                  </button>
                )
              })}
           </div>

           <div className="p-12" style={{ padding: '3rem' }}>
              <AnimatePresence mode="wait">
                {activeTab === 'product' && (
                  <motion.div key="product" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                     <p className="text-lg text-gray-700 leading-relaxed max-w-4xl" style={{ fontSize: '1.125rem', lineHeight: 1.8 }}>{product.description}</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', paddingTop: '2rem' }}>
                        <div className="p-6 bg-gray-50 rounded-2xl" style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '1rem' }}>
                           <FiShield className="text-primary mb-4" size={24} />
                           <h5 className="font-bold mb-2">Safe Payment</h5>
                           <p className="text-xs text-gray-500">Every transaction is secured with military-grade encryption.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl" style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '1rem' }}>
                           <FiTruck className="text-primary mb-4" size={24} />
                           <h5 className="font-bold mb-2">Global Shipping</h5>
                           <p className="text-xs text-gray-500">Fast delivery to over 200 countries worldwide.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-2xl" style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '1rem' }}>
                           <FiCheckCircle className="text-primary mb-4" size={24} />
                           <h5 className="font-bold mb-2">Quality Control</h5>
                           <p className="text-xs text-gray-500">Strict inspection before every single shipment.</p>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                     {product.reviews?.length > 0 ? product.reviews.map(review => (
                        <div key={review.id} className="flex gap-8" style={{ display: 'flex', gap: '2rem' }}>
                           <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xl" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{review.user?.name?.[0]}</div>
                           <div className="flex-grow space-y-3" style={{ flexGrow: 1 }}>
                              <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <p className="font-black text-gray-900">{review.user?.name}</p>
                                 <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex text-orange-400 gap-0.5">
                                 {[...Array(5)].map((_, i) => (
                                   <FiStar key={i} className={i < review.rating ? 'fill-current' : ''} size={14} />
                                 ))}
                              </div>
                              <p className="text-gray-600 leading-relaxed" style={{ color: '#666', lineHeight: 1.6 }}>{review.comment}</p>
                           </div>
                        </div>
                     )) : (
                        <div className="text-center py-20 text-gray-400">
                           <FiMessageCircle size={64} className="mx-auto mb-6 opacity-20" />
                           <p className="text-xl font-bold">No reviews yet</p>
                           <p>Be the first to share your experience with this product!</p>
                        </div>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Related Section */}
        {related.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
               <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">You May Also Like</h2>
                  <p className="text-gray-500">Curated recommendations based on your interests.</p>
               </div>
               <Link to="/shop" className="text-primary font-bold hover:underline flex items-center gap-2">View All <FiChevronRight /></Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
