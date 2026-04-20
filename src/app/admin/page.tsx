'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [password, setPassword] = useState('');
  const [rootDomain, setRootDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTenants = async () => {
    const res = await fetch('/api/clients');
    const data = await res.json();
    setTenants(data);
  };

  useEffect(() => {
    // Current domain detect karein (e.g. app.aiclex.com -> aiclex.com)
    const host = window.location.host;
    // Hamesha 'app.' prefix ko hatayein taaki root domain mile
    const cleanRoot = host.startsWith('app.') ? host.replace('app.', '') : host;
    setRootDomain(cleanRoot);
    fetchTenants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subdomain, password }),
    });
    setName('');
    setSubdomain('');
    setPassword('');
    fetchTenants();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-200 selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800 bg-[#0f111a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Master Admin</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Client Management</h1>
          <p className="text-slate-400 font-medium">Create and manage subdomains for your clients.</p>
        </section>

        {/* Create Client Form */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Create New Client</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Client Name (e.g. Aiclex Tech)" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-[#0f111a] border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-600 text-sm"
              required 
            />
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="subdomain (e.g. aiclex)" 
                value={subdomain} 
                onChange={(e) => setSubdomain(e.target.value)}
                className="w-full bg-[#0f111a] border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-600 text-sm"
                required 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-mono">.{rootDomain}</span>
            </div>
            <input 
              type="password" 
              placeholder="Client Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-[#0f111a] border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-600 text-sm"
              required 
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Register Client'}
            </button>
          </form>
        </section>

        {/* Tenants Table */}
        <section className="bg-[#1a1c2e]/30 border border-slate-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/20 text-slate-400 text-sm">
                <th className="p-5 font-semibold">Tenant Name</th>
                <th className="p-5 font-semibold">Subdomain</th>
                <th className="p-5 font-semibold">Links Count</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-500">No tenants registered yet.</td>
                </tr>
              ) : (
                tenants.map((tenant: any) => (
                  <tr key={tenant.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="p-5 font-bold text-white">{tenant.name}</td>
                    <td className="p-5 text-indigo-400 font-mono text-sm">{tenant.subdomain}.{rootDomain}</td>
                    <td className="p-5 text-slate-400">{tenant._count?.links || 0} links</td>
                    <td className="p-5 text-right">
                      <a 
                        href={`http://${tenant.subdomain}.${rootDomain}`} 
                        target="_blank"
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-white text-black rounded-lg hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        Open Dashboard
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
