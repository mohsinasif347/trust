import AdminBottomNav from "@/components/AdminBottomNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen !bg-[#020617] relative selection:bg-emerald-500/30">
      
      {/* Subtle Admin Background Decoration - Financial Theme */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Top Right Glow - Emerald (Profit/Success) */}
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[40%] !bg-emerald-500/10 blur-[120px] rounded-full" />
         
         {/* Bottom Left Glow - Amber (Wealth/Investment) */}
         <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[40%] !bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Admin Content Area */}
      <main className="relative z-10 pb-32">
        {children}
      </main>

      {/* Persistent Admin Navigation */}
      <div className="relative z-50">
        <AdminBottomNav />
      </div>
      
    </div>
  );
}