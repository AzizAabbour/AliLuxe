import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPieChart, FiPackage, FiShoppingCart, FiUsers, 
  FiSettings, FiActivity, FiPlusCircle, FiGrid 
} from 'react-icons/fi';

const adminLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FiPieChart },
  { name: 'Orders', path: '/admin/orders', icon: FiShoppingCart },
  { name: 'Products', path: '/admin/products', icon: FiPackage },
  { name: 'Add Product', path: '/admin/products/create', icon: FiPlusCircle },
  { name: 'Categories', path: '/admin/categories', icon: FiGrid },
  { name: 'Customers', path: '/admin/customers', icon: FiUsers },
];

export default function AdminNavbar() {
  const location = useLocation();

  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: '#f9fafb', 
      borderBottom: '1px solid #e5e7eb',
      padding: '0 20px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      zIndex: 100,
      position: 'relative'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
        overflowX: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        {adminLinks.map((link) => {
          const isActive = location.pathname === link.path || (link.path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'));
          const Icon = link.icon;
          
          return (
            <Link
              key={link.name}
              to={link.path}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 5px',
                height: '50px',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: isActive ? '#FF6600' : '#6B7280',
                textDecoration: 'none',
                position: 'relative',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={14} color={isActive ? '#FF6600' : '#9CA3AF'} />
              {link.name}
              
              {isActive && (
                <div style={{ 
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  backgroundColor: '#FF6600',
                  borderRadius: '3px 3px 0 0'
                }} />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
