'use client';

import { useState, useEffect } from 'react';

export default function Dashboard({ params }: { params: Promise<{ subdomain: string }> }) {
  const [subdomainName, setSubdomainName] = useState('');
  const [links, setLinks] = useState([]);
  const [slug, setSlug] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Links load karein
  const fetchLinks = async () => {
    const res = await fetch('/api/links');
    const data = await res.json();
    setLinks(data);
  };

  useEffect(() => {
    const loadSubdomain = async () => {
      const { subdomain } = await params;
      setSubdomainName(subdomain);
    };
    loadSubdomain();
    fetchLinks();
  }, [params]);

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, targetUrl }),
    });
    setSlug('');
    setTargetUrl('');
    fetchLinks();
  };

  // Verify Links Trigger
  const verifyLinks = async () => {
    setIsVerifying(true);
    await fetch('/api/verify', { method: 'POST' });
    await fetchLinks();
    setIsVerifying(false);
  };

  const totalClicks = links.reduce((acc, curr: any) => acc + (curr.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-200 selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f111a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20 uppercase">
              {subdomainName.charAt(0)}
            </div>
            <span className="text-xl font-bold tracking-tight text-white capitalize">{subdomainName} Dashboard</span>
          </div>
          <button 
            onClick={verifyLinks} 
            disabled={isVerifying}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              isVerifying 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-600/30'
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                Verifying...
              </span>
            ) : (
              'Verify All Links'
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-12">
        {/* Header Section with Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 font-medium">Manage and track your short links.</p>
          </div>
          <div className="bg-[#1a1c2e] border border-slate-800 p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Links</p>
            <p className="text-3xl font-bold text-white">{links.length}</p>
          </div>
          <div className="bg-[#1a1c2e] border border-slate-800 p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-indigo-400">{totalClicks}</p>
          </div>
        </section>

        {/* Create Link Card */}
        <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Create New Link
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">/</span>
              <input 
                type="text" 
                placeholder="slug (e.g. promo)" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#0f111a] border border-slate-800 text-white pl-7 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-sm"
                required 
              />
            </div>
            <div className="flex-[2]">
              <input 
                type="url" 
                placeholder="Target URL (e.g. https://google.com)" 
                value={targetUrl} 
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full bg-[#0f111a] border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-sm"
                required 
              />
            </div>
            <button type="submit" className="bg-white text-black hover:bg-indigo-500 hover:text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/20 whitespace-nowrap">
              Create Link
            </button>
          </form>
        </section>

        {/* Table Section */}
        <section className="bg-[#1a1c2e]/30 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/20">
                  <th className="p-5 text-slate-400 font-semibold text-sm">Short Link</th>
                  <th className="p-5 text-slate-400 font-semibold text-sm">Target URL</th>
                  <th className="p-5 text-slate-400 font-semibold text-sm text-center">Clicks</th>
                  <th className="p-5 text-slate-400 font-semibold text-sm text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-slate-500">No links created yet.</td>
                  </tr>
                ) : (
                  links.map((link: any) => (
                    <tr key={link.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono font-medium">/{link.slug}</span>
                          <button className="text-slate-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          </button>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="max-w-[300px] truncate text-slate-400 text-sm">{link.targetUrl}</div>
                      </td>
                      <td className="p-5 text-center">
                        <span className="px-3 py-1 bg-slate-800 rounded-full text-white font-bold text-xs">
                          {link.clicks}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        {link.httpStatus === 200 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Online
                          </span>
                        ) : link.httpStatus === null ? (
                          <span className="inline-flex items-center px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20">
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-xs font-bold border border-rose-500/20">
                            Error {link.httpStatus}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      
      <footer className="max-w-6xl mx-auto p-8 text-center text-slate-600 text-sm font-medium">
        Built with Premium Aesthetics & Next.js 16
      </footer>
    </div>
  );
}
