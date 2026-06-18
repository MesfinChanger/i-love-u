
'use client';

import { useState, useEffect } from 'react';
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
  Settings,
  ShieldCheck,
  Megaphone,
  Briefcase,
  IdCard,
  Home
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

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'JP', name: 'Japan' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GLOBAL', name: 'Other' }
];
const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'NGN', symbol: '₦' },
  { code: 'KES', symbol: 'KSh' },
  { code: 'INR', symbol: '₹' },
  { code: 'IDR', symbol: 'Rp' }
];

export default function ProfilePage() {
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
  const [religion, setReligion] = useState('');
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [exactLocation, setExactLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || '');
      setAge(profileData.age?.toString() || '');
      setGender(profileData.gender || '');
      setReligion(profileData.religion || '');
      setLocation(profileData.location || '');
      setAddress(profileData.address || '');
      setTaxId(profileData.taxId || '');
      setCountry(profileData.country || 'US');
      setBio(profileData.bio || '');
      setInterests(profileData.interests?.join(', ') || '');
      setCulturalInterests(profileData.culturalInterests?.join(', ') || '');
      setCurrency(profileData.currency || 'USD');
      setAllowSensitiveContent(profileData.settings?.allowSensitiveContent || false);
      setIsDatingEnabled(profileData.isDatingEnabled !== false);
      setIsAdvertiser(profileData.isAdvertiser || false);
      if (profileData.exactLocation) {
        setExactLocation({
          lat: profileData.exactLocation.latitude,
          lng: profileData.exactLocation.longitude
        });
      }
    }
  }, [profileData]);

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) return;
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
    if (isNaN(userAge) || userAge < 18) {
      toast({ variant: "destructive", title: "Wait!", description: "You must be 18+ to join I Love U." });
      return;
    }

    setIsSaving(true);
    try {
      const moderation = await moderateText({ text: `${displayName} ${bio}` });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Policy", description: moderation.reason });
        setIsSaving(false);
        return;
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        displayName, 
        age: userAge, 
        gender, 
        religion, 
        bio, 
        location,
        address,
        taxId,
        country, 
        currency,
        interests: interests.split(',').map(s => s.trim()).filter(i => i),
        culturalInterests: culturalInterests.split(',').map(s => s.trim()).filter(i => i),
        isDatingEnabled, 
        isAdvertiser,
        settings: { allowSensitiveContent },
        exactLocation: exactLocation ? { latitude: exactLocation.lat, longitude: exactLocation.lng } : null,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Profile Ready", description: "Your changes have been saved." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!interests) {
      toast({ title: "Tell us more", description: "Add some interests first so AI can spark your bio! ✨" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateBio({ 
        interests: interests.split(',').map(s => s.trim()), 
        language: 'English' 
      });
      setBio(result.bio);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !db) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      router.push('/');
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Please re-login to delete account." });
    }
  };

  const maskTaxId = (id: string) => {
    if (!id) return '';
    if (id.length <= 4) return '****';
    return `***-**-${id.slice(-4)}`;
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
            <Button variant="outline" onClick={() => signOut(auth)} className="rounded-2xl h-12 px-6 gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-2xl h-12 px-8 font-bold gap-2 shadow-xl shadow-primary/20">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile
            </Button>
          </div>
        </div>

        <Tabs defaultValue="public" className="w-full">
          <TabsList className="w-full h-14 bg-white rounded-2xl shadow-sm border p-1 mb-8">
            <TabsTrigger value="public" className="flex-1 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest">
              <User className="w-4 h-4" />
              Public Info
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex-1 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest">
              <IdCard className="w-4 h-4" />
              Commercial Info
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Safety
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Full Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-2xl h-14 bg-muted/30 border-none px-6 text-lg font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Age (18+)</Label>
                  <Input type="number" value={age} onChange={e => setAge(e.target.value)} className="rounded-2xl h-14 bg-muted/30 border-none px-6 text-lg font-bold" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none px-6 text-lg font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Location Hint</Label>
                  <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. London, UK" className="rounded-2xl h-14 bg-muted/30 border-none px-6 text-lg font-bold" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">My Bio</Label>
                  <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2 font-black text-[10px] uppercase tracking-widest h-8 px-4 bg-primary/5 rounded-full">
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Magic
                  </Button>
                </div>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[160px] rounded-[2rem] bg-muted/30 border-none p-6 text-lg leading-relaxed italic" placeholder="What sparks joy in your life?" />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Home Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none px-6"><SelectValue /></SelectTrigger>
                    <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Base Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-2xl h-14 bg-muted/30 border-none px-6"><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Personal Interests (Comma separated)</Label>
                <Input value={interests} onChange={e => setInterests(e.target.value)} placeholder="Travel, Art, Cooking, AI" className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold" />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Teachable Culture (Comma separated)</Label>
                <Input value={culturalInterests} onChange={e => setCulturalInterests(e.target.value)} placeholder="Swahili Language, Kenyan Coffee, Maasai Art" className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-bold" />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="commercial">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Lock className="w-5 h-5" />
                <h3 className="font-black uppercase tracking-widest text-sm">Commercial Verification</h3>
              </div>
              <p className="text-xs text-muted-foreground">Required for all Sellers and Advertisers. This info is protected by E2EE and only used for tax/legal compliance.</p>
              
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                  <Home className="w-3 h-3" />
                  Full Business/Legal Address
                </Label>
                <Textarea 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="Street, City, Zip, Country" 
                  className="rounded-2xl bg-muted/30 border-none p-4"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                  <IdCard className="w-3 h-3" />
                  Social Security # or TIN (Protected)
                </Label>
                <Input 
                  value={taxId} 
                  onChange={e => setTaxId(e.target.value)} 
                  placeholder="Enter SSN or TIN" 
                  className="rounded-2xl h-14 bg-muted/30 border-none px-6 font-mono" 
                />
                {profileData?.taxId && (
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest ml-1">
                    Verified: {maskTaxId(profileData.taxId)}
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white space-y-6">
                 <div className="flex items-start gap-4 text-red-600">
                    <MapPin className="w-8 h-8 shrink-0" />
                    <div className="space-y-1">
                       <h3 className="font-black uppercase tracking-tighter text-lg">GPS Accountability</h3>
                       <p className="text-xs text-muted-foreground leading-relaxed">Required for dating matches. Your exact location ensures safety and transparency.</p>
                    </div>
                 </div>
                 <Button onClick={handleUpdateLocation} disabled={isFetchingLocation} className="w-full h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold gap-3 shadow-xl shadow-red-100">
                   {isFetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-5 h-5" />}
                   Refresh GPS Pin
                 </Button>
              </Card>

              <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white space-y-6">
                 <div className="flex items-start gap-4 text-primary">
                    <Megaphone className="w-8 h-8 shrink-0" />
                    <div className="space-y-1">
                       <h3 className="font-black uppercase tracking-tighter text-lg">Advertiser Mode</h3>
                       <p className="text-xs text-muted-foreground leading-relaxed">Promote your legal business or cultural event within the community.</p>
                    </div>
                 </div>
                 <Button asChild className="w-full h-14 rounded-2xl gradient-bg font-bold gap-3 shadow-xl shadow-primary/10">
                   <Link href="/ads/manage">
                     <Briefcase className="w-5 h-5" />
                     Manage Ads
                   </Link>
                 </Button>
              </Card>
            </div>

            <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white">
              <div className="flex items-center justify-between border-b pb-8 mb-8">
                 <div className="space-y-1">
                    <h3 className="font-black uppercase tracking-tight text-lg">Account Visibility</h3>
                    <p className="text-xs text-muted-foreground">Manage how you interact with others.</p>
                 </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-bold">Dating Mode Enabled</span>
                   </div>
                   <Button variant="ghost" onClick={() => setIsDatingEnabled(!isDatingEnabled)} className={isDatingEnabled ? 'text-green-600 font-black' : 'text-red-600 font-black'}>
                     {isDatingEnabled ? 'ON' : 'OFF'}
                   </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-bold">Safety Guard (Blur Sensitive)</span>
                   </div>
                   <Button variant="ghost" onClick={() => setAllowSensitiveContent(!allowSensitiveContent)} className={!allowSensitiveContent ? 'text-green-600 font-black' : 'text-amber-600 font-black'}>
                     {!allowSensitiveContent ? 'ACTIVE' : 'DISABLED'}
                   </Button>
                </div>
              </div>

              <div className="pt-10 flex flex-col items-center gap-6">
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                  <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                  <span>•</span>
                  <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="text-destructive/40 hover:text-destructive font-black text-[9px] uppercase tracking-widest">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete My Account Forever
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-3xl font-black tracking-tighter">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-lg leading-relaxed italic">
                        By deleting your account, all your sparks, messages, and cultural connections will be permanently erased. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8">
                      <AlertDialogCancel className="rounded-2xl h-14 font-bold">Keep My Account</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-white rounded-2xl h-14 font-bold">Yes, Purge Everything</AlertDialogAction>
                    </AlertDialogFooter>
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
