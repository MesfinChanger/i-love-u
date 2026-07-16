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
  Loader2, 
  Save, 
  User, 
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Sparkles,
  X,
  Target,
  Compass,
  Eye,
  Globe,
  ShieldCheck,
  Zap,
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/tabs';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/lib/world-data';

function ProfileContent() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [datingGoal, setDatingGoal] = useState('exploring');
  const [preferredAgeRange, setPreferredAgeRange] = useState('18-99');
  const [preferredCountries, setPreferredCountries] = useState<string[]>([]);
  const [personalityTags, setPersonalityTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState('public');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: profileData, loading: profileLoading } = useDoc(userRef);

  useEffect(() => {
    if (profileData) {
      setUsername(profileData.username || '');
      setDisplayName(profileData.displayName || '');
      setPhotoURL(profileData.photoURL || '');
      setBio(profileData.bio || '');
      setBirthday(profileData.birthday || '');
      setGender(profileData.gender || '');
      setProfession(profileData.profession || '');
      setEducation(profileData.education || '');
      setInterests(profileData.interests || []);
      setDatingGoal(profileData.datingGoal || 'exploring');
      setPreferredAgeRange(profileData.preferredAgeRange || '18-99');
      setPreferredCountries(profileData.preferredCountries || []);
      setPersonalityTags(profileData.personalityTags || []);
      setVisibility(profileData.visibility || 'public');
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        username, displayName, photoURL, bio, birthday, gender, profession, education,
        interests, datingGoal, preferredAgeRange, preferredCountries, personalityTags, visibility,
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', user.uid), payload, { merge: true });
      await setDoc(doc(db, 'publicProfiles', user.uid), { ...payload, verified: profileData?.verified || false, status: 'active' }, { merge: true });
      toast({ title: "Identity Synchronized", description: "Hub updated. ❤️" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (!mounted || profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-6 space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white shadow-xl">
                 <AvatarImage src={photoURL} />
                 <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <div>
                 <h1 className="text-2xl font-black uppercase">{displayName || 'Heart'}</h1>
                 <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Discovery Console Active</p>
              </div>
           </div>
           <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-full font-black uppercase text-[10px] h-10 px-6">
                 {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save Hub"}
              </Button>
              <Button size="icon" variant="ghost" onClick={handleSignOut} className="rounded-full text-slate-400 hover:text-red-500"><LogOut className="w-5 h-5" /></Button>
           </div>
        </div>

        <Tabs defaultValue="identity" className="w-full">
           <TabsList className="grid grid-cols-4 h-14 bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-6 border">
              <TabsTrigger value="identity" className="rounded-xl text-[8px] font-black uppercase">Identity</TabsTrigger>
              <TabsTrigger value="personality" className="rounded-xl text-[8px] font-black uppercase">Traits</TabsTrigger>
              <TabsTrigger value="discovery" className="rounded-xl text-[8px] font-black uppercase">Match</TabsTrigger>
              <TabsTrigger value="account" className="rounded-xl text-[8px] font-black uppercase">Core</TabsTrigger>
           </TabsList>
           <TabsContent value="identity">
              <Card className="p-8 rounded-[2rem] space-y-4">
                 <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="@nickname" className="h-12 rounded-xl" />
                 <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display Name" className="h-12 rounded-xl" />
                 <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Mission statement..." className="min-h-[100px] rounded-xl" />
              </Card>
           </TabsContent>
           <TabsContent value="discovery">
              <Card className="p-8 rounded-[2rem] space-y-6">
                 <Select value={datingGoal} onValueChange={setDatingGoal}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="serious">Serious</SelectItem>
                       <SelectItem value="friendship">Friendship</SelectItem>
                       <SelectItem value="marriage">Marriage</SelectItem>
                       <SelectItem value="exploring">Exploring</SelectItem>
                    </SelectContent>
                 </Select>
                 <Input value={preferredAgeRange} onChange={e => setPreferredAgeRange(e.target.value)} placeholder="Age Range (e.g. 24-35)" className="h-12 rounded-xl" />
                 <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="public">Public</SelectItem>
                       <SelectItem value="private">Private</SelectItem>
                       <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                 </Select>
              </Card>
           </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return <Suspense><ProfileContent /></Suspense>;
}
