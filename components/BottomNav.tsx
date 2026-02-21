"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Users, Wallet, User, PlusCircle } from "lucide-react"; // Bird ki jagah Users import kiya hai
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation Items
  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My Team", href: "/dashboard/team", icon: Users }, // Farm/Bird ki jagah Team/Users laga diya
    // Center Button (Special)
    { name: "Add", href: "/dashboard/invest", icon: PlusCircle, isSpecial: true },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* Floating Glass Container */}
      <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl shadow-emerald-900/20 w-full max-w-sm">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          // Special Center Button Design (Golden)
          if (item.isSpecial) {
            return (
              <div key={item.name} className="relative -top-5 mx-2">
                <Link href={item.href}>
                  <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.5)] border-4 border-slate-950 transition-transform active:scale-95">
                    <Icon className="text-slate-950" size={28} strokeWidth={2.5} />
                  </div>
                </Link>
              </div>
            );
          }

          // Normal Tabs
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex-1 flex flex-col items-center justify-center py-2 cursor-pointer"
            >
              {/* Active Background Glow (Floating Bubble) */}
              {isActive && (
                <motion.div
                  layoutId="nav-bubble"
                  className="absolute inset-0 bg-emerald-500/10 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className={`relative z-10 transition-colors duration-300 ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Active Dot Indicator */}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}