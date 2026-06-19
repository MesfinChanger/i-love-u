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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Sparkles, 
  Loader2, 
  Save, 
  LogOut, 
  Trash2,
  MapPin,
  Navigation,
  Globe2,
  Lock,
  User,
  ShieldCheck,
  IdCard,
  Home,
  Camera,
  Globe
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

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
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [country, setCountry] = useState('GLOBAL');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [culturalInterests, setCulturalInterests] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [allowSensitiveContent, setAllowSensitiveContent] = useState(false);
  const [isDatingEnabled, setIsDatingEnabled] = useState(true);
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [exactLocation, setExactLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || '');
      setAge(profileData.age?.toString() || '');
      setGender(profileData.gender || '');
      setLocation(profileData.location || '');
      setAddress(profileData.address || '');
      setTaxId(profileData.taxId || '');
      setCountry(profileData.country || 'GLOBAL');
      setBio(profileData.bio || '');
      setInterests(profileData.interests?.join(', ') || '');
      setCulturalInterests(profileData.culturalInterests?.join(', ') || '');
      setCurrency(profileData.currency || 'USD');
      setPublicNickname(profileData.publicNickname || '');
      setIsPhotoPublic(profileData.isPhotoPublic || false);
      setAllowSensitiveContent(profileData.settings?.allowSensitiveContent || false);
      setIsDatingEnabled(profileData.isDatingEnabled !== false);
      if (profileData.exactLocation) {
        setExactLocation({ lat: profileData.exactLocation.latitude, lng: profileData.exactLocation.longitude });
      }
    }
  }, [profileData]);

  const handleUpdateLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setExactLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsFetchingLocation(false);
        toast({ title: "GPS Verified", description: "Location recorded for accountability." });
      },
      () => setIsFetchingLocation(false)
    );
  };

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
      
      const interestList = interests.split(',').map(s => s.trim()).filter(i => i);
      const culturalList = culturalInterests.split(',').map(s => s.trim()).filter(i => i);

      const updateData = {
        uid: user.uid,
        displayName, 
        age: userAge, 
        gender, 
        bio, 
        location,
        address,
        taxId,
        country, 
        currency,
        interests: interestList,
        culturalInterests: culturalList,
        isDatingEnabled, 
        publicNickname,
        isPhotoPublic,
        settings: { allowSensitiveContent },
        exactLocation: exactLocation ? { latitude: exactLocation.lat, longitude: exactLocation.lng } : null,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid,
        bio,
        interests: interestList,
        culturalInterests: culturalList,
        locationHint: location || country,
        publicNickname: publicNickname || null,
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null,
        country: country,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Profile Synced", description: "Identity updated across the community. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not save profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!interests) {
      toast({ title: "More info needed", description: "Add a few interests first! ✨" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateBio({ interests: interests.split(',').map(s => s.trim()) });
      setBio(result.bio);
    } finally {
      setIsGenerating(false);
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <Header />
      <main className="container mx-auto px-6 max-w-3xl py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900">Identity</h1>
            <p className="text-muted-foreground mt-2 font-medium">Design your global presence.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => signOut(auth)} className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest transition-all">Sign Out</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-2xl h-14 px-10 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 transition-all">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Sync Profile
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-16 bg-slate-50 rounded-[1.5rem] p-1.5 mb-12 border">
            <TabsTrigger value="personal" className="flex-1 rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest"><User className="w-3.5 h-3.5" />Personal</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest"><Globe2 className="w-3.5 h-3.5" />Public</TabsTrigger>
            <TabsTrigger value="safety" className="flex-1 rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5" />Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[3rem] border-none shadow-xl bg-slate-50/50 p-10 space-y-12">
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Display Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-[1.2rem] h-16 bg-white border-none px-8 font-bold text-lg shadow-sm" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Age (18+)</Label>
                  <Input type="number" min="18" value={age} onChange={e => setAge(e.target.value)} className="rounded-[1.2rem] h-16 bg-white border-none px-8 font-bold text-lg shadow-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Gender Identity</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="rounded-[1.2rem] h-16 bg-white border-none px-8 font-bold text-lg shadow-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Country Code</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-[1.2rem] h-16 bg-white border-none px-8 font-bold text-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[3rem] border-none shadow-xl bg-slate-50/50 p-10 space-y-12">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-2">Unique Public Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. HeartExplorer" className="rounded-[1.2rem] h-16 bg-white border-2 border-primary/10 px-8 font-black text-xl text-primary shadow-inner" />
                  </div>
                  <div className="flex items-center justify-between p-8 bg-white rounded-[2rem] border border-primary/5 shadow-sm">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary"><Camera className="w-6 h-6" /></div>
                        <div>
                          <h4 className="font-black text-sm uppercase tracking-tight">Post Pic Publicly</h4>
                          <p className="text-[10px] opacity-60 font-medium italic mt-0.5">Visible to everyone in Discovery.</p>
                        </div>
                     </div>
                     <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between ml-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Personal Bio</Label>
                      <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2 font-black text-[10px] uppercase h-10 px-5 bg-white rounded-full border border-primary/10 shadow-sm">
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}AI Spark
                      </Button>
                    </div>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[220px] rounded-[2rem] bg-white border-none p-10 text-xl italic font-medium leading-relaxed shadow-sm" placeholder="Tell the world your joyful moments..." />
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="safety">
            <div className="space-y-8">
              <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-slate-50/50 space-y-8">
                 <div className="flex items-start gap-6 text-red-600">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-red-50 flex items-center justify-center shrink-0"><MapPin className="w-8 h-8" /></div>
                    <div className="space-y-1">
                      <h3 className="font-black uppercase tracking-tighter text-2xl">GPS Verification</h3>
                      <p className="text-sm opacity-60 font-medium italic">Mandatory for accountability in Spark Rooms.</p>
                    </div>
                 </div>
                 <Button onClick={handleUpdateLocation} disabled={isFetchingLocation} className="w-full h-18 py-6 rounded-[1.5rem] bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest gap-4 shadow-xl">
                   {isFetchingLocation ? <Loader2 className="w-6 h-6 animate-spin" /> : <Navigation className="w-6 h-6" />}Update GPS Coordinates
                 </Button>
              </Card>
              
              <div className="pt-12 text-center opacity-40 hover:opacity-100 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" className="text-destructive font-black text-[10px] uppercase tracking-[0.3em]"><Trash2 className="w-4 h-4 mr-3" />Delete My Identity Permanently</Button></AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[4rem] p-12 border-none shadow-2xl">
                    <AlertDialogHeader><AlertDialogTitle className="text-4xl font-black tracking-tighter">End Journey?</AlertDialogTitle><AlertDialogDescription className="text-xl italic font-medium pt-4">This will erase all sparks, messages, and your presence forever. Happiness is final.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter className="mt-10 gap-4"><AlertDialogCancel className="rounded-2xl h-16 font-bold flex-1 border-none bg-muted/50">Cancel</AlertDialogCancel><AlertDialogAction onClick={async () => {
                      if (!user || !db) return;
                      await deleteDoc(doc(db, 'users', user.uid));
                      await deleteDoc(doc(db, 'publicProfiles', user.uid));
                      await deleteUser(user);
                      router.push('/');
                    }} className="bg-destructive text-white rounded-2xl h-16 font-black uppercase text-[10px] tracking-widest flex-1">Erase Everything</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
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
