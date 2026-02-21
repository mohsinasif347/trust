"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Settings 
} from "lucide-react"; 
import Link from "next/link";

export default function AdminBottomNav() {
  const pathname = usePathname();

  // Admin Specific Navigation Items (4 Icons)
  const navItems = [
    { name: "Home", href: "/admin", icon: LayoutDashboard },
    { name: "Deposits", href: "/admin/deposits", icon: ArrowDownCircle },
    { name: "Withdraws", href: "/admin/withdrawals", icon: ArrowUpCircle },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* Floating Glass Container - Exact same style as user nav */}
      <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl shadow-emerald-900/20 w-full max-w-sm">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex-1 flex flex-col items-center justify-center py-2 cursor-pointer"
            >
              {/* Active Background Glow (Floating Bubble) */}
              {isActive && (
                <motion.div
                  layoutId="admin-nav-bubble"
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
                  layoutId="admin-nav-dot"
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