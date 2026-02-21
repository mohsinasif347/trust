"use client";

import { motion } from "framer-motion";
import { 
  Send,
  Mail,
  ExternalLink,
  ShieldCheck,
  Clock,
  Copy,
  Headphones,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";

export default function SupportScreen() {
  const whatsappNumber = "+923297302302"; // User's WhatsApp number
  const supportEmail = "mshahzainkhan82@gmail.com";
  const whatsappChannelLink = "https://whatsapp.com/channel/0029VbCUbxq5K3zbcSl6bP30";
  
  // Link for direct WhatsApp message
  const whatsappDirectLink = `https://wa.me/${whatsappNumber.replace('+', '')}`;

  const copyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    toast.success("Support email copied to clipboard!");
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(whatsappNumber);
    toast.success("WhatsApp number copied!");
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-40 !bg-[#020617] text-white">
      
      {/* --- 1. VIP HERO SECTION --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full p-8 rounded-[3rem] overflow-hidden mb-8 border border-white/10 shadow-[0_20px_50px_rgba(16,185,129,0.1)]"
      >
        <div className="absolute inset-0 !bg-gradient-to-br from-[#064e3b] via-[#020617] to-[#020617]" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 !bg-[#10b981]/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
           <div className="p-4 !bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 mb-4 shadow-inner">
              <Headphones className="!text-[#10b981]" size={36} strokeWidth={2.5} />
           </div>
           <h1 className="text-3xl font-black !text-white tracking-tight">TRUST ME Support</h1>
           <p className="!text-slate-400 text-xs mt-2 font-medium max-w-[220px]">
             Experience our priority 24/7 concierge service for VIP members.
           </p>
           
           <div className="mt-6 flex items-center gap-2 px-4 py-1.5 !bg-black/40 rounded-full border border-white/5">
              <span className="w-2 h-2 !bg-[#10b981] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest !text-white/80">Support Online</span>
           </div>
        </div>
      </motion.div>

      {/* --- 2. CONTACT OPTIONS (VIP TILES) --- */}
      <div className="space-y-4">
        
        {/* WhatsApp Direct Message */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open(whatsappDirectLink, '_blank')}
          className="group p-6 rounded-[2.5rem] !bg-[#0f172a] border border-white/5 shadow-xl flex items-center gap-5 cursor-pointer hover:border-emerald-500/30 transition-all"
        >
          <div className="p-4 !bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
             <MessageCircle className="text-emerald-400" size={28} />
          </div>
          <div className="flex-1 min-w-0">
             <h4 className="text-lg font-black !text-white">WhatsApp Support</h4>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate">{whatsappNumber}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); copyNumber(); }}
            className="p-3 !bg-black/40 rounded-xl border border-white/10 !text-white active:scale-90 transition-all"
          >
             <Copy size={18} />
          </button>
        </motion.div>

        {/* WhatsApp Channel */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open(whatsappChannelLink, '_blank')}
          className="group p-6 rounded-[2.5rem] !bg-[#0f172a] border border-white/5 shadow-xl flex items-center gap-5 cursor-pointer hover:border-emerald-500/30 transition-all"
        >
          <div className="p-4 !bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
             <Send className="text-emerald-400" size={28} />
          </div>
          <div className="flex-1">
             <h4 className="text-lg font-black !text-white">WhatsApp Channel</h4>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Follow for official updates</p>
          </div>
          <ExternalLink size={18} className="text-slate-700 group-hover:!text-white transition-colors" />
        </motion.div>

        {/* Email Support */}
        <div className="p-6 rounded-[2.5rem] !bg-[#0f172a] border border-white/5 shadow-xl flex items-center gap-5">
          <div className="p-4 !bg-slate-800 rounded-2xl border border-white/5">
             <Mail className="text-slate-400" size={28} />
          </div>
          <div className="flex-1 min-w-0">
             <h4 className="text-lg font-black !text-white">Email Us</h4>
             <p className="text-[11px] text-emerald-400 font-bold truncate">{supportEmail}</p>
          </div>
          <button 
            onClick={copyEmail}
            className="p-3 !bg-black/40 rounded-xl border border-white/10 !text-white active:scale-90 transition-all"
          >
             <Copy size={18} />
          </button>
        </div>

      </div>

      {/* --- 3. TRUST & SECURITY BADGES --- */}
      <div className="mt-12 grid grid-cols-2 gap-4 px-2">
         <div className="flex flex-col items-center text-center p-4">
            <ShieldCheck size={24} className="text-emerald-500/40 mb-2" />
            <h5 className="text-[10px] font-black !text-white uppercase tracking-widest">Safe & Secure</h5>
            <p className="text-[9px] text-slate-600 mt-1">End-to-end encrypted communications.</p>
         </div>
         <div className="flex flex-col items-center text-center p-4">
            <Clock size={24} className="text-emerald-500/40 mb-2" />
            <h5 className="text-[10px] font-black !text-white uppercase tracking-widest">Fast Response</h5>
            <p className="text-[9px] text-slate-600 mt-1">Average response time is under 1 hour.</p>
         </div>
      </div>

    </div>
  );
}