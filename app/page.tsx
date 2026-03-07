import Image from 'next/image'

export default function Home() {
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
            <button className="px-8 py-4 bg-sky-600 text-white rounded-xl shadow-lg hover:bg-sky-700 transition transform hover:-translate-y-1">
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
        <h2 className="text-2xl font-bold text-center mb-10 text-slate-800">Support what matters to you</h2>
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
              <span className="font-bold text-sm text-slate-600 group-hover:text-sky-600">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. URGENT CAMPAIGNS (Your Preferred Card UI) */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Urgent Campaigns</h2>
            <p className="text-slate-500 mt-2">Verified projects needing your immediate support.</p>
          </div>
          <a href="#" className="text-sky-600 font-bold border-b-2 border-sky-600 pb-1 hover:text-sky-700 transition">
            View All Projects
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Campaign Card Template */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 bg-slate-200 relative">
              <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-sky-600 uppercase">
                <span className="text-emerald-500 mr-1">●</span> Health
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">🏢</div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Helping Hands NGO</span>
                <span className="text-sky-500">✔</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-sky-600 transition">Clean Water Project for Ruiru</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6">Providing solar-powered water pumps to over 500 households in need.</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-700">Ksh 85,000 <span className="font-normal text-slate-400">raised</span></span>
                  <span className="text-sky-600">56%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[56%]"></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Goal: Ksh 150,000</span>
                  <span>12 days left</span>
                </div>
              </div>
              <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-sky-600 transition shadow-lg">
                Donate Now
              </button>
            </div>
          </div>
          {/* ... More cards will go here ... */}
        </div>
      </section>

      {/* 4. NGO PARTNERSHIP CTA */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full filter blur-[100px] opacity-20"></div>
          <div className="flex-1 z-10">
            <h2 className="text-4xl font-bold mb-6">Are you a registered NGO?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg">
              Join the ImaniFund Initiative to access verified donors and professional reporting tools.
            </p>
            <button className="bg-sky-500 hover:bg-sky-600 px-8 py-4 rounded-xl font-bold transition shadow-xl shadow-sky-900/40">
              Apply as an Organisation
            </button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 z-10 font-medium">
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center uppercase tracking-widest text-[10px]">
                <div className="text-sky-400 text-lg font-bold mb-1">Secure</div>
                <div className="text-slate-500 italic">Encrypted Flows</div>
             </div>
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center uppercase tracking-widest text-[10px]">
                <div className="text-sky-400 text-lg font-bold mb-1">Fast</div>
                <div className="text-slate-500 italic">Mobile Payouts</div>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}