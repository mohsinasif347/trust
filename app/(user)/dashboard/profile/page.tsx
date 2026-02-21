"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Phone, Share2, Copy, Users, Lock, 
  Headphones, FileText, LogOut, ChevronRight, 
  Check, Award, Zap, DownloadCloud
} from "lucide-react";
import { toast } from "sonner";

export default function ProfileScreen() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    fetchProfile();

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function fetchProfile() {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      setUser(data);
    }
    setLoading(false);
  }

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowInstallBtn(false);
    setDeferredPrompt(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    toast.success("Logged out successfully");
  };

  // --- RE-ENGINEERED COPY LOGIC (THE ULTIMATE FIX) ---
  const copyLink = async () => {
    // 1. Check if user and code exist
    if (!user || !user.referral_code) {
      toast.error("Referral code loading, please wait...");
      return;
    }

    // 2. Generate Link Direct (No reliance on state 'origin')
    const currentOrigin = window.location.origin;
    const linkToCopy = `${currentOrigin}/register?ref=${user.referral_code}`;

    try {
      // 3. Try Modern API first
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(linkToCopy);
        onCopySuccess();
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (err) {
      // 4. Solid Fallback (Using a hidden input for maximum compatibility)
      const el = document.createElement('textarea');
      el.value = linkToCopy;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      
      const selected = document.getSelection()?.rangeCount! > 0 
        ? document.getSelection()?.getRangeAt(0) 
        : false;
      
      el.select();
      const success = document.execCommand('copy');
      document.body.removeChild(el);
      
      if (selected) {
        document.getSelection()?.removeAllRanges();
        document.getSelection()?.addRange(selected);
      }

      if (success) {
        onCopySuccess();
      } else {
        toast.error("Manual copy failed. Please select and copy.");
      }
    }
  };

  const onCopySuccess = () => {
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen !bg-[#020617] flex items-center justify-center">
      <Zap className="animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="min-h-screen px-4 pt-10 pb-40 !bg-[#020617]">
      
      {/* --- 1. USER IDENTITY CARD --- */}
      <div className="relative mb-8 text-center">
         <div className="relative inline-block">
            <div className="w-24 h-24 rounded-[2.5rem] !bg-gradient-to-tr from-emerald-500 to-indigo-600 p-1 shadow-2xl">
               <div className="w-full h-full rounded-[2.3rem] !bg-[#0f172a] flex items-center justify-center">
                  <User size={40} className="text-emerald-400" />
               </div>
            </div>
            <div className="absolute -bottom-1 -right-1 !bg-emerald-500 p-1.5 rounded-xl border-4 border-[#020617]">
               <Check size={12} className="text-black font-bold" />
            </div>
         </div>
         <h2 className="text-2xl font-black !text-white mt-4 tracking-tight">{user?.full_name}</h2>
         <p className="text-slate-500 text-xs font-bold flex items-center justify-center gap-1 mt-1">
            <Phone size={12} /> {user?.phone_number}
         </p>
      </div>

      {/* --- 2. DYNAMIC REFERRAL CARD --- */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="!bg-[#0f172a] rounded-[2.5rem] p-6 mb-8 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={100} /></div>
        <div className="flex justify-between items-start mb-4">
           <div>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Your Referral ID</p>
              <h3 className="text-2xl font-black !text-white tracking-widest">{user?.referral_code}</h3>
           </div>
           <div className="p-3 !bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Award className="text-emerald-400" size={24} />
           </div>
        </div>
        
        <div className="flex gap-2">
           <div className="flex-1 !bg-black/40 rounded-2xl border border-white/5 p-3 overflow-hidden">
              <p className="text-[11px] text-emerald-400 font-bold truncate">
                {typeof window !== 'undefined' ? window.location.origin : ''}/register?ref={user?.referral_code}
              </p>
           </div>
           <button 
            onClick={copyLink} 
            className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 shadow-lg ${isCopied ? '!bg-white text-emerald-600' : '!bg-emerald-500 text-black'}`}
           >
              {isCopied ? <Check size={20} /> : <Copy size={20} />}
           </button>
        </div>
      </motion.div>

      {/* --- 3. MENU TILES --- */}
      <div className="space-y-3">
          <AnimatePresence>
            {showInstallBtn && (
              <ProfileTile 
                icon={<DownloadCloud className="text-emerald-400" />} 
                title="Install App" 
                subtitle="Save as mobile application" 
                onClick={handleInstallApp}
                highlight={true}
              />
            )}
          </AnimatePresence>

          <ProfileTile 
            icon={<Users className="text-indigo-400" />} 
            title="My Team" 
            subtitle="View your referral network" 
            onClick={() => router.push('/dashboard/team')} 
          />
          <ProfileTile 
            icon={<Lock className="text-amber-400" />} 
            title="Security" 
            subtitle="Change your password" 
            onClick={() => router.push('/dashboard/settings')} 
          />
          <ProfileTile 
            icon={<Headphones className="text-sky-400" />} 
            title="Contact Support" 
            subtitle="24/7 help center" 
            onClick={() => router.push('/dashboard/support')} 
          />
          <ProfileTile 
            icon={<FileText className="text-slate-400" />} 
            title="Terms & Policy" 
            subtitle="Rules and regulations" 
            onClick={() => router.push('/dashboard/legal')} 
          />
      </div>

      {/* --- 4. LOGOUT BUTTON --- */}
      <button 
        onClick={handleLogout}
        className="w-full mt-10 py-5 rounded-[2.2rem] !bg-red-500/10 border border-red-500/20 !text-red-500 font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
      >
        <LogOut size={22} /> LOGOUT ACCOUNT
      </button>

    </div>
  );
}

// --- REUSABLE TILE COMPONENT ---
function ProfileTile({ icon, title, subtitle, onClick, highlight }: any) {
  return (
    <motion.div 
      initial={highlight ? { scale: 0.9, opacity: 0 } : false}
      animate={highlight ? { scale: 1, opacity: 1 } : false}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-4 p-5 rounded-[2.2rem] border shadow-lg transition-colors cursor-pointer ${
        highlight 
        ? "!bg-emerald-500/10 border-emerald-500/20" 
        : "!bg-[#0f172a] border-white/5 active:!bg-slate-800"
      }`}
    >
      <div className={`p-3 rounded-2xl border ${highlight ? "!bg-emerald-500/20 border-emerald-500/20" : "!bg-[#020617] border-white/5"}`}>
         {icon}
      </div>
      <div className="flex-1">
         <h4 className="font-bold !text-white text-sm">{title}</h4>
         <p className="text-[10px] text-slate-500 font-medium">{subtitle}</p>
      </div>
      <ChevronRight size={18} className={highlight ? "text-emerald-500" : "text-slate-700"} />
    </motion.div>
  );
}