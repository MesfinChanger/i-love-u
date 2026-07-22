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
import CirclePermissionGuard from "@/components/CirclePermissionGuard";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { useUser, useFirestore } from "@/firebase";
import {
  Loader2,
  ShieldCheck,
  Trash2,
  Crown,
  User,
  ChevronLeft,
  ShieldX
} from "lucide-react";
import {
  getAllCircleMembers,
  changeMemberRole,
  removeMember
} from "@/services/circle-admin.service";
import {
  getCircleRole,
  canManageCircle,
  CircleMemberPermission
} from "@/services/circle-permission.service";
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
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!circleId || !user?.uid) return;

      try {
        const role = await getCircleRole(circleId, user.uid);
        const allowed = canManageCircle(role);
        setAuthorized(allowed);
        setCurrentMember({ userId: user.uid, role });

        if (allowed) {
          await loadRegistry();
        }
      } catch (error) {
        console.error("Circle authority error", error);
      } finally {
        setChecking(false);
      }
    }
    verify();
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
      console.error("Member registry error", error);
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
      toast({ title: "Authority Updated", description: `Member changed to ${newRole}` });
      await loadRegistry();
    } catch (error) {
      toast({ variant: "destructive", title: "Action Failed", description: "Permission denied" });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleRemove(targetUserId: string) {
    if (!user?.uid) return;
    if (!confirm("Remove this member from circle?")) return;
    setProcessingId(targetUserId);
    try {
      await removeMember(circleId, targetUserId, user.uid);
      toast({ title: "Member Removed", description: "Circle registry updated" });
      await loadRegistry();
    } catch (error) {
      toast({ variant: "destructive", title: "Removal Failed", description: "Guardian permission required" });
    } finally {
      setProcessingId(null);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md p-12 rounded-[3rem] text-center space-y-6">
          <ShieldX className="mx-auto w-16 h-16 text-red-500" />
          <h1 className="text-3xl font-black">Access Restricted</h1>
          <p>Only Circle guardians can manage members.</p>
          <Button asChild className="w-full">
            <Link href={`/circles/${circleId}`}>Return</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-6 py-10 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black flex gap-3 items-center">
              <ShieldCheck className="text-primary" />
              Circle Control
            </h1>
            <Button variant="ghost" asChild>
              <Link href={`/circles/${circleId}`}>
                <ChevronLeft /> Back
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            members.map((member) => (
              <Card key={member.id} className="rounded-[2rem] shadow-lg">
                <CardContent className="p-6 flex justify-between items-center gap-6">
                  <div className="flex gap-5 items-center">
                    <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center">
                      {member.profile?.photoURL ? (
                        <Image src={member.profile.photoURL} alt="profile" fill className="object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-primary/30" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-black text-xl">
                        {member.profile?.displayName || member.profile?.username || "Unknown Heart"}
                      </h2>
                      <Badge>{member.role}</Badge>
                    </div>
                  </div>

                  {member.role !== "owner" && (
                    <CirclePermissionGuard member={currentMember} permission="canManageMembers">
                      <div className="flex gap-3">
                        <Button disabled={processingId === member.userId} onClick={() => handleRoleChange(member.userId, member.role)}>
                          {member.role === "moderator" ? "Remove Moderator" : "Make Moderator"}
                        </Button>
                        <Button variant="destructive" disabled={processingId === member.userId} onClick={() => handleRemove(member.userId)}>
                          {processingId === member.userId ? <Loader2 className="animate-spin" /> : <Trash2 />}
                          Remove
                        </Button>
                      </div>
                    </CirclePermissionGuard>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </main>
        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}
