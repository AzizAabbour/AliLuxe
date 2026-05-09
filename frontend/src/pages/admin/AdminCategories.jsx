import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '', image: cat.image || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will affect all products in this category.')) {
      try {
        await api.delete(`/admin/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData);
        toast.success('Category updated');
      } else {
        await api.post('/admin/categories', formData);
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900 }}>Categories</h1>
          <p className="text-text-secondary">Organize your products into logical groups.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({name: '', description: '', image: ''}); setShowModal(true); }}
          className="btn btn-primary btn-lg"
        >
          <FiPlus className="mr-2" /> Add Category
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card overflow-hidden group"
            style={{ borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <div className="h-48 relative overflow-hidden" style={{ height: '12rem', position: 'relative' }}>
              <img 
                src={cat.image || `https://picsum.photos/seed/${cat.slug}/600/400`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={() => handleEdit(cat)} className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FiEdit2 /></button>
                <button onClick={() => handleDelete(cat.id)} className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-danger hover:text-white transition-all"><FiTrash2 /></button>
              </div>
            </div>
            <div className="p-6" style={{ padding: '1.5rem' }}>
              <h3 className="text-xl font-bold mb-2" style={{ fontWeight: 700 }}>{cat.name}</h3>
              <p className="text-sm text-text-secondary line-clamp-2" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {cat.description || 'No description provided.'}
              </p>
              <div className="mt-6 flex justify-between items-center" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary" style={{ fontSize: '10px', color: 'var(--color-primary)' }}>{cat.products_count || 0} Products</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted" style={{ fontSize: '10px' }}>Slug: {cat.slug}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card p-10 rounded-[32px]"
              style={{ backgroundColor: 'var(--color-bg-card)', padding: '2.5rem', borderRadius: '2rem', width: '100%' }}
            >
              <h2 className="text-2xl font-black mb-8" style={{ fontWeight: 900 }}>{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <form onSubmit={handleSubmit} className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>Category Name</label>
                  <input required className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Image URL</label>
                  <div className="relative">
                    <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" style={{ position: 'absolute', left: '1rem', top: '50%' }} />
                    <input className="input-field w-full pl-12" placeholder="https://..." value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} style={{ paddingLeft: '3rem' }} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea className="input-field min-h-[100px] py-3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ minHeight: '100px' }} />
                </div>
                <div className="flex justify-end gap-4 pt-6" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary px-8">Save Category</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
