import BottomNav from "@/components/BottomNav";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-white relative">
      
      {/* Background Ambience (Optional) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Main Page Content */}
      <main className="relative z-10 pb-28"> {/* pb-28 is very important! */}
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav />
      
    </div>
  );
}