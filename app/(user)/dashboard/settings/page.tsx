"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { 
  Lock, KeyRound, ShieldCheck, Loader2, 
  ArrowRight, ShieldAlert, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";
import NeonInput from "@/components/NeonInput"; // Path check kar lena apne project ke hisab se

export default function ChangePasswordScreen() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match!");
    }

    if (passwords.new.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);

    // Supabase Auth Update Password
    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-40 !bg-[#020617]">
      
      {/* --- 1. TOP SECURITY HEADER --- */}
      <div className="text-center mb-10 px-6">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
           className="inline-block p-4 !bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 mb-4"
         >
            <ShieldCheck size={40} className="!text-emerald-400" />
         </motion.div>
         <h1 className="text-3xl font-black !text-white tracking-tight">Security Vault</h1>
         <p className="text-slate-500 text-xs mt-2 font-medium">Update your account password to keep your farm secure.</p>
      </div>

      {/* --- 2. PASSWORD FORM (SQUIRCLE CARD) --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="!bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 !bg-emerald-500/5 blur-[60px] rounded-full" />

        <form onSubmit={handleUpdate} className="space-y-2 relative z-10">
          
          <NeonInput 
            label="Current Password"
            name="current"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={passwords.current}
            onChange={handleChange}
            required
          />

          <NeonInput 
            label="New Password"
            name="new"
            type="password"
            placeholder="••••••••"
            icon={KeyRound}
            value={passwords.new}
            onChange={handleChange}
            required
          />

          <NeonInput 
            label="Confirm New Password"
            name="confirm"
            type="password"
            placeholder="••••••••"
            icon={ShieldCheck}
            value={passwords.confirm}
            onChange={handleChange}
            required
          />

          {/* SUBMIT BUTTON (VIP GREEN GRADIENT) */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-5 rounded-[2rem] !bg-[#10b981] !text-black font-black text-lg shadow-[0_15px_30px_rgba(16,185,129,0.2)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>UPDATE PASSWORD <ArrowRight size={22} strokeWidth={3} /></>}
          </button>

        </form>
      </motion.div>

      {/* --- 3. SECURITY TIPS --- */}
      <div className="mt-8 px-4 space-y-4">
         <div className="flex items-start gap-4 p-5 rounded-[2rem] !bg-[#0f172a]/50 border border-white/5">
            <ShieldAlert className="!text-amber-500 shrink-0" size={20} />
            <div>
               <h4 className="!text-white font-bold text-xs uppercase tracking-wider">Safety Tip</h4>
               <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                 Kabhi bhi apna password kisi ke sath share na karein, chahe wo Admin hi kyun na ho.
               </p>
            </div>
         </div>

         <div className="flex items-center justify-center gap-2 text-slate-600">
            <CheckCircle2 size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
         </div>
      </div>

    </div>
  );
}