import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiEye, FiCheckCircle, FiXCircle, 
  FiTruck, FiPrinter, FiMoreHorizontal, FiPackage 
} from 'react-icons/fi';
import api from '../api/axios';
import LoadingScreen from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/admin/orders')
      .then(res => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleStatusUpdate = (id, status) => {
    api.put(`/admin/orders/${id}/status`, { status })
      .then(() => {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      })
      .catch(err => toast.error('Error updating status'));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading && orders.length === 0) return <LoadingScreen />;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-500">Track and fulfill your customer orders worldwide.</p>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
          {['all', 'pending', 'confirmed', 'shipped'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Info</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-black text-gray-900">#{order.order_number}</p>
                      <p className="text-xs text-gray-400 mt-1 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                        {order.user?.name?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{order.user?.name}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <FiPackage className="text-gray-400" />
                       <span className="text-sm font-bold text-gray-600">{order.items?.length || 0} items</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">{order.total} DH</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                      order.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                      order.status === 'confirmed' ? 'bg-blue-50 text-blue-600' :
                      order.status === 'shipped' ? 'bg-purple-50 text-purple-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        order.status === 'pending' ? 'bg-orange-600' :
                        order.status === 'confirmed' ? 'bg-blue-600' :
                        'bg-green-600'
                      }`}></div>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'pending' && (
                        <button onClick={() => handleStatusUpdate(order.id, 'confirmed')} className="p-3 text-success hover:bg-green-50 rounded-xl transition-all" title="Confirm Order"><FiCheckCircle size={20} /></button>
                      )}
                      <button className="p-3 text-gray-400 hover:text-primary hover:bg-orange-50 rounded-xl transition-all" title="View Details"><FiEye size={20} /></button>
                      <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all" title="Print Invoice"><FiPrinter size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
