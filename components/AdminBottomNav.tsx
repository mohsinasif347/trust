"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Settings,
  Users // Naya icon Users list ke liye
} from "lucide-react"; 
import Link from "next/link";

export default function AdminBottomNav() {
  const pathname = usePathname();

  // Admin Specific Navigation (5 Items with Home in Center)
  const navItems = [
    { name: "Users List", href: "/admin/users", icon: Users },
    { name: "Deposits", href: "/admin/deposits", icon: ArrowDownCircle },
    // Center Button (Admin Dashboard - VIP)
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, isSpecial: true },
    { name: "Withdrawals", href: "/admin/withdrawals", icon: ArrowUpCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* Floating Glass Container */}
      <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl shadow-emerald-900/20 w-full max-w-md">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          // Special Center Button (Admin Dashboard)
          if (item.isSpecial) {
            return (
              <div key={item.name} className="relative -top-7 mx-2">
                <Link href={item.href}>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)] border-[6px] border-[#020617]"
                  >
                    <Icon className="text-slate-950" size={28} strokeWidth={2.5} />
                  </motion.div>
                </Link>
              </div>
            );
          }

          // Normal Admin Tabs
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex-1 flex flex-col items-center justify-center py-2 cursor-pointer"
            >
              {/* Active Glow */}
              {isActive && (
                <motion.div
                  layoutId="admin-nav-bubble"
                  className="absolute inset-0 bg-emerald-500/10 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className={`relative z-10 transition-all duration-300 ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Active Dot */}
              {isActive && (
                <motion.div
                  layoutId="admin-nav-dot"
                  className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}