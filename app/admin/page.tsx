"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { 
  Users, ArrowDownCircle, ArrowUpCircle, 
  ShieldCheck, Loader2, RefreshCcw, TrendingUp 
} from "lucide-react";

export default function AdminStatsScreen() {
  const supabase = createClient();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    setLoading(true);
    const { data } = await supabase.rpc("get_admin_dashboard_stats");
    if (data) setStats(data);
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen px-5 pt-8 pb-32 bg-[#020617]">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white tracking-tight">Console <span className="text-emerald-500">.</span></h1>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Control</p>
        </div>
        <button onClick={fetchStats} className="h-10 w-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 active:rotate-180 transition-transform duration-500">
           <RefreshCcw size={18} />
        </button>
      </div>

      {/* --- 1. HERO REVENUE CARD (Matching your Farm style) --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="relative w-full p-8 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl shadow-emerald-900/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-950" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
        
        <div className="relative z-10 flex flex-col justify-between">
           <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 w-fit mb-4">
              <ShieldCheck className="text-white" size={24} />
           </div>
           <p className="text-emerald-100/70 text-xs font-bold uppercase tracking-widest">Total Investment Volume</p>
           <h2 className="text-5xl font-black text-white mt-1 tracking-tighter">
             Rs {stats?.total_deposit_value?.toLocaleString()}
           </h2>
        </div>
      </motion.div>

      {/* --- 2. PENDING TASKS GRID --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         {/* Deposit Card */}
         <div className="p-5 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
            <ArrowDownCircle className="text-emerald-400 mb-3" size={28} />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Deposits</p>
            <h4 className="text-3xl font-black text-white mt-1">{stats?.pending_deposits}</h4>
         </div>

         {/* Payout Card */}
         <div className="p-5 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
            <ArrowUpCircle className="text-orange-400 mb-3" size={28} />
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Payouts</p>
            <h4 className="text-3xl font-black text-white mt-1">{stats?.pending_withdrawals}</h4>
         </div>
      </div>

      {/* --- 3. USERS OVERVIEW --- */}
      <div className="p-6 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 flex items-center gap-5">
         <div className="p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20">
            <Users className="text-blue-400" size={30} />
         </div>
         <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Users</p>
            <h4 className="text-3xl font-black text-white tracking-tighter">{stats?.total_users}</h4>
         </div>
      </div>

    </div>
  );
}