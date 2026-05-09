import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiGrid, FiBox, FiList, FiShoppingBag, FiUsers, FiPieChart, FiLogOut, FiHome, FiMenu, FiX, FiBell, FiSearch } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: FiGrid, path: '/admin' },
    { name: 'Products', icon: FiBox, path: '/admin/products' },
    { name: 'Categories', icon: FiList, path: '/admin/categories' },
    { name: 'Orders', icon: FiShoppingBag, path: '/admin/orders' },
    { name: 'Customers', icon: FiUsers, path: '/admin/users' },
    // { name: 'Reports', icon: FiPieChart, path: '/admin/reports' },
  ];

  return (
    <div className="min-h-screen bg-bg flex" style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-bg-secondary border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '16rem', backgroundColor: 'var(--color-bg-secondary)', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'fixed', zIndex: 40, height: '100vh', transition: 'transform 0.3s' }}>
        
        <div className="p-8 border-b border-white/5 flex items-center justify-between" style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/" className="text-xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            LUXE<span className="text-primary">ADMIN</span>
          </Link>
          <button className="lg:hidden text-text-muted" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none' }}>
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-2 flex flex-col h-[calc(100vh-100px)]" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:bg-white/5'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
          
          <div className="mt-auto space-y-2" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/" className="flex items-center gap-4 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
              <FiHome size={20} />
              Back to Website
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-danger hover:bg-danger/5" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-danger)', background: 'none' }}>
              <FiLogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header className="h-20 bg-bg-secondary/50 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30" 
          style={{ height: '5rem', backgroundColor: 'rgba(26,26,46,0.5)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0 }}>
          
          <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="lg:hidden p-2 text-text-muted" onClick={() => setIsSidebarOpen(true)} style={{ background: 'none' }}>
              <FiMenu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 h-10 w-80" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', padding: '0 1rem', height: '2.5rem', width: '20rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <FiSearch className="text-text-muted" />
              <input type="text" placeholder="Search data..." className="bg-transparent border-none text-sm ml-3 flex-grow focus:outline-none" style={{ background: 'transparent', border: 'none', marginLeft: '0.75rem', flexGrow: 1, fontSize: '0.875rem', color: 'white' }} />
            </div>
          </div>

          <div className="flex items-center gap-6" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button className="relative p-2 text-text-muted hover:text-white" style={{ background: 'none' }}>
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', width: '0.5rem', height: '0.5rem', backgroundColor: 'var(--color-danger)', borderRadius: '50%' }}></span>
            </button>
            <div className="h-10 w-px bg-white/5" style={{ height: '2.5rem', width: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
            <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="text-right hidden sm:block" style={{ textAlign: 'right' }}>
                <p className="text-sm font-bold" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{user?.name}</p>
                <p className="text-[10px] text-primary uppercase font-black tracking-widest" style={{ fontSize: '10px', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 900 }}>Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 flex-grow" style={{ padding: '2rem', flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 30 }}
        />
      )}
    </div>
  );
}
