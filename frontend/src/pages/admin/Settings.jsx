import { FiSettings, FiBell, FiShield, FiGlobe, FiDatabase } from 'react-icons/fi';

export default function Settings() {
  const sections = [
    { title: 'General Settings', icon: FiSettings, desc: 'Store name, logo, and basic information.' },
    { title: 'Notifications', icon: FiBell, desc: 'Email and system alert preferences.' },
    { title: 'Security', icon: FiShield, desc: 'API keys and admin access control.' },
    { title: 'Localization', icon: FiGlobe, desc: 'Currency, timezone, and language.' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pt-48 pb-20 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-500">Configure your store's backend and administrative preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(s => (
          <div key={s.title} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <s.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">{s.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
