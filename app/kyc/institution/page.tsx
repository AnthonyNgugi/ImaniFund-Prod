'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

/**
 * IMANIFUND INSTITUTION KYC
 * EXACT UI/UX RESTORED + PRODUCTION LOGIC
 */
export default function InstitutionKYC() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track selection state for visual feedback
  const [selected, setSelected] = useState({
    registration_certificate: false,
    institution_kra_pin: false,
    board_resolution: false,
    director_id_image_front: false,
    director_id_image_back: false,
    director_kra_pic_certificate: false,
    selfie: false,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setSelected((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append('merchant_id', '2'); 

    try {
      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("✅ Documents submitted successfully!");
      } else {
        const result = await response.json();
        alert(`❌ Error: ${result.details || 'Upload failed'}`);
      }
    } catch (error) {
      alert("❌ Critical Error: Could not reach the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-12 font-sans text-slate-900">
      <form onSubmit={handleSubmit} className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR SECTION */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-sky-200 text-xl">i</div>
              <span className="font-black text-slate-900 tracking-tighter text-xl uppercase italic">ImaniFund</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter mb-4">Institution<br/>Verification</h2>
            <div className="space-y-4 pt-8 border-t border-slate-100">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Completion</span>
                <span className="text-sm font-black text-sky-500">{isSubmitting ? '...' : '25%'}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-sky-500 transition-all duration-700 ${isSubmitting ? 'w-full animate-pulse' : 'w-1/4'}`}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Required Steps</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <p className="text-sm font-bold text-slate-800">Account Created</p>
              </div>
              <div className="flex gap-4 group">
                <div className="w-6 h-6 rounded-full border-2 border-sky-500 flex items-center justify-center text-sky-500 flex-shrink-0">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm font-black text-slate-900">Upload Documents</p>
              </div>
              <div className="flex gap-4 opacity-40">
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex-shrink-0"></div>
                <p className="text-sm font-bold text-slate-500">Director Verification</p>
              </div>
              <div className="flex gap-4 opacity-40">
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex-shrink-0"></div>
                <p className="text-sm font-bold text-slate-500">Final Review</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Safe & Secure</span>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-70 italic">Your corporate files are encrypted. ImaniFund ensures full AML/KYC compliance.</p>
            </div>
          </div>

          <div className="bg-sky-50 p-8 rounded-[2.5rem] border border-sky-100">
            <h4 className="text-sky-900 font-black text-sm uppercase mb-2">Need Help?</h4>
            <p className="text-sky-700/70 text-xs font-bold mb-4 leading-tight">Our compliance team is available 24/7 to assist with your documents.</p>
            <button type="button" className="w-full bg-white text-sky-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-sky-500 hover:text-white transition-all">Chat With Support</button>
          </div>
        </div>

        {/* FORM CONTENT SECTION */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between ml-4 mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">01. Company Documents</p>
            <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-3 py-1 rounded-full uppercase">
              {Object.values(selected).filter(v => v).length} Captured
            </span>
          </div>
          
          <div className="space-y-3">
            <FileRow 
              name="registration_certificate" 
              label="Registration Certificate" 
              sub="Official Registration" 
              isSelected={selected.registration_certificate} 
              onChange={handleFileChange}
              icon={<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>}
            />
            <FileRow 
              name="institution_kra_pin" 
              label="Institution KRA PIN" 
              sub="Tax Document" 
              isSelected={selected.institution_kra_pin} 
              onChange={handleFileChange}
              icon={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></>}
            />
            <FileRow 
              name="board_resolution" 
              label="Board Resolution" 
              sub="Authorization Letter" 
              isSelected={selected.board_resolution} 
              onChange={handleFileChange}
              icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>}
            />
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-2 mt-8">02. Director Information</p>
          <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input type="text" name="director_fullname" placeholder="Director Name" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Number</label>
                    <input type="tel" name="director_mobile_number" placeholder="07XX XXX XXX" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">National ID</label>
                    <input type="text" name="director_id_number" placeholder="12345678" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">KRA Personal PIN</label>
                    <input type="text" name="director_kra_pin" placeholder="A00XXXXXXXX" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none" />
                  </div>
              </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-2 mt-8">03. Identity Proof</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FileCard name="director_id_image_front" label="ID Front" isSelected={selected.director_id_image_front} onChange={handleFileChange} svg={<><rect width="18" height="12" x="3" y="6" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10"/></>} />
              <FileCard name="director_id_image_back" label="ID Back" isSelected={selected.director_id_image_back} onChange={handleFileChange} svg={<><rect width="18" height="12" x="3" y="6" rx="2" ry="2"/><line x1="3" y1="14" x2="21" y2="14"/></>} />
              <FileCard name="director_kra_pic_certificate" label="KRA PIN" isSelected={selected.director_kra_pic_certificate} onChange={handleFileChange} svg={<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>} />
              <FileCard name="selfie" label="Selfie" isSelected={selected.selfie} onChange={handleFileChange} svg={<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>} />
          </div>

          <div className="pt-10">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-sky-500 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-sky-100 hover:bg-sky-600 transition-all transform hover:-translate-y-1 active:scale-[0.98] ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Complete Institution KYC'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FileRow({ name, label, sub, isSelected, onChange, icon }: any) {
  return (
    <label className={`bg-white p-5 rounded-[2rem] border-2 transition-all group flex items-center justify-between cursor-pointer ${isSelected ? 'border-sky-500' : 'border-slate-100 hover:border-sky-500'}`}>
      <input type="file" name={name} className="hidden" onChange={onChange} required={!isSelected} />
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${isSelected ? 'bg-sky-50 text-sky-500' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
        </div>
        <div>
          <h3 className="font-black text-slate-800 text-md tracking-tight leading-none">{label}</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase mt-1.5 tracking-tight italic leading-none">{sub}</p>
        </div>
      </div>
      <div className={`${isSelected ? 'bg-sky-500' : 'bg-slate-900 group-hover:bg-sky-500'} text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-slate-200`}>
        {isSelected ? 'Done' : 'Upload'}
      </div>
    </label>
  );
}

function FileCard({ name, label, isSelected, onChange, svg }: any) {
  return (
    <label className={`bg-white p-4 rounded-[2rem] border-2 transition-all cursor-pointer group flex flex-col items-center gap-3 ${isSelected ? 'border-sky-500 shadow-md' : 'border-slate-100 hover:border-sky-500'}`}>
      <input type="file" name={name} className="hidden" onChange={onChange} required={!isSelected} />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-sky-50 text-sky-500' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>
      </div>
      <span className={`text-[9px] font-black uppercase ${isSelected ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'}`}>{label}</span>
    </label>
  );
}