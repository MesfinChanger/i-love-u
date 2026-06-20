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
  Lock,
  Languages
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
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
import { COUNTRIES, LANGUAGES, CURRENCIES } from '@/lib/world-data';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

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
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');

  // Security Protocol
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
      setIsAgeVerified(profileData.isAgeVerified || false);
      setIsRespectful(profileData.isRespectful || false);
      setIsHuman(profileData.isHuman || false);
      setPreferredLanguage(profileData.preferredLanguage || 'English');
      setCurrency(profileData.currency || 'USD');
    }
  }, [profileData]);

  const calculateAge = (bday: string) => {
    if (!bday) return 0;
    const today = new Date();
    const birthDate = new Date(bday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    if (!isAgeVerified || !isRespectful || !isHuman) {
      toast({ variant: "destructive", title: "Protocol Required", description: "Complete the Security tab first." });
      return;
    }
    const userAge = calculateAge(birthdate);
    if (birthdate && userAge < 18) {
      toast({ variant: "destructive", title: "Age Requirement", description: "You must be 18+ to join." });
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
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
        preferredLanguage,
        currency,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid, 
        bio, 
        publicNickname: publicNickname || "Mystery Heart", 
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null, 
        country, 
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Identity Synced", description: "Your profile has been updated! ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not sync." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const result = await generateBio({ 
        interests: ['Respect', 'Love', 'Prosperity'],
        language: preferredLanguage
      });
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
      <main className="container mx-auto px-4 max-w-2xl py-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Identity</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Global community origin.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => signOut(auth)} className="h-9 px-4 text-[9px] font-black uppercase">Sign Out</Button>
            <Button 
              size="sm"
              onClick={handleSave} 
              disabled={isSaving || !isProtocolComplete} 
              className={cn("h-9 px-5 text-[9px] font-black uppercase shadow-lg", isProtocolComplete ? "gradient-bg" : "bg-slate-200 text-slate-400")}
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Save className="w-3 h-3 mr-1.5" />}
              Sync
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-10 bg-white/50 rounded-lg p-0.5 mb-6 border shadow-sm backdrop-blur-md overflow-x-auto no-scrollbar">
            <TabsTrigger value="personal" className="flex-1 rounded-md text-[8px] uppercase tracking-widest"><User className="w-3 h-3 mr-1" />Info</TabsTrigger>
            <TabsTrigger value="address" className="flex-1 rounded-md text-[8px] uppercase tracking-widest"><MapPin className="w-3 h-3 mr-1" />Address</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-md text-[8px] uppercase tracking-widest"><Globe2 className="w-3 h-3 mr-1" />Public</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-md text-[8px] uppercase tracking-widest relative">
              <ShieldCheck className="w-3 h-3 mr-1" />Security
              {!isProtocolComplete && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2rem] border-none shadow-lg bg-white p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="h-10 text-sm" placeholder="Legal first name" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} className="h-10 text-sm" placeholder="Legal last name" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Display Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="h-10 text-sm" placeholder="How friends see you" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Birthdate</Label>
                  <Input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="h-10 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card className="rounded-[2rem] border-none shadow-lg bg-white p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} className="h-10 text-sm" placeholder="Street address" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">City</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} className="h-10 text-sm" placeholder="City" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">State</Label>
                    <Input value={state} onChange={e => setState(e.target.value)} className="h-10 text-sm" placeholder="State" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[2rem] border-none shadow-lg bg-white p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Unique Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. MysteryHeart77" className="h-10 text-sm font-black text-primary" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Preferred Language</Label>
                      <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                        <SelectTrigger className="h-10 text-sm">
                          <Languages className="w-3 h-3 mr-2" />
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64 overflow-y-auto">
                          {LANGUAGES.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[8px] font-black uppercase tracking-widest opacity-60 ml-1">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                        <SelectContent className="max-h-64 overflow-y-auto">
                          {CURRENCIES.map(curr => <SelectItem key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm"><Camera className="w-4 h-4" /></div>
                        <div>
                          <h4 className="font-black text-[10px] uppercase">Public Photo</h4>
                          <p className="text-[8px] opacity-60 italic mt-0.5">Toggle discovery visibility.</p>
                        </div>
                     </div>
                     <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[8px] font-black uppercase tracking-widest opacity-60">Personal Bio</Label>
                      <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-1 h-7 px-3 bg-muted/20 rounded-full text-[8px] font-black uppercase">
                        {isGenerating ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}AI Bio
                      </Button>
                    </div>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[120px] rounded-xl text-sm italic p-4" placeholder="Tell the community about your mission..." />
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="rounded-[2rem] border-none shadow-lg bg-white p-6 space-y-6">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Security Protocol</h3>
                <p className="text-[10px] text-muted-foreground font-medium italic">Mandatory confirmations.</p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isAgeVerified ? "border-primary bg-primary" : "border-slate-200")}>
                        {isAgeVerified && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">I AM 18+ YEARS OLD</span>
                    </div>
                    <div className="flex items-center space-x-3 pt-3 border-t border-primary/10 cursor-pointer" onClick={() => setIsRespectful(!isRespectful)}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isRespectful ? "border-primary bg-primary" : "border-slate-200")}>
                        {isRespectful && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">RESPECT IS MANDATORY</span>
                    </div>
                    <div className="flex items-center space-x-3 pt-3 border-t border-primary/10 cursor-pointer" onClick={() => setIsHuman(!isHuman)}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isHuman ? "border-primary bg-primary" : "border-slate-200")}>
                        {isHuman && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">VERIFY HUMAN STATUS</span>
                    </div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl flex items-center gap-2">
                  <Lock className="w-3 h-3 text-primary shrink-0" />
                  <p className="text-[7px] text-white/70 italic uppercase tracking-widest font-bold">
                    All requirements are mandatory to access syncing.
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
