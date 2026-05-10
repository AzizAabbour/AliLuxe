import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiFilter, 
  FiChevronRight, FiImage, FiPackage, FiMoreVertical 
} from 'react-icons/fi';
import api from '../api/axios';
import LoadingScreen from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
      .then(res => {
        setProducts(res.data.products.data || res.data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      api.delete(`/admin/products/${id}`)
        .then(() => {
          toast.success('Product deleted successfully');
          fetchProducts();
        })
        .catch(err => toast.error('Error deleting product'));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && products.length === 0) return <LoadingScreen />;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Products Inventory</h1>
          <p className="text-gray-500">Manage your store's products, stock, and pricing.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <FiPlus size={20} /> Create Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name, SKU..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-6 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-all">
          <FiFilter /> Filters
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img src={product.images?.[0]?.image_path || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">SKU: {product.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold uppercase tracking-wider">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">{product.price} DH</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-success' : 'bg-red-500'}`}></div>
                      <span className="font-bold text-gray-600">{product.stock} in stock</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      product.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-3 text-gray-400 hover:text-primary hover:bg-orange-50 rounded-xl transition-all"><FiEdit2 size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-8 border-t border-gray-50 flex justify-between items-center text-sm">
          <p className="text-gray-400 font-bold">Showing {filteredProducts.length} products</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-100 rounded-lg text-gray-400 font-bold hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold">1</button>
            <button className="px-4 py-2 border border-gray-100 rounded-lg text-gray-500 font-bold hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
