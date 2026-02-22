"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Calendar, Phone, Search, Loader2, Mail } from "lucide-react";

export default function UsersListAdmin() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const PAGE_SIZE = 10;

  const fetchUsers = useCallback(async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return;
    setLoading(true);

    const currentPage = isInitial ? 0 : page;
    
    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

    // Search logic
    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else if (data) {
      if (data.length < PAGE_SIZE) setHasMore(false);
      
      setUsers((prev) => {
        const currentList = isInitial ? [] : prev;
        // Duplicate key check using Set
        const existingIds = new Set(currentList.map(u => u.id));
        const filteredNewData = data.filter(u => !existingIds.has(u.id));
        return [...currentList, ...filteredNewData];
      });

      setPage(currentPage + 1);
    }
    setLoading(false);
  }, [page, loading, hasMore, supabase, searchTerm]);

  // Infinite Scroll Observer
  const lastUserRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchUsers();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchUsers]);

  // Handle Search
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchUsers(true);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#020617] text-white px-4 pt-10 pb-32">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">User Base</h1>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Manage your empire</p>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Users className="text-emerald-500" size={24} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-slate-500" size={18} />
        </div>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0f172a] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600 shadow-inner"
        />
      </div>

      {/* Users List */}
      <div className="space-y-4">
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              ref={index === users.length - 1 ? lastUserRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 rounded-[2rem] bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/5 shadow-xl relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <User className="text-emerald-500" size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-white truncate text-sm uppercase tracking-tight">
                    {user.full_name || 'Incognito User'}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold mt-1">
                    <Phone size={10} className="text-emerald-500/50" />
                    {user.phone_number || 'N/A'}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-emerald-400">
                    Rs. {user.available_balance?.toLocaleString() || '0'}
                  </p>
                  <p className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">Balance</p>
                </div>
              </div>

              {/* Joined Date Badge */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar size={10} className="text-slate-600" />
                  <span className="text-[9px] text-slate-500 font-bold uppercase">
                    Since {new Date(user.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <div className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 font-bold">
                   Active
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* States */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="text-emerald-500 animate-spin" size={32} />
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <p className="text-center text-slate-600 text-[10px] font-black mt-10 uppercase tracking-[0.2em] opacity-50">
          — End of the Line —
        </p>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500 font-bold text-sm">No users found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}