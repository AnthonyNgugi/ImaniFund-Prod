'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="relative bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 h-20">
      
      {/* LEFT: Logo */}
      <div className="flex items-center z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-sky-100 text-xl">i</div>
          <span className="font-black text-slate-900 uppercase tracking-tighter text-xl">ImaniFund</span>
        </Link>
      </div>

      {/* CENTER: Public Links (Only visible if NOT logged in) */}
      {!user && (
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10 font-bold text-slate-500 text-[11px] uppercase tracking-widest">
          <a href="#" className="hover:text-sky-500 transition">Explore Campaigns</a>
          <a href="#" className="hover:text-sky-500 transition">How it Works</a>
          <a href="#" className="hover:text-sky-500 transition">Organisations</a>
        </div>
      )}
      
      {/* RIGHT: Auth Actions / Profile */}
      <div className="flex items-center gap-4 z-10">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-slate-400 leading-none">
                {user.is_verified ? 'Verified' : 'Pending Review'}
              </p>
              <p className="text-sm font-black text-slate-900 leading-tight">
                {user.account_type === 'merchant' ? user.organization_name : user.full_name}
              </p>
            </div>
            <button onClick={logout} className="p-2 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500">Login</Link>
            <Link href="/register" className="bg-sky-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}