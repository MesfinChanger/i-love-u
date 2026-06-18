
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
  Star,
  FileText,
  Shield,
  Globe2,
  Languages,
  Soup,
  HeartOff,
  Key,
  MapPin,
  Navigation,
  EyeOff,
  Building2,
  Coins
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateKeyPair } from '@/lib/crypto';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];
const RELIGIONS = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Sikhism', 'Atheist', 'Agnostic', 'None'];
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
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [culturalInterests, setCulturalInterests] = useState('');
  const [languagesLearning, setLanguagesLearning] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [allowSensitiveContent, setAllowSensitiveContent] = useState(false);
  const [isDatingEnabled, setIsDatingEnabled] = useState(true);
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
      setBio(profileData.bio || '');
      setInterests(profileData.interests?.join(', ') || '');
      setCulturalInterests(profileData.culturalInterests?.join(', ') || '');
      setLanguagesLearning(profileData.languagesLearning?.join(', ') || '');
      setPreferredLanguage(profileData.preferredLanguage || 'English');
      setCurrency(profileData.currency || 'USD');
      setAllowSensitiveContent(profileData.settings?.allowSensitiveContent || false);
      setIsDatingEnabled(profileData.isDatingEnabled !== false);
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
    if (!navigator.geolocation) {
      toast({ variant: "destructive", title: "Unsupported", description: "Geolocation is not supported by your browser." });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setExactLocation({ lat: latitude, lng: longitude });
        setIsFetchingLocation(false);
        toast({ title: "Location Verified", description: "Your exact coordinates have been captured for accountability." });
      },
      (error) => {
        console.error(error);
        setIsFetchingLocation(false);
        toast({ variant: "destructive", title: "Location Error", description: "Could not fetch your exact location. Please enable GPS." });
      }
    );
  };

  const handleSetupEncryption = async () => {
    if (!user || !db) return;
    try {
      const keys = await generateKeyPair();
      localStorage.setItem(`spark_priv_${user.uid}`, keys.privateKey);
      await updateDoc(doc(db, 'users', user.uid), {
        publicKey: keys.publicKey
      });
      setHasKeys(true);
      toast({
        title: "Encryption Enabled",
        description: "Your messages are now secured with End-to-End Encryption. ✨"
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Setup Failed", description: "Could not generate security keys." });
    }
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    
    const userAge = parseInt(age);
    if (isNaN(userAge) || userAge < 18) {
      toast({ variant: "destructive", title: "Restricted", description: "You must be 18+ to use Spark." });
      return;
    }

    setIsSaving(true);
    try {
      const [nameModeration, bioModeration, locationModeration] = await Promise.all([
        moderateText({ text: displayName }),
        moderateText({ text: bio }),
        moderateText({ text: location })
      ]);

      if (nameModeration.isFlagged || bioModeration.isFlagged || locationModeration.isFlagged) {
        toast({ 
          variant: "destructive", 
          title: "Profile Flagged", 
          description: "Your content violates respect guidelines." 
        });
        setIsSaving(false);
        return;
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        displayName, age: userAge, gender, religion, bio, location, currency,
        interests: interests.split(',').map(s => s.trim()).filter(i => i),
        culturalInterests: culturalInterests.split(',').map(s => s.trim()).filter(i => i),
        languagesLearning: languagesLearning.split(',').map(s => s.trim()).filter(i => i),
        preferredLanguage,
        isDatingEnabled,
        exactLocation: exactLocation ? {
          latitude: exactLocation.lat,
          longitude: exactLocation.lng,
          lastUpdated: new Date().toISOString()
        } : null,
        settings: { allowSensitiveContent },
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Saved!", description: "Profile updated successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!interests) return toast({ title: "Interests required", variant: "destructive" });
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
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      localStorage.removeItem(`spark_priv_${user.uid}`);
      toast({ title: "Account Deleted", description: "Your data has been removed from Spark." });
      router.push('/');
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Please re-login to verify identity before account deletion." 
      });
      setIsDeleting(false);
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => signOut(auth)} className="rounded-full"><LogOut className="w-4 h-4" /></Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-full gap-2 px-6">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-8 border">
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-full bg-accent flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative">
              <Camera className="w-10 h-10 text-primary opacity-30" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {profileData?.relationshipStatus === 'dating' && (
                <Badge className="bg-primary text-white gap-1 animate-pulse"><Zap className="w-3 h-3 fill-white" />Currently Sparking</Badge>
              )}
              {hasKeys && (
                <Badge className="bg-green-500 text-white gap-1"><Shield className="w-3 h-3" /> E2EE Active</Badge>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-full text-blue-500">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Local Currency</h3>
                <p className="text-xs text-muted-foreground">Used for localized shops and donations</p>
              </div>
            </div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-24 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="p-6 bg-accent/20 rounded-[1.5rem] border border-accent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-full text-primary">
                {isDatingEnabled ? <Heart className="w-6 h-6 fill-primary" /> : <HeartOff className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold">Dating Mode</h3>
                <p className="text-xs text-muted-foreground">{isDatingEnabled ? "Eligible for exclusive Sparks" : "Friendship mode only"}</p>
              </div>
            </div>
            <Switch checked={isDatingEnabled} onCheckedChange={setIsDatingEnabled} />
          </div>

          <div className="p-6 bg-red-50 border border-red-200 rounded-[1.5rem] space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-800">GPS Accountability</h3>
                <p className="text-sm text-red-700">Coordinates visible to your <strong>exclusive partner</strong> only.</p>
              </div>
            </div>
            <Button onClick={handleUpdateLocation} disabled={isFetchingLocation} variant="outline" className="w-full rounded-xl gap-2 border-red-300 text-red-700">
              {isFetchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              Refresh Location
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (18+)</Label>
              <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <Select value={religion} onValueChange={setReligion}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{RELIGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t">
            <Label className="font-black text-lg flex items-center gap-2 text-blue-600">
              <Globe2 className="w-5 h-5" />
              Culture & Exchange
            </Label>
            <div className="space-y-2">
                <Label>City / Country</Label>
                <Input placeholder="e.g. Tokyo, Japan" value={location} onChange={e => setLocation(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
                <Label>Cultural Interests</Label>
                <Input placeholder="e.g. Christmas, Japanese Food" value={culturalInterests} onChange={e => setCulturalInterests(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Bio</Label>
              <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2">
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}AI Bio
              </Button>
            </div>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[120px] rounded-2xl" />
          </div>

          <div className="pt-8 border-t space-y-4">
              <div className="grid gap-2">
                <Button variant="outline" className="w-full rounded-xl justify-between h-12" asChild>
                  <Link href="/donate">
                    <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary fill-primary" /> Support the Community</span>
                  </Link>
                </Button>
                <Button variant="outline" className="w-full rounded-xl justify-between h-12" asChild>
                  <Link href="/privacy">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Privacy Policy</span>
                  </Link>
                </Button>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/5 rounded-xl gap-2 h-12">
                    <Trash2 className="w-4 h-4" />
                    Delete Account Permanently
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Permanent Account Purge?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your profile, matches, and messages.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-white rounded-xl">
                      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
