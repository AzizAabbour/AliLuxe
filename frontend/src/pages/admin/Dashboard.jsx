import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, FiUsers, FiDollarSign, FiPackage, 
  FiTrendingUp, FiClock, FiCheckCircle, FiXCircle 
} from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        setStats(res.data.stats);
        setLatestOrders(res.data.recent_orders || res.data.latest_orders);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingScreen />;

  const statCards = [
    { title: 'Total Revenue', value: `${(stats?.total_revenue || 0).toLocaleString()} DH`, icon: FiDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Orders', value: stats?.total_orders || 0, icon: FiShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Customers', value: stats?.total_users || 0, icon: FiUsers, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Active Products', value: stats?.total_products || 0, icon: FiPackage, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '180px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: '0 0 8px 0' }}>Dashboard Overview</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {statCards.map((card, i) => (
          <div
            key={card.title}
            style={{ 
              backgroundColor: '#fff', 
              padding: '24px', 
              borderRadius: '24px', 
              border: '1px solid #f3f4f6', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '24px'
            }}
          >
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: card.bg === 'bg-green-50' ? '#ecfdf5' : card.bg === 'bg-blue-50' ? '#eff6ff' : card.bg === 'bg-purple-50' ? '#f5f3ff' : '#fff7ed',
              color: card.color === 'text-green-600' ? '#059669' : card.color === 'text-blue-600' ? '#2563eb' : card.color === 'text-purple-600' ? '#7c3aed' : '#ea580c'
            }}>
              <card.icon size={28} />
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px 0' }}>{card.title}</p>
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', margin: 0 }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        {/* Latest Orders */}
        <div style={{ gridColumn: 'span 2', backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
          <div style={{ padding: '32px', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>Recent Orders</h3>
            <button style={{ color: '#FF6600', fontWeight: '700', fontSize: '14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order ID</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #f3f4f6' }}>
                {Array.isArray(latestOrders) && latestOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '20px 32px', fontWeight: '900', color: '#111827' }}>#{order.order_number}</td>
                    <td style={{ padding: '20px 32px', fontSize: '14px', fontWeight: '700', color: '#4b5563' }}>{order.user?.name}</td>
                    <td style={{ padding: '20px 32px', fontWeight: '900', color: '#111827' }}>{order.total} DH</td>
                    <td style={{ padding: '20px 32px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', backgroundColor: order.status === 'pending' ? '#fff7ed' : '#ecfdf5', color: order.status === 'pending' ? '#ea580c' : '#059669' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #f3f4f6', padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: '0 0 32px 0' }}>System Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0 }}>
                  <FiClock size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#111827', fontWeight: '700', margin: 0 }}>New product added by Admin</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', margin: 0 }}>2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
