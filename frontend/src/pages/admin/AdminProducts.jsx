import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiMoreVertical, FiEye, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    compare_price: '',
    stock: '',
    description: '',
    short_description: '',
    is_featured: false,
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?per_page=100'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      compare_price: product.compare_price || '',
      stock: product.stock,
      description: product.description,
      short_description: product.short_description || '',
      is_featured: product.is_featured,
      status: product.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        toast.success('Product deleted');
        fetchData();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, formData);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', formData);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>Product Management</h1>
          <p className="text-text-secondary">Control your inventory, prices, and product details.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setFormData({name: '', category_id: '', price: '', compare_price: '', stock: '', description: '', short_description: '', is_featured: false, status: 'active'}); setShowModal(true); }}
          className="btn btn-primary btn-lg px-8 h-14" 
          style={{ padding: '0 2rem', height: '3.5rem' }}
        >
          <FiPlus className="mr-2" /> Add New Product
        </button>
      </header>

      <div className="glass-card p-8" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="flex flex-col md:flex-row gap-6 mb-8" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="flex-grow relative" style={{ flexGrow: 1 }}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search products by name, SKU..." className="input-field w-full pl-12" style={{ width: '100%', paddingLeft: '3rem' }} />
          </div>
          <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary flex items-center gap-2"><FiFilter /> Filter</button>
            <button className="btn btn-secondary flex items-center gap-2">Export</button>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
          <table className="w-full" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-left border-b border-white/5" style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Product</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Category</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Price</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Stock</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px' }}>Status</th>
                <th className="pb-4 px-4 text-xs uppercase tracking-widest text-text-muted font-black text-right" style={{ padding: '0 1rem 1rem 1rem', fontSize: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '0.5rem', flexShrink: 0 }}>
                        <img src={product.primary_image?.image_path || `https://picsum.photos/seed/${product.id}/100`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ fontWeight: 700, fontSize: '0.875rem' }}>{product.name}</p>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 900 }}>SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <span className="text-sm font-medium text-text-secondary" style={{ fontSize: '0.875rem' }}>{product.category?.name}</span>
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <p className="font-black text-sm" style={{ fontWeight: 900, fontSize: '0.875rem' }}>${product.price}</p>
                    {product.compare_price && <p className="text-xs text-text-muted line-through" style={{ fontSize: '0.75rem', textDecoration: 'line-through' }}>${product.compare_price}</p>}
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <div className="flex flex-col gap-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span className={`text-sm font-bold ${product.stock < 10 ? 'text-danger' : 'text-text-secondary'}`} style={{ fontSize: '0.875rem' }}>{product.stock} in stock</span>
                      <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden" style={{ width: '5rem', height: '0.375rem', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <div className={`h-full ${product.stock < 10 ? 'bg-danger' : 'bg-success'}`} style={{ height: '100%', width: `${Math.min(100, product.stock)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ padding: '1rem' }}>
                    <span className={`badge py-1 px-3 text-[10px] uppercase font-bold ${product.status === 'active' ? 'badge-success' : 'badge-secondary'}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '10px' }}>
                      {product.status || 'active'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right" style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-all" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem' }}><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-all" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem' }}><FiTrash2 size={14} /></button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem' }}><FiMoreVertical size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card p-10 rounded-[32px] border-white/10"
              style={{ backgroundColor: 'var(--color-bg-card)', padding: '2.5rem', borderRadius: '2rem', overflowY: 'auto', maxWidth: '56rem', width: '100%' }}
            >
              <h2 className="text-3xl font-black mb-8" style={{ fontWeight: 900 }}>{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="md:col-span-2 input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Product Name</label>
                  <input required className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="input-group">
                  <label>Category</label>
                  <select required className="input-field" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div className="input-group">
                  <label>Status</label>
                  <select className="input-field" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Price ($)</label>
                  <input required type="number" step="0.01" className="input-field" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>

                <div className="input-group">
                  <label>Compare Price ($)</label>
                  <input type="number" step="0.01" className="input-field" value={formData.compare_price} onChange={(e) => setFormData({...formData, compare_price: e.target.value})} />
                </div>

                <div className="input-group">
                  <label>Initial Stock</label>
                  <input required type="number" className="input-field" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>

                <div className="flex items-center gap-3 pt-8" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '2rem' }}>
                  <input type="checkbox" id="featured" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 accent-primary" />
                  <label htmlFor="featured" className="cursor-pointer font-bold">Mark as Featured</label>
                </div>

                <div className="md:col-span-2 input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Short Description</label>
                  <input className="input-field" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} />
                </div>

                <div className="md:col-span-2 input-group" style={{ gridColumn: 'span 2' }}>
                  <label>Detailed Description</label>
                  <textarea className="input-field min-h-[150px] py-4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 pt-8" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '2rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary px-8">Cancel</button>
                  <button type="submit" className="btn btn-primary px-12">Save Product</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
