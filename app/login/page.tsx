"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client"; 
import { Loader2, Sparkles, LogIn, ArrowRight } from "lucide-react";

// Tumhara existing component import kar raha hun
import NeonInput from "@/components/NeonInput";

function AuthContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const referralCode = searchParams.get("ref");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const dummyEmail = `${phone}@birdvest.com`;

    try {
      const { data, error } = isLogin
        ? await supabase.auth.signInWithPassword({ email: dummyEmail, password })
        : await supabase.auth.signUp({
            email: dummyEmail,
            password,
            options: {
              data: {
                full_name: fullName,
                phone_number: phone,
                referred_by: referralCode || null,
              },
            },
          });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: pError } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", data.user.id)
          .single();

        if (pError || !profile) throw new Error("Profile creation failed.");

        router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#020617]">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-amber-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* --- Main 3D Container --- */}
      <div className="w-full max-w-md perspective-1000 z-10" style={{ perspective: "1000px" }}>
        <motion.div
          initial={false}
          animate={{ rotateY: isLogin ? 180 : 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120, damping: 20 }}
          className="relative w-full"
          style={{ 
            minHeight: '600px',
            transformStyle: "preserve-3d" // Yeh zaroori hai flip fixing ke liye
          }} 
        >
          
          {/* =======================
              FRONT SIDE: REGISTER 
              ======================= */}
          <div 
            className="absolute inset-0 flex flex-col h-full"
            style={{ 
                backfaceVisibility: "hidden", 
                WebkitBackfaceVisibility: "hidden" 
            }}
          >
            {/* Glass Card */}
            <div className="relative flex-1 bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-900/20 overflow-hidden flex flex-col">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 ring-1 ring-emerald-500/20">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Join the VIP Community</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <NeonInput 
                  label="Full Name" 
                  placeholder="Ali Ahmed" 
                  value={fullName} 
                  onChange={(e: any) => setFullName(e.target.value)} 
                  required 
                />

                <NeonInput 
                  label="Phone" 
                  type="tel" 
                  placeholder="03xxxxxxxxx" 
                  value={phone} 
                  onChange={(e: any) => setPhone(e.target.value)} 
                  required 
                />

                <NeonInput 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e: any) => setPassword(e.target.value)} 
                  required 
                />

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium animate-pulse">
                    {errorMsg}
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full py-4 mt-2 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Start Journey"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-auto pt-6 text-center">
                <p className="text-slate-500 text-xs">
                  Already a member?{" "}
                  <button onClick={() => setIsLogin(true)} className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4 transition-colors">
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* =======================
              BACK SIDE: LOGIN 
              ======================= */}
          <div 
            className="absolute inset-0 flex flex-col h-full"
            style={{ 
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            {/* Glass Card */}
            <div className="relative flex-1 bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-900/20 overflow-hidden flex flex-col justify-center">
              
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 mb-3 ring-1 ring-amber-500/20">
                  <LogIn size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
                <p className="text-slate-400 text-xs mt-1 font-medium">Access your Dashboard</p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                <NeonInput 
                  label="Phone Number" 
                  type="tel" 
                  placeholder="03xxxxxxxxx" 
                  value={phone} 
                  onChange={(e: any) => setPhone(e.target.value)} 
                  required 
                />
                
                <NeonInput 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e: any) => setPassword(e.target.value)} 
                  required 
                />

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                    {errorMsg}
                  </div>
                )}

                <button 
                  disabled={loading}
                  className="w-full py-4 mt-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-xs">
                  Don't have an account?{" "}
                  <button onClick={() => setIsLogin(false)} className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 transition-colors">
                    Register Now
                  </button>
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

export default function AuthForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-emerald-500">Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}