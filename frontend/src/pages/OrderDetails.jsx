import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard, FiCheckCircle, FiClock, FiCalendar, FiDownload, FiStar } from 'react-icons/fi';
import api from '../api/axios';
import LoadingScreen from '../components/ui/LoadingScreen';
import toast from 'react-hot-toast';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => {
        setOrder(res.data.data || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load order details');
        navigate('/orders');
      });
  }, [id, navigate]);

  if (loading) return <LoadingScreen />;
  if (!order) return null;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-50';
      case 'pending': return 'text-orange-500 bg-orange-50';
      case 'shipped': return 'text-blue-500 bg-blue-50';
      case 'cancelled': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-40 pb-20" style={{ backgroundColor: '#f8f9fa', paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link to="/orders" className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary transition-all">
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order #{order.order_number}</h1>
              <p className="text-gray-500 font-medium">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <FiDownload /> Invoice
            </button>
            <div className={`px-6 py-3 rounded-xl font-bold ${getStatusColor(order.status)}`}>
               {order.status?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Products List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50">
                  <h3 className="text-xl font-black text-gray-900">Order Items</h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {order.items?.map((item) => (
                    <div key={item.id} className="p-8 flex items-center gap-6 group hover:bg-gray-50 transition-colors">
                       <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                          <img src={item.product?.primary_image?.image_path || `https://picsum.photos/seed/${item.id}/200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.product_name} />
                       </div>
                       <div className="flex-grow">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">{item.product_name}</h4>
                          <p className="text-sm text-gray-500 mb-4">Unit Price: {item.price} DH</p>
                          <div className="flex items-center gap-4">
                             <Link to={`/product/${item.product?.slug}`} className="text-sm font-black text-primary hover:underline">View Product</Link>
                             <button className="text-sm font-black text-gray-400 hover:text-gray-900 flex items-center gap-1">
                                <FiStar /> Review
                             </button>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-gray-900">{(item.price * item.quantity).toFixed(2)} DH</p>
                          <p className="text-sm text-gray-400 font-bold">Qty: {item.quantity}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-8 bg-gray-50/50 flex flex-col gap-3">
                  <div className="flex justify-between text-gray-500 font-medium">
                     <span>Subtotal</span>
                     <span className="text-gray-900">{(order.total_amount || order.total).toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                     <span>Shipping Fee</span>
                     <span className="text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200 mt-2">
                     <span className="text-xl font-black text-gray-900">Total</span>
                     <span className="text-3xl font-black text-primary">{(order.total_amount || order.total).toFixed(2)} DH</span>
                  </div>
               </div>
            </div>

            {/* Tracking Progress (Dummy) */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
               <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <FiTruck className="text-primary" /> Delivery Status
               </h3>
               <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                  <div className="space-y-10 relative">
                     {[
                        { title: 'Order Placed', time: order.created_at, desc: 'We have received your order.', done: true },
                        { title: 'Payment Confirmed', time: order.created_at, desc: 'Payment was successfully processed.', done: true },
                        { title: 'Order Shipped', time: null, desc: 'Your package is on its way.', done: order.status === 'shipped' || order.status === 'completed' },
                        { title: 'Delivered', time: null, desc: 'Successfully delivered to your address.', done: order.status === 'completed' },
                     ].map((step, i) => (
                        <div key={i} className="flex items-start gap-8 pl-1">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.done ? 'bg-primary text-white' : 'bg-white border-2 border-gray-100 text-gray-300 shadow-sm'}`}>
                              {step.done ? <FiCheckCircle size={16} /> : <FiClock size={16} />}
                           </div>
                           <div>
                              <p className={`font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                              {step.time && <p className="text-xs text-gray-400 mb-1">{new Date(step.time).toLocaleString()}</p>}
                              <p className="text-sm text-gray-500">{step.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Customer & Shipping */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
               <div>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <FiMapPin className="text-primary" /> Shipping Address
                  </h4>
                  <div className="text-gray-900">
                     <p className="font-black text-lg">{order.shipping_first_name} {order.shipping_last_name}</p>
                     <p className="text-gray-600 leading-relaxed mt-1">
                        {order.shipping_address}<br />
                        {order.shipping_city}, {order.shipping_postal_code}<br />
                        {order.shipping_phone}
                     </p>
                  </div>
               </div>

               <div className="pt-8 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <FiCreditCard className="text-primary" /> Payment Method
                  </h4>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                     <div className="text-2xl">💳</div>
                     <div>
                        <p className="font-bold text-gray-900">Credit Card</p>
                        <p className="text-xs text-gray-500">Ending in •••• 4242</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-8 text-white">
               <h4 className="text-xl font-black mb-4">Need Help?</h4>
               <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  If you have any questions regarding your order, please contact our 24/7 customer support.
               </p>
               <Link to="/contact" className="block w-full py-4 bg-primary text-white text-center rounded-xl font-black hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-orange-500/20">
                  Contact Support
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
