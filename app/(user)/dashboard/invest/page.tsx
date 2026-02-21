"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, Copy, UploadCloud, X, 
  Clock, Search, ShieldCheck, ChevronRight, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

// --- Types ---
type Package = {
  id: number;
  name: string;
  investment_amount: number;
  daily_profit: number;
  total_profit: number;
  plan_duration_days: number;
  image_url: string;
};

type PaymentMethod = {
  id: string;
  method: string;
  wallet_name: string;
  wallet_number: string;
};

export default function InvestmentMarket() {
  const supabase = createClient();
  const [packages, setPackages] = useState<Package[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: packagesData } = await supabase.rpc("get_market_packages");
      const { data: methodsData } = await supabase.from("admin_payment_methods").select("*").eq("is_active", true);
      
      if (packagesData) setPackages(packagesData);
      if (methodsData) setPaymentMethods(methodsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPackages = packages.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen px-4 py-6 pb-32 max-w-lg mx-auto md:max-w-4xl bg-[#020617]">
      
      {/* --- HEADER --- */}
      <div className="sticky top-0 z-20 bg-[#020617]/90 backdrop-blur-xl py-4 -mx-4 px-4 mb-6 border-b border-white/5">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Investment Plans<span className="text-emerald-500">.</span></h1>
            <p className="text-sm text-slate-400 font-medium mt-1">Select a plan to start earning daily</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search for a package..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>
      </div>

      {/* --- DYNAMIC LOADING SHIMMER --- */}
      {loading ? (
        <div className="flex flex-col gap-5">
           {[1, 2, 3].map(i => (
             <div key={i} className="relative overflow-hidden bg-[#0f172a] rounded-[2rem] border border-white/5 p-5 flex flex-col gap-4 h-[220px]">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl" />
                  <div className="flex-1 flex flex-col justify-center gap-2">
                     <div className="h-5 w-2/3 bg-slate-800/50 rounded-full" />
                     <div className="h-4 w-1/3 bg-slate-800/50 rounded-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="h-16 bg-slate-800/50 rounded-xl" />
                  <div className="h-16 bg-slate-800/50 rounded-xl" />
                </div>
                <div className="h-12 w-full bg-slate-800/50 rounded-xl mt-auto" />
             </div>
           ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredPackages.map((pkg, index) => (
            <PackageCard 
              key={pkg.id} 
              pkg={pkg} 
              index={index}
              onClick={() => setSelectedPackage(pkg)} 
            />
          ))}
        </div>
      )}

      {/* --- PURCHASE MODAL --- */}
      <AnimatePresence>
        {selectedPackage && (
          <PurchaseModal 
            pkg={selectedPackage} 
            methods={paymentMethods} 
            onClose={(isSuccess) => {
              setSelectedPackage(null);
              if (isSuccess) {
                setTimeout(() => setShowSuccessModal(true), 300);
              }
            }} 
          />
        )}
      </AnimatePresence>

      {/* --- SUCCESS "THANK YOU" MODAL --- */}
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUCCESS MODAL COMPONENT ---
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-[#0f172a] rounded-[2rem] border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] p-6 text-center z-10 flex flex-col items-center"
      >
         <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-5 border border-emerald-500/20 shadow-inner">
            <CheckCircle2 size={40} className="text-emerald-400" />
         </div>
         <h3 className="text-2xl font-black text-white mb-2">Thank You!</h3>
         <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed">
           Your investment request has been successfully submitted. It will be reviewed and approved within <strong className="text-emerald-400">30 minutes to 24 hours</strong>.
         </p>
         <button 
           onClick={onClose} 
           className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
         >
           Got It
         </button>
      </motion.div>
    </div>
  );
}

// --- PACKAGE CARD ---
function PackageCard({ pkg, index, onClick }: { pkg: Package; index: number; onClick: () => void }) {
  const colors = [
    { from: "from-emerald-500/20", to: "to-teal-900/40", border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/10" },
    { from: "from-blue-500/20", to: "to-indigo-900/40", border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/10" },
    { from: "from-amber-500/20", to: "to-orange-900/40", border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10" },
    { from: "from-purple-500/20", to: "to-fuchsia-900/40", border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10" },
  ];
  
  const theme = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`relative flex flex-col bg-[#0f172a] rounded-[2rem] overflow-hidden border ${theme.border} shadow-2xl shadow-black group cursor-pointer`}
    >
      <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${theme.from} ${theme.to} opacity-50`} />

      <div className="relative p-5 z-10 flex flex-col h-full">
        <div className="flex gap-4 items-start mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${theme.border} ${theme.bg} shadow-lg backdrop-blur-sm`}>
            {pkg.image_url ? (
               <img src={pkg.image_url} alt={pkg.name} className="w-12 h-12 object-cover rounded-xl" />
            ) : (
               <ShieldCheck className={theme.text} size={32} />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-black text-xl tracking-tight mb-1">{pkg.name}</h3>
            <div className="flex items-center gap-2">
               <span className="text-sm text-slate-400 font-medium">Price:</span>
               <span className="text-2xl font-black text-white">Rs {pkg.investment_amount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
           <div className="bg-[#020617]/80 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Daily Return</p>
              <p className={`text-lg font-black ${theme.text}`}>Rs {pkg.daily_profit || 0}</p>
           </div>
           <div className="bg-[#020617]/80 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Return</p>
              <p className="text-lg font-black text-white">Rs {pkg.total_profit?.toLocaleString() || 0}</p>
           </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-white/5">
              <Clock size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{pkg.plan_duration_days} Days</span>
           </div>

           <button 
             onClick={(e) => {
               e.stopPropagation(); 
               onClick();
             }}
             className={`flex-1 flex justify-center items-center gap-2 py-3.5 rounded-xl ${theme.bg} border ${theme.border} ${theme.text} font-black uppercase tracking-widest text-sm hover:opacity-80 active:scale-95 transition-all shadow-lg`}
           >
             Invest Now <ChevronRight size={16} strokeWidth={3} />
           </button>
        </div>

      </div>
    </motion.div>
  );
}

// --- PURCHASE MODAL ---
function PurchaseModal({ pkg, methods, onClose }: { pkg: Package; methods: PaymentMethod[]; onClose: (success?: boolean) => void }) {
  const supabase = createClient();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [trxId, setTrxId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quantity is removed, totalAmount is just the package investment amount
  const totalAmount = pkg.investment_amount || 0;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; }
  }, []);

  const handleImageChange = async (event: any) => {
    const imageFile = event.target.files[0];
    if (!imageFile) return;
    
    setPreviewUrl(URL.createObjectURL(imageFile));
    
    const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1024, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setFile(compressedFile);
    } catch (error) { 
      toast.error("Image compression error"); 
    }
  };

  const handleSubmit = async () => {
    if (!selectedMethod) return toast.error("Please select a Payment Method (e.g. Easypaisa)");
    if (!trxId) return toast.error("Please enter Transaction ID (TID)");
    if (!file) return toast.error("Please upload payment screenshot");
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(fileName, file);
      if (uploadError) throw uploadError;
      
      const screenshotUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-proofs/${fileName}`;
      
      const { error } = await supabase.rpc('submit_purchase_request', {
        p_package_id: pkg.id, 
        p_quantity: 1, // Default quantity sent to database
        p_amount: totalAmount,
        p_trx_id: trxId, 
        p_method: selectedMethod.method, 
        p_screenshot_url: screenshotUrl
      });
      if (error) throw error;
      
      toast.success("Investment Request Sent!");
      onClose(true); 
    } catch (error: any) { 
      toast.error(error.message); 
    } finally { 
      setUploading(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/95 backdrop-blur-md" 
        onClick={() => onClose()} 
      />
      
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md !bg-[#111827] rounded-t-[2.5rem] sm:rounded-[2rem] border-t border-white/10 overflow-hidden flex flex-col shadow-2xl mb-16 sm:mb-0"
      >
        <div className="w-full flex justify-center pt-3 pb-1">
           <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
        </div>

        {/* HEADER WITH PACKAGE INFO */}
        <div className="px-6 py-4 border-b border-white/5 flex gap-4 items-center">
           <div className="h-12 w-12 rounded-xl overflow-hidden border border-emerald-500/20 bg-emerald-500/10 flex-shrink-0 flex items-center justify-center">
              {pkg.image_url ? <img src={pkg.image_url} className="w-full h-full object-cover" /> : <ShieldCheck className="text-emerald-500" size={24}/>}
           </div>
           
           <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-white leading-none truncate mb-1">{pkg.name}</h2>
              <p className="text-emerald-400 font-bold text-sm tracking-tight">Amount: Rs {totalAmount.toLocaleString()}</p>
           </div>

           {previewUrl && (
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="h-12 w-12 rounded-xl overflow-hidden border border-emerald-500/50 flex-shrink-0 relative bg-black"
             >
                <img src={previewUrl} className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setFile(null); }}
                  className="absolute top-0 right-0 bg-black/60 p-0.5 rounded-bl-lg text-white"
                >
                  <X size={10}/>
                </button>
             </motion.div>
           )}

           <button onClick={() => onClose()} className="bg-slate-800 p-2 rounded-full text-slate-400 active:scale-90 transition-transform">
              <X size={18}/>
           </button>
        </div>

        <div className="p-6 space-y-5 !bg-[#111827]">
          
          <div className="grid grid-cols-2 gap-3">
            {methods.map(method => (
              <button 
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`py-3.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${
                  selectedMethod?.id === method.id 
                  ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                  : "bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {method.method}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedMethod && (
              <motion.div 
                key={selectedMethod.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 flex justify-between items-center shadow-lg"
              >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest truncate mb-1">{selectedMethod.wallet_name}</p>
                    <p className="text-emerald-400 font-mono text-xl font-black tracking-tight">{selectedMethod.wallet_number}</p>
                  </div>
                  <button onClick={() => {navigator.clipboard.writeText(selectedMethod.wallet_number); toast.success("Copied!");}} className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 active:scale-90 transition-transform">
                    <Copy size={18}/>
                  </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
             <div className="relative">
                <input 
                  type="text" 
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="Enter Transaction ID (TID)"
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm font-medium focus:border-emerald-500 outline-none transition-colors placeholder:text-slate-600"
                />
             </div>
             <button 
               onClick={() => fileInputRef.current?.click()}
               className={`w-full py-4 border border-dashed rounded-xl flex items-center justify-center gap-2 transition-all ${file ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-slate-700 bg-black/40 text-slate-400 hover:border-slate-500"}`}
             >
               <UploadCloud size={20}/>
               <span className="text-xs font-bold uppercase tracking-widest">
                 {file ? "Screenshot Attached" : "Upload Payment Proof"}
               </span>
               <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
             </button>
          </div>
        </div>

        <div className="p-6 pt-0 !bg-[#111827] border-t border-white/5 pb-24">
           <button 
             onClick={handleSubmit} 
             disabled={uploading} 
             className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-lg shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
           >
             {uploading ? <Loader2 className="animate-spin" /> : "Confirm Investment"}
           </button>
        </div>
      </motion.div>
    </div>
  );
}