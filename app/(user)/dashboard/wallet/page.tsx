"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpCircle, ArrowDownCircle, 
  History, Plus, Minus, CreditCard,
  TrendingUp, Landmark, X, Wallet, Building2, Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import NeonInput from "@/components/NeonInput"; // <-- Apna import path verify kar lena

export default function WalletScreen() {
  const supabase = createClient();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Withdraw Modal States
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  async function fetchWallet() {
    const { data } = await supabase.rpc("get_user_wallet_data");
    if (data) setStats(data);
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen px-4 pt-6 pb-32 !bg-[#020617]">
      
      {/* --- HEADER --- */}
      <div className="mb-6 flex justify-between items-center px-2">
        <h1 className="text-2xl font-black text-white">My Wallet<span className="text-emerald-500">.</span></h1>
        <div className="p-2 bg-slate-900 rounded-full border border-white/5 shadow-inner">
           <Landmark className="text-emerald-400" size={20} />
        </div>
      </div>

      {/* --- MAIN BALANCE CARD (VIP LOOK) --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="relative w-full bg-gradient-to-br from-[#0f172a] to-[#020617] rounded-[2.5rem] p-8 mb-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Wallet size={14}/> Available Balance
            </p>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-8 flex items-baseline gap-2">
              <span className="text-2xl text-slate-500">Rs</span>
              {stats?.current_assets?.toLocaleString() || 0}
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/dashboard/invest" className="flex-1">
               <button className="w-full py-4 bg-emerald-500 rounded-2xl text-black font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                  <Plus size={18} strokeWidth={3} /> INVEST
               </button>
            </Link>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="flex-1 py-4 bg-white rounded-2xl text-black font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            >
               <Minus size={18} strokeWidth={3} /> WITHDRAW
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- SUMMARY STATS --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-[#0f172a] p-5 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="p-2 bg-emerald-500/10 w-max rounded-xl mb-3 border border-emerald-500/20">
               <ArrowUpCircle className="text-emerald-400" size={20} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Invested</p>
            <p className="text-lg font-black text-white">Rs {stats?.total_invested?.toLocaleString() || 0}</p>
         </div>
         <div className="bg-[#0f172a] p-5 rounded-[2rem] border border-white/5 shadow-xl">
            <div className="p-2 bg-orange-500/10 w-max rounded-xl mb-3 border border-orange-500/20">
               <ArrowDownCircle className="text-orange-400" size={20} />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Withdrawn</p>
            <p className="text-lg font-black text-white">Rs {stats?.total_sold?.toLocaleString() || 0}</p>
         </div>
      </div>

      {/* --- TRANSACTION LIST --- */}
      <div className="px-2">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-white font-black text-sm flex items-center gap-2">
              <History size={18} className="text-emerald-500" /> Recent Activity
           </h3>
           <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>

        <div className="space-y-3">
          {stats?.transactions?.map((trx: any) => (
            <motion.div 
              key={trx.id}
              initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
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

          {(!stats?.transactions || stats.transactions.length === 0) && (
            <div className="py-12 border-2 border-dashed border-white/5 rounded-[2rem] bg-slate-900/20 flex flex-col items-center justify-center">
               <History size={32} className="text-slate-800 mb-3" />
               <p className="text-slate-500 font-bold text-sm">No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* --- WITHDRAWAL MODAL --- */}
      <AnimatePresence>
        {isWithdrawOpen && (
          <WithdrawModal 
            balance={stats?.current_assets || 0} 
            onClose={() => { setIsWithdrawOpen(false); fetchWallet(); }} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SEPARATE WITHDRAW MODAL COMPONENT ---
function WithdrawModal({ balance, onClose }: { balance: number, onClose: () => void }) {
  const supabase = createClient();
  const [amount, setAmount] = useState(100); // Minimum amount
  const [method, setMethod] = useState("Easypaisa");
  const [walletName, setWalletName] = useState("");
  const [walletNumber, setWalletNumber] = useState("");
  const [otherMethod, setOtherMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Updated Methods (Removed NayaPay & Bank Transfer)
  const methods = ["Easypaisa", "JazzCash", "SadaPay", "Other"];

  const handleAmountChange = (newAmount: number) => {
    if (newAmount > balance) {
      toast.error("Cannot exceed available balance");
      setAmount(balance);
    } else if (newAmount < 0) {
      setAmount(0);
    } else {
      setAmount(newAmount);
    }
  };

  const handleSubmit = async () => {
    if (amount <= 0) return toast.error("Enter a valid amount");
    if (amount > balance) return toast.error("Insufficient balance");
    if (!walletName.trim()) return toast.error("Enter account title/name");
    if (!walletNumber.trim()) return toast.error("Enter account number");
    
    const finalMethod = method === "Other" ? otherMethod : method;
    if (!finalMethod.trim()) return toast.error("Specify the payment method");

    setIsSubmitting(true);
    
    // Call our RPC
    const { data, error } = await supabase.rpc('submit_withdrawal_request', {
      p_amount: amount,
      p_method: finalMethod,
      p_wallet_name: walletName,
      p_wallet_number: walletNumber
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Withdrawal request submitted!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Added mb-24 to keep it above bottom navigation on mobile */}
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#111827] rounded-[2rem] border border-white/10 flex flex-col shadow-2xl z-[110] mb-24 sm:mb-0"
      >
        <div className="w-full flex justify-center pt-3 pb-2">
           <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-2 flex justify-between items-center border-b border-white/5 pb-4">
           <div>
              <h2 className="text-lg font-black text-white leading-none mb-1">Withdraw Funds</h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Available: Rs {balance.toLocaleString()}</p>
           </div>
           <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white active:scale-90 transition-all">
              <X size={18}/>
           </button>
        </div>

        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          
          {/* Amount Selector */}
          <div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 ml-1">Withdraw Amount</p>
             <div className="bg-black/40 rounded-2xl p-2 border border-white/5 flex items-center justify-between shadow-inner">
                <button 
                  onClick={() => handleAmountChange(amount - 500)} 
                  className="p-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white active:scale-90 transition-all"
                >
                  <Minus size={20}/>
                </button>
                
                <div className="flex items-center gap-1">
                   <span className="text-xl text-emerald-500 font-black">Rs</span>
                   <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => handleAmountChange(Number(e.target.value))}
                     className="w-24 bg-transparent text-center text-3xl font-black text-white outline-none"
                   />
                </div>

                <button 
                  onClick={() => handleAmountChange(amount + 500)} 
                  className="p-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white active:scale-90 transition-all"
                >
                  <Plus size={20}/>
                </button>
             </div>
             
             {/* Quick Actions */}
             <div className="flex gap-2 mt-3">
                <button onClick={() => handleAmountChange(1000)} className="flex-1 py-2 rounded-xl bg-slate-800/50 text-[10px] font-black text-slate-300 border border-white/5 hover:bg-slate-800">1K</button>
                <button onClick={() => handleAmountChange(5000)} className="flex-1 py-2 rounded-xl bg-slate-800/50 text-[10px] font-black text-slate-300 border border-white/5 hover:bg-slate-800">5K</button>
                <button onClick={() => handleAmountChange(10000)} className="flex-1 py-2 rounded-xl bg-slate-800/50 text-[10px] font-black text-slate-300 border border-white/5 hover:bg-slate-800">10K</button>
                <button onClick={() => handleAmountChange(balance)} className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-[10px] font-black text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">MAX</button>
             </div>
          </div>

          {/* Payment Method Selector */}
          <div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 ml-1">Receive In</p>
             <div className="grid grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button 
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                      method === m 
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                      : "bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {m}
                  </button>
                ))}
             </div>
             
             {/* If Other is selected - Using NeonInput */}
             {method === "Other" && (
                <div className="mt-4">
                  <NeonInput
                    label="Bank / Wallet Name"
                    placeholder="E.g. UPaisa, Allied Bank..."
                    value={otherMethod}
                    onChange={(e) => setOtherMethod(e.target.value)}
                  />
                </div>
             )}
          </div>

          {/* Account Details - Using NeonInput */}
          <div className="mt-4">
             <div className="space-y-1">
                <NeonInput
                  label="Account Title"
                  icon={Building2}
                  placeholder="Full Name"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
                
                <NeonInput
                  label="Account Number"
                  icon={CreditCard}
                  placeholder="IBAN / Number"
                  value={walletNumber}
                  onChange={(e) => setWalletNumber(e.target.value)}
                />
             </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="p-6 pt-2 pb-6">
           <button 
             onClick={handleSubmit} 
             disabled={isSubmitting || amount === 0} 
             className="w-full py-4 rounded-xl bg-white text-black font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
           >
             {isSubmitting ? <Loader2 className="animate-spin" /> : `Withdraw Rs ${amount.toLocaleString()}`}
           </button>
        </div>
      </motion.div>
    </div>
  );
}