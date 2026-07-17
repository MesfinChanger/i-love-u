'use client';

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/AdminGuard";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Loader2, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  UserCircle 
} from "lucide-react";

/**
 * @fileOverview User Management Command Center.
 * High-fidelity registry for community guardians to monitor heart identities.
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      if (!db) return;
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(list);
      } catch (e) {
        console.error("Registry Sync Ripple:", e);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto p-8 space-y-10 max-w-5xl">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none flex items-center gap-3">
              <Users className="w-10 h-10 text-primary" />
              👥 User Management
            </h1>
            <p className="text-muted-foreground font-medium italic">
              "Managing every heart in the Prosperity Revolution."
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm font-black uppercase tracking-widest">Scanning Network...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {users.map((u) => (
                <Card key={u.id} className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden hover:shadow-xl transition-all group">
                  <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 text-left flex-grow min-w-0">
                      <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center font-black text-2xl text-primary group-hover:scale-110 transition-transform">
                        {u.displayName?.[0] || u.name?.[0] || <UserCircle />}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-3">
                           <h2 className="text-2xl font-black tracking-tight truncate">
                             {u.displayName || u.name || "Mystery Heart"}
                           </h2>
                           {u.role === 'admin' && (
                             <Badge className="bg-red-500 text-white border-none text-[8px] font-black uppercase px-2 h-5 tracking-widest">Guardian</Badge>
                           )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {u.email}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {u.country || "Global"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                       <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-3 h-8 border-2">
                            Role: {u.role || "member"}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 border-none text-[10px] font-black uppercase tracking-widest px-3 h-8">
                            {u.status || "active"}
                          </Badge>
                       </div>
                       <p className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-widest">UID: {u.id.slice(0, 12)}...</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="p-8 bg-slate-900 rounded-[3rem] border border-primary/20 shadow-2xl relative overflow-hidden group">
             <ShieldCheck className="absolute top-0 right-0 p-8 w-40 h-40 text-primary opacity-5 group-hover:rotate-12 transition-transform" />
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                   <ShieldCheck className="w-6 h-6" />
                   <h4 className="text-xl font-black uppercase tracking-tight text-white">Integrity Protocol Active</h4>
                </div>
                <p className="text-base text-white/70 font-medium italic leading-relaxed uppercase tracking-widest">
                  "Respect is Mandatory." Admins ensure every heart contributes to prosperity and follows the community honor code.
                </p>
             </div>
          </div>
        </main>
        <BottomNav />
      </div>
    </AdminGuard>
  );
}
