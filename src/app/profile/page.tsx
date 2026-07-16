
'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Loader2, 
  Save, 
  User, 
  ShieldCheck,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Building2,
  Map,
  Hash,
  Gavel,
  Zap,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc, useFirebaseStorage } from '@/firebase';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LiveCamera } from '@/components/LiveCamera';
import Link from 'next/link';

/**
 * @fileOverview Profile Management Hub.
 * Optimized for Sovereign Authority visibility and the new Heart Identity Schema.
 */
function ProfileContent() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { uploadFile } = useFirebaseStorage();
  const { toast } = useToast();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'gallery' | 'video' | null>(null);
  const [sovereignId, setSovereignId] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'siteSettings', 'sovereignty'), (snap) => {
      if (snap.exists()) setSovereignId(snap.data().ownerId);
    });
    return () => unsub();
  }, [db]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: profileData, loading: profileLoading } = useDoc(userRef);

  useEffect(() => {
    if (profileData) {
      setUsername(profileData.username || '');
      setDisplayName(profileData.displayName || '');
      setPhone(profileData.phone || '');
      setPhotoURL(profileData.photoURL || '');
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        username,
        displayName,
        phone: phone || null,
        photoURL,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Update public profile for discovery
      await setDoc(doc(db, 'publicProfiles', user.uid), {
        username,
        displayName,
        photoURL,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Identity Saved", description: "Your Heart Identity has been synchronized. ❤️" });
    } finally {
      setIsSaving(false);
    }
  };

  const isUserSovereign = user?.uid === sovereignId;

  if (!mounted || profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
              <AvatarImage src={photoURL} className="object-cover" />
              <AvatarFallback><User className="w-10 h-10" /></AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Console</h1>
                 {(isUserSovereign || profileData?.role === 'admin') && <Badge className="bg-slate-900 text-white font-black text-[7px] uppercase tracking-widest px-2 h-5 flex items-center gap-1"><Zap className="w-2 h-2 text-primary" /> Admin</Badge>}
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1">Unified Heart Identity</p>
            </div>
          </div>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-full font-black uppercase text-[9px] h-10 px-6">Save Identity</Button>
        </div>

        {isUserSovereign && (
          <Link href="/admin/approvals">
            <Card className="rounded-3xl border-none shadow-xl bg-slate-900 text-white p-6 mb-8 hover:scale-[1.02] transition-transform group cursor-pointer overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                  <Gavel className="w-24 h-24 text-primary" />
               </div>
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Zap className="w-6 h-6 text-primary" />
                     </div>
                     <div className="text-left leading-none">
                        <h3 className="font-black text-lg tracking-tighter uppercase">Sovereign Command</h3>
                        <p className="text-[8px] font-black uppercase text-primary tracking-widest mt-1">Assign User Roles & Permissions</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full"><Star className="w-5 h-5 fill-primary text-primary" /></Button>
               </div>
            </Card>
          </Link>
        )}

        <Tabs defaultValue="personal" className="w-full">
           <TabsList className="grid grid-cols-4 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-6 border shadow-sm">
              <TabsTrigger value="personal" className="rounded-xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Identity</TabsTrigger>
              <TabsTrigger value="account" className="rounded-xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Account</TabsTrigger>
              <TabsTrigger value="public" className="rounded-xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Public</TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Safety</TabsTrigger>
           </TabsList>

           <TabsContent value="personal" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8 space-y-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username (ID)</Label>
                    <Input value={username} onChange={e => setUsername(e.target.value)} className="h-12 rounded-xl bg-muted/20 border-none font-bold" placeholder="@nickname" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</Label>
                    <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="h-12 rounded-xl bg-muted/20 border-none font-bold" placeholder="Your Name" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-12 rounded-xl bg-muted/20 border-none font-bold" placeholder="+1..." />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Profile Photo URL</Label>
                    <div className="flex gap-2">
                       <Input value={photoURL} onChange={e => setPhotoURL(e.target.value)} className="h-12 rounded-xl bg-muted/20 border-none font-bold" placeholder="https://..." />
                       <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2" onClick={() => { setCameraTarget('avatar'); setIsCameraOpen(true); }}><Camera className="w-5 h-5" /></Button>
                    </div>
                 </div>
              </Card>
           </TabsContent>

           <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="rounded-[2rem] border-none shadow-sm bg-white p-8 space-y-6">
                 <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-dashed">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Status</p>
                       <p className="font-bold text-sm uppercase text-primary">{profileData?.status || 'active'}</p>
                    </div>
                    <Badge className="bg-primary text-white border-none px-4 h-7 text-[8px] font-black uppercase tracking-widest">{profileData?.accountType || 'free'}</Badge>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country</p>
                       <div className="h-12 flex items-center px-4 rounded-xl bg-muted/20 font-bold text-sm">{profileData?.country || 'Global'}</div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Timezone</p>
                       <div className="h-12 flex items-center px-4 rounded-xl bg-muted/20 font-bold text-xs truncate">{profileData?.timezone || 'UTC'}</div>
                    </div>
                 </div>
              </Card>
           </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={(data) => {
         setPhotoURL(data.url);
         setIsCameraOpen(false);
      }} />
    </div>
  );
}

export default function ProfilePage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}><ProfileContent /></Suspense>;
}
