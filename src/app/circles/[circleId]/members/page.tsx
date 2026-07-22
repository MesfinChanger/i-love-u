'use client';

import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "next/navigation";

import {
  Users,
  ShieldCheck,
  Crown,
  Loader2
} from "lucide-react";

import {
  Card,
  CardContent
} from "@/components/ui/Card";

import {
  Badge
} from "@/components/ui/badge";

import {
  Header
} from "@/components/Header";

import {
  BottomNav
} from "@/components/BottomNav";

import GuestAccessGuard from "@/components/GuestAccessGuard";

import {
  getCircleMembers
} from "@/services/circle.service";

/**
 * @fileOverview High-Fidelity Circle Members Registry.
 * Displays the hearts synchronized with a specific community frequency.
 */
export default function MembersPage() {
  const params = useParams();
  const circleId = params?.circleId as string;

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!circleId) return;

      try {
        const data = await getCircleMembers(circleId);
        setMembers(data);
      } catch (error) {
        console.error("Registry Sync Error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [circleId]);

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />

        <main className="container mx-auto px-6 py-10 max-w-5xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black flex items-center gap-4 tracking-tighter uppercase">
              <Users className="text-primary w-12 h-12" />
              Members
            </h1>
            <p className="text-muted-foreground font-medium italic ml-1">
              "Every heart identified in this frequency."
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
                    <CardContent className="p-8 flex items-center gap-5">
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

                      <div className="flex-1 space-y-2">
                        <h2 className="font-black text-xl tracking-tight leading-none">
                          {member.profile?.displayName ||
                            member.profile?.username ||
                            "Unknown Heart"}
                        </h2>

                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
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
