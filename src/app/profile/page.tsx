
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
  EyeOff,
  User,
  ShieldCheck,
  Megaphone,
  Briefcase,
  IdCard,
  Home,
  Camera
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

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

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [taxId, setTaxId] = useState('');
  const [country, setCountry] = useState('US');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [culturalInterests, setCulturalInterests] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [allowSensitiveContent, setAllowSensitiveContent] = useState(false);
  const [isDatingEnabled, setIsDatingEnabled] = useState(true);
  const [isAdvertiser, setIsAdvertiser] = useState(false);
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
      setCountry(profileData.country || 'US');
      setBio(profileData.bio || '');
      setInterests(profileData.interests?.join(', ') || '');
      setCulturalInterests(profileData.culturalInterests?.join(', ') || '');
      setCurrency(profileData.currency || 'USD');
      setPublicNickname(profileData.publicNickname || '');
      setIsPhotoPublic(profileData.isPhotoPublic || false);
      setAllowSensitiveContent(profileData.settings?.allowSensitiveContent || false);
      setIsDatingEnabled(profileData.isDatingEnabled !== false);
      setIsAdvertiser(profileData.isAdvertiser || false);
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
        toast({ title: "Location Updated" });
      },
      () => setIsFetchingLocation(false)
    );
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    const userAge = parseInt(age);
    if (isNaN(userAge) || userAge < 18 || userAge > 65) {
      toast({ variant: "destructive", title: "Wait!", description: "Age must be between 18 and 65." });
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

      await setDoc(doc(db, 'users', user.uid), {
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
        isAdvertiser,
        publicNickname,
        isPhotoPublic,
        settings: { allowSensitiveContent },
        exactLocation: exactLocation ? { latitude: exactLocation.lat, longitude: exactLocation.lng } : null,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid,
        bio,
        interests: interestList,
        culturalInterests: culturalList,
        locationHint: location || country,
        publicNickname: publicNickname || null,
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Profile Ready", description: "Identity synced for discovery. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not save profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!interests) {
      toast({ title: "Tell us more", description: "Add interests first! ✨" });
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

  const handleDeleteAccount = async () => {
    if (!user || !db) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteDoc(doc(db, 'publicProfiles', user.uid));
      await deleteUser(user);
      router.push('/');
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Re-login to delete account." });
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-3xl py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-5xl font-black tracking-tighter">My Spark</h1>
            <p className="text-muted-foreground mt-1">Design your global presence.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => signOut(auth)} className="rounded-2xl h-12 px-6">Sign Out</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-2xl h-12 px-8 font-bold shadow-xl shadow-primary/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Save
            </Button>
          </div>
        </div>

        <Tabs defaultValue="public" className="w-full">
          <TabsList className="w-full h-14 bg-white rounded-2xl shadow-sm border p-1 mb-8">
            <TabsTrigger value="public" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest"><User className="w-3.5 h-3.5" />Personal</TabsTrigger>
            <TabsTrigger value="identity" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest"><Globe2 className="w-3.5 h-3.5" />Public</TabsTrigger>
            <TabsTrigger value="commercial" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest"><IdCard className="w-3.5 h-3.5" />Commercial</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest"><ShieldCheck className="w-3.5 h-3.5" />Safety</TabsTrigger>
          </TabsList>

          <TabsContent value="public">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Age (18-65)</Label>
                  <Input type="number" min="18" max="65" value={age} onChange={e => setAge(e.target.value)} className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Location</Label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. London, UK" className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Bio</Label>
                  <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2 font-black text-[10px] uppercase h-8 px-4 bg-primary/5 rounded-full">
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}AI Magic
                  </Button>
                </div>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[160px] rounded-[2rem] bg-muted/30 border-none p-6 text-lg italic" placeholder="Joy moments..." />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="identity">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Public Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="Unique Identity" className="rounded-2xl h-14 bg-primary/5 border-2 border-primary/10 px-6 font-black text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/10">
                     <div className="flex items-center gap-4">
                        <Camera className="w-6 h-6 text-primary" />
                        <div><h4 className="font-black text-sm uppercase">Post Pic Publicly</h4><p className="text-[10px] opacity-60">Visible in Discovery.</p></div>
                     </div>
                     <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="commercial">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60"><Home className="w-3 h-3 inline mr-2" />Business Address</Label>
                <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Legal Address" className="rounded-2xl bg-muted/30 border-none p-4" />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60"><IdCard className="w-3 h-3 inline mr-2" />Tax ID (SSN/TIN)</Label>
                <Input value={taxId} onChange={e => setTaxId(e.target.value)} placeholder="Protected Info" className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-mono" />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white space-y-6">
               <div className="flex items-start gap-4 text-red-600">
                  <MapPin className="w-8 h-8 shrink-0" />
                  <div className="space-y-1"><h3 className="font-black uppercase tracking-tighter text-lg">GPS Pin</h3><p className="text-xs opacity-60">Ensures accountability in Sparks.</p></div>
               </div>
               <Button onClick={handleUpdateLocation} disabled={isFetchingLocation} className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold gap-3 shadow-xl">
                 {isFetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-5 h-5" />}Update GPS
               </Button>
            </Card>
            <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                   <span className="text-sm font-bold">Dating Mode</span>
                   <Button variant="ghost" onClick={() => setIsDatingEnabled(!isDatingEnabled)} className={isDatingEnabled ? 'text-green-600 font-black' : 'text-red-600 font-black'}>{isDatingEnabled ? 'ON' : 'OFF'}</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                   <span className="text-sm font-bold">Safety Guard</span>
                   <Button variant="ghost" onClick={() => setAllowSensitiveContent(!allowSensitiveContent)} className={!allowSensitiveContent ? 'text-green-600 font-black' : 'text-amber-600 font-black'}>{!allowSensitiveContent ? 'ACTIVE' : 'OFF'}</Button>
                </div>
              </div>
              <div className="pt-10 text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" className="text-destructive/40 hover:text-destructive font-black text-[9px] uppercase tracking-widest"><Trash2 className="w-4 h-4 mr-2" />Delete Account</Button></AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
                    <AlertDialogHeader><AlertDialogTitle className="text-3xl font-black">Are you sure?</AlertDialogTitle><AlertDialogDescription className="text-lg italic">Erases all sparks and data forever.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter className="mt-8"><AlertDialogCancel className="rounded-2xl h-14 font-bold">Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-white rounded-2xl h-14 font-bold">Delete</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
