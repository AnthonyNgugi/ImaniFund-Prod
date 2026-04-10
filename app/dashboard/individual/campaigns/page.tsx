"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json()).then(res => res.data || []);

const baseUrl = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000';

export default function IndividualCampaignsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');

  const API_URL = `${baseUrl}/manage/savings-account/`;
  const { data: campaigns, isLoading } = useSWR(API_URL, fetcher);

  // Helper to calculate days remaining
  const getDaysRemaining = (dateString: string) => {
    const target = new Date(dateString);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const activeCampaigns = campaigns?.filter((c: any) => c.account_status === "ACTIVE") || [];
  const closedCampaigns = campaigns?.filter((c: any) => c.account_status !== "ACTIVE") || [];
  const displayCampaigns = activeTab === 'active' ? activeCampaigns : closedCampaigns;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-xl">ImaniPersonal</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard/individual" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Overview
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-sky-50 text-sky-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Campaigns
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic">Campaign Center</h1>
              <p className="text-slate-500 text-sm mt-1">One step at a time. Manage your fundraising journey.</p>
            </div>

            <button 
              onClick={() => router.push('/dashboard/individual/new')}
              className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-sky-100 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Start New Campaign
            </button>
          </header>

          <div className="flex mb-8">
            <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  activeTab === 'active' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setActiveTab('closed')}
                className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  activeTab === 'closed' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              <div className="py-20 text-center font-black uppercase tracking-[0.2em] text-slate-300 animate-pulse">
                Synchronizing Data...
              </div>
            ) : displayCampaigns.map((c: any) => {
              const balance = parseFloat(c.account_balance) || 0;
              const target = parseFloat(c.account_target) || 1;
              const progress = Math.min((balance / target) * 100, 100);
              const daysLeft = getDaysRemaining(c.target_date);

              return (
                <div key={c.id} className="bg-white rounded-[32px] border-2 border-sky-100 shadow-xl shadow-sky-50/50 overflow-hidden flex flex-col md:flex-row h-full md:h-72">
                  <div className="md:w-1/3 bg-slate-200 relative min-h-[200px]">
                    <img src={c.campaign_image || "/api/placeholder/400/300"} alt={c.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
                    <span className={`absolute top-6 left-6 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter ${activeTab === 'active' ? 'bg-sky-600' : 'bg-slate-500'}`}>
                      {activeTab === 'active' ? 'Live Now' : 'Closed'}
                    </span>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight italic">{c.title}</h3>
                        <span className="text-xs font-bold text-slate-400">
                          {activeTab === 'active' ? `Ends in ${daysLeft} Days` : 'Campaign Ended'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 max-w-xl">{c.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sky-600 text-lg italic">KES {balance.toLocaleString()}</span>
                            <span className="text-slate-400">raised of {Math.floor(target/1000)}k</span>
                          </div>
                          <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-sky-600 h-full rounded-full shadow-[0_0_12px_rgba(2,132,199,0.3)]" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                          Manage Campaign
                        </button>
                        <button className="border-2 border-slate-100 text-slate-600 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                          Share Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}