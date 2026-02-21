"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe, TrendingUp, Landmark, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50 font-sans">
      
      {/* --- Floating Elite Navbar --- */}
      <nav className="fixed top-0 w-full z-[100] p-4 md:p-6">
        <div className="mx-auto max-w-7xl flex justify-between items-center bg-slate-900/40 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
              <Landmark size={20} className="text-slate-950" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">
              TRUST <span className="text-emerald-500">ME</span>
            </span>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Directs to Auth page with login state preference */}
            <Link href="/login?mode=login" className="hidden sm:block text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]">
              Login
            </Link>
            <Link href="/login?mode=register" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Main Hero Content --- */}
      <main className="relative pt-36 pb-20 px-6 flex flex-col items-center">
        
        {/* Deep Field Ambient Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[500px] bg-emerald-500/10 blur-[150px] -z-10 rounded-full animate-pulse" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] -z-10 rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl"
        >
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-full mb-8 shadow-inner"
          >
            <Zap size={12} className="text-emerald-400 fill-emerald-400" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Premium Investment Platform</span>
          </motion.div>

          <h1 className="text-4xl md:text-8xl font-black mb-8 leading-[1] tracking-tighter">
            Maximize Your <br /> 
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-200 to-teal-400 bg-clip-text text-transparent">
              Daily Profits
            </span>
          </h1>
          
          <p className="text-xs md:text-lg text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed font-medium uppercase tracking-wide opacity-80">
            Secure high-yield investment plans. Experience automated daily profit cycles and withdraw your earnings with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-xs mx-auto sm:max-w-none">
            <Link href="/login?mode=register" className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-emerald-500 hover:scale-105 shadow-2xl shadow-emerald-500/20">
              Open Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login?mode=login" className="flex justify-center items-center w-full sm:w-auto px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] border border-white/10 bg-slate-900/50 backdrop-blur-md hover:bg-white/5 transition-all">
              View Plans
            </Link>
          </div>
        </motion.div>

        {/* --- Pro Features Grid --- */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { 
              icon: <TrendingUp className="text-emerald-400" />, 
              title: "Guaranteed Growth", 
              desc: "Deploy capital into secure plans with fixed daily returns. Watch your digital portfolio grow consistently." 
            },
            { 
              icon: <ShieldCheck className="text-blue-400" />, 
              title: "Instant Payouts", 
              desc: "Seamlessly withdraw your earnings to verified local wallets like Easypaisa & JazzCash instantly." 
            },
            { 
              icon: <Briefcase className="text-purple-400" />, 
              title: "Elite Packages", 
              desc: "Access premium investment tiers tailored for maximum profitability and secure capital growth." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative p-10 rounded-[3rem] bg-slate-900/30 border border-white/5 hover:border-emerald-500/20 transition-all duration-700"
            >
              <div className="relative z-10">
                <div className="bg-slate-950 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black mb-4 uppercase tracking-tighter text-white">{item.title}</h3>
                <p className="text-slate-500 text-[11px] leading-loose font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Market Statistics --- */}
        <div className="mt-32 w-full max-w-5xl py-12 px-8 rounded-[3rem] bg-slate-900/20 border border-white/5 backdrop-blur-sm">
            <div className="flex flex-wrap justify-around gap-12">
               <div className="text-center group">
                  <h4 className="text-4xl font-black tracking-tighter italic text-white group-hover:text-emerald-400 transition-colors">100%</h4>
                  <p className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500 mt-2">Secure Capital</p>
               </div>
               <div className="text-center group">
                  <h4 className="text-4xl font-black tracking-tighter italic text-white group-hover:text-emerald-400 transition-colors">24h</h4>
                  <p className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500 mt-2">Profit Cycles</p>
               </div>
               <div className="text-center group">
                  <h4 className="text-4xl font-black tracking-tighter italic text-white group-hover:text-emerald-400 transition-colors">24/7</h4>
                  <p className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500 mt-2">Withdrawal Support</p>
               </div>
            </div>
        </div>
      </main>

      {/* --- Footer Footer --- */}
      <footer className="mt-20 py-16 border-t border-white/5 text-center bg-slate-950/50 backdrop-blur-md">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Landmark size={20} className="text-emerald-500" />
          <span className="text-sm font-black uppercase tracking-[0.4em] italic text-white/80">TRUST ME GLOBAL</span>
        </div>
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] mb-4">
          The future of secure digital investments.
        </p>
        <div className="h-1 w-20 bg-emerald-500/20 mx-auto rounded-full" />
      </footer>
    </div>
  );
}                                                      