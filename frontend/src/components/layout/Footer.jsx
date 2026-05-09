import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin, FiGlobe, FiChevronRight } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8" style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e5e5', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
          
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider" style={{ fontSize: '13px', fontWeight: 800, marginBottom: '1.5rem', color: '#333' }}>Customer Care</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-500" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px' }}>
              <li><Link to="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link to="#" className="hover:text-primary">Submit a Dispute</Link></li>
              <li><Link to="#" className="hover:text-primary">Policies & Rules</Link></li>
              <li><Link to="#" className="hover:text-primary">Get Paid for Your Feedback</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider" style={{ fontSize: '13px', fontWeight: 800, marginBottom: '1.5rem', color: '#333' }}>About Us</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-500" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px' }}>
              <li><Link to="/about" className="hover:text-primary">About AliLuxe</Link></li>
              <li><Link to="#" className="hover:text-primary">Sitemap</Link></li>
              <li><Link to="#" className="hover:text-primary">AliLuxe Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider" style={{ fontSize: '13px', fontWeight: 800, marginBottom: '1.5rem', color: '#333' }}>Sourcing on AliLuxe</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-500" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px' }}>
              <li><Link to="/shop" className="hover:text-primary">All Categories</Link></li>
              <li><Link to="#" className="hover:text-primary">Request for Quotation</Link></li>
              <li><Link to="#" className="hover:text-primary">Ready to Ship</Link></li>
              <li><Link to="#" className="hover:text-primary">Luxe Select</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider" style={{ fontSize: '13px', fontWeight: 800, marginBottom: '1.5rem', color: '#333' }}>Sell on AliLuxe</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-500" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px' }}>
              <li><Link to="#" className="hover:text-primary">Supplier Membership</Link></li>
              <li><Link to="#" className="hover:text-primary">Learning Center</Link></li>
              <li><Link to="#" className="hover:text-primary">Partner Program</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider" style={{ fontSize: '13px', fontWeight: 800, marginBottom: '1.5rem', color: '#333' }}>Trade Services</h4>
            <ul className="flex flex-col gap-3 text-xs text-gray-500" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '12px' }}>
              <li><Link to="#" className="hover:text-primary">Trade Assurance</Link></li>
              <li><Link to="#" className="hover:text-primary">Business Identity</Link></li>
              <li><Link to="#" className="hover:text-primary">Logistics Service</Link></li>
              <li><Link to="#" className="hover:text-primary">Production Monitoring</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100" style={{ paddingTop: '2.5rem', borderTop: '1px solid #f5f5f5' }}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
            <div className="flex gap-6 items-center" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <span className="text-xs text-gray-400 font-bold" style={{ fontSize: '11px', fontWeight: 700 }}>Follow us:</span>
              <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
                  <a key={i} href="#" className="text-gray-400 hover:text-primary transition-colors">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
               <div className="flex items-center gap-2 text-xs text-gray-500" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px' }}>
                 <FiGlobe /> <span>English - USD</span>
               </div>
               <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50" style={{ height: '1rem' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50" style={{ height: '1rem' }} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50" style={{ height: '1.5rem' }} />
              </div>
            </div>
          </div>

          <div className="text-center" style={{ textAlign: 'center' }}>
            <p className="text-[11px] text-gray-400 leading-relaxed" style={{ fontSize: '11px', lineHeight: 1.8, color: '#999' }}>
              AliLuxe.com Site: <Link to="#" className="hover:underline">International</Link> - <Link to="#" className="hover:underline">Español</Link> - <Link to="#" className="hover:underline">Português</Link> - <Link to="#" className="hover:underline">Deutsch</Link> - <Link to="#" className="hover:underline">Français</Link> - <Link to="#" className="hover:underline">Italiano</Link> - <Link to="#" className="hover:underline">Русский</Link> - <Link to="#" className="hover:underline">한국어</Link> - <Link to="#" className="hover:underline">日本語</Link><br />
              AliLuxe Group | AliLuxe Marketplace | AliLuxe Cloud | AliPay | Lazada<br />
              Browse Alphabetically: <Link to="#" className="hover:underline">Onetouch</Link> - <Link to="#" className="hover:underline">Showroom</Link> - <Link to="#" className="hover:underline">Country Search</Link><br />
              <span className="mt-4 block" style={{ marginTop: '1rem', display: 'block' }}>&copy; 2026 AliLuxe.com. All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
