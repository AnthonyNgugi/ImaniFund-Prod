'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [accountType, setAccountType] = useState<'individual' | 'merchant'>('individual');
  const [step, setStep] = useState<1 | 2>(1); 
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    otp: ''
  });

  const baseUrl = process.env.DJANGO_API_URL;

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${accountType}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });
      if (res.ok) setStep(2);
      else alert("Invalid credentials.");
    } catch (err) {
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/${accountType}/login/otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status) login(data.access_token, data.user);
      else alert(data.message || "Invalid OTP");
    } catch (err) {
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[2rem] shadow-xl shadow-sky-100 text-sky-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Welcome Back</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Secure Gateway • Step {step} of 2</p>
        </div>

        {/* Account Type Switcher */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex shadow-sm">
          <button 
            onClick={() => step === 1 && setAccountType('individual')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${accountType === 'individual' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-400'}`}
          >
            Individual
          </button>
          <button 
            onClick={() => step === 1 && setAccountType('merchant')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${accountType === 'merchant' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-400'}`}
          >
            Organization
          </button>
        </div>

        {/* Login Card */}
        <form onSubmit={step === 1 ? handleInitialLogin : handleVerifyOtp} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
            <input 
              type="text" 
              disabled={step === 2}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="2547XXXXXXXX" 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-slate-300 disabled:opacity-50" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <input 
              type="password" 
              disabled={step === 2}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••" 
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none placeholder:text-slate-300 disabled:opacity-50" 
            />
          </div>

          {/* OTP Field - Visible always but styled based on step */}
          <div className={`space-y-2 pt-2 border-t border-slate-50 transition-opacity ${step === 1 ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 ml-1">Enter 6-Digit OTP</label>
            <input 
              type="text" 
              maxLength={6}
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value})}
              placeholder="XXXXXX" 
              className="w-full px-6 py-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl text-center text-xl font-black tracking-[0.5em] text-emerald-600 focus:ring-0 outline-none placeholder:text-emerald-200" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 text-white py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? 'Processing...' : step === 1 ? 'Get OTP' : 'Verify & Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
          New to Imanifund? <Link href="/register" className="text-sky-500 border-b-2 border-sky-100 pb-0.5">Create Account</Link>
        </p>
      </div>
    </div>
  );
}