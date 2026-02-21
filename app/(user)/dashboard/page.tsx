"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { 
  Wallet, Coins, LineChart, Activity, 
  ArrowUpRight, Briefcase, Sparkles, TrendingUp,
  History, CreditCard
} from "lucide-react";
import Link from "next/link";

// --- Configuration for Dashboard Stats (Easy to manage) ---
const STAT_CARDS = [
  { 
    key: "today_earning", 
    label: "Today's Profit", 
    icon: Coins, 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20" 
  },
  { 
    key: "total_earning", 
    label: "Total Earned", 
    icon: LineChart, 
    color: "text-blue-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20" 
  },
  { 
    key: "active_plans_count", 
    label: "Active Plans", 
    icon: Briefcase, 
    color: "text-orange-400", 
    bg: "bg-orange-500/10", 
    border: "border-orange-500/20" 
  },
];

export default function DashboardHome() {
  const supabase = createClient();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // Calling the updated RPC function
      const { data, error } = await supabase.rpc("get_dashboard_stats");
      
      if (error) console.error("Error fetching stats:", error);
      else setStats(data);
      
      setLoading(false);
    }
    fetchStats();
  }, []);

  // --- Loading Skeleton (Pro Feel) ---
  if (loading) {
    return (
      <div className="p-5 space-y-6 animate-pulse">
        <div className="h-44 w-full bg-slate-800/50 rounded-[2rem]" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-800/50 rounded-3xl" />
          ))}
        </div>
        <div className="space-y-3 mt-6">
           <div className="h-6 w-1/3 bg-slate-800/50 rounded-lg" />
           {[1, 2].map((i) => (
             <div key={i} className="h-16 w-full bg-slate-800/50 rounded-2xl" />
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pt-8 pb-32">
      
      {/* --- Header Section --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            My Portfolio <span className="text-emerald-500">.</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            Live Overview
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Activity size={18} className="text-emerald-400" />
        </div>
      </div>

      {/* --- 1. MAIN HERO CARD (Available Balance) --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full h-44 rounded-[2rem] overflow-hidden mb-8 shadow-2xl shadow-emerald-900/20"
      >
        {/* Background Gradient & Noise */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        {/* Glowing Orbs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/30 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col justify-between p-6">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
               <Wallet className="text-emerald-100" size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={12} /> Active
            </span>
          </div>

          <div>
            <p className="text-emerald-100/70 text-sm font-medium uppercase tracking-wide">Available Balance</p>
            <h2 className="text-4xl font-black text-white mt-1 tracking-tight flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-emerald-200/70">Rs.</span>
              {stats?.available_balance?.toLocaleString() || 0}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* --- 2. SECTION TITLE --- */}
      <div className="flex items-center gap-2 mb-4">
         <Sparkles size={16} className="text-amber-400" />
         <h3 className="text-lg font-bold text-white">Investment Stats</h3>
      </div>

      {/* --- 3. DYNAMIC STATS GRID --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {STAT_CARDS.map((card, index) => {
          const statValue = stats?.[card.key] || 0;
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-5 rounded-3xl border backdrop-blur-md overflow-hidden group ${card.bg} ${card.border} ${card.key === 'active_plans_count' ? 'col-span-2' : ''}`}
            >
               <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-xl bg-slate-950/40 border border-white/5 ${card.color}`}>
                         <Icon size={18} />
                      </div>
                      <ArrowUpRight size={16} className="text-slate-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 text-slate-400`}>{card.label}</h4>
                    <span className="text-2xl font-black text-white flex items-baseline gap-1">
                      {card.key !== 'active_plans_count' && <span className="text-sm font-medium text-slate-500">Rs.</span>}
                      {typeof statValue === 'number' ? statValue.toLocaleString() : statValue}
                    </span>
                  </div>
               </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- 4. RECENT TRANSACTIONS --- */}
      <div>
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-white font-black text-sm flex items-center gap-2">
              <History size={18} className="text-emerald-500" /> Recent Activity
           </h3>
           <Link href="/dashboard/wallet">
             <span className="text-[10px] text-slate-400 font-bold hover:text-white transition-colors cursor-pointer uppercase tracking-widest">View All</span>
           </Link>
        </div>

        <div className="space-y-3">
          {stats?.recent_transactions?.map((trx: any, index: number) => (
            <motion.div 
              key={trx.id}
              initial={{ x: -10, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#0f172a] p-4 rounded-3xl border border-white/5 flex items-center gap-4 shadow-md"
            >
              <div className={`p-3 rounded-2xl ${
                trx.type === 'withdraw' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              }`}>
                {trx.type === 'withdraw' ? <CreditCard size={20} /> : <TrendingUp size={20} />}
              </div>
              
              <div className="flex-1 min-w-0">
                 <h4 className="text-white text-sm font-bold truncate tracking-tight">{trx.description || trx.type}</h4>
                 <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">{new Date(trx.created_at).toLocaleDateString()}</p>
              </div>

              <div className="text-right">
                 <p className={`text-sm font-black ${
                   trx.type === 'withdraw' ? 'text-orange-400' : 'text-emerald-400'
                 }`}>
                   {trx.type === 'withdraw' ? '-' : '+'} Rs {trx.amount?.toLocaleString()}
                 </p>
                 <div className="flex justify-end mt-1">
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                     trx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                     trx.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                     'bg-red-500/20 text-red-400'
                   }`}>
                     {trx.status}
                   </span>
                 </div>
              </div>
            </motion.div>
          ))}

          {(!stats?.recent_transactions || stats.recent_transactions.length === 0) && (
            <div className="py-12 border-2 border-dashed border-white/5 rounded-[2rem] bg-slate-900/20 flex flex-col items-center justify-center">
               <History size={32} className="text-slate-800 mb-3" />
               <p className="text-slate-500 font-bold text-sm">No recent activity.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}