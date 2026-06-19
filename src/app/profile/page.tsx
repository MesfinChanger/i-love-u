'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  Globe,
  UserCheck,
  MapPin,
  Briefcase
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

  // Identity Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthdate, setBirthdate] = useState(''); // YYYY-MM-DD
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('GLOBAL');
  const [bio, setBio] = useState('');
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);

  // Address Fields
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Mandatory Security Protocol
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setDisplayName(profileData.displayName || '');
      setBirthdate(profileData.birthdate || '');
      setGender(profileData.gender || '');
      setCountry(profileData.country || 'GLOBAL');
      setBio(profileData.bio || '');
      setPublicNickname(profileData.publicNickname || '');
      setIsPhotoPublic(profileData.isPhotoPublic || false);
      
      setAddress1(profileData.address1 || '');
      setAddress2(profileData.address2 || '');
      setCity(profileData.city || '');
      setState(profileData.state || '');

      setIsAgeVerified(profileData.isAgeVerified || false);
      setIsRespectful(profileData.isRespectful || false);
      setIsHuman(profileData.isHuman || false);
    }
  }, [profileData]);

  const calculateAge = (bday: string) => {
    if (!bday) return 0;
    const today = new Date();
    const birthDate = new Date(bday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateAccess = () => {
    if (!isAgeVerified) {
      toast({ variant: "destructive", title: "Global Security Protocol", description: "You must confirm you are 18+." });
      return false;
    }
    if (!isRespectful) {
      toast({ variant: "destructive", title: "Global Security Protocol", description: "Respect and Love must be Mandatory." });
      return false;
    }
    if (!isHuman) {
      toast({ variant: "destructive", title: "Global Security Protocol", description: "Verify human status is mandatory. ✨" });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;

    if (!validateAccess()) return;

    const userAge = calculateAge(birthdate);
    if (userAge < 18) {
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
        firstName,
        lastName,
        displayName, 
        birthdate,
        age: userAge, 
        gender, 
        bio, 
        address1,
        address2,
        city,
        state,
        country, 
        publicNickname,
        isPhotoPublic,
        isAgeVerified,
        isRespectful,
        isHuman,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });

      // Create birth month/day string for privacy
      const bDate = new Date(birthdate);
      const monthDay = bDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid,
        bio,
        publicNickname: publicNickname || null,
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null,
        country: country,
        birthMonthDay: monthDay,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Profile Synced", description: "Global Identity & Security updated. ❤️" });
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
      <main className="container mx-auto px-6 max-w-3xl py-10">
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
            <TabsTrigger value="address" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><MapPin className="w-3 h-3" />Address</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><Globe2 className="w-3 h-3" />Public</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><ShieldCheck className="w-3 h-3" />Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Display Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Birthdate</Label>
                  <Input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  <p className="text-[8px] text-muted-foreground ml-2 uppercase font-black tracking-widest">* Year is hidden from public view for privacy.</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Gender Identity</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Commercial Location</h3>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 2 (Optional)</Label>
                  <Input value={address2} onChange={e => setAddress2(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">City</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">State / Province</Label>
                    <Input value={state} onChange={e => setState(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Country Origin</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
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

          <TabsContent value="security">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-primary mx-auto animate-pulse" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Global Security Protocol</h3>
                <p className="text-xs text-muted-foreground font-medium italic">These confirmations are mandatory for all hearts.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="age-check-prof" checked={isAgeVerified} onCheckedChange={(c) => setIsAgeVerified(c as boolean)} className="mt-1" />
                      <label htmlFor="age-check-prof" className="text-[9px] font-black leading-tight text-primary uppercase tracking-widest cursor-pointer">I AM 18+ YEARS OLD</label>
                    </div>
                    <div className="flex items-start space-x-3 pt-3 border-t border-primary/10">
                      <Checkbox id="respect-check-prof" checked={isRespectful} onCheckedChange={(c) => setIsRespectful(c as boolean)} className="mt-1" />
                      <label htmlFor="respect-check-prof" className="text-[9px] font-black leading-tight text-primary uppercase tracking-widest cursor-pointer">RESPECT & LOVE IS MANDATORY</label>
                    </div>
                    <div className="flex items-start space-x-3 pt-3 border-t border-primary/10">
                      <Checkbox id="human-check-prof" checked={isHuman} onCheckedChange={(c) => setIsHuman(c as boolean)} className="mt-1" />
                      <label htmlFor="human-check-prof" className="text-[9px] font-black leading-tight text-primary uppercase tracking-widest cursor-pointer flex items-center gap-2">
                        <UserCheck className="w-3 h-3" /> VERIFY HUMAN
                      </label>
                    </div>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl text-white text-[8px] font-black uppercase tracking-widest leading-relaxed">
                  By checking these boxes, you acknowledge that I LOVE U filters all meanness and disrespect via AI. Failure to comply leads to permanent disconnection.
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
