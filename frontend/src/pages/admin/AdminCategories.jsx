import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiGrid, FiX } from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(res => {
        setCategories(res.data.categories || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const request = editingCategory 
      ? api.put(`/admin/categories/${editingCategory.id}`, formData)
      : api.post('/admin/categories', formData);

    request
      .then(() => {
        toast.success(editingCategory ? 'Category updated' : 'Category created');
        setShowModal(false);
        fetchCategories();
      })
      .catch(err => {
        toast.error('Error saving category');
        console.error(err);
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure? This will affect products in this category.')) {
      api.delete(`/admin/categories/${id}`)
        .then(() => {
          toast.success('Category deleted');
          fetchCategories();
        })
        .catch(err => toast.error('Error deleting category'));
    }
  };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  if (loading && categories.length === 0) return <LoadingScreen />;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '180px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: '0 0 8px 0' }}>Categories Management</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Organize your products into logical collections.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ 
            backgroundColor: '#FF6600', 
            color: '#fff', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            fontWeight: '900', 
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(255, 102, 0, 0.2)'
          }}
        >
          <FiPlus size={20} /> New Category
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '20px', border: '1px solid #f3f4f6', marginBottom: '32px', display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            style={{ width: '100%', padding: '14px 16px 14px 48px', backgroundColor: '#f9fafb', border: 'none', borderRadius: '14px', outline: 'none' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category Name</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Slug</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Products Count</th>
                <th style={{ padding: '24px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid #f3f4f6' }}>
              {filteredCategories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6600' }}>
                        <FiGrid size={20} />
                      </div>
                      <span style={{ fontWeight: '900', color: '#111827' }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '24px', color: '#6b7280', fontSize: '14px' }}>{cat.slug}</td>
                  <td style={{ padding: '24px', color: '#111827', fontWeight: '700' }}>{cat.products_count || 0} Products</td>
                  <td style={{ padding: '24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        style={{ padding: '8px', color: '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} style={{ padding: '8px', color: '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP */}
      {showModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 2000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ 
            backgroundColor: '#fff', 
            width: '100%', 
            maxWidth: '450px', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', backgroundColor: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Electronics"
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', outline: 'none', fontWeight: '700' }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Slug (URL)</label>
                <input 
                  type="text" 
                  required
                  placeholder="electronics"
                  style={{ width: '100%', padding: '14px 16px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '12px', outline: 'none', color: '#6b7280' }}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                disabled={saving}
                style={{ 
                  width: '100%', 
                  backgroundColor: '#FF6600', 
                  color: '#fff', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  fontWeight: '900', 
                  border: 'none', 
                  cursor: 'pointer',
                  opacity: saving ? 0.7 : 1
                }}
              >
                {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
