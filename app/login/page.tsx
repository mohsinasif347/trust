"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client"; 
import { 
  Loader2, 
  Sparkles, 
  LogIn, 
  ArrowRight, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff // Eye icons import kar liye
} from "lucide-react";
import NeonInput from "@/components/NeonInput";
import Link from "next/link";

function AuthContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Eye toggle state

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const referralCode = searchParams.get("ref");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            throw new Error("Bhai, pehlay apni email inbox check krain aur account approve krain!");
          }
          throw error;
        }
        if (data.user) {
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
          router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
          router.refresh();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, phone_number: phone, referred_by: referralCode || null } },
        });
        if (error) throw error;
        if (data.user) setShowPopup(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{ rotateY: isLogin ? 180 : 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120, damping: 20 }}
          className="relative w-full"
          style={{ minHeight: '680px', transformStyle: "preserve-3d" }} 
        >
          {/* --- REGISTER SIDE (FRONT) --- */}
          <div className="absolute inset-0 flex flex-col h-full" style={{ backfaceVisibility: "hidden" }}>
            <div className="relative flex-1 bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 ring-1 ring-emerald-500/20">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight italic uppercase">Create Account</h2>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <NeonInput label="Full Name" placeholder="Mohsin Asif" value={fullName} onChange={(e: any) => setFullName(e.target.value)} required />
                <NeonInput label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
                <NeonInput label="Phone Number" type="tel" placeholder="03xxxxxxxxx" value={phone} onChange={(e: any) => setPhone(e.target.value)} required />
                
                {/* Password with Eye Button */}
                <div className="relative group">
                  <NeonInput 
                    label="Password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e: any) => setPassword(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-slate-500 hover:text-emerald-400 transition-colors z-20"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errorMsg && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] text-center font-bold flex items-center gap-2"><AlertCircle size={14} /> {errorMsg}</div>}

                <button disabled={loading} className="w-full py-4 mt-2 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-500 text-slate-950 shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Start Journey"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-auto pt-6 text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Already a member? <button onClick={() => setIsLogin(true)} className="text-emerald-400 underline decoration-emerald-500/30">Sign In</button></p>
              </div>
            </div>
          </div>

          {/* --- LOGIN SIDE (BACK) --- */}
          <div className="absolute inset-0 flex flex-col h-full" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            <div className="relative flex-1 bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-center">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 mb-3 ring-1 ring-amber-500/20"><LogIn size={20} /></div>
                <h2 className="text-2xl font-bold text-white tracking-tight italic uppercase">Welcome Back</h2>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <NeonInput label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
                
                <div className="space-y-2">
                  <div className="relative group">
                    <NeonInput 
                      label="Password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e: any) => setPassword(e.target.value)} 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[38px] text-slate-500 hover:text-amber-400 transition-colors z-20"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    {/* FIXED: Removed size prop to solve TS error */}
                    <Link href="/forgot-password" className="text-[10px] font-bold text-slate-500 hover:text-amber-400 uppercase tracking-widest transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {errorMsg && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] text-center font-bold flex items-center gap-2"><AlertCircle size={14} /> {errorMsg}</div>}

                <button disabled={loading} className="w-full py-4 mt-2 rounded-xl font-black text-xs uppercase tracking-widest bg-amber-500 text-slate-950 shadow-lg flex items-center justify-center gap-2 hover:bg-amber-400 transition-all">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">New here? <button onClick={() => setIsLogin(false)} className="text-amber-400 underline decoration-amber-500/30">Register Now</button></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-sm bg-slate-900 border border-emerald-500/30 p-8 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20"><Mail className="text-emerald-400" size={40} /></div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Verify Email</h3>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-8 uppercase tracking-widest">Activation link sent to <span className="text-emerald-400 font-bold lowercase">{email}</span>.</p>
              <button onClick={() => { setShowPopup(false); setIsLogin(true); }} className="w-full bg-white text-slate-950 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-colors">Got It</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AuthForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-emerald-500">Initializing Security...</div>}>
      <AuthContent />
    </Suspense>
  )
}