'use client';

import { useState, use, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  Loader2, 
  UserPlus, 
  Trash2, 
  Crown,
  ArrowUpCircle,
  ArrowDownCircle,
  Save,
  ChevronLeft
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, updateDoc, deleteDoc, collection, query, serverTimestamp } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useCircleRole } from '@/hooks/use-circle-role';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { circleCategories } from '@/types/circle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

/**
 * @fileOverview High-Fidelity Circle Management Hub.
 * Exclusively for Owners and Admins to manage membership and community metadata.
 */
export default function CircleManagePage({ params }: { params: Promise<{ circleId: string }> }) {
  const { circleId } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const { isAdmin, isOwner, role, loading: roleLoading } = useCircleRole(circleId);

  const circleRef = useMemoFirebase(() => db ? doc(db, 'communities', circleId) : null, [db, circleId]);
  const { data: circle, loading: circleLoading } = useDoc(circleRef);

  const membersQuery = useMemoFirebase(() => {
    if (!db || !circleId) return null;
    return collection(db, 'communities', circleId, 'members');
  }, [db, circleId]);

  const { data: members, loading: membersLoading } = useCollection(membersQuery);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (circle) {
      setName(circle.name || '');
      setDescription(circle.description || '');
      setCategory(circle.category || '');
    }
  }, [circle]);

  const handleUpdateCircle = async () => {
    if (!circleRef || isSaving) return;
    setIsSaving(true);
    try {
      await updateDoc(circleRef, {
        name: name.trim(),
        description: description.trim(),
        category,
        updatedAt: serverTimestamp()
      });
      toast({ title: "Frequency Updated", description: "Circle metadata synchronized. ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not synchronize metadata." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async (targetUserId: string, newRole: string) => {
    if (!db || !circleId || isSaving) return;
    try {
      await updateDoc(doc(db, 'communities', circleId, 'members', targetUserId), {
        role: newRole,
        updatedAt: serverTimestamp()
      });
      toast({ title: "Authority Adjusted", description: `Member role updated to ${newRole}. ❤️` });
    } catch (e) {
      toast({ variant: "destructive", title: "Authority Ripple", description: "Access denied." });
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!db || !circleId || isSaving) return;
    if (targetUserId === user?.uid) {
      toast({ variant: "destructive", title: "Action Denied", description: "You cannot purge yourself. ✨" });
      return;
    }
    try {
      await deleteDoc(doc(db, 'communities', circleId, 'members', targetUserId));
      toast({ title: "Member Purged", description: "Heart record removed from this circle." });
    } catch (e) {
      toast({ variant: "destructive", title: "Removal Failed", description: "Could not disconnect heart." });
    }
  };

  if (roleLoading || circleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-muted/30">
        <Card className="max-w-md rounded-[3rem] p-12 space-y-6">
           <ShieldCheck className="w-16 h-16 text-primary mx-auto opacity-20" />
           <h1 className="text-3xl font-black uppercase">Guardian Access Only</h1>
           <p className="text-muted-foreground italic">"You do not possess the authority to manage this frequency."</p>
           <Button asChild className="rounded-xl"><Link href={`/circles/${circleId}`}>Return to Circle</Link></Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-10 max-w-5xl space-y-10">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-primary" />
                Manage Circle
              </h1>
              <p className="text-muted-foreground font-medium italic">"Directing the prosperity of {circle?.name}."</p>
           </div>
           <Button variant="ghost" asChild className="rounded-xl">
              <Link href={`/circles/${circleId}`}><ChevronLeft className="mr-2" /> Back</Link>
           </Button>
        </div>

        <Tabs defaultValue="members" className="w-full space-y-8">
           <TabsList className="grid grid-cols-2 h-14 bg-white/50 rounded-2xl p-1 border">
              <TabsTrigger value="members" className="rounded-xl font-black uppercase text-[10px] gap-2">
                 <Users className="w-4 h-4" /> Member Registry
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl font-black uppercase text-[10px] gap-2">
                 <Settings className="w-4 h-4" /> Circle Settings
              </TabsTrigger>
           </TabsList>

           <TabsContent value="members" className="space-y-6">
              <div className="grid gap-4">
                 {membersLoading ? (
                   <Loader2 className="animate-spin mx-auto opacity-20" />
                 ) : members?.map((member: any) => (
                   <MemberCard 
                    key={member.id} 
                    member={member} 
                    isOwner={isOwner} 
                    currentUserRole={role}
                    onUpdateRole={handleUpdateRole}
                    onRemove={handleRemoveMember}
                   />
                 ))}
              </div>
           </TabsContent>

           <TabsContent value="settings">
              <Card className="rounded-[3rem] border-none shadow-xl bg-white overflow-hidden">
                 <CardHeader className="p-10 bg-primary/5 border-b">
                    <CardTitle className="text-2xl font-black uppercase">Core Protocol</CardTitle>
                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-primary/60">Synchronize community metadata</CardDescription>
                 </CardHeader>
                 <CardContent className="p-10 space-y-8">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Community Name</Label>
                       <Input value={name} onChange={e => setName(e.target.value)} className="h-14 rounded-2xl bg-muted/20 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Shared Description</Label>
                       <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[120px] rounded-[2rem] bg-muted/20 border-none p-6 font-medium italic" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Category</Label>
                       <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-none font-bold">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                             {circleCategories.map(cat => <SelectItem key={cat} value={cat} className="rounded-xl py-3 font-bold">{cat}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                    <Button onClick={handleUpdateCircle} disabled={isSaving} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase shadow-xl">
                       {isSaving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
                       Synchronize Frequency
                    </Button>
                 </CardContent>
              </Card>
           </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}

function MemberCard({ member, isOwner, currentUserRole, onUpdateRole, onRemove }: any) {
  const db = useFirestore();
  const { data: profile } = useDoc(doc(db, 'users', member.userId));

  const isTargetOwner = member.role === 'owner';
  const isTargetAdmin = member.role === 'admin';
  
  // Authority Rules: 
  // - Admins can remove members.
  // - Owners can promote/demote admins and remove anyone.
  const canManage = isOwner && !isTargetOwner;

  return (
    <Card className="p-6 rounded-[2.5rem] bg-white border-none shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 group hover:shadow-xl transition-all">
       <div className="flex items-center gap-6 flex-grow">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-2xl border border-primary/10">
             {profile?.displayName?.[0] || '?'}
          </div>
          <div className="space-y-1 text-left">
             <div className="flex items-center gap-3">
                <h4 className="text-xl font-black uppercase tracking-tight">{profile?.displayName || "Mystery Heart"}</h4>
                {isTargetOwner && <Crown className="w-4 h-4 text-amber-500" />}
             </div>
             <div className="flex items-center gap-2">
                <Badge variant={isTargetAdmin ? "default" : "outline"} className="text-[7px] font-black uppercase px-2 h-5">
                   {member.role}
                </Badge>
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest opacity-40">UID: {member.userId.slice(0, 8)}...</span>
             </div>
          </div>
       </div>

       <div className="flex items-center gap-3">
          {canManage && (
            <>
               {isTargetAdmin ? (
                 <Button variant="ghost" size="icon" onClick={() => onUpdateRole(member.userId, 'member')} className="rounded-xl text-slate-400 hover:text-primary" title="Demote to Member">
                    <ArrowDownCircle className="w-5 h-5" />
                 </Button>
               ) : (
                 <Button variant="ghost" size="icon" onClick={() => onUpdateRole(member.userId, 'admin')} className="rounded-xl text-slate-400 hover:text-green-500" title="Promote to Admin">
                    <ArrowUpCircle className="w-5 h-5" />
                 </Button>
               )}
               <Button variant="ghost" size="icon" onClick={() => onRemove(member.userId)} className="rounded-xl text-slate-400 hover:text-red-500" title="Purge Member">
                  <Trash2 className="w-5 h-5" />
               </Button>
            </>
          )}
       </div>
    </Card>
  );
}
