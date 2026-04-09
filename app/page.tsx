"use client";
import React from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json()).then(res => res.data || []);

export default function Home() {
  const router = useRouter();

  // 1. FETCH REAL CAMPAIGNS
  const API_URL = 'http://127.0.0.1:8000/apps/imanifund/api/v2/manage/savings-account/';
  const { data: campaigns, isLoading } = useSWR(API_URL, fetcher);

  // Helper for progress calculation
  const calculateProgress = (raised: string, target: string) => {
    const r = parseFloat(raised) || 0;
    const t = parseFloat(target) || 1;
    return Math.min(Math.round((r / t) * 100), 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. HERO SECTION */}
      <header className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
            Crowdfunding for Kenya
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-tight text-slate-800">
            Empower Change. <br /><span className="text-sky-600">Fund a Cause.</span>
          </h1>
          <p className="text-lg text-slate-500 mt-6 leading-relaxed max-w-lg">
            The most transparent way for individuals and NGOs in Kenya to raise funds for medical, 
            educational, and community projects. Verified by ImaniFund.
          </p>
          <div className="flex gap-4 mt-10 font-bold">
            <button 
              onClick={() => router.push('/dashboard/individual/new')}
              className="px-8 py-4 bg-sky-600 text-white rounded-xl shadow-lg hover:bg-sky-700 transition transform hover:-translate-y-1"
            >
              Start a Campaign
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
              Donate Now
            </button>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-sky-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse"></div>
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800" 
              alt="Community Support" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* 2. CATEGORY EXPLORER */}
      <section className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-center mb-10 text-slate-800 tracking-tight italic">Support what matters to you</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: "🏥", label: "Medical" },
            { icon: "🎓", label: "Education" },
            { icon: "🥘", label: "Hunger" },
            { icon: "🌳", label: "Climate" },
            { icon: "🐾", label: "Animals" },
            { icon: "🏗️", label: "Community" }
          ].map((cat) => (
            <button key={cat.label} className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition border border-slate-100 group">
              <span className="text-3xl mb-3 group-hover:scale-110 transition">{cat.icon}</span>
              <span className="font-bold text-sm text-slate-600 group-hover:text-sky-600 uppercase tracking-tighter">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. URGENT CAMPAIGNS (Real Data Integration) */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight italic">Urgent Campaigns</h2>
            <p className="text-slate-500 mt-2">Verified projects needing your immediate support.</p>
          </div>
          <a href="#" className="text-sky-600 font-bold border-b-2 border-sky-600 pb-1 hover:text-sky-700 transition uppercase text-xs tracking-widest">
            View All Projects
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {isLoading ? (
            // LOADING SKELETONS
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-100" />
            ))
          ) : campaigns?.slice(0, 6).map((c: any) => {
            const progress = calculateProgress(c.account_balance, c.account_target);
            
            return (
              <div key={c.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                <div className="h-48 bg-slate-200 relative">
                  <img 
                    src={c.campaign_image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=400"} 
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-sky-600 uppercase tracking-widest shadow-sm">
                    <span className="text-emerald-500 mr-1">●</span> {c.account_status}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-[10px]">🇰🇪</div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Campaign #{c.account_number}</span>
                    <span className="text-sky-500">✔</span>
                  </div>
                  
                  <h3 className="text-xl font-black mb-2 group-hover:text-sky-600 transition leading-tight italic truncate">
                    {c.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10 font-medium">
                    {c.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-black">
                      <span className="text-slate-700">KES {parseFloat(c.account_balance).toLocaleString()} <span className="font-bold text-slate-300 uppercase text-[10px] ml-1">raised</span></span>
                      <span className="text-sky-600 italic">{progress}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-sky-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(14,165,233,0.4)]" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Goal: KES {parseFloat(c.account_target).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-sky-600 transition transform active:scale-95 shadow-lg shadow-slate-100">
                    Donate Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. NGO PARTNERSHIP CTA */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full filter blur-[100px] opacity-20"></div>
          <div className="flex-1 z-10">
            <h2 className="text-4xl font-extrabold mb-6 italic tracking-tight">Are you a registered NGO?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg font-medium leading-relaxed">
              Join the ImaniFund Initiative to access verified donors and professional reporting tools for your community projects.
            </p>
            <button className="bg-sky-500 hover:bg-sky-600 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition shadow-xl shadow-sky-900/40 transform hover:-translate-y-1">
              Apply as an Organisation
            </button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 z-10 font-medium w-full">
             <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center uppercase tracking-widest text-[10px] backdrop-blur-sm">
                <div className="text-sky-400 text-xl font-black mb-1">Secure</div>
                <div className="text-slate-500 italic font-bold">Encrypted Flows</div>
             </div>
             <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center uppercase tracking-widest text-[10px] backdrop-blur-sm">
                <div className="text-sky-400 text-xl font-black mb-1">Fast</div>
                <div className="text-slate-500 italic font-bold">Mobile Payouts</div>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-sky-600 rounded flex items-center justify-center text-white text-[10px] font-bold">I</div>
            <span className="font-black text-slate-800 tracking-tighter uppercase text-sm">ImaniFund 2026</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            <a href="#" className="hover:text-sky-600 transition">Transparency</a>
            <a href="#" className="hover:text-sky-600 transition">Terms</a>
            <a href="#" className="hover:text-sky-600 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}