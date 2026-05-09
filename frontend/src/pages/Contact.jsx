import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div className="page pt-32 pb-20" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container">
        <header className="page-header text-center mb-24" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem' }}>Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed" style={{ color: 'var(--color-text-secondary)', maxWidth: '42rem', margin: '0 auto', fontSize: '1.25rem' }}>
            Whether you have a question about our collections or need assistance with an order, our expert team is here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem' }}>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 md:p-12"
            style={{ padding: '3rem', borderRadius: '2rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <h2 className="text-3xl font-bold mb-8" style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '2rem' }}>Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input required type="text" className="input-field" placeholder="AABBOUR ABDELAZIZ" />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input required type="email" className="input-field" placeholder="aabbourabdelaziz@gmail.com" />
                </div>
              </div>  
              <div className="input-group">
                <label>Subject</label>
                <input required type="text" className="input-field" placeholder="How can we help?" />
              </div>
              <div className="input-group">
                <label>Message</label>
                <textarea required className="input-field min-h-[150px] py-4" placeholder="Your message here..." style={{ minHeight: '150px', padding: '1rem' }}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full h-14" style={{ width: '100%', height: '3.5rem' }}>
                Send Message <FiSend className="ml-2" />
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <div className="space-y-12" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="flex items-start gap-6" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0" style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: 'rgba(108,92,231,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Our Location</h3>
                  <p className="text-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>562 SIDI MOUMEN, JAOUHARA, Casablanca, Morocco</p>
                </div>
              </div>

              <div className="flex items-start gap-6" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0" style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: 'rgba(0,206,201,0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiPhone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Call Us</h3>
                  <p className="text-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>+217 77 99 69 988</p>
                </div>
              </div>

              <div className="flex items-start gap-6" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0" style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: 'rgba(253,121,168,0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiMail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Email Support</h3>
                  <p className="text-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>support@luxestore.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white flex-shrink-0" style={{ width: '56px', height: '56px', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiClock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Opening Hours</h3>
                  <p className="text-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>Mon - Sat: 10:00 AM - 9:00 PM<br />Sun: 12:00 PM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="glass-card h-80 rounded-3xl overflow-hidden" style={{ height: '20rem', borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              {/* Mock Google Map */}
              <div className="w-full h-full bg-bg-card flex items-center justify-center text-text-muted" style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-bg-card)' }}>
                <FiMapPin size={48} className="opacity-20" />
                <span className="ml-4 font-bold" style={{ marginLeft: '1rem', fontWeight: 700 }}>Interactive Map</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
