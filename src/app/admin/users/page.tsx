"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/AdminGuard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, ShieldCheck, Loader2 } from "lucide-react";

/**
 * @fileOverview High-Fidelity User Management Registry.
 * Synchronized with the Heart Mission Registry protocols.
 */
export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!db) return;
      try {
        const result = await getDocs(collection(db, "users"));
        setUsers(result.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Registry load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AdminGuard>
      <main className="container mx-auto p-8 max-w-5xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Heart Registry</h1>
            <p className="text-xs text-muted-foreground italic uppercase tracking-widest">Global Member Database</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 opacity-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="p-6 rounded-[2rem] border-none shadow-md hover:shadow-lg transition-all bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 flex-grow">
                  <h2 className="font-black text-xl tracking-tight">{user.displayName || user.name || "Mystery Heart"}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="text-xs font-medium">{user.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-slate-900 text-white border-none uppercase text-[8px] font-black tracking-widest px-3 h-6">
                    {user.role || "user"}
                  </Badge>
                  {user.isAdmin && <ShieldCheck className="w-5 h-5 text-green-500" />}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}