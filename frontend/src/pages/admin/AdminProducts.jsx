import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiFilter, 
  FiChevronRight, FiImage, FiPackage, FiMoreVertical, FiExternalLink, FiX, FiCheckCircle
} from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products?include_inactive=1&per_page=100')
      .then(res => {
        const productList = res.data.data || res.data;
        setProducts(Array.isArray(productList) ? productList : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    api.get('/categories').then(res => setCategories(res.data.categories || res.data));
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category_id: product.category_id,
      is_active: product.is_active
    });
    setShowModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setSaving(true);
    api.put(`/admin/products/${editingProduct.id}`, formData)
      .then(() => {
        toast.success('Product updated successfully');
        setShowModal(false);
        fetchProducts();
      })
      .catch(err => {
        toast.error('Error updating product');
        console.error(err);
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      api.delete(`/admin/products/${id}`)
        .then(() => {
          toast.success('Product deleted');
          fetchProducts();
        })
        .catch(() => toast.error('Error deleting product'));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
    marginTop: '6px'
  };

  const labelStyle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  };

  if (loading && products.length === 0) return <LoadingScreen />;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '180px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: '0 0 8px 0' }}>Products Inventory</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Manage your store's products, stock, and pricing.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products/create')}
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
          <FiPlus size={20} /> Create Product
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '20px', border: '1px solid #f3f4f6', marginBottom: '32px', display: 'flex', gap: '16px' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
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
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stock</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '24px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid #f3f4f6' }}>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                        <img 
                          src={product.primary_image?.image_path ? `http://localhost:8000/storage/${product.primary_image.image_path}` : 'https://via.placeholder.com/100'} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <div>
                        <p style={{ fontWeight: '900', color: '#111827', margin: 0 }}>{product.name}</p>
                        <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', margin: '4px 0 0 0' }}>ID: #{product.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <span style={{ padding: '4px 12px', backgroundColor: '#f3f4f6', color: '#4b5563', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>
                      {product.category?.name || 'General'}
                    </span>
                  </td>
                  <td style={{ padding: '24px', fontWeight: '900', color: '#111827' }}>{product.price} DH</td>
                  <td style={{ padding: '24px', fontWeight: '700', color: '#4b5563' }}>{product.stock} pcs</td>
                  <td style={{ padding: '24px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '10px', 
                      fontWeight: '900', 
                      backgroundColor: product.is_active ? '#ecfdf5' : '#fef2f2', 
                      color: product.is_active ? '#059669' : '#ef4444' 
                    }}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button onClick={() => handleEditClick(product)} style={{ padding: '8px', color: '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}><FiEdit2 size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} style={{ padding: '8px', color: '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '20px' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>Update Product</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', backgroundColor: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Product Name</label>
                <input type="text" required style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Price (DH)</label>
                  <input type="number" required style={inputStyle} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input type="number" required style={inputStyle} value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <input 
                  type="checkbox" 
                  id="is_active"
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <label htmlFor="is_active" style={{ fontSize: '14px', fontWeight: '700', color: '#111827', cursor: 'pointer' }}>Product is Active</label>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                style={{ width: '100%', backgroundColor: '#FF6600', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'UPDATING...' : 'SAVE CHANGES'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
