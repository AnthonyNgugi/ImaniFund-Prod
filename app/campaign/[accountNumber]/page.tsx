"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function CampaignPage() {
  const { accountNumber } = useParams();
  const [data, setData] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;

  useEffect(() => {
    fetch(`${baseUrl}/manage/savings-account-public/?a_number=${accountNumber}`)
      .then(res => res.json())
      .then(json => {
        if (json.status) {
          const fetchedData = json.data;
          setData(fetchedData);
          
          // Logic to start with video if available
          const videoIndex = fetchedData.video_links?.findIndex((v: any) => v.external_link_type === "Youtube");
          if (videoIndex !== -1) {
            // Because we combine media below (images then videos), 
            // the video index in the combined array will be: images.length + videoIndex
            setActiveSlide((fetchedData.campaign_images?.length || 0) + videoIndex);
          }
        }
        setLoading(false);
      });
  }, [accountNumber]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-sky-600 italic">LOADING...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center font-bold">Campaign Not Found</div>;

  // Combine media: Images first, then Videos
  const media = [
    ...(data.campaign_images || []),
    ...(data.video_links?.filter((v: any) => v.external_link_type === "Youtube") || [])
  ];

  const balance = parseFloat(data.account_balance) || 0;
  const target = parseFloat(data.account_target) || 1;
  const progress = Math.min(Math.round((balance / target) * 100), 100);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-sky-100">
      
      <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-[100]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-black italic">I</div>
            <span className="font-black text-lg tracking-tighter">ImaniFund</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-xs font-bold text-slate-500 hover:text-sky-600 transition">Search</button>
            <button className="px-5 py-2.5 border border-slate-200 rounded-full text-xs font-bold hover:bg-slate-50 transition">Sign In</button>
          </div>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
          {data.title}
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 pb-32">
        
        <div className="lg:col-span-8 space-y-10">
          
          {/* SLIDESHOW DESIGN */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100 group">
            {media.length > 0 ? (
              <div className="w-full h-full">
                {media[activeSlide]?.location ? (
                  <img src={media[activeSlide].location} className="w-full h-full object-cover" alt="Slide" />
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYoutubeId(media[activeSlide]?.external_url)}?autoplay=0`}
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-slate-200" />
            )}

            {media.length > 1 && (
              <>
                <button onClick={() => setActiveSlide(prev => (prev === 0 ? media.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition font-bold">←</button>
                <button onClick={() => setActiveSlide(prev => (prev === media.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition font-bold">→</button>
              </>
            )}
          </div>

          <div className="lg:hidden space-y-4">
            <div className="space-y-2">
               <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">KES {balance.toLocaleString()}</span>
                  <span className="text-sm text-slate-400">raised of {target.toLocaleString()} goal</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
            <div className="flex gap-3">
               <button className="flex-[2] py-4 bg-sky-600 text-white rounded-xl font-black uppercase text-xs tracking-widest italic shadow-lg shadow-sky-100">Donate</button>
               <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest italic">Share</button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">IM</div>
               <div>
                  <p className="text-sm font-medium">Verified Fundraiser</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                     <span className="font-bold text-sky-600">ID: {data.account_number}</span> • <span>{data.account_status}</span>
                  </div>
               </div>
            </div>
          </div>

          <article className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
            <p className="whitespace-pre-wrap">{data.description}</p>
          </article>
        </div>

        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 space-y-6">
               <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-bold">KES {balance.toLocaleString()}</span>
                     <span className="text-sm text-slate-400">raised of {target.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-sky-600 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-xs font-bold text-slate-400 italic">{progress}% Funded</p>
               </div>
               <div className="space-y-3">
                  <button className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-black uppercase text-xs tracking-widest italic shadow-lg shadow-sky-100">Donate Now</button>
                  <button className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 italic">Share</button>
               </div>
            </div>
            <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition">Report Fundraiser</button>
          </div>
        </aside>

      </main>
    </div>
  );
}