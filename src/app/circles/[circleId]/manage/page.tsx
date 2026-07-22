"use client";

import { useEffect, useState, use } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  ShieldCheck, 
  Trash2, 
  Crown, 
  User, 
  ChevronLeft,
  Sparkles
} from "lucide-react";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { useCircleRole } from "@/hooks/use-circle-role";
import { 
  getAllCircleMembers, 
  changeMemberRole, 
  removeMember 
} from "@/services/circle-admin.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview High-Fidelity Circle Management Hub.
 * Orchestrates community governance and membership registry management.
 */
export default function CircleManagePage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = use(params);
  const { isAdmin, loading: roleLoading } = useCircleRole(circleId);
  const { toast } = useToast();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function load() {
    if (!circleId) return;
    setLoading(true);
    try {
      const data = await getAllCircleMembers(circleId);
      // Enrich with profile data
      const enriched = await Promise.all(data.map(async (m) => {
        const userSnap = await getDoc(doc(db, "users", m.userId));
        return { ...m, profile: userSnap.exists() ? userSnap.data() : null };
      }));
      setMembers(enriched);
    } catch (e) {
      console.error("Registry Sync Ripple:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [circleId, isAdmin]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setProcessingId(userId);
    try {
      await changeMemberRole(circleId, userId, newRole);
      toast({ title: "Authority Adjusted", description: `Member role updated to ${newRole}. ✨` });
      await load();
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Insufficient permissions. ❤️" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this heart from the circle?")) return;
    setProcessingId(userId);
    try {
      await removeMember(circleId, userId);
      toast({ title: "Heart Disconnected", description: "Member has been removed from the registry." });
      await load();
    } catch (e) {
      toast({ variant: "destructive", title: "Removal Failed", description: "Could not purge record." });
    } finally {
      setProcessingId(null);
    }
  };

  if (!roleLoading && !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 text-center">
        <Card className="max-w-md p-12 rounded-[3.5rem] border-none shadow-2xl space-y-6">
           <ShieldCheck className="w-16 h-16 text-primary mx-auto opacity-20" />
           <h1 className="text-3xl font-black uppercase">Access Denied</h1>
           <p className="text-muted-foreground italic">"You do not possess the Guardian authority required for this frequency."</p>
           <Button asChild className="rounded-xl gradient-bg"><Link href={`/circles/${circleId}`}>Return to Circle</Link></Button>
        </Card>
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />

        <main className="container mx-auto px-6 py-10 max-w-5xl space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-5xl font-black flex gap-4 items-center tracking-tighter uppercase leading-none">
                <ShieldCheck className="text-primary w-12 h-12" />
                Circle Control
              </h1>
              <p className="text-muted-foreground font-medium italic">"Managing the registry of hearts."</p>
            </div>
            <Button variant="ghost" asChild className="rounded-xl">
               <Link href={`/circles/${circleId}`}><ChevronLeft className="mr-2" /> Back</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary opacity-20" />
              </div>
            ) : members.length > 0 ? (
              members.map((member) => (
                <Card key={member.id} className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden group hover:shadow-xl transition-all">
                  <CardContent className="p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                         {member.profile?.photoURL ? (
                           <img src={member.profile.photoURL} alt="" className="w-full h-full object-cover rounded-2xl" />
                         ) : (
                           <User className="w-8 h-8" />
                         )}
                      </div>
                      <div className="text-left flex-grow">
                        <h2 className="font-black text-2xl tracking-tight uppercase leading-none">
                          {member.profile?.displayName || "Mystery Heart"}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                           <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase px-2 h-5">
                             {member.role}
                           </Badge>
                           <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                             ID: {member.userId.slice(0, 8)}...
                           </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={processingId === member.userId || member.role === 'owner'}
                        onClick={() => handleRoleChange(member.userId, member.role === 'moderator' ? 'member' : 'moderator')}
                        className="rounded-xl h-12 flex-1 sm:flex-none font-black uppercase text-[10px] gap-2"
                      >
                        {member.role === 'moderator' ? <User className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                        {member.role === 'moderator' ? "Make Member" : "Moderator"}
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={processingId === member.userId || member.role === 'owner'}
                        onClick={() => handleRemove(member.userId)}
                        className="rounded-xl h-12 flex-1 sm:flex-none font-black uppercase text-[10px] gap-2"
                      >
                        {processingId === member.userId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center opacity-20 space-y-4">
                 <Sparkles className="w-20 h-20 mx-auto" />
                 <p className="text-xl font-black uppercase tracking-widest italic">"The registry is waiting for the first heartbeat."</p>
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}
