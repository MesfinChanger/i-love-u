
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Camera, 
  Loader2, 
  Save, 
  LogOut, 
  Heart, 
  Zap, 
  ShieldAlert, 
  Lock, 
  Trash2,
  Globe2,
  MapPin,
  Navigation,
  Coins,
  Briefcase,
  Megaphone,
  ShieldCheck,
  EyeOff
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DonationDialog } from '@/components/DonationDialog';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];
const RELIGIONS = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Sikhism', 'Atheist', 'Agnostic', 'None'];
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
  const [country, setCountry] = useState('US');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [culturalInterests, setCulturalInterests] = useState('');
  const [languagesLearning, setLanguagesLearning] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [allowSensitiveContent, setAllowSensitiveContent] = useState(false);
  const [isDatingEnabled, setIsDatingEnabled] = useState(true);
  const [isLocalProducer, setIsLocalProducer] = useState(false);
  const [isNewEntrepreneur, setIsNewEntrepreneur] = useState(false);
  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [exactLocation, setExactLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || '');
      setAge(profileData.age?.toString() || '');
      setGender(profileData.gender || '');
      setReligion(profileData.religion || '');
      setLocation(profileData.location || '');
      setCountry(profileData.country || 'US');
      setBio(profileData.bio || '');
      setInterests(profileData.interests?.join(', ') || '');
      setCulturalInterests(profileData.culturalInterests?.join(', ') || '');
      setLanguagesLearning(profileData.languagesLearning?.join(', ') || '');
      setPreferredLanguage(profileData.preferredLanguage || 'English');
      setCurrency(profileData.currency || 'USD');
      setAllowSensitiveContent(profileData.settings?.allowSensitiveContent || false);
      setIsDatingEnabled(profileData.isDatingEnabled !== false);
      setIsLocalProducer(profileData.isLocalProducer || false);
      setIsNewEntrepreneur(profileData.isNewEntrepreneur || false);
      setIsAdvertiser(profileData.isAdvertiser || false);
      setHasKeys(!!profileData.publicKey && !!localStorage.getItem(`spark_priv_${user?.uid}`));
      if (profileData.exactLocation) {
        setExactLocation({
          lat: profileData.exactLocation.latitude,
          lng: profileData.exactLocation.longitude
        });
      }
    }
  }, [profileData, user]);

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) return;
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setExactLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsFetchingLocation(false);
        toast({ title: "Location Verified" });
      },
      () => setIsFetchingLocation(false)
    );
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    const userAge = parseInt(age);
    if (isNaN(userAge) || userAge < 18) {
      toast({ variant: "destructive", title: "Age Restriction", description: "You must be 18+ to use Spark." });
      return;
    }
    if (!gender) {
      toast({ variant: "destructive", title: "Gender Required", description: "Please select your gender." });
      return;
    }

    setIsSaving(true);
    try {
      const moderation = await moderateText({ text: `${displayName} ${bio}` });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Policy Violation", description: moderation.reason });
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
        country, 
        currency,
        interests: interests.split(',').map(s => s.trim()).filter(i => i),
        culturalInterests: culturalInterests.split(',').map(s => s.trim()).filter(i => i),
        languagesLearning: languagesLearning.split(',').map(s => s.trim()).filter(i => i),
        preferredLanguage, 
        isDatingEnabled, 
        isLocalProducer, 
        isNewEntrepreneur, 
        isAdvertiser,
        settings: {
          allowSensitiveContent: allowSensitiveContent
        },
        exactLocation: exactLocation ? { latitude: exactLocation.lat, longitude: exactLocation.lng } : null,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Profile Saved" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!interests) {
      toast({ title: "Missing Interests", description: "Add some interests first so AI can write your bio! ✨" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateBio({ 
        interests: interests.split(',').map(s => s.trim()), 
        language: preferredLanguage 
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
      toast({ variant: "destructive", title: "Error deleting account" });
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl font-black tracking-tighter">Profile Settings</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => signOut(auth)} className="rounded-full gap-2 border-muted-foreground/20">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-full gap-2 px-6">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden p-8 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Display Name</Label>
                <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country (Legal Compliance)</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age (18+)</Label>
                <Input type="number" value={age} onChange={e => setAge(e.target.value)} className="rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">About You</Label>
                <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2 font-bold text-xs uppercase tracking-tighter">
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}AI Bio Generator
                </Button>
              </div>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[120px] rounded-[1.5rem] bg-muted/20 border-none p-4" placeholder="Tell the world who you are..." />
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Safety Guard & Privacy</h3>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><EyeOff className="w-5 h-5 text-amber-600" /></div>
                    <div>
                      <Label className="font-bold">Safety Filter</Label>
                      <p className="text-[10px] text-muted-foreground">Always blur sensitive AI-flagged content.</p>
                    </div>
                  </div>
                  <Switch checked={!allowSensitiveContent} onCheckedChange={(checked) => setAllowSensitiveContent(!checked)} />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Zap className="w-5 h-5 text-primary" /></div>
                    <div>
                      <Label className="font-bold">Dating Mode</Label>
                      <p className="text-[10px] text-muted-foreground">Allow sparks for romantic connections.</p>
                    </div>
                  </div>
                  <Switch checked={isDatingEnabled} onCheckedChange={setIsDatingEnabled} />
                </div>
              </div>
            </div>

            <div className="p-6 bg-red-50 border border-red-200 rounded-[2rem] space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm"><MapPin className="w-6 h-6 text-red-600" /></div>
                <div>
                  <h3 className="font-black text-red-800 text-lg tracking-tighter">GPS Accountability</h3>
                  <p className="text-xs text-red-700 leading-relaxed font-medium">Your exact coordinates are <strong>ONLY</strong> shared with your exclusive dating partner to ensure safety and transparency. It is never public.</p>
                </div>
              </div>
              <Button onClick={handleUpdateLocation} disabled={isFetchingLocation} className="w-full h-12 rounded-xl gap-2 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200">
                {isFetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                Refresh Accountable GPS
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Business & Community Tools</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="p-4 border border-dashed flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Megaphone className="w-5 h-5 text-blue-500" />
                    <Label className="font-bold text-xs">Advertiser Mode</Label>
                  </div>
                  <Switch checked={isAdvertiser} onCheckedChange={setIsAdvertiser} />
                </Card>
                <Card className="p-4 border border-dashed flex items-center justify-between gap-2">
                   <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    <Label className="font-bold text-xs">Entrepreneur Mode</Label>
                  </div>
                  <Switch checked={isNewEntrepreneur} onCheckedChange={setIsNewEntrepreneur} />
                </Card>
              </div>
              {isAdvertiser && (
                <Button variant="outline" className="w-full rounded-xl gap-2 h-12 border-blue-100 text-blue-600" asChild>
                  <Link href="/ads/manage">Manage My Ads</Link>
                </Button>
              )}
               {isNewEntrepreneur && (
                <Button variant="outline" className="w-full rounded-xl gap-2 h-12 border-green-100 text-green-700" asChild>
                  <Link href="/shop/manage">My Seller Dashboard</Link>
                </Button>
              )}
            </div>

            <div className="pt-8 border-t flex flex-col gap-4">
                <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground/50">
                   <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                   <span>•</span>
                   <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="w-full text-destructive/50 hover:text-destructive hover:bg-destructive/5 rounded-xl gap-2 h-12 font-bold text-xs uppercase tracking-widest">
                      <Trash2 className="w-4 h-4" />
                      Request Account Deletion
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black tracking-tighter">Purge Account Data?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                        In accordance with privacy laws, deleting your account will permanently remove all your messages, profile data, and sparks from our active servers. This action is irreversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="rounded-xl">Keep my Sparks</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-white rounded-xl shadow-lg shadow-destructive/20">Purge Data Forever</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

