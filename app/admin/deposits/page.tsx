"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, XCircle, User, Activity, 
  Clock, Eye, Loader2, RefreshCcw, X, FileText
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDeposits() {
  const supabase = createClient();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => { fetchRequests(); }, []);

  async function fetchRequests() {
    setLoading(true);
    // Fetch from updated RPC that joins with new tables
    const { data, error } = await supabase.rpc("get_admin_purchase_requests");
    if (error) {
      console.error("Error fetching deposits:", error);
      toast.error("Failed to fetch deposit requests.");
    } else if (data) {
      // Filter out only pending ones (in case RPC doesn't filter)
      setRequests(data.filter((r: any) => r.status === 'pending'));
    }
    setLoading(false);
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase.rpc("approve_purchase_request", { p_request_id: id });
    if (error) {
       toast.error(error.message);
    } else {
       toast.success("Investment Activated!");
       fetchRequests();
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason (e.g. Invalid TRX ID or Fake Screenshot):");
    if (!reason) return;

    setProcessingId(id);
    const { error } = await supabase.rpc("reject_purchase_request", {
      p_request_id: id,
      p_admin_notes: reason
    });
    
    if (error) {
       toast.error("Rejection failed: " + error.message);
    } else {
       toast.error("Request Rejected.");
       fetchRequests();
    }
    setProcessingId(null);
  };

  if (loading) return (
    <div className="min-h-screen !bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen px-5 pt-10 pb-40 !bg-[#020617]">
      <div className="flex justify-between items-center mb-8 px-2">
         <div>
            <h1 className="text-2xl font-black !text-white tracking-tight">Investment Deposits</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-1">Pending Approvals</p>
         </div>
         <button onClick={fetchRequests} className="p-3 !bg-[#0f172a] rounded-2xl border border-white/5 !text-emerald-500 hover:!bg-slate-800 transition-colors shadow-lg">
            <RefreshCcw size={18} />
         </button>
      </div>

      <div className="space-y-5">
        {requests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/20 flex flex-col items-center">
             <Activity size={36} className="text-slate-700 mb-3" />
             <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">No pending deposits</div>
          </div>
        ) : (
          requests.map((req) => (
            <motion.div 
              key={req.request_id}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="p-5 rounded-[2rem] !bg-[#0f172a] backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

              {/* User & Amount */}
              <div className="flex justify-between items-start mb-5 relative z-10">
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
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Deposit</p>
                   <p className="text-xl font-black !text-emerald-400 leading-none">Rs {req.amount?.toLocaleString()}</p>
                   {/* Fallback to package_name or general text if not available */}
                   <span className="text-[9px] !bg-emerald-500/10 !text-emerald-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-widest mt-2 inline-block border border-emerald-500/20">
                     {req.package_name || "Plan Investment"}
                   </span>
                </div>
              </div>

              {/* TRX Detail Box */}
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6 relative z-10">
                 <div className="flex justify-between mb-2">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Transaction ID</span>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Method</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-sm !text-white font-mono tracking-tight">{req.trx_id}</p>
                    <p className="text-xs !text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md">{req.method}</p>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 relative z-10">
                 <button 
                   onClick={() => setSelectedImg(req.screenshot_url)}
                   className="flex-1 py-4 !bg-slate-800 rounded-2xl !text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-700 shadow-inner"
                 >
                    <FileText size={16} /> View Proof
                 </button>
                 
                 <div className="flex gap-2">
                    <button 
                      disabled={processingId === req.request_id}
                      onClick={() => handleReject(req.request_id)}
                      className="p-4 !bg-red-500/10 !text-red-500 rounded-2xl border border-red-500/20 active:scale-90 transition-transform"
                    >
                       <XCircle size={22} />
                    </button>
                    <button 
                      disabled={processingId === req.request_id}
                      onClick={() => handleApprove(req.request_id)}
                      className="p-4 !bg-emerald-500 !text-black rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] active:scale-90 transition-transform"
                    >
                       {processingId === req.request_id ? <Loader2 className="animate-spin" size={22} /> : <CheckCircle2 size={22} strokeWidth={3} />}
                    </button>
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* --- SCREENSHOT MODAL --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] !bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-md"
          >
            <button onClick={() => setSelectedImg(null)} className="absolute top-10 right-8 p-3 !bg-slate-800 border border-white/10 rounded-full !text-slate-400 hover:!text-white shadow-2xl transition-colors">
               <X size={24} />
            </button>
            <img src={selectedImg} className="max-w-full max-h-[80vh] rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] object-contain" alt="Payment Proof" />
            <p className="mt-6 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Transaction Proof Screenshot</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}