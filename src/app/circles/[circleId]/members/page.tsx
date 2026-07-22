'use client';

import { useEffect, useState, use } from "react";
import { Users, ShieldCheck, Crown, Loader2, Lock, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { getCircleMembers } from "@/services/circle.service";
import { getCircleRole } from "@/services/permission.service";
import { useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * @fileOverview High-Fidelity Circle Members Registry.
 * Displays the hearts synchronized with a specific community frequency.
 * Protected by the Circle Membership Protocol to ensure members-only access.
 */
export default function MembersPage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = use(params);
  const { user } = useUser();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifyAndLoad() {
      if (!circleId || !user?.uid) return;

      try {
        /**
         * Sovereignty Handshake Protocol.
         * Verifies if the heart has a registered record in this circle frequency.
         */
        const role = await getCircleRole(circleId, user.uid);
        const isMember = role !== null && role !== "guest";
        setAuthorized(isMember);

        if (isMember) {
          /**
           * Registry Sync.
           * Retrieves the high-fidelity member list once authority is confirmed.
           */
          const data = await getCircleMembers(circleId);
          setMembers(data);
        }
      } catch (error) {
        console.error("Registry Sync Ripple:", error);
      } finally {
        setLoading(false);
        setChecking(false);
      }
    }

    verifyAndLoad();
  }, [circleId, user?.uid]);

  if (checking) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-primary opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-4">Synchronizing Registry...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto max-w-lg p-6 flex items-center justify-center min-h-[60vh]">
          <Card className="p-12 text-center rounded-[3.5rem] border-none shadow-2xl bg-white space-y-8 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-primary/20">
                <Lock className="w-10 h-10 text-primary opacity-20" />
             </div>
             <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter">Members Only</h1>
                <p className="text-muted-foreground italic font-medium leading-relaxed">
                  "Only synchronized members can access the heart registry for this frequency."
                </p>
             </div>
             <Button asChild className="h-16 w-full rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all gap-2">
                <Link href={`/circles/${circleId}`}>
                  <ArrowLeft className="w-4 h-4" />
                  Return to Circle
                </Link>
             </Button>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />

        <main className="container mx-auto px-6 py-10 max-w-5xl space-y-10">
          <div className="space-y-2">
            <h1 className="text-5xl font-black flex items-center gap-4 tracking-tighter uppercase leading-none">
              <Users className="text-primary w-12 h-12" />
              Registry
            </h1>
            <p className="text-muted-foreground font-medium italic ml-1">
              "Every heart synchronized with this community frequency."
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-40">
              <Loader2 className="animate-spin w-12 h-12 text-primary opacity-20" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {members.length > 0 ? (
                members.map((member) => (
                  <Card
                    key={member.id}
                    className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden hover:shadow-xl transition-all group"
                  >
                    <CardContent className="p-8 flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/5">
                        {member.profile?.photoURL ? (
                          <img
                            src={member.profile.photoURL}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-8 h-8 text-primary/40" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2 text-left">
                        <h2 className="font-black text-2xl tracking-tight uppercase leading-none truncate max-w-[200px]">
                          {member.profile?.displayName ||
                            member.profile?.username ||
                            "Unknown Heart"}
                        </h2>

                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                          🌍 {member.profile?.country || "Global"}
                        </p>

                        <div className="flex gap-2 pt-1">
                          {member.role === "owner" && (
                            <Badge className="bg-primary text-white border-none font-black uppercase text-[8px] h-6 px-3">
                              <Crown className="w-3 h-3 mr-1" />
                              Owner
                            </Badge>
                          )}

                          {member.role === "moderator" && (
                            <Badge variant="secondary" className="bg-slate-900 text-white border-none font-black uppercase text-[8px] h-6 px-3">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Moderator
                            </Badge>
                          )}

                          {(!member.role || member.role === "member") && (
                            <Badge variant="outline" className="border-2 font-black uppercase text-[8px] h-6 px-3">
                              Member
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-32 text-center opacity-20 border-4 border-dashed rounded-[3rem] bg-white/50">
                   <p className="text-xl font-black uppercase tracking-widest italic">
                     "The registry is waiting for the first heartbeat."
                   </p>
                </div>
              )}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}
