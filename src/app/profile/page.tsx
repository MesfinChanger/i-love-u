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
  User,
  ShieldCheck,
  Camera,
  MapPin,
  Lock
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
import { cn } from '@/lib/utils';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' }, { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' }, { code: 'IN', name: 'India' }, { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' }, { code: 'DE', name: 'Germany' }, { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' }, { code: 'CA', name: 'Canada' }, { code: 'AU', name: 'Australia' },
  { code: 'BR', name: 'Brazil' }, { code: 'ZA', name: 'South Africa' }, { code: 'ID', name: 'Indonesia' }
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
  const [birthdate, setBirthdate] = useState('');
  
  // Address Fields
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('US');

  // Vibe Fields
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);

  // Security Protocol (Mandatory for Syncing)
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setBirthdate(profileData.birthdate || '');
      setAddress1(profileData.address1 || '');
      setAddress2(profileData.address2 || '');
      setCity(profileData.city || '');
      setState(profileData.state || '');
      setCountry(profileData.country || 'US');
      setDisplayName(profileData.displayName || '');
      setGender(profileData.gender || '');
      setBio(profileData.bio || '');
      setPublicNickname(profileData.publicNickname || '');
      setIsPhotoPublic(profileData.isPhotoPublic || false);
      
      // Load security status if available
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

  const handleSave = async () => {
    if (!user || !db || isSaving) return;

    // MANDATORY Security check
    if (!isAgeVerified || !isRespectful || !isHuman) {
      toast({ 
        variant: "destructive", 
        title: "Security Protocol Required", 
        description: "Please complete all mandatory confirmations in the Security tab before syncing." 
      });
      return;
    }

    const userAge = calculateAge(birthdate);
    if (birthdate && userAge < 18) {
      toast({ variant: "destructive", title: "Age Requirement", description: "You must be 18+ to join the community." });
      return;
    }

    setIsSaving(true);
    try {
      const moderation = await moderateText({ text: `${firstName} ${lastName} ${displayName} ${bio} ${publicNickname}` });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Policy Violation", description: moderation.reason });
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

      // Privacy logic: Extract birthMonthDay only for public discovery
      let monthDayStr = "Secret";
      if (birthdate) {
        const d = new Date(birthdate);
        monthDayStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid,
        bio,
        publicNickname: publicNickname || "Mystery Heart",
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null,
        country: country,
        birthMonthDay: monthDayStr,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Identity Synced", description: "Your global origin has been updated! ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not sync profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const result = await generateBio({ interests: ['Respect', 'Love', 'Prosperity'] });
      setBio(result.bio);
    } finally {
      setIsGenerating(false);
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  const isProtocolComplete = isAgeVerified && isRespectful && isHuman;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-6 max-w-3xl py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">Identity</h1>
            <p className="text-muted-foreground mt-1 font-medium italic">Sync your global origin and verify security.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => signOut(auth)} className="rounded-xl h-12 px-6 font-black uppercase text-[9px] tracking-widest transition-all">Sign Out</Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !isProtocolComplete} 
              className={cn("rounded-xl h-12 px-8 font-black uppercase text-[9px] tracking-widest shadow-xl transition-all", isProtocolComplete ? "gradient-bg" : "bg-slate-200 text-slate-400")}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {isProtocolComplete ? 'Sync Identity' : 'Protocol Needed'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-14 bg-white/50 rounded-xl p-1 mb-10 border shadow-sm backdrop-blur-md overflow-x-auto no-scrollbar">
            <TabsTrigger value="personal" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest min-w-fit"><User className="w-3 h-3" />Personal</TabsTrigger>
            <TabsTrigger value="address" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest min-w-fit"><MapPin className="w-3 h-3" />Address</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest min-w-fit"><Globe2 className="w-3 h-3" />Public</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest min-w-fit relative">
              <ShieldCheck className="w-3 h-3" />Security
              {!isProtocolComplete && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Legal first name" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Legal last name" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Display Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="How friends see you" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Birthdate</Label>
                  <Input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  <p className="text-[8px] text-muted-foreground ml-2 uppercase font-black tracking-widest italic">* Year is hidden from public discovery profiles.</p>
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
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Street address" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 2 (Optional)</Label>
                  <Input value={address2} onChange={e => setAddress2(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Apartment, suite, etc." />
                </div>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">City</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="City" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">State / Province</Label>
                    <Input value={state} onChange={e => setState(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="State" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Country of Origin</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Unique Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. MysteryHeart77" className="rounded-xl h-14 bg-muted/10 border-2 border-primary/5 px-6 font-black text-primary shadow-inner" />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Camera className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-tight">Show Public Photo</h4>
                          <p className="text-[9px] opacity-60 font-medium italic mt-0.5">Toggle visibility in global discovery.</p>
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
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[160px] rounded-2xl bg-muted/10 border-none p-6 italic font-medium leading-relaxed shadow-inner" placeholder="Tell the community about your mission..." />
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Security Protocol</h3>
                <p className="text-xs text-muted-foreground font-medium italic">Mandatory confirmations to Sync Identity.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
                    <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", isAgeVerified ? "border-primary bg-primary" : "border-slate-200 group-hover:border-primary/40")}>
                        {isAgeVerified && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">I AM 18+ YEARS OLD</span>
                    </div>
                    <div className="flex items-center space-x-3 pt-4 border-t border-primary/10 cursor-pointer group" onClick={() => setIsRespectful(!isRespectful)}>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", isRespectful ? "border-primary bg-primary" : "border-slate-200 group-hover:border-primary/40")}>
                        {isRespectful && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">RESPECT & LOVE IS MANDATORY</span>
                    </div>
                    <div className="flex items-center space-x-3 pt-4 border-t border-primary/10 cursor-pointer group" onClick={() => setIsHuman(!isHuman)}>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", isHuman ? "border-primary bg-primary" : "border-slate-200 group-hover:border-primary/40")}>
                        {isHuman && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">VERIFY HUMAN STATUS</span>
                    </div>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl flex items-center gap-3">
                  <Lock className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-[8px] text-white/70 italic uppercase tracking-widest font-bold">
                    All protocol requirements are mandatory to access community syncing.
                  </p>
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
