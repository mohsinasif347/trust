"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import NeonInput from "@/components/NeonInput";

export default function ResetPassword() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Eye Toggle States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords match nahi kar rahay!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password kam az kam 6 characters ka hona chahiye.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Password update karne mein masla hua.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#020617] text-white">
      
      {/* --- Elite Ambient Effects --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 sm:p-10 shadow-2xl">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 ring-1 ring-emerald-500/20 shadow-lg">
              <Lock size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">Set New <span className="text-emerald-500">Security</span></h2>
            <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">Update your elite credentials</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            
            {/* New Password with Eye Button */}
            <div className="relative">
              <NeonInput 
                label="New Password" 
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
            
            {/* Confirm Password with Eye Button */}
            <div className="relative">
              <NeonInput 
                label="Confirm Password" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e: any) => setConfirmPassword(e.target.value)} 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-[38px] text-slate-500 hover:text-emerald-400 transition-colors z-20"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] text-center font-bold uppercase">
                {errorMsg}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
              {!loading && <ShieldCheck size={18} />}
            </button>
          </form>
        </div>
      </motion.div>

      {/* --- SUCCESS POPUP --- */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-emerald-500/30 p-10 rounded-[3rem] max-w-sm text-center shadow-[0_0_60px_rgba(16,185,129,0.2)]"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <CheckCircle2 className="text-emerald-500" size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Security Updated</h3>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-8 uppercase tracking-widest text-center">
                Password successfully change ho gaya hai. Ab aap naye credentials ke sath login kar saktay hain.
              </p>
              <button 
                onClick={() => window.location.href = "/login"}
                className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
              >
                Go to Sign In
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}