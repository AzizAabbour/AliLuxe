import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiBox, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingScreen />;

  const stats = [
    { title: 'Total Revenue', value: `$${data.stats.total_revenue?.toLocaleString()}`, icon: FiTrendingUp, trend: '+12.5%', color: 'var(--color-success)', bg: 'rgba(0,184,148,0.1)' },
    { title: 'Total Orders', value: data.stats.total_orders, icon: FiShoppingBag, trend: '+8.2%', color: 'var(--color-primary)', bg: 'rgba(108,92,231,0.1)' },
    { title: 'Total Products', value: data.stats.total_products, icon: FiBox, trend: '+5', color: 'var(--color-secondary)', bg: 'rgba(0,206,201,0.1)' },
    { title: 'Active Customers', value: data.stats.total_users, icon: FiUsers, trend: '+18.4%', color: 'var(--color-accent)', bg: 'rgba(253,121,168,0.1)' },
  ];

  // Map monthly sales for chart
  const chartData = data.monthly_sales.map(item => ({
    name: item.month,
    revenue: item.revenue,
    orders: item.orders
  }));

  return (
    <div className="space-y-10" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <header>
        <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>Analytics Overview</h1>
        <p className="text-text-secondary">Welcome back, here's what's happening with your store today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8"
            style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex justify-between items-start mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon size={28} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stat.trend.startsWith('+') ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {stat.trend.startsWith('+') ? <FiArrowUpRight /> : <FiArrowDownRight />} {stat.trend}
              </span>
            </div>
            <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 800 }}>{stat.title}</p>
            <h3 className="text-3xl font-black" style={{ fontSize: '1.875rem', fontWeight: 900 }}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-8 h-[450px]" style={{ gridColumn: 'span 2', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', height: '450px' }}>
          <h3 className="text-xl font-bold mb-8" style={{ fontWeight: 800, marginBottom: '2rem' }}>Revenue Trends</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-text-muted)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: 'var(--color-bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                itemStyle={{color: 'var(--color-primary)', fontWeight: 'bold'}}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Best Sellers */}
        <div className="glass-card p-8" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 className="text-xl font-bold mb-8" style={{ fontWeight: 800, marginBottom: '2rem' }}>Best Sellers</h3>
          <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {data.best_sellers.map((product, i) => (
              <div key={product.id} className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '0.75rem', flexShrink: 0 }}>
                  <img src={product.primary_image?.image_path || `https://picsum.photos/seed/${product.id}/100`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0" style={{ flexGrow: 1, minWidth: 0 }}>
                  <p className="text-sm font-bold truncate" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{product.name}</p>
                  <p className="text-xs text-text-muted" style={{ fontSize: '0.75rem' }}>{product.sales_count} sales</p>
                </div>
                <div className="text-right" style={{ textAlign: 'right' }}>
                  <p className="text-sm font-black text-primary" style={{ fontWeight: 900, color: 'var(--color-primary)' }}>${product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary w-full mt-10" style={{ width: '100%', marginTop: '2.5rem' }}>View All Products</button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card p-8 overflow-x-auto" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
        <div className="flex justify-between items-center mb-8" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h3 className="text-xl font-bold" style={{ fontWeight: 800 }}>Recent Orders</h3>
          <button className="text-primary font-bold text-sm hover:underline" style={{ color: 'var(--color-primary)', background: 'none' }}>View All Orders</button>
        </div>
        <table className="w-full" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className="text-left border-b border-white/5" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th className="pb-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ paddingBottom: '1rem', fontSize: '10px' }}>Order ID</th>
              <th className="pb-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ paddingBottom: '1rem', fontSize: '10px' }}>Customer</th>
              <th className="pb-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ paddingBottom: '1rem', fontSize: '10px' }}>Date</th>
              <th className="pb-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ paddingBottom: '1rem', fontSize: '10px' }}>Amount</th>
              <th className="pb-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ paddingBottom: '1rem', fontSize: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recent_orders.map(order => (
              <tr key={order.id} className="border-b border-white/5 last:border-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="py-4 font-bold text-sm" style={{ padding: '1rem 0', fontWeight: 700 }}>#{order.order_number}</td>
                <td className="py-4 text-sm" style={{ padding: '1rem 0' }}>{order.user?.name}</td>
                <td className="py-4 text-sm text-text-secondary" style={{ padding: '1rem 0' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="py-4 font-black text-sm" style={{ padding: '1rem 0', fontWeight: 900 }}>${order.total}</td>
                <td className="py-4" style={{ padding: '1rem 0' }}>
                  <span className={`badge py-1 px-3 text-[10px] uppercase font-bold status-${order.status}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '10px' }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
