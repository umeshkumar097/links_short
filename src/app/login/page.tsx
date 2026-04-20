'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Redirect to the same page (middleware will now allow access to the dashboard)
        window.location.href = '/';
      } else {
        setError('Galat password! Phir se koshish karein.');
      }
    } catch (err) {
      setError('System error. Baad mein koshish karein.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0f111a] to-[#0f111a]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 group cursor-default">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center font-extrabold text-3xl text-white shadow-2xl shadow-indigo-600/30 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            L
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Access</h1>
          <p className="text-slate-500 mt-2 font-medium">Is dashboard ko access karne ke liye password dalein.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl shadow-black/50">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f111a]/50 border border-slate-800 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-700 font-mono"
              required 
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium animate-shake text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Unlock Dashboard'
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-12 text-sm font-medium">
          AICLEX<span className="text-indigo-500/50"> Free Short Link</span> © 2026
        </p>
      </div>
    </div>
  );
}
