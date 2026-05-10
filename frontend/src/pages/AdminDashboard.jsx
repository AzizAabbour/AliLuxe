import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, FiUsers, FiDollarSign, FiPackage, 
  FiTrendingUp, FiClock, FiCheckCircle, FiXCircle 
} from 'react-icons/fi';
import api from '../api/axios';
import LoadingScreen from '../components/ui/LoadingScreen';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        setStats(res.data.stats);
        setLatestOrders(res.data.latest_orders);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingScreen />;

  const statCards = [
    { title: 'Total Revenue', value: `${stats?.total_revenue?.toLocaleString()} DH`, icon: FiDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Orders', value: stats?.total_orders, icon: FiShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Customers', value: stats?.total_users, icon: FiUsers, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Active Products', value: stats?.total_products, icon: FiPackage, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6"
          >
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Latest Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>
            <button className="text-primary font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-8 py-5 font-black text-gray-900">#{order.order_number}</td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-600">{order.user?.name}</td>
                    <td className="px-8 py-5 font-black text-gray-900">{order.total} DH</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        order.status === 'completed' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-xl font-black text-gray-900 mb-8">System Activity</h3>
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-bold">New product added by Admin</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
