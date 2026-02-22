"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Key, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import NeonInput from "@/components/NeonInput";

export default function ForgotPassword() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setIsSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Email bhejte waqt masla hua.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#020617] text-white">
      
      {/* --- Elite Background Glows --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        {/* Glass Card */}
        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 mb-4 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10">
              <Key size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Recover <span className="text-blue-500">Access</span></h2>
            <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">Enter your elite email to reset</p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <NeonInput 
              label="Registered Email" 
              type="email" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e: any) => setEmail(e.target.value)} 
              required 
            />

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] text-center font-bold uppercase">
                {errorMsg}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Recovery Link"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>

      {/* --- SUCCESS POPUP --- */}
      <AnimatePresence>
        {isSent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-blue-500/30 p-10 rounded-[3rem] max-w-sm text-center shadow-[0_0_60px_rgba(59,130,246,0.2)]"
            >
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <ShieldCheck className="text-blue-400" size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Check Your Inbox</h3>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed mb-8 uppercase tracking-widest">
                We've sent a secure recovery link to <br/>
                <span className="text-blue-400 font-black">{email}</span>. <br/>
                Please follow the instructions to regain access.
              </p>
              <button 
                onClick={() => window.location.href = "/login"}
                className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-lg"
              >
                Back to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}