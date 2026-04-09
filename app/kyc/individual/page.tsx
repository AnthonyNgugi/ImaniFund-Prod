'use client';

import AuthProxy from '@/app/components/Proxy';
import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function IndividualKYC() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    id_image_front: null,
    id_image_back: null,
    profile_picture: null,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
    }
  };

  const removeFile = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: null }));
  };

  const submitKyc = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    const clientId = user?.client_id?.toString() || '7';
    formData.append('client_id', clientId); 
    
    if (files.id_image_front) formData.append('id_image_front', files.id_image_front);
    if (files.id_image_back) formData.append('id_image_back', files.id_image_back);
    if (files.profile_picture) formData.append('profile_picture', files.profile_picture);

    try {
      const response = await fetch('/api/kyc/upload/individual', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/status-tracker');
      } else {
        alert("❌ Upload failed.");
      }
    } catch (err) {
      alert("❌ Server connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthProxy>
    <div className="min-h-screen bg-slate-50 flex justify-center py-12 px-4 font-sans text-slate-900">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[2rem] shadow-xl shadow-sky-100 text-sky-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Verification</h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-2">Individual Account • Final Step</p>
        </div>

        <div className="space-y-4">
          <UploadStep 
            label="National ID (Front)"
            file={files.id_image_front}
            isLocked={false}
            onUpload={(e: any) => handleFileChange(e, 'id_image_front')}
            onRemove={() => removeFile('id_image_front')}
            icon={<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>}
          />

          <UploadStep 
            label="National ID (Back)"
            file={files.id_image_back}
            isLocked={!files.id_image_front}
            onUpload={(e: any) => handleFileChange(e, 'id_image_back')}
            onRemove={() => removeFile('id_image_back')}
            icon={<><rect width="18" height="12" x="3" y="6" rx="2" ry="2"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="7" x2="7" y1="14" y2="14"/><line x1="11" x2="11" y1="14" y2="14"/></>}
          />

          <UploadStep 
            label="Selfie (Profile)"
            file={files.profile_picture}
            isLocked={!files.id_image_back}
            onUpload={(e: any) => handleFileChange(e, 'profile_picture')}
            onRemove={() => removeFile('profile_picture')}
            icon={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
          />
        </div>

        {files.id_image_front && files.id_image_back && files.profile_picture && (
            <div className="mt-8">
                <button 
                  onClick={submitKyc}
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 text-white py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Verification'}
                </button>
            </div>
        )}
      </div>
    </div>
    </AuthProxy>
  );
}

// Sub-component with explicit return
function UploadStep({ label, file, isLocked, onUpload, onRemove, icon }: any) {
  if (isLocked) {
    return (
      <div className="bg-white/60 p-2 rounded-[2.5rem] border border-slate-100 opacity-60">
        <div className="flex items-center p-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-black text-slate-400 leading-none">{label}</h3>
            <p className="text-slate-300 text-[9px] font-black uppercase mt-1 italic tracking-widest">Locked</p>
          </div>
        </div>
      </div>
    );
  }

  if (file) {
    return (
      <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center p-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <div className="ml-4 flex-1 text-left">
            <h3 className="font-black text-slate-800 leading-none">{label}</h3>
            <p className="text-emerald-500 text-[10px] font-black uppercase mt-1">Uploaded</p>
          </div>
          <button onClick={onRemove} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-sky-100/50 border-2 border-sky-500 transition-all">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
          </div>
          <div className="ml-4 text-left">
            <h3 className="font-black text-slate-800 leading-none text-lg">{label}</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase mt-1">Pending</p>
          </div>
        </div>
        <label className="block w-full bg-sky-500 text-white py-4 rounded-2xl font-black text-sm uppercase text-center tracking-widest shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all cursor-pointer">
          Upload
          <input type="file" className="hidden" onChange={onUpload} accept="image/*" />
        </label>
      </div>
    </div>
  );
}