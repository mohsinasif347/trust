"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { 
  CheckCircle2, User, Wallet, 
  Copy, Loader2, RefreshCcw, Landmark, Clock
} from "lucide-react";
import { toast } from "sonner";

export default function AdminWithdrawals() {
  const supabase = createClient();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => { fetchRequests(); }, []);

  async function fetchRequests() {
    setLoading(true);
    // Updated RPC for fetching withdrawal requests
    const { data, error } = await supabase.rpc("get_admin_withdrawal_requests");
    if (error) {
      toast.error("Failed to fetch requests");
      console.error(error);
    } else if (data) {
      // Data is already filtered for 'pending' in the RPC
      setRequests(data);
    }
    setLoading(false);
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    let notes = action === 'approve' ? "Payment sent successfully" : "";
    if (action === 'reject') {
        notes = prompt("Enter rejection reason:") || "Incomplete details";
    }

    setProcessingId(id);
    // Updated RPC for handling withdrawals
    const { error } = await supabase.rpc("handle_withdrawal_request", {
      p_request_id: id,
      p_action: action,
      p_admin_notes: notes
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(action === 'approve' ? "Withdrawal Approved & Paid!" : "Withdrawal Rejected & Refunded");
      fetchRequests(); // Refresh list
    }
    setProcessingId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) return (
    <div className="min-h-screen !bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    // yahan main div mein `pb-40` ko maintain rakha hai jo scroll space create karta hai
    <div className="min-h-screen px-5 pt-10 pb-40 !bg-[#020617] overflow-y-auto">
      <div className="flex justify-between items-center mb-8 px-2">
         <div>
            <h1 className="text-2xl font-black !text-white tracking-tight">User Withdrawals</h1>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em] mt-1">Pending Payouts</p>
         </div>
         <button onClick={fetchRequests} className="p-3 !bg-[#0f172a] rounded-2xl border border-white/5 !text-emerald-500 hover:!bg-slate-800 transition-colors shadow-lg">
           <RefreshCcw size={18} />
         </button>
      </div>

      {/* Iss container mein bhi extra spacing add kar di hai agar list lambi ho */}
      <div className="space-y-5 pb-10">
        {requests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/20 flex flex-col items-center">
             <Landmark size={36} className="text-slate-700 mb-3" />
             <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">No pending withdrawals</div>
          </div>
        ) : (
          requests.map((req) => (
            <motion.div 
              key={req.request_id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-[2.2rem] !bg-[#0f172a] border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px] rounded-full pointer-events-none" />

              {/* User and Amount */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl !bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5 shadow-inner">
                      <User size={22} />
                   </div>
                   <div>
                      <h4 className="font-bold !text-white text-sm">{req.full_name || "User"}</h4>
                      <p className="text-[10px] text-slate-500 font-bold tracking-tight mt-0.5">{req.email}</p>
                      <div className="flex items-center gap-1 mt-1 text-slate-600">
                         <Clock size={10} />
                         <span className="text-[9px] font-medium uppercase tracking-wider">{new Date(req.created_at).toLocaleString()}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Amount</p>
                   <p className="text-xl font-black !text-orange-400 leading-none">Rs {req.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* PAYMENT WALLET CARD */}
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6 relative z-10">
                 <div className="flex items-center gap-2 mb-3">
                    <Wallet size={16} className="text-slate-500" />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-800/50 px-2 py-0.5 rounded-md">{req.method}</span>
                 </div>
                 <div className="space-y-1">
                    <div className="flex justify-between items-center">
                       <p className="text-sm !text-white font-black">{req.wallet_name}</p>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-lg !text-emerald-400 font-mono tracking-tighter">{req.wallet_number}</p>
                       <button onClick={() => copyToClipboard(req.wallet_number)} className="p-2 !bg-emerald-500/10 rounded-xl border border-emerald-500/20 !text-emerald-500 active:scale-90 transition-all">
                          <Copy size={16} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 relative z-10">
                 <button 
                   disabled={processingId === req.request_id}
                   onClick={() => handleAction(req.request_id, 'reject')}
                   className="flex-1 py-4 !bg-red-500/10 border border-red-500/20 !text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-inner"
                 >
                    Reject
                 </button>
                 <button 
                   disabled={processingId === req.request_id}
                   onClick={() => handleAction(req.request_id, 'approve')}
                   className="flex-1 py-4 !bg-emerald-500 !text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                    {processingId === req.request_id ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle2 size={16} strokeWidth={3} /> Mark as Paid</>}
                 </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}