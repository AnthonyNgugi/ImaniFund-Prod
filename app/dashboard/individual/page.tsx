"use client";
import useSWR from 'swr';
import Link from 'next/link'; // Added Link import
// import AuthProxy from '@/app/components/Proxy'; // Disabled for development
import { useAuth } from '@/context/AuthContext';

// 1. Simplified Fetcher (No token requirement for now)

const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
});

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Using SWR but allowing development without a live token
  const API_URL = `${baseUrl}/auth/stats`;
  const { data, isLoading } = useSWR(API_URL, fetcher, {
    revalidateOnFocus: false, // Prevents constant refreshing during dev
    shouldRetryOnError: false
  });

  // 2. Helper to access data with hardcoded fallbacks for UI testing
  const val = (path: string, fallback: any) => {
    if (isLoading) return "...";
    const value = data ? path.split('.').reduce((o, i) => o?.[i], data) : null;
    return value ?? fallback;
  };

  return (
    // <AuthProxy> (Commented out until development is complete)
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900">
        
        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">ImaniPersonal</span>
          </div>
          <button className="p-2 text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </div>

        {/* SIDEBAR */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen shrink-0">
          <div className="p-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-xl">ImaniPersonal</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Creator Tools</p>
            <Link href="/dashboard/individual" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all bg-sky-50 text-sky-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              Overview
            </Link>
            <Link href="/dashboard/individual/campaigns" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Campaigns
            </Link>
            <Link href="/dashboard/individual/transfers" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
              Transfers
            </Link>
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Available for Payout</p>
              <p className="text-xl font-bold italic">
                KES {Number(val('stats.available_payout', 12400)).toLocaleString()}
              </p>
              <Link href="/dashboard/individual/transfers">
                <button className="mt-4 w-full bg-sky-600 hover:bg-sky-500 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">Settle Funds</button>
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-10 flex flex-col gap-6 md:gap-8">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight italic">Account Overview</h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">Real-time performance metrics.</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 md:p-3 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
              <div className="w-10 h-10 bg-sky-100 rounded-full border border-sky-200 flex items-center justify-center font-bold text-sky-700 shrink-0">
                {user?.full_name?.substring(0,2) || 'AM'}
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm font-bold text-slate-900">{user?.full_name || 'Abdi Malik'}</p>
                <p className="text-[10px] text-sky-600 font-bold uppercase tracking-tight">Verified Individual</p>
              </div>
            </div>
          </header>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lifetime Volume</p>
                <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 italic">
                KES {Number(val('stats.lifetime_volume', 482900)).toLocaleString()}
              </h3>
              <p className="text-[10px] font-bold text-emerald-600 mt-1">↑ 14% this month</p>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Gift</p>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="7" r="4"/></svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 italic">
                KES {Number(val('stats.average_gift', 3250)).toLocaleString()}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{val('stats.contributors_count', 148)} contributors</p>
            </div>

            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2 md:mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Rate</p>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 italic">{val('stats.success_rate', '98.4%')}</h3>
              <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-tighter">Optimal Speed</p>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col grow">
            <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tighter">Donation Flow</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Across all campaigns</p>
              </div>
              <button className="w-full md:w-auto text-[10px] font-black uppercase text-sky-600 border border-sky-100 px-4 py-2 rounded-xl hover:bg-sky-50 transition-colors bg-white">Download CSV</button>
            </div>
            
            <div className="hidden md:block overflow-x-auto grow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                    <th className="px-8 py-4">Contributor</th>
                    <th className="px-8 py-4">Campaign Target</th>
                    <th className="px-8 py-4 text-center">Channel</th> 
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Status</th> 
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.flow || [
                    { id: 1, contributor: 'Jane Njeri', target: 'School Fees for Mercy', channel: 'M-PESA', amount: 5000, status: 'Success', date: 'Today, 14:20', ref: 'TXN-492102', initials: 'JN' },
                    { id: 2, contributor: 'Kevin Omari', target: 'Boda Boda Repair', channel: 'CARD', amount: 1200, status: 'Success', date: 'Yesterday', ref: 'TXN-492101', initials: 'KO' }
                  ]).map((row: any) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors bg-white">
                      <td className="px-8 py-6 flex items-center gap-3">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {row.initials}
                        </div>
                        <p className="text-sm font-bold text-slate-900">{row.contributor}</p>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{row.target}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-[9px] font-bold text-slate-400 border border-slate-100 px-2 py-1 rounded">{row.channel}</span>
                      </td>
                      <td className="px-8 py-6 font-bold text-sky-600 italic">KES {row.amount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${row.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[11px] text-slate-400">{row.date}</td>
                      <td className="px-8 py-6 text-right font-mono text-[10px] text-slate-400">{row.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    // </AuthProxy>
  );
}