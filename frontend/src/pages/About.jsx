import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiGlobe, FiTarget } from 'react-icons/fi';

export default function About() {
  return (
    <div className="page pt-32 pb-20" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container">
        <header className="page-header text-center mb-24" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem' }}>Our Story</h1>
          <p className="max-w-2xl mx-auto text-xl text-text-secondary leading-relaxed" style={{ color: 'var(--color-text-secondary)', maxWidth: '42rem', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.8 }}>
            LuxeStore was founded in 2026 with a simple mission: to bridge the gap between artisanal craftsmanship and modern elegance.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center', marginBottom: '8rem' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>The Pursuit of Excellence</h2>
            <p className="text-text-secondary text-lg mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', lineHeight: 1.8 }}>
              We believe that true luxury lies in the details. Every product in our collection is carefully selected for its quality, durability, and timeless design.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', lineHeight: 1.8 }}>
              Our team travels across the globe to partner with the world's finest artisans and designers, ensuring that every piece you buy from us is more than just a product—it's a statement of style and a commitment to quality.
            </p>
          </motion.div>
          <div className="glass-card rounded-[40px] overflow-hidden aspect-[4/5]" style={{ borderRadius: '2.5rem', overflow: 'hidden', aspectRatio: '4/5', border: '1px solid rgba(255,255,255,0.05)' }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" alt="Store Interior" className="w-full h-full object-cover" />
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          {[
            { icon: FiAward, title: 'Quality First', desc: 'We never compromise on material or build.' },
            { icon: FiUsers, title: 'Client Centric', desc: 'Your satisfaction is our ultimate metric.' },
            { icon: FiGlobe, title: 'Global Reach', desc: 'Bringing luxury to every corner of the world.' },
            { icon: FiTarget, title: 'Sustainability', desc: 'Committed to ethical and conscious luxury.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 text-center"
              style={{ padding: '2.5rem', borderRadius: '1.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6" style={{ width: '64px', height: '64px', borderRadius: '1rem', backgroundColor: 'rgba(108,92,231,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <item.icon size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h3>
              <p className="text-text-secondary" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
