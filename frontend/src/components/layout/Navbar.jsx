import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiSettings, FiChevronDown, FiHome, FiPackage, FiZap, FiTruck, FiShield, FiStar } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import AdminNavbar from './AdminNavbar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, token } = useSelector((state) => state.auth);
  const { itemsCount } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: categories } = useSelector((state) => state.categories);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    dispatch(fetchCategories());
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
    }
  };

  return (
    <header style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000, 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Bar */}
      <div className="hidden md:block bg-gray-100 py-1" style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #eee' }}>
        <div className="container flex justify-between text-[11px] text-gray-500 font-medium" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666' }}>
          <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
            <span>One-stop sourcing platform</span>
            <span className="text-orange-600 font-bold" style={{ color: 'var(--color-primary)' }}>Alibaba Clone</span>
          </div>
          <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="py-4" style={{ padding: '1rem 0' }}>
        <div className="container flex items-center gap-8" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" style={{ flexShrink: 0 }}>
            <span className="text-3xl font-black tracking-tight" style={{ fontWeight: 900, color: '#222', fontSize: '1.75rem' }}>
              Ali<span className="text-primary" style={{ color: 'var(--color-primary)' }}>Luxe</span>
            </span>
          </Link>

          {/* Search Bar - Alibaba Style */}
          <form onSubmit={handleSearch} className="flex-grow max-w-2xl hidden md:flex" style={{ flexGrow: 1, maxWidth: '42rem', display: 'flex' }}>
            <div className="relative flex-grow" style={{ display: 'flex', flexGrow: 1 }}>
              <input 
                type="text" 
                placeholder="What are you looking for..." 
                className="w-full h-11 px-6 border-2 border-primary rounded-l-full focus:outline-none"
                style={{ width: '100%', height: '2.75rem', paddingLeft: '1.5rem', border: '2px solid var(--color-primary)', borderRight: 'none', borderRadius: '9999px 0 0 9999px', fontSize: '0.875rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-8 h-11 rounded-r-full font-bold flex items-center gap-2 hover:bg-primary-dark transition-all"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0 2rem', height: '2.75rem', borderRadius: '0 9999px 9999px 0', border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FiSearch size={18} /> Search
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-6 ml-auto" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
            <Link to={token ? "/profile" : "/login"} className="hidden lg:flex items-center gap-2 group cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#f5f5f5' }}>
                <FiUser size={20} />
              </div>
              <div className="text-xs" style={{ fontSize: '11px' }}>
                <p className="text-gray-500">{user ? 'Account' : 'Sign In'}</p>
                <p className="font-bold flex items-center" style={{ fontWeight: 700 }}>{user ? user.name : 'Join Free'} <FiChevronDown /></p>
              </div>
            </Link>

            <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-primary transition-colors" style={{ color: '#666' }}>
              <FiHeart size={24} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full" style={{ position: 'absolute', top: '-0.25rem', right: '-0.25rem', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '10px', width: '1.25rem', height: '1.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors" style={{ color: '#666' }}>
              <FiShoppingBag size={24} />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full" style={{ position: 'absolute', top: '-0.25rem', right: '-0.25rem', backgroundColor: 'var(--color-primary)', color: '#fff', fontSize: '10px', width: '1.25rem', height: '1.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {itemsCount}
                </span>
              )}
            </Link>
            
            <button 
              className="md:hidden text-gray-800 hover:text-primary transition-colors focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', outline: 'none', padding: '0.5rem' }}
            >
              {isMobileMenuOpen ? <FiX size={32} /> : <FiMenu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub Nav / Categories */}
      <div className="bg-white border-t border-gray-100 hidden md:block shadow-sm" style={{ backgroundColor: '#fff', borderTop: '1px solid #f5f5f5' }}>
        <div className="container py-0 flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '45px' }}>
          <div className="flex items-center gap-8 h-full" style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '100%' }}>
            {/* Categories Dropdown Trigger */}
            <div className="relative group h-full flex items-center" style={{ height: '100%' }}>
              <button className="flex items-center gap-2 px-4 h-full font-bold text-gray-800 hover:text-primary transition-all bg-gray-50/50" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem', fontWeight: 800, fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <FiMenu size={18} />
                <span>All Categories</span>
                <FiChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>

              {/* Categories Dropdown Menu */}
              <div className="absolute top-full left-0 w-64 bg-white shadow-2xl border border-gray-100 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] py-4" style={{ position: 'absolute', top: '100%', left: 0, width: '16rem', backgroundColor: '#fff', padding: '1rem 0', zIndex: 100, borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
                {categories && categories.length > 0 ? (
                  categories.map(cat => (
                    <Link 
                      key={cat.id} 
                      to={`/shop?category=${cat.slug}`} 
                      className="flex items-center justify-between px-6 py-2.5 text-[13px] text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1.5rem', fontSize: '13px' }}
                    >
                      <span className="font-medium">{cat.name}</span>
                      <FiChevronDown className="-rotate-90 opacity-40" size={12} />
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-2 text-[13px] text-gray-400">Loading categories...</div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <nav className="flex items-center gap-6 text-[13px] font-bold text-gray-600 h-full" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '13px', fontWeight: 700 }}>
              <Link to="/shop" className="flex items-center gap-2 hover:text-primary transition-colors py-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiZap className="text-orange-500" /> Ready to Ship
              </Link>
              <Link to="/shop" className="hover:text-primary transition-colors py-2">Personal Protective Equipment</Link>
              <Link to="/shop" className="flex items-center gap-2 hover:text-primary transition-colors py-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiShield className="text-blue-500" /> Trade Assurance
              </Link>
              <Link to="/shop" className="flex items-center gap-2 hover:text-primary transition-colors py-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiStar className="text-yellow-500" /> Luxe Membership
              </Link>
            </nav>
          </div>

          {/* Right Side Links */}
          <div className="flex items-center gap-6" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-primary font-black text-xs hover:scale-105 transition-transform" style={{ color: 'var(--color-primary)', fontWeight: 900, fontSize: '11px', letterSpacing: '0.05em' }}>
                ADMIN DASHBOARD
              </Link>
            )}
            <div className="h-4 w-[1px] bg-gray-200" style={{ height: '1rem', width: '1px', backgroundColor: '#eee' }}></div>
            <Link to="/contact" className="text-[12px] text-gray-500 hover:text-primary transition-colors" style={{ fontSize: '12px' }}>Help Center</Link>
          </div>
        </div>
      </div>
      
      {/* Admin Secondary Navbar */}
      {user?.role === 'admin' && (
        <div style={{ width: '100%', borderTop: '1px solid #f0f0f0' }}>
          <AdminNavbar />
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 2000 }}
            />
            
            {/* Menu */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col"
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px', backgroundColor: '#fff', zIndex: 2001, display: 'flex', flexDirection: 'column' }}
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10" style={{ padding: '1.5rem', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="font-black text-2xl tracking-tight">Menu</span>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                    <FiX size={32} />
                 </button>
              </div>

              {/* User Section */}
              <div className="p-8 bg-gradient-to-br from-orange-50/50 to-white border-b border-gray-50" style={{ padding: '2rem', backgroundColor: 'rgba(255,102,0,0.03)' }}>
                 {user ? (
                   <div className="flex flex-col gap-1">
                      <p className="font-black text-gray-900 text-xl leading-tight">{user.name}</p>
                      <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-primary">
                         <FiUser size={24} />
                         <span className="font-black">Welcome to AliLuxe</span>
                      </div>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-white text-center py-3 rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Sign In / Join Free</Link>
                   </div>
                 )}
              </div>

              {/* Links */}
              <div className="flex-grow overflow-y-auto p-6 space-y-2" style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-700 transition-all">
                    <FiHome className="text-gray-400" /> Home
                 </Link>
                 <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-700 transition-all">
                    <FiShoppingBag className="text-gray-400" /> Shop All
                 </Link>
                 <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-700 transition-all">
                    <FiHeart className="text-gray-400" /> Wishlist
                 </Link>
                 
                 <div className="my-4 border-t border-gray-50 pt-4" style={{ margin: '1rem 0', borderTop: '1px solid #f9f9f9', paddingTop: '1rem' }}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Account Settings</p>
                    {user && (
                      <>
                        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-700 transition-all">
                           <FiUser className="text-gray-400" /> My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 font-bold text-gray-700 transition-all">
                           <FiPackage className="text-gray-400" /> My Orders
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 text-primary font-black shadow-sm">
                             <FiSettings /> ADMIN PANEL
                          </Link>
                        )}
                      </>
                    )}
                 </div>
              </div>

              {/* Footer */}
              {user && (
                <div className="p-6 bg-white border-t border-gray-100">
                   <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-bold border border-red-100 rounded-xl hover:bg-red-50 active:scale-95 transition-all"
                   >
                     <FiLogOut /> Sign Out
                   </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
