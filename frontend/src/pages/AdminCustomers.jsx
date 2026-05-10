import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiSearch, FiMail, FiPhone, FiCalendar, 
  FiSlash, FiCheckCircle, FiTrash2, FiMoreVertical 
} from 'react-icons/fi';
import api from '../api/axios';
import LoadingScreen from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(res => {
        setUsers(res.data.users);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      api.delete(`/admin/users/${id}`)
        .then(() => {
          toast.success('User deleted successfully');
          fetchUsers();
        })
        .catch(err => toast.error('Error deleting user'));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && users.length === 0) return <LoadingScreen />;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Customer Database</h1>
        <p className="text-gray-500">Manage your registered users and their account statuses.</p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search customers by name, email, phone..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-black">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: #USR-{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail className="text-gray-400" size={14} /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPhone className="text-gray-400" size={14} /> {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                      <FiCalendar className="text-gray-400" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">{user.orders_count || 0}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"><FiSlash size={18} /></button>
                      <button onClick={() => handleDeleteUser(user.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FiTrash2 size={18} /></button>
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
