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
  Sparkles,
  AlertCircle,
  ShieldX
} from "lucide-react";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { useUser, useFirestore } from "@/firebase";
import { 
  getAllCircleMembers, 
  changeMemberRole, 
  removeMember 
} from "@/services/circle-admin.service";
import { getCircleRole, canManageCircle } from "@/services/permission.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";

/**
 * @fileOverview High-Fidelity Circle Management Hub.
 * Protected by a dedicated Sovereignty Handshake to ensure owner-only access.
 */
export default function CircleManagePage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Sovereignty Handshake Protocol
  useEffect(() => {
    async function check() {
      if (!circleId || !user?.uid) return;
      
      try {
        const role = await getCircleRole(circleId, user.uid);
        const canManage = canManageCircle(role);
        setAuthorized(canManage);
        
        if (canManage) {
          await loadRegistry();
        }
      } catch (e) {
        console.warn("Authority Check Ripple:", e);
      } finally {
        setIsChecking(false);
      }
    }
    check();
  }, [circleId, user?.uid]);

  async function loadRegistry() {
    if (!circleId || !db) return;
    setLoading(true);
    try {
      const data = await getAllCircleMembers(circleId);
      // High-Fidelity Enrichment: Map member IDs to public heart profiles
      const enriched = await Promise.all(data.map(async (m) => {
        try {
          const profileSnap = await getDoc(doc(db, "publicProfiles", m.userId));
          return { ...m, profile: profileSnap.exists() ? profileSnap.data() : null };
        } catch (e) {
          return m;
        }
      }));
      setMembers(enriched);
    } catch (e) {
      console.error("Registry Sync Ripple:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId: string, currentRole: string) => {
    if (!circleId) return;
    setProcessingId(userId);
    const newRole = currentRole === 'moderator' ? 'member' : 'moderator';
    try {
      await changeMemberRole(circleId, userId, newRole);
      toast({ title: "Authority Adjusted", description: `Member role updated to ${newRole}. ✨` });
      await loadRegistry();
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Guardian authority required. ❤️" });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!circleId) return;
    if (!confirm("Are you sure you want to remove this heart from the circle frequency?")) return;
    
    setProcessingId(userId);
    try {
      await removeMember(circleId, userId);
      toast({ title: "Heart Disconnected", description: "Member record purged from registry." });
      await loadRegistry();
    } catch (e) {
      toast({ variant: "destructive", title: "Removal Failed", description: "Could not synchronize disconnect." });
    } finally {
      setProcessingId(null);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-4">Verifying Sovereignty...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 text-center">
        <Card className="max-w-md w-full p-12 rounded-[3.5rem] border-none shadow-2xl space-y-8 bg-white animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-red-100">
              <ShieldX className="w-10 h-10 text-red-500" />
           </div>
           <div className="space-y-2">
              <h1 className="text-3xl font-black uppercase tracking-tighter">Access Restricted</h1>
              <p className="text-muted-foreground italic font-medium">
                "Only Circle owners hold the Guardian signature required for this frequency."
              </p>
           </div>
           <Button asChild className="w-full rounded-2xl h-16 gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
              <Link href={`/circles/${circleId}`}>Return to Circle</Link>
           </Button>
        </Card>
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24 text-slate-900">
        <Header />

        <main className="container mx-auto px-6 py-10 max-w-5xl space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-5xl font-black flex gap-4 items-center tracking-tighter uppercase leading-none">
                <ShieldCheck className="text-primary w-12 h-12" />
                Circle Control
              </h1>
              <p className="text-muted-foreground font-medium italic ml-1">"Managing the registry of hearts."</p>
            </div>
            <Button variant="ghost" asChild className="rounded-xl font-black uppercase text-[10px] tracking-widest">
               <Link href={`/circles/${circleId}`}><ChevronLeft className="mr-2 w-4 h-4" /> Back</Link>
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
                      <div className="w-20 h-20 rounded-[1.8rem] bg-primary/5 flex items-center justify-center text-primary border-2 border-primary/5 overflow-hidden shadow-sm">
                         {member.profile?.photoURL ? (
                           <img src={member.profile.photoURL} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <User className="w-8 h-8 opacity-20" />
                         )}
                      </div>
                      <div className="text-left flex-grow space-y-1">
                        <h2 className="font-black text-2xl tracking-tight uppercase leading-none">
                          {member.profile?.displayName || member.profile?.username || "Unknown Heart"}
                        </h2>
                        <div className="flex items-center gap-3">
                           <Badge className={cn(
                             "border-none text-[8px] font-black uppercase px-3 h-6 flex items-center",
                             member.role === 'owner' ? "bg-primary text-white" : "bg-primary/10 text-primary"
                           )}>
                             {member.role === 'owner' && <Crown className="w-3 h-3 mr-1" />}
                             {member.role}
                           </Badge>
                           <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                             {member.profile?.country || "Global"} Registry
                           </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {member.role !== 'owner' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={processingId === member.userId}
                            onClick={() => handleRoleChange(member.userId, member.role)}
                            className="rounded-xl h-12 flex-1 sm:flex-none font-black uppercase text-[10px] gap-2 border-2"
                          >
                            {member.role === 'moderator' ? <User className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                            {member.role === 'moderator' ? "Make Member" : "Moderator"}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={processingId === member.userId}
                            onClick={() => handleRemove(member.userId)}
                            className="rounded-xl h-12 flex-1 sm:flex-none font-black uppercase text-[10px] gap-2"
                          >
                            {processingId === member.userId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Remove
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center opacity-20 space-y-4">
                 <Sparkles className="w-20 h-20 mx-auto text-primary" />
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
