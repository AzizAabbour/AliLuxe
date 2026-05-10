import { FiActivity, FiTrendingUp, FiBarChart2, FiPieChart } from 'react-icons/fi';

export default function Analytics() {
  return (
    <div className="max-w-[1400px] mx-auto pt-48 pb-20 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Store Analytics</h1>
        <p className="text-gray-500">Real-time data and performance insights for your business.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm h-96 flex flex-col items-center justify-center text-gray-400">
          <FiBarChart2 size={64} className="mb-6 opacity-20" />
          <p className="text-xl font-bold">Sales Over Time</p>
          <p>Chart data will appear here.</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm h-96 flex flex-col items-center justify-center text-gray-400">
          <FiPieChart size={64} className="mb-6 opacity-20" />
          <p className="text-xl font-bold">Category Distribution</p>
          <p>Chart data will appear here.</p>
        </div>
      </div>
    </div>
  );
}
