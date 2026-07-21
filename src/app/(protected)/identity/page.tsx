"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
import { 
  User, 
  ShieldCheck, 
  Mail, 
  Globe, 
  IdCard, 
  Loader2, 
  Save,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview High-Fidelity Identity Hub.
 * The sacred registry where hearts manage their primary mission signature.
 */
export default function IdentityPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, loading } = useDoc(userRef);

  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!db || !user?.uid || isSaving) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName.trim(),
        updatedAt: serverTimestamp()
      });
      toast({ title: "Registry Synchronized", description: "Your heart signature has been updated. ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update signature." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-10 max-w-4xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
              <IdCard className="w-10 h-10 text-primary" />
              Identity Hub
            </h1>
            <p className="text-lg text-muted-foreground font-medium italic">
              "Your unique signature in the Prosperity Revolution."
            </p>
          </div>
          <Badge className="bg-slate-900 text-white border-none px-4 h-8 uppercase font-black tracking-widest text-[10px]">
            {profile?.accountType || "FREE"} HEART
          </Badge>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 rounded-[3rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-8 bg-primary/5 border-b">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Core Registry</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-primary/60">High-Fidelity Identification</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Heart Name</Label>
                  <Input 
                    value={displayName} 
                    onChange={e => setDisplayName(e.target.value)} 
                    className="h-14 rounded-2xl bg-muted/20 border-none font-bold text-lg"
                    placeholder="Identify yourself..."
                  />
               </div>

               <div className="space-y-2 opacity-60">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Signature</Label>
                  <div className="h-14 rounded-2xl bg-muted/10 border-2 border-dashed border-muted flex items-center px-6 text-slate-400 font-medium">
                     {profile?.email}
                  </div>
               </div>

               <Button 
                onClick={handleSave} 
                disabled={isSaving || !displayName.trim()}
                className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 active:scale-95 transition-all gap-3"
               >
                 {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 Synchronize Identity
               </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-5 space-y-6">
             <Card className="rounded-[2.5rem] border-none shadow-lg bg-slate-900 text-white p-8 space-y-6">
                <div className="flex items-center gap-3 text-primary">
                   <ShieldCheck className="w-8 h-8" />
                   <h3 className="font-black text-xl uppercase tracking-tighter">Security Protocol</h3>
                </div>
                <div className="space-y-4">
                   <SecurityStatusItem icon={<Clock />} label="Last Sync" val={profile?.updatedAt ? "Just Now" : "Initial"} />
                   <SecurityStatusItem icon={<Globe />} label="Region" val={profile?.country || "Global"} />
                   <SecurityStatusItem icon={<ShieldCheck />} label="Verified" val={profile?.isVerified ? "Yes" : "Pending"} />
                </div>
             </Card>

             <div className="p-8 bg-white/60 rounded-[2.5rem] border-2 border-dashed border-primary/10 text-center space-y-4">
                <Sparkles className="w-8 h-8 text-primary mx-auto opacity-20" />
                <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed uppercase tracking-widest">
                  "Respect & Love is Mandatory." Your identity is a sacred bridge to the global community. Protect it with honor.
                </p>
             </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function SecurityStatusItem({ icon, label, val }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
       <div className="flex items-center gap-3 text-white/40">
          <div className="w-4 h-4">{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-[10px] font-black uppercase text-primary tracking-widest">{val}</span>
    </div>
  );
}
