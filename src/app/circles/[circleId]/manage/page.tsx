"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { useUser, useFirestore } from "@/firebase";
import {
  getCircleRole,
  canManageCircle,
} from "@/services/permission.service";
import {
  Loader2,
  ShieldCheck,
  Trash2,
  Crown,
  User,
  ChevronLeft,
} from "lucide-react";
import {
  getAllCircleMembers,
  changeMemberRole,
  removeMember
} from "@/services/circle-admin.service";
import { useToast } from "@/hooks/use-toast";

interface CircleMember {
  id: string;
  userId: string;
  role: string;
  status: string;
  profile?: {
    displayName?: string;
    username?: string;
    photoURL?: string | null;
    country?: string;
  };
}

/**
 * @fileOverview Circle Management Hub.
 * Exclusively protected for Owners and Guardians via the Sovereignty Protocol.
 */
export default function CircleManagePage({
  params
}: {
  params: Promise<{ circleId: string }>;
}) {
  const { circleId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [members, setMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      if (!circleId || !user?.uid) {
        setChecking(false);
        return;
      }

      try {
        const role = await getCircleRole(circleId, user.uid);
        const isAllowed = canManageCircle(role);
        setAuthorized(isAllowed);

        if (isAllowed) {
          await loadRegistry();
        }
      } catch (error) {
        console.error("Circle authority handshake error:", error);
      } finally {
        setChecking(false);
      }
    }
    check();
  }, [circleId, user?.uid]);

  async function loadRegistry() {
    if (!circleId || !db) return;
    setLoading(true);
    try {
      const data = await getAllCircleMembers(circleId);
      const enriched = await Promise.all(
        data.map(async (member: any) => {
          try {
            const profileSnap = await getDoc(doc(db, "publicProfiles", member.userId));
            return {
              ...member,
              profile: profileSnap.exists() ? profileSnap.data() : null
            };
          } catch {
            return member;
          }
        })
      );
      setMembers(enriched);
    } catch (error) {
      console.error("Member registry sync error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(targetUserId: string, currentRole: string) {
    if (!user?.uid) return;
    setProcessingId(targetUserId);
    try {
      const newRole = currentRole === "moderator" ? "member" : "moderator";
      await changeMemberRole(circleId, targetUserId, newRole, user.uid);
      toast({ title: "Authority Updated", description: `Member role changed to ${newRole}. ✨` });
      await loadRegistry();
    } catch (error) {
      toast({ variant: "destructive", title: "Action Failed", description: "You do not have permission to change roles." });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRemove(targetUserId: string) {
    if (!user?.uid) return;
    if (!confirm("Are you sure you want to remove this member from the circle registry?")) return;
    
    setProcessingId(targetUserId);
    try {
      await removeMember(circleId, targetUserId, user.uid);
      toast({ title: "Member Purged", description: "Circle registry updated successfully. ❤️" });
      await loadRegistry();
    } catch (error) {
      toast({ variant: "destructive", title: "Removal Failed", description: "Guardian permission required for this action." });
    } finally {
      setProcessingId(null);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
        <Loader2 className="animate-spin w-12 h-12 text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest mt-4">Verifying Authority...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30 text-center">
        <Card className="max-w-md p-12 rounded-[3.5rem] border-none shadow-2xl bg-white space-y-6">
          <ShieldCheck className="mx-auto w-20 h-20 text-red-500 opacity-20" />
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Access Restricted</h1>
            <p className="text-muted-foreground italic font-medium leading-relaxed">
              Only Circle owners can manage this Circle. ❤️
            </p>
          </div>
          <Button asChild className="w-full h-14 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl">
            <Link href={`/circles/${circleId}`}>Return to Circle</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-6 py-10 max-w-5xl space-y-10">
          <div className="flex justify-between items-end gap-6">
            <div className="space-y-1">
              <h1 className="text-5xl font-black flex gap-4 items-center uppercase tracking-tighter">
                <ShieldCheck className="text-primary w-12 h-12" />
                Circle Control
              </h1>
              <p className="text-muted-foreground italic font-medium">Guardian registry for {circleId}</p>
            </div>
            <Button variant="ghost" asChild className="rounded-full h-12 px-6 hover:bg-white">
              <Link href={`/circles/${circleId}`}>
                <ChevronLeft className="mr-2 w-4 h-4" /> Back to Space
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary opacity-20" />
              </div>
            ) : members.map((member) => (
              <Card key={member.id} className="rounded-[2.5rem] border-none shadow-md bg-white overflow-hidden hover:shadow-lg transition-all">
                <CardContent className="p-8 flex flex-col sm:flex-row justify-between items-center gap-8">
                  <div className="flex gap-6 items-center w-full sm:w-auto">
                    <div className="relative w-24 h-24 rounded-[1.8rem] overflow-hidden bg-primary/10 flex items-center justify-center border-4 border-muted/20 shrink-0">
                      {member.profile?.photoURL ? (
                        <Image src={member.profile.photoURL} alt="profile" fill className="object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-primary/30" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-black text-2xl tracking-tight">
                        {member.profile?.displayName || member.profile?.username || "Mystery Heart"}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/5 text-primary border-none font-black uppercase text-[8px] h-5 px-2">
                           {member.role === 'owner' ? <Crown className="w-2 h-2 mr-1" /> : null}
                           {member.role}
                        </Badge>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{member.profile?.country || "Global"}</span>
                      </div>
                    </div>
                  </div>

                  {member.role !== "owner" && (
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-center">
                        <Button 
                          variant="outline"
                          disabled={processingId === member.userId} 
                          onClick={() => handleRoleChange(member.userId, member.role)}
                          className="rounded-xl h-11 px-5 font-black uppercase text-[9px] tracking-widest flex-1 sm:flex-none"
                        >
                          {member.role === "moderator" ? "Revoke Authority" : "Make Moderator"}
                        </Button>
                        <Button 
                          variant="destructive" 
                          disabled={processingId === member.userId} 
                          onClick={() => handleRemove(member.userId)}
                          className="rounded-xl h-11 px-5 font-black uppercase text-[9px] tracking-widest gap-2 flex-1 sm:flex-none shadow-xl shadow-red-500/10"
                        >
                          {processingId === member.userId ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          Purge Member
                        </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}
