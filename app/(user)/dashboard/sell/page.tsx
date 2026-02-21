"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingDown, Plus, Minus, 
  ArrowRight, X, Loader2, Bird, Sparkles
} from "lucide-react";
import { toast } from "sonner";

export default function SellChicksScreen() {
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreed, setSelectedBreed] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    const { data: stats } = await supabase.rpc("get_user_sell_stats");
    if (stats) setData(stats);
    setLoading(false);
  }

  const totalChicks = data.reduce((acc, curr) => acc + curr.user_chick_count, 0);

  return (
    <div className="min-h-screen px-5 pt-8 pb-32 bg-[#020617]">
      
      {/* --- 1. HERO TOTAL CARD (Farm Style) --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full p-8 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl shadow-indigo-900/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-800 to-slate-950" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-400/20 blur-[60px] rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
           <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 mb-3">
              <Bird className="text-white" size={28} />
           </div>
           <p className="text-indigo-100/70 text-[10px] font-black uppercase tracking-[0.3em]">Market Inventory</p>
           <h1 className="text-5xl font-black text-white mt-1 tracking-tighter">{totalChicks}</h1>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 mb-5 px-1">
         <Sparkles size={16} className="text-amber-400" />
         <h3 className="text-lg font-bold text-white tracking-tight">Select Breed to Sell</h3>
      </div>

      {/* --- 2. BREED LIST --- */}
      <div className="space-y-4">
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-slate-900/50 rounded-[2rem] animate-pulse border border-white/5" />
          ))
        ) : (
          data.map((breed, index) => (
            <motion.div 
              key={breed.breed_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-[2rem] border backdrop-blur-md transition-all flex items-center gap-4 ${
                breed.user_chick_count > 0 
                ? "bg-slate-900/40 border-white/10 shadow-xl" 
                : "bg-slate-950 border-white/5 opacity-40 grayscale"
              }`}
            >
              {/* Small Optimized Image Container */}
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-slate-800 flex-shrink-0">
                <img 
                  src={breed.image_url} 
                  className="w-full h-full object-cover shadow-inner" 
                  loading="lazy"
                  alt={breed.breed_name}
                />
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-black text-white tracking-tight">{breed.breed_name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-emerald-400 text-[11px] font-bold">Rs {breed.sell_price}</p>
                   <span className="text-slate-600 text-[10px]">|</span>
                   <p className="text-slate-400 text-[10px] font-medium">Own: <span className="text-white">{breed.user_chick_count}</span></p>
                </div>
                {breed.user_chick_count < 2 && (
                  <p className="text-rose-400 text-xs mt-1">aap ke paas {breed.user_chick_count} hai, 2 hone chahiye</p>
                )}
              </div>

              <button 
                disabled={breed.user_chick_count < 2}
                onClick={() => {
                  if (breed.user_chick_count < 2) {
                    if (breed.user_chick_count === 1) {
                      toast.error("aap ke paas sirf 1 chick hai, 2 hone chahiye");
                    } else {
                      toast.error("aap ke paas 0 chick hai, 2 hone chahiye");
                    }
                  } else {
                    setSelectedBreed(breed);
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  breed.user_chick_count >= 2 
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 active:scale-95" 
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Sell
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* --- 3. SELL MODAL --- */}
      <AnimatePresence>
        {selectedBreed && (
          <SellModal 
            breed={selectedBreed} 
            onClose={() => setSelectedBreed(null)} 
            onSuccess={() => { setSelectedBreed(null); fetchStats(); }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- MODAL COMPONENT (Updated with Another Option) ---
function SellModal({ breed, onClose, onSuccess }: any) {
  const supabase = createClient();
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState("");
  const [customMethod, setCustomMethod] = useState(""); // State for custom bank/method
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = qty * breed.sell_price;

  const handleSell = async () => {
    // require at least 2 chicks
    if (qty < 2) {
      if (qty === 1) {
        return toast.error("aap ke paas sir1 chick hai, 2 hone chahiye");
      }
      return toast.error("aap ke paas 0 chick hai, 2 hone chahiye");
    }

    // Determine the actual method to send
    const finalMethod = method === "Another" ? customMethod : method;

    if (!finalMethod || !name || !number) return toast.error("Fill all details");
    setSubmitting(true);
    
    const { data, error } = await supabase.rpc("submit_sell_request", {
      p_breed_name: breed.breed_name,
      p_quantity: qty,
      p_rate: breed.sell_price,
      p_method: finalMethod,
      p_wallet_name: name,
      p_wallet_number: number
    });

    if (error) toast.error(error.message);
    else {
      toast.success("Payout request submitted!");
      onSuccess();
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="relative w-full max-w-md bg-[#0f172a] rounded-t-[3rem] border-t border-white/10 p-8 pb-32 flex flex-col gap-6 shadow-2xl"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-white">Sell <span className="text-emerald-500">{breed.breed_name}</span></h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Confirm Payout Details</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={20}/></button>
        </div>

        {/* Quantity Selection */}
        <div className="bg-slate-900/50 rounded-3xl p-5 border border-white/5 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Select Amount</p>
            <p className="text-xl font-black text-white">{qty} <span className="text-xs text-slate-500">Chicks</span></p>
          </div>
          <div className="flex items-center gap-3 bg-black/40 rounded-2xl p-2 border border-white/10">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white active:scale-90"><Minus size={18}/></button>
            <button onClick={() => setQty(q => Math.min(breed.user_chick_count, q + 1))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500 text-black active:scale-90"><Plus size={18}/></button>
          </div>
        </div>

        {/* Final Payout Amount */}
        <div className="text-center py-2">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Payout</p>
           <h3 className="text-4xl font-black text-white mt-1 tracking-tighter">Rs {total.toLocaleString()}</h3>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black ml-1">Method</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:border-emerald-500 outline-none appearance-none"
                >
                  <option value="">Select</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="SadaPay">SadaPay</option>
                  <option value="Another">Another</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-black ml-1">Holder Name</label>
                <input 
                  type="text"
                  placeholder="Ali..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-emerald-500"
                />
             </div>
          </div>

          {/* Conditional Field: Another Bank/Method Name */}
          <AnimatePresence>
            {method === "Another" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[10px] text-slate-500 uppercase font-black ml-1">Bank / Method Name</label>
                <input 
                  type="text"
                  placeholder="Enter Bank Name (HBL, UBL, etc.)"
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-emerald-500"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-black ml-1">Account / Phone Number</label>
            <input 
              type="tel"
              placeholder="03XXXXXXXXX"
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-black text-white font-mono tracking-[0.2em] outline-none focus:border-emerald-500 placeholder:tracking-normal"
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSell}
          disabled={submitting}
          className="w-full py-5 rounded-[1.5rem] bg-emerald-500 text-black font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="animate-spin" /> : <>Confirm Payout <ArrowRight size={18}/></>}
        </button>
      </motion.div>
    </div>
  );
}