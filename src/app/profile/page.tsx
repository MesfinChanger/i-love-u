'use client';

import { useState, useEffect, Suspense } from 'react';
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
  Sparkles, 
  Loader2, 
  Save, 
  LogOut, 
  Globe2,
  Lock,
  User,
  ShieldCheck,
  Camera,
  Globe
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

const COUNTRIES = [
  { code: 'GLOBAL', name: 'Global Community' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'JP', name: 'Japan' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'KR', name: 'South Korea' }
];

function ProfileContent() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profileData, loading: profileLoading } = useDoc(userRef);

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('GLOBAL');
  const [bio, setBio] = useState('');
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || '');
      setAge(profileData.age?.toString() || '18');
      setGender(profileData.gender || '');
      setCountry(profileData.country || 'GLOBAL');
      setBio(profileData.bio || '');
      setPublicNickname(profileData.publicNickname || '');
      setIsPhotoPublic(profileData.isPhotoPublic || false);
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    const userAge = parseInt(age);
    if (isNaN(userAge) || userAge < 18) {
      toast({ variant: "destructive", title: "Wait!", description: "You must be 18+ to join the movement." });
      return;
    }

    setIsSaving(true);
    try {
      const moderation = await moderateText({ text: `${displayName} ${bio} ${publicNickname}` });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Policy", description: moderation.reason });
        setIsSaving(false);
        return;
      }
      
      const updateData = {
        uid: user.uid,
        displayName, 
        age: userAge, 
        gender, 
        bio, 
        country, 
        publicNickname,
        isPhotoPublic,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid,
        bio,
        publicNickname: publicNickname || null,
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null,
        country: country,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Profile Synced", description: "Global Identity updated. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not sync profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const result = await generateBio({ interests: ['Respect', 'Love', 'Prosperity', 'Connection'] });
      setBio(result.bio);
    } finally {
      setIsGenerating(false);
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-6 max-w-2xl py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">Identity</h1>
            <p className="text-muted-foreground mt-1 font-medium italic">Record your global origin and community presence.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => signOut(auth)} className="rounded-xl h-12 px-6 font-black uppercase text-[9px] tracking-widest transition-all">Sign Out</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-xl h-12 px-8 font-black uppercase text-[9px] tracking-widest shadow-xl transition-all">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Sync
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-14 bg-white/50 rounded-xl p-1 mb-10 border shadow-sm backdrop-blur-md">
            <TabsTrigger value="personal" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><User className="w-3 h-3" />Personal</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><Globe2 className="w-3 h-3" />Public</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Display Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Age (18+)</Label>
                  <Input type="number" min="18" value={age} onChange={e => setAge(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Global Origin</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Country Selection</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue /></SelectTrigger>
                      <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Gender Identity</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue /></SelectTrigger>
                      <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Unique Public Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. GlobalHeart" className="rounded-xl h-14 bg-muted/10 border-2 border-primary/5 px-6 font-black text-primary shadow-inner" />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Camera className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-tight">Public Photo Toggle</h4>
                          <p className="text-[9px] opacity-60 font-medium italic mt-0.5">Show your portrait in the global discovery feed.</p>
                        </div>
                     </div>
                     <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Personal Bio</Label>
                      <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2 font-black text-[9px] uppercase h-9 px-4 bg-muted/20 rounded-full">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}AI Spark
                      </Button>
                    </div>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[160px] rounded-2xl bg-muted/10 border-none p-6 italic font-medium leading-relaxed shadow-inner" placeholder="Share your global mission and interests..." />
                  </div>
                </div>
             </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
