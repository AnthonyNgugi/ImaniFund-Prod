"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Building2, Check, ArrowLeft, Smartphone, Loader2, AlertCircle, MapPin, Mail } from "lucide-react";
import { requestOtpAction, registerAction } from "./actions";
const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://127.0.0.1:8000';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [user_type, setPersona] = useState<"individual" | "organisation" | null>("individual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);

  const [lookups, setLookups] = useState({
    merchant_types: [],
    merchant_type_category: [],
    country_region: [],
    sub_region: []
  });

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", document_type_id: "1", document_number: "",
    merchant_name: "", registration_number: "", merchant_type_id: "", 
    merchant_type_categories: [] as number[], merchant_kra_pin: "", 
    merchant_email: "", physical_address: "",
    mobile_number: "", region_id: "", sub_region_id: "", password: ""
  });

  // --- Resend Timer Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // --- Auto-Submit Registration when OTP is full ---
  useEffect(() => {
    if (otp.every(slot => slot !== "") && otp.length === 6) {
      handleFinalRegister(otp.join(""));
    }
  }, [otp]);

  // --- Data Fetching ---
  useEffect(() => {
    const loadInit = async () => {
      try {
        const [mTypeRes, regionRes] = await Promise.all([
          fetch(`${baseUrl}/manage/merchant-type/`),
          fetch(`${baseUrl}/manage/country-regions/`)
        ]);
        const mTypeData = await mTypeRes.json();
        const regionData = await regionRes.json();
        setLookups(prev => ({ 
          ...prev, 
          merchant_types: mTypeData.merchant_types || [], 
          country_region: regionData.country_region || [] 
        }));
      } catch (err) { setError("Server connection failed. Check your API."); }
    };
    loadInit();
  }, []);

  useEffect(() => {
    if (formData.region_id) {
      fetch(`${baseUrl}/manage/country-sub-region/?country_region_id=${formData.region_id}`)
        .then(res => res.json())
        .then(data => setLookups(prev => ({ ...prev, sub_region: data.sub_region || [] })));
    }
  }, [formData.region_id]);

  useEffect(() => {
    if (formData.merchant_type_id) {
      fetch(`${baseUrl}/manage/merchant-type-categories/?merchant_type_id=${formData.merchant_type_id}`)
        .then(res => res.json())
        .then(data => setLookups(prev => ({ ...prev, merchant_type_category: data.merchant_type_category || [] })));
    }
  }, [formData.merchant_type_id]);

  // --- Action Handlers ---
  const handleOTPRequest = async () => {
    setError(null);
    setLoading(true);
    const res = await requestOtpAction(formData.mobile_number, user_type!);
    setLoading(false);
    
    if (res.status) { // Checking your API "status" key
      setStep(user_type === "organisation" ? 4 : 3);
      setResendTimer(180);
    } else {
      setError(res.message); // Showing your API "message" key
    }
  };

  const handleFinalRegister = async (finalOtp: string) => {
    setError(null);
    setLoading(true);
    const res = await registerAction({ ...formData, otp: finalOtp }, user_type!);
    setLoading(false);
    
    if (res.status) {
      window.location.href = "/dashboard";
    } else {
      setError(res.message);
      setOtp(["", "", "", "", "", ""]); // Reset OTP on failure
      document.getElementById("otp-0")?.focus();
    }
  };

  const isStep2Valid = () => {
    const common = formData.mobile_number.length >= 9 && formData.region_id && 
                   formData.sub_region_id && 
                   formData.merchant_email.includes("@") && formData.physical_address && formData.password.length >= 6;
    return user_type === "individual" 
      ? (common && formData.first_name && formData.last_name && formData.document_number)
      : (common && formData.merchant_name && formData.registration_number && formData.merchant_kra_pin);
  };

  const steps = user_type === "organisation" 
    ? [{ id: 1, label: "Account" }, { id: 2, label: "Info" }, { id: 3, label: "Categories" }, { id: 4, label: "Verify" }]
    : [{ id: 1, label: "Account" }, { id: 2, label: "Info" }, { id: 3, label: "Verify" }];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-4">
      {/* Navbar */}
      <nav className="w-full max-w-7xl flex items-center justify-between p-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-lg text-white font-bold text-xl">i</div>
          {/* <span className="text-[#0055aa] font-black text-2xl">ImaniFund</span> */}
        </div>
      </nav>

      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12">
        
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.id ? 'bg-[#0099ff] text-white shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-300'}`}>
                  {step > s.id ? <Check size={18} /> : s.id}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${step === s.id ? 'text-slate-900' : 'text-slate-200'}`}>{s.label}</span>
              </div>
              {i !== steps.length - 1 && <div className={`w-8 h-[2px] mb-5 mx-1 ${step > s.id ? 'bg-[#0099ff]' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        {/* Global Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-red-800 text-sm font-bold leading-tight">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-black">✕</button>
          </div>
        )}

        {/* STEP 1: ACCOUNT TYPE */}
        {step === 1 && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Get Started</h2>
            <p className="text-slate-500 mb-10 font-medium">Choose an account type to proceed.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <button onClick={() => setPersona("individual")} className={`p-8 rounded-3xl border-2 text-left transition-all ${user_type === 'individual' ? 'border-[#0099ff] bg-[#f0f9ff] ring-4 ring-blue-50' : 'border-slate-50 hover:border-slate-100'}`}>
                <User size={32} className={`mb-4 ${user_type === 'individual' ? 'text-[#0099ff]' : 'text-slate-300'}`} />
                <h4 className="font-black text-xl text-slate-800">Individual</h4>
                <p className="text-xs text-slate-500 mt-2">Personal fundraising and peer support.</p>
              </button>
              <button onClick={() => setPersona("organisation")} className={`p-8 rounded-3xl border-2 text-left transition-all ${user_type === 'organisation' ? 'border-[#0099ff] bg-[#f0f9ff] ring-4 ring-blue-50' : 'border-slate-50 hover:border-slate-100'}`}>
                <Building2 size={32} className={`mb-4 ${user_type === 'organisation' ? 'text-[#0099ff]' : 'text-slate-300'}`} />
                <h4 className="font-black text-xl text-slate-800">Organisation</h4>
                <p className="text-xs text-slate-500 mt-2">NGOs, Charities and Foundations.</p>
              </button>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-[#0099ff] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100">Continue</button>
          </div>
        )}

        {/* STEP 2: INFO (Added Email & Address) */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-6"><ArrowLeft size={14} /> Back</button>
            <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Information</h2>
            
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-10">
              {user_type === "individual" ? (
                <>
                  <div className="col-span-1"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">First Name</label><input name="first_name" onChange={(e)=>setFormData({...formData, first_name: e.target.value})} value={formData.first_name} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div>
                  <div className="col-span-1"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Last Name</label><input name="last_name" onChange={(e)=>setFormData({...formData, last_name: e.target.value})} value={formData.last_name} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div>
                  <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">ID/Passport Number</label><input name="document_number" onChange={(e)=>setFormData({...formData, document_number: e.target.value})} value={formData.document_number} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div>
                </>
              ) : (
                <>
                  <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Legal Org Name</label><input name="merchant_name" onChange={(e)=>setFormData({...formData, merchant_name: e.target.value})} value={formData.merchant_name} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div>
                  <div className="col-span-1"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Registration No.</label><input name="registration_number" onChange={(e)=>setFormData({...formData, registration_number: e.target.value})} value={formData.registration_number} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div>
                  <div className="col-span-1"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">KRA PIN</label><input name="merchant_kra_pin" onChange={(e)=>setFormData({...formData, merchant_kra_pin: e.target.value})} value={formData.merchant_kra_pin} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div>
                </>
              )}

              <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Email Address</label><div className="relative"><Mail className="absolute left-4 top-4 text-slate-300" size={18}/><input name="merchant_email" type="email" onChange={(e)=>setFormData({...formData, merchant_email: e.target.value})} value={formData.merchant_email} className="w-full p-4 pl-12 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" placeholder="example@imanifund.com" /></div></div>
              
              <div className="col-span-1"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Region</label>
                <select name="region_id" onChange={(e)=>setFormData({...formData, region_id: e.target.value, sub_region_id: ""})} value={formData.region_id} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none">
                  <option value="">Select</option>{lookups.country_region.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div className="col-span-1"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Sub-Region</label>
                <select name="sub_region_id" onChange={(e)=>setFormData({...formData, sub_region_id: e.target.value})} value={formData.sub_region_id} disabled={!formData.region_id} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none disabled:opacity-30 transition-all">
                  <option value="">Select</option>{lookups.sub_region.map((sr: any) => <option key={sr.id} value={sr.id}>{sr.name}</option>)}
                </select>
              </div>

              <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Physical Address / Street</label><div className="relative"><MapPin className="absolute left-4 top-4 text-slate-300" size={18}/><input name="physical_address" onChange={(e)=>setFormData({...formData, physical_address: e.target.value})} value={formData.physical_address} className="w-full p-4 pl-12 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" placeholder="e.g. Kimathi Street, Nairobi" /></div></div>
              

              <div className="col-span-2"><label className="text-[9px] font-black uppercase text-[#0099ff] mb-1 block">Mobile (07...)</label><input name="mobile_number" onChange={(e)=>setFormData({...formData, mobile_number: e.target.value})} value={formData.mobile_number} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" placeholder="0712345678" /></div>
              <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Secure Password</label><input name="password" type="password" onChange={(e)=>setFormData({...formData, password: e.target.value})} value={formData.password} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div>
            </div>

            <button disabled={!isStep2Valid() || loading} onClick={user_type === "organisation" ? () => setStep(3) : handleOTPRequest} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2">
              {loading && <Loader2 className="animate-spin" size={20} />}
              {user_type === "organisation" ? "Next: Categories" : "Verify Account"}
            </button>
          </div>
        )}

        {/* STEP 3: CATEGORIES (Org Only) */}
        {step === 3 && user_type === "organisation" && (
          <div className="animate-in fade-in duration-500">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-8"><ArrowLeft size={14} /> Back</button>
            <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Categories</h2>
            <div className="space-y-6 mb-10">
              <div><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Merchant Type</label>
                <select name="merchant_type_id" onChange={(e)=>setFormData({...formData, merchant_type_id: e.target.value, merchant_type_categories: []})} value={formData.merchant_type_id} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none">
                  <option value="">Select Type</option>{lookups.merchant_types.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                {lookups.merchant_type_category.map((c: any) => (
                  <label key={c.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.merchant_type_categories.includes(c.id) ? 'border-[#0099ff] bg-[#f0f9ff]' : 'border-slate-50 bg-slate-50/50'}`}>
                    <input type="checkbox" checked={formData.merchant_type_categories.includes(c.id)} onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setFormData(prev => ({ ...prev, merchant_type_categories: e.target.checked ? [...prev.merchant_type_categories, val] : prev.merchant_type_categories.filter(x => x !== val) }));
                    }} value={c.id} className="w-4 h-4 rounded text-[#0099ff]" />
                    <span className="text-xs font-bold text-slate-700">{c.name}</span>
                  </label>
                ))}
              </div>
              {/* <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Secure Password</label><input name="password" type="password" onChange={(e)=>setFormData({...formData, password: e.target.value})} value={formData.password} className="w-full p-4 rounded-xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-[#0099ff] outline-none" /></div> */}
            
            </div>
            <button disabled={formData.merchant_type_categories.length === 0 || loading} onClick={handleOTPRequest} className="w-full bg-[#0099ff] text-white py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-2">
               {loading && <Loader2 className="animate-spin" size={20} />} Verify Organisation
            </button>
          </div>
        )}

        {/* STEP 4/3: OTP (Auto-Submit Enabled) */}
        {(step === 4 || (step === 3 && user_type === "individual")) && (
          <div className="animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 text-[#0099ff] rounded-[2rem] flex items-center justify-center mb-8"><Smartphone size={40} /></div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Enter Code</h2>
            <p className="text-slate-500 mb-12 font-medium">Verification code sent to {formData.mobile_number}</p>
            
            <div className="flex justify-center gap-3 mb-12">
              {otp.map((digit, i) => (
                <input key={i} id={`otp-${i}`} maxLength={1} value={digit} onChange={(e) => {
                  const val = e.target.value;
                  const newOtp = [...otp];
                  newOtp[i] = val.slice(-1);
                  setOtp(newOtp);
                  if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
                }} onKeyDown={(e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                className="w-12 h-16 border-2 border-slate-100 rounded-2xl bg-slate-50 text-center text-3xl font-black focus:border-[#0099ff] focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm" />
              ))}
            </div>

            <button onClick={() => handleFinalRegister(otp.join(""))} disabled={loading || otp.join("").length < 6} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 mb-6">
              {loading && <Loader2 className="animate-spin" size={20} />} Complete Registration
            </button>

            {resendTimer > 0 ? (
              <p className="text-slate-400 font-bold text-sm">Resend code in <span className="text-[#0099ff]">{resendTimer}s</span></p>
            ) : (
              <button onClick={handleOTPRequest} className="text-[#0099ff] font-bold text-sm hover:underline">Resend Verification Code</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}