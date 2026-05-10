import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiImage, FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    images: [] // This will store the actual File objects
  });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.categories || res.data));
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Update formData with new files
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category_id', formData.category_id);
      
      // Append each image
      formData.images.forEach((file, index) => {
        data.append(`images[${index}]`, file);
      });
      
      // If the backend expects 'primary_image' or 'images[]'
      // data.append('primary_image', formData.images[0]);

      await api.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
    marginTop: '8px'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '900',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '180px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', backgroundColor: 'transparent', color: '#6b7280', fontWeight: '900', cursor: 'pointer', marginBottom: '32px' }}
        >
          <FiArrowLeft /> BACK TO INVENTORY
        </button>

        <div style={{ backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #f3f4f6', padding: '40px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: '0 0 40px 0' }}>Create New Product</h1>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '32px' }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input 
                  required
                  type="text" 
                  style={inputStyle}
                  placeholder="e.g. Premium Leather Jacket"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select 
                  required
                  style={inputStyle}
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Price (DH)</label>
                <input 
                  required
                  type="number" 
                  style={inputStyle}
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label style={labelStyle}>Stock Quantity</label>
                <input 
                  required
                  type="number" 
                  style={inputStyle}
                  placeholder="0"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>Description</label>
              <textarea 
                rows="5"
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={labelStyle}>Product Images</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {previews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange} 
                />
                
                <div 
                  onClick={() => fileInputRef.current.click()}
                  style={{ 
                    aspectRatio: '1/1', 
                    backgroundColor: '#f9fafb', 
                    border: '2px dashed #e5e7eb', 
                    borderRadius: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#9ca3af',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#FF6600'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <FiPlus size={32} />
                  <span style={{ fontSize: '10px', fontWeight: '900', marginTop: '8px' }}>ADD PHOTO</span>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>Upload at least one clear photo of your product.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '32px' }}>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                style={{ padding: '16px 32px', borderRadius: '12px', fontWeight: '900', border: 'none', backgroundColor: '#f3f4f6', color: '#4b5563', cursor: 'pointer' }}
              >
                CANCEL
              </button>
              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  padding: '16px 48px', 
                  backgroundColor: '#FF6600', 
                  color: '#fff', 
                  borderRadius: '12px', 
                  fontWeight: '900', 
                  border: 'none', 
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(255, 102, 0, 0.2)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'CREATING...' : 'CREATE PRODUCT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
