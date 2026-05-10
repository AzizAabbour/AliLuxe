import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, FiFilter, FiEye, FiCheckCircle, FiXCircle, 
  FiTruck, FiPrinter, FiMoreHorizontal, FiPackage, FiX, FiUser, FiMapPin, FiPhone, FiCalendar
} from 'react-icons/fi';
import api from '../../api/axios';
import LoadingScreen from '../../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const printRef = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/admin/orders')
      .then(res => {
        setOrders(res.data.data || res.data.orders || res.data);
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-receipt').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore React state
  };

  const filteredOrders = Array.isArray(orders) 
    ? (filter === 'all' ? orders : orders.filter(o => o.status === filter))
    : [];

  if (loading && orders.length === 0) return <LoadingScreen />;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '180px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: '0 0 8px 0' }}>Orders Management</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Track and fulfill your customer orders worldwide.</p>
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: '#f3f4f6', borderRadius: '16px' }}>
          {['all', 'pending', 'confirmed', 'shipped'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{ 
                padding: '8px 24px', 
                borderRadius: '12px', 
                fontSize: '11px', 
                fontWeight: '900', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filter === f ? '#fff' : 'transparent',
                color: filter === f ? '#FF6600' : '#9ca3af',
                boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '30px', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Info</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Products</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</th>
                <th style={{ padding: '24px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '24px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid #f3f4f6' }}>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '24px' }}>
                    <div>
                      <p style={{ fontWeight: '900', color: '#111827', margin: 0 }}>#{order.order_number}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', margin: 0, fontWeight: '700' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: '900' }}>
                        {order.user?.name?.[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{order.user?.name}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{order.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <FiPackage color="#9ca3af" />
                       <span style={{ fontSize: '14px', fontWeight: '700', color: '#4b5563' }}>{order.items?.length || 0} items</span>
                    </div>
                  </td>
                  <td style={{ padding: '24px', fontWeight: '900', color: '#111827' }}>{order.total} DH</td>
                  <td style={{ padding: '24px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '10px', 
                      fontWeight: '900', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em',
                      backgroundColor: order.status === 'pending' ? '#fff7ed' : order.status === 'confirmed' ? '#eff6ff' : '#ecfdf5',
                      color: order.status === 'pending' ? '#ea580c' : order.status === 'confirmed' ? '#2563eb' : '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: 'fit-content'
                    }}>
                      <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: order.status === 'pending' ? '#ea580c' : order.status === 'confirmed' ? '#2563eb' : '#059669' 
                      }}></div>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      {order.status === 'pending' && (
                        <button onClick={() => handleStatusUpdate(order.id, 'confirmed')} style={{ padding: '8px', color: '#10b981', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}><FiCheckCircle size={20} /></button>
                      )}
                      <button onClick={() => handleViewOrder(order)} style={{ padding: '8px', color: '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}><FiEye size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {showModal && selectedOrder && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 2000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#fff', 
            width: '100%', 
            maxWidth: '600px', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>Order Details #{selectedOrder.order_number}</h2>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', backgroundColor: 'transparent', color: '#9ca3af', cursor: 'pointer' }}>
                <FiX size={24} />
              </button>
            </div>

            <div id="printable-receipt" style={{ padding: '32px', overflowY: 'auto' }}>
               {/* Receipt Header */}
               <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#FF6600', margin: '0 0 4px 0' }}>ALILUXE</h1>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Official Order Receipt</p>
               </div>

               {/* Info Grid */}
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div>
                    <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Customer</h3>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{selectedOrder.user?.name}</p>
                    <p style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0 0 0' }}>{selectedOrder.user?.email}</p>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Order Date</h3>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Shipping Address</h3>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{selectedOrder.shipping_address || 'No address provided'}</p>
                  </div>
               </div>

               {/* Items Table */}
               <div style={{ borderTop: '2px dashed #f3f4f6', paddingTop: '24px', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Order Items</h3>
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ flexGrow: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{item.product_name}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Quantity: {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: '900', color: '#111827' }}>{(item.price * item.quantity).toFixed(2)} DH</p>
                    </div>
                  ))}
               </div>

               {/* Summary */}
               <div style={{ borderTop: '2px solid #111827', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', color: '#4b5563' }}>Subtotal</span>
                    <span style={{ fontWeight: '700', color: '#111827' }}>{selectedOrder.total} DH</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontWeight: '700', color: '#4b5563' }}>Shipping</span>
                    <span style={{ fontWeight: '700', color: '#10b981' }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#111827' }}>Total</span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#FF6600' }}>{selectedOrder.total} DH</span>
                  </div>
               </div>
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '16px' }}>
              <button 
                onClick={handlePrint}
                style={{ 
                  flexGrow: 1,
                  backgroundColor: '#111827', 
                  color: '#fff', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  fontWeight: '900', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FiPrinter /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
