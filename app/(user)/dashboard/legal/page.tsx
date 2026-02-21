"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, FileText, Lock, Scale, 
  AlertCircle, ChevronRight, Gavel, Eye, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegalScreen() {
  const router = useRouter();

  return (
    <div className="min-h-screen px-4 pt-10 pb-40 !bg-[#020617] text-white">
      
      {/* --- 1. PROFESSIONAL HEADER --- */}
      <div className="flex items-center gap-4 mb-8 px-2">
         <button 
           onClick={() => router.back()} 
           className="p-3 !bg-slate-900 rounded-2xl border border-white/5 text-slate-400 hover:text-white transition-colors"
         >
            <ChevronRight className="rotate-180" size={20} />
         </button>
         <div>
            <h1 className="text-2xl font-black !text-white tracking-tight">Legal Center</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">Terms & Privacy Policy</p>
         </div>
      </div>

      {/* --- 2. TRUST BANNER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full p-6 rounded-[2.5rem] !bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 mb-8 overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={100} /></div>
        <div className="relative z-10">
           <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="!text-[#10b981]" size={18} />
              <span className="text-xs font-black uppercase !text-white">Transparency Commitment</span>
           </div>
           <p className="text-[11px] text-slate-400 leading-relaxed max-w-[280px]">
             At TRUST ME, we prioritize your security and trust. Please read our operational guidelines to understand how your investments and daily profits are managed.
           </p>
        </div>
      </motion.div>

      {/* --- 3. LEGAL SECTIONS --- */}
      <div className="space-y-8 px-1">
        
        {/* Section: Terms of Service */}
        <LegalSection 
          icon={<Gavel className="text-indigo-400" />}
          title="Terms of Service"
          content="By using the TRUST ME platform, you agree to comply with our investment rules. All plan activations are final and subject to the specific duration cycles mentioned in the packages section."
        />

        {/* Section: Investment & Profit */}
        <LegalSection 
          icon={<Zap className="text-amber-400" />}
          title="Investment Policy"
          content="Each package purchase represents a fixed-term contract. Daily profit is calculated based on your active plan. Once a plan reaches its expiry date, it will no longer generate profit and will be marked as completed in your portfolio."
        />

        {/* Section: Withdrawals */}
        <LegalSection 
          icon={<Scale className="text-emerald-400" />}
          title="Withdrawal Policy"
          content="Withdrawal requests are processed manually by our finance team to ensure security. Users must provide valid account details (EasyPaisa/JazzCash/Bank). Payouts are typically processed within 24-48 business hours."
        />

        {/* Section: Privacy & Data */}
        <LegalSection 
          icon={<Eye className="text-sky-400" />}
          title="Privacy Policy"
          content="We collect minimal data (Name, Phone, Transaction IDs, Wallet Addresses) solely to verify your identity and process payments. Your data is encrypted and is never shared with third-party advertisers."
        />

        {/* Section: Risks */}
        <div className="p-6 rounded-[2.5rem] !bg-red-500/5 border border-red-500/10 mt-10">
           <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-red-500" size={18} />
              <span className="text-xs font-black uppercase text-red-500 tracking-widest">Risk Disclosure</span>
           </div>
           <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
             All financial investments involve calculated risks. While TRUST ME ensures a stable earning ecosystem, users are advised to read plan details carefully. Past performance does not guarantee future results.
           </p>
        </div>

      </div>

      {/* --- 4. FOOTER INFO --- */}
      <div className="mt-12 text-center pb-8">
         <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">
           Last Updated: February 2026 • TRUST ME v3.0
         </p>
      </div>

    </div>
  );
}

// --- REUSABLE LEGAL COMPONENT ---
function LegalSection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="space-y-3">
       <div className="flex items-center gap-4">
          <div className="p-3 !bg-[#0f172a] rounded-2xl border border-white/5 shadow-inner">
             {icon}
          </div>
          <h4 className="font-black !text-white text-base tracking-tight">{title}</h4>
       </div>
       <div className="pl-[3.25rem]">
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
             {content}
          </p>
       </div>
    </div>
  );
}