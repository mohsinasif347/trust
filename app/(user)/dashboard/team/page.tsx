"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { 
  Users, Trophy, Calendar, Copy, 
  UserCheck, Zap, Wallet, Loader2, Link as LinkIcon 
} from "lucide-react";
import { toast } from "sonner";

export default function ReferralTeamScreen() {
  const supabase = createClient();
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchData();
  }, []);

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch Referral Stats (RPC)
    const { data: statsData } = await supabase.rpc("get_user_referral_stats");
    
    // Fetch Profile for Referral Code
    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single();
      setProfile(profileData);
    }

    if (statsData) setStats(statsData);
    setLoading(false);
  }

  const copyLink = () => {
    const link = `${origin}/register?ref=${profile?.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  if (loading) return (
    <div className="min-h-screen !bg-[#020617] flex items-center justify-center">
       <Loader2 className="animate-spin !text-[#10b981]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen px-4 pt-8 pb-40 !bg-[#020617] text-white">
      
      {/* --- 1. PREMIUM SQUIRCLE REWARD CARD --- */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full p-8 rounded-[3rem] overflow-hidden mb-6 shadow-[0_20px_60px_rgba(16,185,129,0.15)] border border-white/5"
      >
        {/* VIP Gradient Background */}
        <div className="absolute inset-0 !bg-gradient-to-br from-[#064e3b] via-[#020617] to-[#020617]" />
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 !bg-[#10b981]/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
           <div className="p-3 !bg-white/5 backdrop-blur-2xl rounded-[1.5rem] border border-white/10 mb-3">
              <Trophy className="!text-[#10b981]" size={28} />
           </div>
           <p className="!text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Total Team Bonus</p>
           <h1 className="text-5xl font-black !text-white tracking-tighter flex items-baseline justify-center gap-1">
             <span className="text-2xl !text-[#10b981] font-bold">Rs.</span> {stats?.total_earned || 0}
           </h1>
           <div className="mt-4 flex items-center gap-2 px-4 py-1.5 !bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Users size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black !text-white uppercase tracking-wider">
                {stats?.referrals?.length || 0} Active Members
              </span>
           </div>
        </div>
      </motion.div>

      {/* --- 2. DYNAMIC REFERRAL BOX (HIGH CONTRAST) --- */}
      <div className="mb-10 px-1">
         <p className="text-[10px] !text-slate-500 font-black uppercase tracking-widest mb-3 ml-2">Your Invitation Link</p>
         
         <div className="!bg-[#0f172a] p-2 rounded-[2rem] border border-white/10 flex items-center gap-2 shadow-2xl">
            {/* Link Area */}
            <div className="flex-1 px-4 py-3 !bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
               <p className="text-[11px] !text-[#10b981] font-bold truncate">
                 {origin}/register?ref={profile?.referral_code}
               </p>
            </div>

            {/* Glowing Copy Button */}
            <button 
              onClick={copyLink}
              className="p-4 !bg-[#10b981]/10 rounded-2xl !text-[#10b981] border border-[#10b981]/30 active:scale-90 active:!bg-[#10b981] active:!text-black transition-all shadow-lg"
            >
               <Copy size={22} strokeWidth={2.5} />
            </button>
         </div>
      </div>

      {/* --- 3. SECTION TITLE --- */}
      <div className="flex items-center gap-4 mb-6 px-2">
         <h3 className="!text-white font-black text-sm flex items-center gap-2 tracking-tight">
            <UserCheck size={18} className="!text-[#10b981]" /> Team Network
         </h3>
         <div className="h-px flex-1 !bg-white/5" />
      </div>

      {/* --- 4. REFERRAL LIST --- */}
      <div className="space-y-3">
        {stats?.referrals?.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] !bg-slate-900/20">
             <Zap className="mx-auto text-slate-800 mb-4" size={40} />
             <p className="text-slate-500 font-bold text-sm">Your network is empty.</p>
             <p className="text-[10px] text-slate-600 uppercase mt-1 tracking-widest">Share link to start earning!</p>
          </div>
        ) : (
          stats?.referrals?.map((ref: any, index: number) => (
            <motion.div 
              key={ref.id}
              initial={{ x: -10, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-[2rem] !bg-[#0f172a] border border-white/5 flex items-center gap-4 shadow-lg hover:border-[#10b981]/20 transition-colors"
            >
              {/* Member Icon - Swapped Star with UserCheck/Wallet abstract */}
              <div className="w-12 h-12 rounded-2xl !bg-[#020617] border border-[#10b981]/20 flex items-center justify-center">
                 <UserCheck size={18} className="!text-[#10b981]" strokeWidth={2.5} />
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                 <h4 className="!text-white font-bold text-sm truncate">{ref.referee_name}</h4>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <Calendar size={10} className="text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                       Joined: {new Date(ref.created_at).toLocaleDateString()}
                    </span>
                 </div>
              </div>

              {/* Commission Tag - Now shows Rs. amount */}
              <div className="text-right">
                 <div className="px-3 py-1.5 !bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl flex items-center gap-1">
                    <span className="!text-[#10b981] font-black text-xs">+Rs. {ref.amount}</span>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}