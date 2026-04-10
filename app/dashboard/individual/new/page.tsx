"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewIndividualCampaign() {
  const baseUrl = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000';
  const router = useRouter();
  
  // 1. STATE MANAGEMENT
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [categories, setCategories] = useState([]);
  const [linkTypes, setLinkTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    client_id: 7, 
    title: '',
    description: '',
    account_target: '',
    target_date: '',
    account_category_id: '',
    lock_status: 1, 
    video_links: [{ external_link_type_id: '', external_link: '' }]
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // 2. FETCH METADATA
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, linkRes] = await Promise.all([
          fetch(`${baseUrl}/manage/account-type/`),
          fetch(`${baseUrl}/manage/external-link-type/`)
        ]);
        
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.account_category || []);
        }
        if (linkRes.ok) {
          const data = await linkRes.json();
          setLinkTypes(data.external_link_type || []);
        }
      } catch (err) {
        console.error("Error fetching metadata:", err);
      }
    };
    fetchMetadata();
  }, []);

  // 3. HANDLERS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...formData.video_links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData(prev => ({ ...prev, video_links: updatedLinks }));
  };

  const addVideoLink = () => {
    setFormData(prev => ({
      ...prev,
      video_links: [...prev.video_links, { external_link_type_id: '', external_link: '' }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    const data = new FormData();
    data.append('client_id', formData.client_id.toString());
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('account_target', formData.account_target);
    data.append('target_date', formData.target_date);
    data.append('account_category_id', formData.account_category_id);
    data.append('lock_status', formData.lock_status.toString());
    data.append('video_links', JSON.stringify(formData.video_links));
    selectedImages.forEach((file) => data.append('pictures', file));

    try {
      const response = await fetch(`${baseUrl}/manage/savings-account/`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Campaign Created Successfully' });
        setTimeout(() => {
          router.push('/dashboard/individual/campaigns');
        }, 1500);
      } else {
        const errorData = await response.json();
        setStatus({ type: 'error', message: 'Failed to create campaign' });
        console.error(errorData);
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* STATUS NOTIFICATION */}
      {status.type && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
            status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
          </div>
        </div>
      )}

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
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your Menu</p>
          <button onClick={() => router.push('/dashboard/individual')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            My Dashboard
          </button>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm bg-sky-50 text-sky-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Start Campaign
          </div>
        </nav>
      </aside>

      {/* MAIN FORM */}
      <main className={`flex-1 p-6 md:p-12 overflow-y-auto transition-opacity ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold uppercase tracking-wider mb-4">
              Individual Account
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight italic">What are we raising for?</h1>
            <p className="text-slate-500 text-sm mt-1">Start a personal fundraiser to reach your goal.</p>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Campaign Title</label>
                  <input type="text" name="title" required onChange={handleInputChange} placeholder="e.g. My University Tuition"
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:border-sky-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Your Story</label>
                  <textarea name="description" rows={6} required onChange={handleInputChange} placeholder="Share your journey with the community..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:border-sky-600 outline-none transition-all" />
                </div>

                {/* VIDEO LINKS SECTION */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Video Links (Social Proof)</label>
                  {formData.video_links.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <select 
                        required
                        onChange={(e) => handleVideoLinkChange(index, 'external_link_type_id', e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-xl px-3 text-[10px] font-bold outline-none"
                      >
                        <option value="">Platform</option>
                        {linkTypes.map((t: any) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <input 
                        type="url" placeholder="Paste URL here..." required
                        onChange={(e) => handleVideoLinkChange(index, 'external_link', e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-sky-600" 
                      />
                    </div>
                  ))}
                  <button type="button" onClick={addVideoLink} className="text-[10px] font-black text-sky-600 uppercase mt-1 hover:underline">
                    + Add another link
                  </button>
                </div>
              </div>

              {/* MEDIA UPLOAD */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Photos (Max 5)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Tap to upload gallery</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" 
                           onChange={(e) => setSelectedImages(Array.from(e.target.files || []).slice(0, 5))} />
                  </label>
                </div>
                {selectedImages.length > 0 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {selectedImages.map((file, idx) => (
                      <div key={idx} className="h-10 px-3 flex items-center bg-sky-50 text-sky-700 rounded-lg text-[10px] font-bold border border-sky-100 shrink-0">
                        {file.name.substring(0, 10)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SIDEBAR SETTINGS */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Target Goal (KES)</label>
                  <input type="number" name="account_target" required onChange={handleInputChange}
                         className="w-full bg-slate-800 text-white border-none rounded-2xl px-5 py-4 text-2xl font-black italic focus:ring-4 focus:ring-sky-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Category</label>
                  <select name="account_category_id" required onChange={handleInputChange}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 outline-none">
                    <option value="">Select Category</option>
                    {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">End Date</label>
                  <input type="date" name="target_date" required onChange={handleInputChange}
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Payout Setting</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl cursor-pointer border-2 border-sky-600">
                    <input type="radio" name="lock_status" value="1" defaultChecked onChange={handleInputChange} className="accent-sky-600" />
                    <span className="text-[10px] font-black text-sky-900 uppercase">Flexible (Withdraw anytime)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer border-2 border-transparent hover:border-slate-200 transition-all">
                    <input type="radio" name="lock_status" value="2" onChange={handleInputChange} className="accent-sky-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">Locked (Until Goal Reached)</span>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading}
                      className="w-full bg-sky-600 hover:bg-sky-500 text-white p-6 rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-sky-100 transition-all transform active:scale-95 disabled:opacity-50">
                {loading ? 'Starting Campaign...' : 'Go Live Now'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}