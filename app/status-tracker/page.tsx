'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StatusTracker() {
  const { user } = useAuth();
  const router = useRouter();

  // Guard: If user fixes documents and status changes to AWAITING_DOCUMENTS, 
  // we send them back to the upload page automatically.
  useEffect(() => {
    if (user?.kyc_status === 'AWAITING_DOCUMENTS') {
      const path = user.account_type === 'merchant' ? '/kyc/organization' : '/kyc/individual';
      router.push(path);
    }
  }, [user, router]);

  const status = user?.kyc_status || 'AWAITING_ADMIN_VERIFICATION';
  const isRejected = status === 'REJECTED';
  const isSuspended = status === 'SUSPENDED';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-2xl w-full">
        <div className={`bg-white p-10 rounded-[3rem] border ${isRejected || isSuspended ? 'border-red-100' : 'border-slate-100'} shadow-xl`}>
          
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Status<br/>Tracker</h2>
              <p className={`${isRejected || isSuspended ? 'text-red-500' : 'text-emerald-500'} font-black text-[10px] uppercase tracking-widest mt-3 flex items-center gap-2`}>
                <span className={`w-2 h-2 ${isRejected || isSuspended ? 'bg-red-500' : 'bg-emerald-500'} rounded-full animate-ping`}></span>
                {status.replace(/_/g, ' ')}
              </p>
            </div>
            <div className={`${isRejected || isSuspended ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-600'} px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest`}>
              {isRejected ? 'Action Required' : isSuspended ? 'Access Denied' : 'Under Review'}
            </div>
          </div>

          <div className="space-y-4">
            {/* STEP 1: Documents Received */}
            <StatusItem 
              label="Documents Received" 
              desc="Your KYC files have been securely received." 
              state="completed" 
            />

            {/* STEP 2: Compliance Review (Active Step) */}
            <StatusItem 
              label="Compliance Review" 
              desc={isRejected ? "Verification failed. Please check your email for details." : "Our admin team is currently reviewing your profile."} 
              state={isRejected || isSuspended ? 'error' : 'active'} 
            />

            {/* STEP 3: Final Activation */}
            <StatusItem 
              label="Final Activation" 
              desc="Full dashboard access is granted upon approval." 
              state="locked" 
            />
          </div>

          {(isRejected || isSuspended) && (
            <button className="w-full mt-8 bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">
              Contact Support
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, desc, state }: { label: string, desc: string, state: 'completed' | 'active' | 'locked' | 'error' }) {
  const styles = {
    completed: "bg-slate-50 border-slate-100 text-emerald-500",
    active: "bg-white border-sky-500 border-2 shadow-xl shadow-sky-50 text-sky-500 animate-pulse",
    locked: "bg-white border-slate-100 opacity-40 text-slate-400",
    error: "bg-red-50 border-red-200 text-red-500"
  };

  return (
    <div className={`flex items-center gap-5 p-6 rounded-[2rem] border ${styles[state]}`}>
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${state === 'completed' ? 'bg-emerald-500 text-white' : state === 'error' ? 'bg-red-500 text-white' : 'bg-sky-50'}`}>
        {state === 'completed' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        ) : state === 'error' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 6-12 12"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        )}
      </div>
      <div>
        <h4 className="font-black text-sm uppercase">{label}</h4>
        <p className="text-[10px] font-bold opacity-70">{desc}</p>
      </div>
    </div>
  );
}