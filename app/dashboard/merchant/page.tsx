"use client";
import React from 'react';
import useSWR from 'swr';
import { useAuth } from '@/context/AuthContext';
// import AuthProxy from '@/app/components/Proxy'; // Disabled for development

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
});

export default function InstitutionDashboard() {
  const { user } = useAuth();
  
  // SWR setup pointing to merchant stats
  const API_URL = 'http://127.0.0.1:8000/apps/imanifund/api/v2/merchant/stats';
  const { data, isLoading } = useSWR(API_URL, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false
  });

  // Helper for dynamic values with hardcoded Merchant fallbacks
  const val = (path: string, fallback: any) => {
    if (isLoading) return "...";
    const value = data ? path.split('.').reduce((o, i) => o?.[i], data) : null;
    return value ?? fallback;
  };

  return (
    // <AuthProxy>
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              {/* Institution/Layered Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-xl">ImaniFund</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all bg-sky-50 text-sky-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            Campaigns
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Treasury
          </a>

          <div className="pt-6">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Settings</p>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Account Profile
            </a>
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
            <p className="text-xl font-bold">KES {Number(val('treasury.balance', 84200)).toLocaleString()}</p>
            <button className="mt-4 w-full bg-sky-600 hover:bg-sky-500 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">Withdraw Funds</button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 flex flex-col">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8 w-full">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
            <span>Organization</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Campaigns</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.organization_name || 'Turkana Water Org'}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Verified Merchant</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-400">
              {user?.organization_name?.substring(0,2) || 'TW'}
            </div>
          </div>
        </div>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 w-full">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic">Campaign Analytics</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time performance across your active fundraisers.</p>
          </div>
          <div className="flex gap-3 shrink-0 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider">Export CSV</button>
            <button className="flex-1 md:flex-none px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-all shadow-md shadow-sky-100 uppercase tracking-wider">+ New Campaign</button>
          </div>
        </div>

        {/* MERCHANT STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 w-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-2xl font-black text-slate-900 italic">KES {val('stats.revenue', '1.42M')}</h3>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">↑ 12.5%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
              <h3 className="text-2xl font-black text-slate-900 italic">{val('stats.conversion', '4.2%')}</h3>
            </div>
            <div className="mt-2 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Avg. Benchmark</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Donors</p>
              <h3 className="text-2xl font-black text-slate-900 italic">{Number(val('stats.donors', 1842)).toLocaleString()}</h3>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">High Engagement</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Days to Goal</p>
              <h3 className="text-2xl font-black text-slate-900 italic">{val('stats.days_left', '14')} Days</h3>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase">Action Recommended</span>
            </div>
          </div>
        </div>

        {/* CAMPAIGN TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full grow flex flex-col">
          <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-widest">Active Fundraisers</h3>
            <div className="flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {data?.campaigns?.length || 3} Campaigns Total
            </div>
          </div>
          
          <div className="overflow-x-auto grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="px-8 py-4">Campaign Name</th>
                  <th className="px-8 py-4">Progress Indicator</th>
                  <th className="px-8 py-4">Total Raised</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.campaigns || [
                  { id: 'CAM-9042', name: 'Turkana Water Project', progress: 75, raised: 750000, status: 'LIVE' },
                  { id: 'CAM-8821', name: 'Education Outreach', progress: 40, raised: 120000, status: 'LIVE' },
                  { id: 'CAM-7712', name: 'Emergency Food Aid', progress: 95, raised: 1900000, status: 'LIVE' }
                ]).map((camp: any) => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors bg-white">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-900">{camp.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono uppercase tracking-tighter">ID: {camp.id}</p>
                    </td>
                    <td className="px-8 py-5 min-w-[200px]">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
                        <div 
                          className="h-full bg-sky-600 rounded-full transition-all duration-700" 
                          style={{ width: `${camp.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-2">{camp.progress}% of goal reached</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-900 italic">KES {camp.raised.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-lg border border-emerald-100 uppercase tracking-widest">
                        <span className="w-1 h-1 bg-emerald-600 rounded-full"></span>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-sky-600 font-bold text-[10px] hover:text-sky-800 underline underline-offset-4 uppercase tracking-widest">Edit Details</button>
                    </td>
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