"use client";
import React, { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;

export default function TransfersPage() {
  const [selectedChannel, setSelectedChannel] = useState('mpesa');
  const [amount, setAmount] = useState('');

  // 1. Fetching real-time stats (Balance & History)
  const API_URL = `${baseUrl}/auth/stats`;
  const { data, isLoading } = useSWR(API_URL, fetcher);

  const balance = data?.stats?.available_payout || 124000.50;
  const history = data?.disbursements || [
    { id: 1, date: 'April 08, 2026', channel: 'M-Pesa', amount: 12500, status: 'Completed', color: 'emerald' },
    { id: 2, date: 'April 02, 2026', channel: 'Equity Bank', amount: 45000, status: 'Processing', color: 'sky' },
  ];

  const handleTransfer = () => {
    console.log(`Transferring KES ${amount} via ${selectedChannel}`);
    // Add your M-Pesa Daraja or B2C logic here
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* SIDEBAR */}
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
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Creator Tools</p>
          <Link href="/dashboard/individual" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Overview
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-sky-50 text-sky-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
            Transfers
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic uppercase">Settlements</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Move your funds to your preferred mobile wallet or bank account.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Select Payout Channel</label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* M-PESA */}
                  <button 
                    onClick={() => setSelectedChannel('mpesa')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all transform active:scale-95 ${selectedChannel === 'mpesa' ? 'bg-emerald-50 border-2 border-emerald-500 shadow-lg' : 'bg-slate-50 border-2 border-transparent hover:border-emerald-200'}`}
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                       <span className="text-emerald-600 font-black text-xs italic">M</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase ${selectedChannel === 'mpesa' ? 'text-emerald-700' : 'text-slate-400'}`}>M-Pesa</span>
                  </button>

                  {/* AIRTEL */}
                  <button 
                    onClick={() => setSelectedChannel('airtel')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all transform active:scale-95 ${selectedChannel === 'airtel' ? 'bg-red-50 border-2 border-red-500 shadow-lg' : 'bg-slate-50 border-2 border-transparent hover:border-red-200'}`}
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                       <span className="text-red-600 font-black text-xs italic">A</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase ${selectedChannel === 'airtel' ? 'text-red-700' : 'text-slate-400'}`}>Airtel</span>
                  </button>

                  {/* SASAPAY */}
                  <button 
                    onClick={() => setSelectedChannel('sasapay')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all transform active:scale-95 ${selectedChannel === 'sasapay' ? 'bg-orange-50 border-2 border-orange-500 shadow-lg' : 'bg-slate-50 border-2 border-transparent hover:border-orange-200'}`}
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                    </div>
                    <span className={`text-[10px] font-black uppercase ${selectedChannel === 'sasapay' ? 'text-orange-700' : 'text-slate-400'}`}>Sasapay</span>
                  </button>

                  {/* BANK */}
                  <button 
                    onClick={() => setSelectedChannel('bank')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all transform active:scale-95 ${selectedChannel === 'bank' ? 'bg-sky-50 border-2 border-sky-500 shadow-lg' : 'bg-slate-50 border-2 border-transparent hover:border-sky-200'}`}
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-sky-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <span className={`text-[10px] font-black uppercase ${selectedChannel === 'bank' ? 'text-sky-700' : 'text-slate-400'}`}>Bank</span>
                  </button>
                </div>

                <div className="mt-10 space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Amount to Transfer (KES)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-2xl font-black italic focus:border-sky-600 outline-none transition-all" 
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Note: Minimum withdrawal is KES 100.</p>
                </div>
              </div>

              {/* HISTORY */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 italic">Disbursement History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                            <th className="px-8 py-4">Date</th>
                            <th className="px-8 py-4">Channel</th>
                            <th className="px-8 py-4">Amount</th>
                            <th className="px-8 py-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {history.map((item: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-5 text-xs font-bold text-slate-500">{item.date}</td>
                              <td className="px-8 py-5">
                                  <span className={`text-[9px] font-black text-${item.color}-600 bg-${item.color}-50 px-2 py-1 rounded uppercase`}>{item.channel}</span>
                              </td>
                              <td className="px-8 py-5 font-black text-slate-900 italic">KES {item.amount.toLocaleString()}</td>
                              <td className="px-8 py-5 text-right">
                                  <span className={`text-[9px] font-black uppercase ${item.status === 'Processing' ? 'text-amber-500 italic animate-pulse' : 'text-emerald-600'}`}>{item.status}</span>
                              </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            </div>

            {/* SIDEBAR SUMMARY */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl shadow-sky-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Available Balance</p>
                <h2 className="text-4xl font-black italic mb-8">KES {balance.toLocaleString()}</h2>
                
                <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Transfer Limit</span>
                        <span className="text-white">Unlimited</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <span>Account Tier</span>
                        <span className="text-sky-400">Verified Individual</span>
                    </div>
                </div>

                <button 
                  onClick={handleTransfer}
                  disabled={!amount || Number(amount) < 100}
                  className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-6 rounded-2xl mt-10 font-black uppercase tracking-[0.2em] text-[12px] transition-all transform active:scale-95 shadow-lg shadow-sky-600/20"
                >
                    Confirm Transfer
                </button>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </div>
                      <div>
                          <h4 className="text-[11px] font-black uppercase text-slate-900">Need Help?</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Average payout time: 5 mins</p>
                      </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}