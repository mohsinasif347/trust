"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Save, Smartphone, Briefcase, 
  Loader2, RefreshCcw, DollarSign, DownloadCloud, X,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import NeonInput from "@/components/NeonInput";

export default function AdminSettingsScreen() {
  const supabase = createClient();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // PWA Install Logic States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => { 
    fetchSettings(); 

    // PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data: res } = await supabase.rpc("get_admin_settings_data");
    if (res) setData(res);
    setLoading(false);
  }

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const updatePayment = async (id: string, name: string, num: string) => {
    setUpdating(id);
    const { error } = await supabase.rpc("update_admin_settings", {
      p_type: 'payment_method', p_id: id, p_wallet_name: name, p_wallet_number: num
    });
    if (error) toast.error("Update failed: " + error.message);
    else toast.success("Wallet updated!");
    setUpdating(null);
  };

  const updatePackage = async (id: number, invest_amt: number, daily_profit: number, duration: number) => {
    setUpdating(id.toString());
    const { error } = await supabase.rpc("update_admin_settings", {
      p_type: 'package', 
      p_package_id: id, 
      p_investment_amount: invest_amt, 
      p_daily_profit: daily_profit, 
      p_plan_duration_days: duration
    });
    if (error) toast.error("Update failed: " + error.message);
    else toast.success("Package details updated!");
    setUpdating(null);
  };

  if (loading) return <div className="min-h-screen !bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

  return (
    <div className="min-h-screen px-5 pt-10 pb-40 !bg-[#020617]">
      
      {/* --- 0. PWA INSTALL BANNER --- */}
      <AnimatePresence>
        {showInstallBtn && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="mb-8 p-5 rounded-[2rem] bg-gradient-to-r from-emerald-600 to-teal-700 shadow-[0_20px_40px_rgba(16,185,129,0.2)] flex items-center justify-between border border-white/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10">
                <DownloadCloud className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Install TRUST ME</h4>
                <p className="text-emerald-100 text-[10px] font-medium opacity-80">Fast, secure & offline access</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallApp}
                className="px-4 py-2 bg-white text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
              >
                Install
              </button>
              <button onClick={() => setShowInstallBtn(false)} className="p-2 text-white/50 hover:text-white transition-colors"><X size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-10 px-2">
         <h1 className="text-2xl font-black !text-white flex items-center gap-3">
            <Settings className="text-emerald-500" /> Platform Settings
         </h1>
         <button onClick={fetchSettings} className="p-3 !bg-slate-900 rounded-2xl border border-white/5 text-emerald-500 shadow-inner active:scale-95 transition-all"><RefreshCcw size={18} /></button>
      </div>

      {/* --- 1. PAYMENT METHODS SECTION --- */}
      <h3 className="text-xs font-black !text-slate-500 uppercase tracking-[0.3em] mb-4 ml-2 flex items-center gap-2">
         <Smartphone size={14} /> Receiving Accounts
      </h3>
      <div className="space-y-6 mb-12">
        {data?.payment_methods?.map((m: any) => (
          <motion.div key={m.id} className="p-6 rounded-[2.2rem] !bg-slate-900/40 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Smartphone className="text-emerald-400" size={18} />
                </div>
                <h4 className="font-black !text-white uppercase tracking-tighter text-lg">{m.method}</h4>
            </div>
            <div className="space-y-2 relative z-10">
                <NeonInput label="Account Title / Holder Name" value={m.wallet_name} onChange={(e: any) => {
                  const newData = {...data};
                  const item = newData.payment_methods.find((x:any)=>x.id === m.id);
                  if (item) item.wallet_name = e.target.value;
                  setData(newData);
                }} />
                <NeonInput label="Account Number / IBAN" value={m.wallet_number} onChange={(e: any) => {
                  const newData = {...data};
                  const item = newData.payment_methods.find((x:any)=>x.id === m.id);
                  if (item) item.wallet_number = e.target.value;
                  setData(newData);
                }} />
            </div>
            <button 
              onClick={() => updatePayment(m.id, m.wallet_name, m.wallet_number)}
              disabled={updating === m.id}
              className="w-full mt-4 py-4 rounded-xl !bg-emerald-500 !text-black font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
            >
              {updating === m.id ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Update {m.method}</>}
            </button>
          </motion.div>
        ))}
      </div>

      {/* --- 2. INVESTMENT PACKAGES SECTION --- */}
      <h3 className="text-xs font-black !text-slate-500 uppercase tracking-[0.3em] mb-4 ml-2 flex items-center gap-2">
        <Briefcase size={14} /> Investment Packages
      </h3>
      <div className="space-y-6">
        {data?.packages?.map((pkg: any) => (
          <motion.div key={pkg.id} className="p-6 rounded-[2.2rem] !bg-[#0f172a] border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                   <TrendingUp className="text-amber-400" size={20} />
                </div>
                <h4 className="font-black !text-white text-lg">{pkg.name}</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
                <NeonInput label="Invest Amount (Rs)" value={pkg.investment_amount} type="number" onChange={(e: any) => {
                  const newData = {...data};
                  const item = newData.packages.find((x:any)=>x.id === pkg.id);
                  if (item) item.investment_amount = e.target.value;
                  setData(newData);
                }} />
                <NeonInput label="Daily Profit (Rs)" value={pkg.daily_profit} type="number" onChange={(e: any) => {
                  const newData = {...data};
                  const item = newData.packages.find((x:any)=>x.id === pkg.id);
                  if (item) item.daily_profit = e.target.value;
                  setData(newData);
                }} />
            </div>
            <div className="relative z-10">
                <NeonInput label="Plan Duration (Days)" value={pkg.plan_duration_days} type="number" onChange={(e: any) => {
                    const newData = {...data};
                    const item = newData.packages.find((x:any)=>x.id === pkg.id);
                    if (item) item.plan_duration_days = e.target.value;
                    setData(newData);
                }} />
            </div>
            <button 
              onClick={() => updatePackage(pkg.id, pkg.investment_amount, pkg.daily_profit, pkg.plan_duration_days)}
              disabled={updating === pkg.id.toString()}
              className="w-full mt-4 py-4 rounded-xl border border-amber-500/20 !bg-amber-500/5 !text-amber-500 font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-amber-500/10"
            >
              {updating === pkg.id.toString() ? <Loader2 className="animate-spin" size={16} /> : <><DollarSign size={16} /> Save {pkg.name} Details</>}
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
}