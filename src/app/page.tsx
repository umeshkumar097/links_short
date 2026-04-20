import { redirect } from 'next/navigation';

export default function Home() {
  // Option 1: Just redirect to the admin panel if it's the root domain
  // redirect('http://app.localhost:3000');
  
  // Option 2: Show a landing page
  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-200 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center font-extrabold text-4xl text-white shadow-2xl shadow-indigo-600/30 mb-8">
        A
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4">
        AICLEX<span className="text-indigo-500"> Free Short Link</span>
      </h1>
      <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mb-12">
        The premium multi-tenant link management platform for modern teams.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        <div className="bg-[#1a1c2e] border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-all cursor-pointer group">
          <h3 className="text-xl font-bold text-white mb-2">Master Admin</h3>
          <p className="text-slate-500 text-sm mb-6">Manage clients, subdomains, and global infrastructure.</p>
          <a href="http://app.localhost:3000" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm">
            Launch Admin
          </a>
        </div>
        <div className="bg-[#1a1c2e] border border-slate-800 p-8 rounded-3xl hover:border-emerald-500/50 transition-all cursor-pointer group">
          <h3 className="text-xl font-bold text-white mb-2">Client Access</h3>
          <p className="text-slate-500 text-sm mb-6">Access your private dashboard via your assigned subdomain.</p>
          <span className="text-emerald-500 text-sm font-bold">yourname.ourdomain.in</span>
        </div>
      </div>
    </div>
  );
}
