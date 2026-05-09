import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiTruck, FiShield, FiPackage, FiSearch, FiChevronRight, FiGrid, FiUser } from 'react-icons/fi';
import { fetchFeaturedProducts } from '../store/slices/productSlice';
import ProductCard from '../components/shop/ProductCard';
import api from '../api/axios';

export default function Home() {
  const dispatch = useDispatch();
  const { featured, featuredLoading } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    api.get('/categories').then(res => setCategories(res.data));
  }, [dispatch]);

  return (
    <div className="bg-[#f2f3f7] min-h-screen pt-40" style={{ backgroundColor: '#f2f3f7', minHeight: '100vh', paddingTop: '10rem' }}>
      <div className="container">
        {/* Main Section with Sidebar */}
        <section className="flex flex-col lg:flex-row gap-4 mb-8" style={{ gap: '1rem', marginBottom: '2rem' }}>
          {/* Category Sidebar */}
          <aside className="hidden lg:block w-64 bg-white rounded-lg shadow-sm p-4 h-[450px]" style={{ width: '16rem', backgroundColor: '#fff', borderRadius: '0.5rem', padding: '1rem', height: '450px', border: '1px solid #e5e5e5' }}>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ fontSize: '12px', fontWeight: 800, marginBottom: '1rem' }}>My Markets</h3>
            <ul className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array.isArray(categories) && categories.slice(0, 10).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/shop/${cat.slug}`} className="text-[13px] text-gray-700 hover:text-primary hover:font-bold transition-all flex items-center justify-between" style={{ fontSize: '13px', color: '#444', display: 'flex', justifyContent: 'space-between' }}>
                    {cat.name} <FiChevronRight className="opacity-20" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Hero Slider */}
          <div className="flex-grow bg-white rounded-lg shadow-sm overflow-hidden relative group h-[450px]" style={{ flexGrow: 1, backgroundColor: '#fff', borderRadius: '0.5rem', overflow: 'hidden', height: '450px', border: '1px solid #e5e5e5' }}>
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" 
              className="w-full h-full object-cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-12 text-white" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
              <h1 className="text-5xl font-black mb-6 leading-tight" style={{ fontWeight: 900, fontSize: '3rem', marginBottom: '1.5rem' }}>Global Sourcing <br /> Made Easy</h1>
              <p className="text-lg mb-8 max-w-md opacity-90" style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '28rem' }}>Connect with millions of premium suppliers worldwide in one place.</p>
              <div className="flex gap-4">
                <Link to="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-all" style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 700 }}>Get Started</Link>
                <Link to="/register" className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-bold hover:bg-white/30 transition-all" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 700 }}>Join Free</Link>
              </div>
            </div>
          </div>

          {/* Right Banner/Actions */}
          <div className="hidden xl:flex w-64 flex-col gap-4" style={{ width: '16rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center h-[217px] border border-gray-200" style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #e5e5e5' }}>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4" style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#f5f5f5', marginBottom: '1rem' }}>
                <FiUser size={32} />
              </div>
              <p className="text-sm mb-4 font-medium" style={{ fontSize: '14px', marginBottom: '1rem' }}>Welcome to AliLuxe!</p>
              <div className="grid grid-cols-2 gap-2 w-full" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                <Link to="/login" className="bg-primary text-white py-2 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0.5rem', borderRadius: '9999px', fontSize: '11px', textAlign: 'center' }}>Login</Link>
                <Link to="/register" className="bg-white border border-primary text-primary py-2 rounded-full text-xs font-bold" style={{ backgroundColor: '#fff', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '0.5rem', borderRadius: '9999px', fontSize: '11px', textAlign: 'center' }}>Join</Link>
              </div>
            </div>
            <div className="bg-primary rounded-lg shadow-sm p-6 flex flex-col justify-center h-[217px] text-white" style={{ backgroundColor: 'var(--color-primary)', borderRadius: '0.5rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 className="font-bold mb-2" style={{ fontWeight: 700 }}>Trade Assurance</h4>
              <p className="text-xs opacity-90 leading-relaxed" style={{ fontSize: '11px', lineHeight: 1.6 }}>Protect your orders from payment to delivery with our trade assurance service.</p>
              <Link to="/about" className="mt-4 text-xs font-bold underline" style={{ marginTop: '1rem', fontSize: '11px' }}>Learn more</Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { title: 'Source Right Now', desc: 'Millions of ready-to-ship products', icon: FiPackage },
            { title: 'Trade Assurance', desc: 'Built-in protection for every order', icon: FiShield },
            { title: 'Logistics Service', desc: 'Secure and fast global shipping', icon: FiTruck },
            { title: 'Quality Inspection', desc: 'Professional local inspection service', icon: FiCheckCircle },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4 border border-gray-200" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e5e5e5' }}>
              <div className="w-12 h-12 rounded-full bg-orange-50 text-primary flex items-center justify-center flex-shrink-0" style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(255, 102, 0, 0.05)', color: 'var(--color-primary)', flexShrink: 0 }}>
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm" style={{ fontWeight: 700, fontSize: '14px' }}>{item.title}</h4>
                <p className="text-xs text-gray-500" style={{ fontSize: '12px', color: '#888' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Ready to Ship Section */}
        <section className="mb-12" style={{ marginBottom: '3rem' }}>
          <div className="flex justify-between items-end mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <h2 className="text-2xl font-black flex items-center gap-3" style={{ fontWeight: 900, fontSize: '1.5rem' }}>
              READY TO SHIP <span className="text-sm font-normal text-gray-500" style={{ fontSize: '14px', fontWeight: 400 }}>Latest products in stock</span>
            </h2>
            <Link to="/shop" className="text-sm font-bold text-gray-600 hover:text-primary transition-all flex items-center gap-1" style={{ fontSize: '13px' }}>View More <FiArrowRight /></Link>
          </div>

          {featuredLoading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 skeleton rounded-lg" style={{ height: '16rem', borderRadius: '0.5rem' }} />)}
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {Array.isArray(featured) && featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Personalized Recommendation */}
        <section className="pb-20" style={{ paddingBottom: '5rem' }}>
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200" style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid #e5e5e5' }}>
            <h2 className="text-xl font-bold mb-8 text-center" style={{ textAlign: 'center', marginBottom: '2rem' }}>Personalized for You</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {Array.isArray(featured) && featured.slice(0, 5).map(product => (
                <Link key={product.id} to={`/product/${product.slug}`} className="group block" style={{ display: 'block' }}>
                   <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50" style={{ aspectRatio: '1/1', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.75rem' }}>
                     <img src={product.primary_image?.image_path} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                   </div>
                   <p className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-primary" style={{ fontSize: '13px', lineHeight: 1.4, height: '2.8rem', overflow: 'hidden' }}>{product.name}</p>
                   <p className="font-black text-lg" style={{ fontWeight: 900 }}>{product.price} DH</p>
                   <p className="text-[10px] text-gray-400" style={{ fontSize: '10px' }}>120+ orders</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
