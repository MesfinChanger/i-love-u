'use client';

import { useState, useEffect, Suspense, useRef, useMemo } from 'react';
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
  Languages,
  Plus,
  Trash2,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Heart,
  Zap,
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc, useFirebaseStorage } from '@/firebase';
import { doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { COUNTRIES, LANGUAGES, CURRENCIES, WORLD_LOCATIONS } from '@/lib/world-data';
import Image from 'next/image';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { LiveCamera } from '@/components/LiveCamera';
import { Progress } from "@/components/ui/progress";
import { compressImage, fileToDataUri } from '@/lib/image-utils';

/**
 * @fileOverview Profile Console.
 * Strictly enforces Binary Identity Protocol (Male/Female only).
 */
const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

function ProfileContent() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { uploadFile, isUploading: isStorageUploading, progress: uploadProgress } = useFirebaseStorage();
  const { toast } = useToast();
  const { t } = useTranslation();
  const router = useRouter();
  const avatarGalleryInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'gallery' | 'video' | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [additionalPhotoUrls, setAdditionalPhotoUrls] = useState<string[]>([]);
  const [publicVideoUrl, setPublicVideoUrl] = useState('');
  
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState(''); 
  const [state, setState] = useState(''); 
  const [country, setCountry] = useState('US');

  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');

  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profileData, loading: profileLoading } = useDoc(userRef);

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setEmail(profileData.email || user?.email || '');
      setPhoneNumber(profileData.phoneNumber || '');
      setBirthdate(profileData.birthdate || '');
      setPhotoUrl(profileData.photoUrl || '');
      setAdditionalPhotoUrls(profileData.additionalPhotoUrls || []);
      setPublicVideoUrl(profileData.publicVideoUrl || '');
      setAddress1(profileData.address1 || '');
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
  }, [profileData, user?.email]);

  const isCommercialUser = profileData?.isSeller || profileData?.isAdvertiser;
  const isProtocolComplete = !isCommercialUser || (isAgeVerified && isRespectful && isHuman);

  const availableStates = useMemo(() => {
    const data = WORLD_LOCATIONS[country] || WORLD_LOCATIONS['DEFAULT'];
    return data.states || [];
  }, [country]);

  const availableCities = useMemo(() => {
    const stateObj = availableStates.find(s => s.name === state);
    return stateObj ? stateObj.cities : [];
  }, [state, availableStates]);

  const handleLiveCapture = async (data: { url: string; file: File; type: 'image' | 'video' }) => {
    if (!user) return;
    try {
      const url = await uploadFile(`profiles/${user.uid}/${cameraTarget}_${Date.now()}`, data.file);
      if (cameraTarget === 'avatar') setPhotoUrl(url);
      else if (cameraTarget === 'gallery') setAdditionalPhotoUrls(prev => [...prev, url]);
      else if (cameraTarget === 'video') setPublicVideoUrl(url);
      toast({ title: "Media Secured", description: "Your moment is live! ✨" });
    } catch (e: any) {
      if (e.code === 'storage/unknown') {
        toast({ 
          variant: "destructive", 
          title: "Storage Configuration Ripple", 
          description: "Firebase Storage needs setup. Check Rules & CORS in console. 🛠️",
          action: <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={() => window.open('https://console.firebase.google.com/')}>Open Console</Button>
        });
      } else {
        toast({ variant: "destructive", title: "Upload Ripple", description: "Could not secure media." });
      }
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'gallery' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      let finalFile = file;
      if (file.type.startsWith('image/')) {
        finalFile = await compressImage(file, 0.65);
      }
      const url = await uploadFile(`profiles/${user.uid}/${target}_${Date.now()}`, finalFile);
      if (target === 'avatar') setPhotoUrl(url);
      else if (target === 'gallery') setAdditionalPhotoUrls(prev => [...prev, url]);
      else if (target === 'video') setPublicVideoUrl(url);
      toast({ title: "Media Saved", description: "Updated respectfully. ✨" });
    } catch (error: any) {
      if (error.code === 'storage/unknown') {
        toast({ 
          variant: "destructive", 
          title: "Storage Configuration Ripple", 
          description: "Firebase Storage needs setup. Check Rules & CORS in console. 🛠️",
          action: <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={() => window.open('https://console.firebase.google.com/')}>Open Console</Button>
        });
      } else {
        toast({ variant: "destructive", title: "Upload Failed", description: "Mission control is offline." });
      }
    }
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        firstName, lastName, email, phoneNumber, birthdate, photoUrl,
        additionalPhotoUrls, publicVideoUrl, gender, bio, address1,
        city, state, country, publicNickname, isPhotoPublic,
        isAgeVerified, isRespectful, isHuman, preferredLanguage, currency,
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast({ title: "Identity Saved", description: "Your details have been secured. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not save identity." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth || isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut(auth);
      router.push('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !db || !auth?.currentUser) return;
    setIsDeletingAccount(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(auth.currentUser);
      router.push('/');
    } catch (e) {
      toast({ variant: "destructive", title: "Purge Failed", description: "Requires recent login." });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (!mounted || profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-6">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => { setCameraTarget('avatar'); setIsCameraOpen(true); }}>
              <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-lg">
                <AvatarImage src={photoUrl} className="object-cover" />
                <AvatarFallback>{isStorageUploading && cameraTarget === 'avatar' ? <Loader2 className="animate-spin" /> : <User />}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-white shadow-sm"><Plus className="w-3 h-3" /></div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">My Profile</h1>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">Universal Identity Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full font-black uppercase text-[9px] h-9">Sign Out</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving || !isProtocolComplete} className="gradient-bg rounded-full font-black uppercase text-[9px] h-9 shadow-lg">Save Changes</Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-14 bg-white/50 rounded-2xl p-1 mb-6 border shadow-sm backdrop-blur-md overflow-x-auto no-scrollbar">
            <TabsTrigger value="personal" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5">Personal</TabsTrigger>
            <TabsTrigger value="address" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5">Location</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5">Public</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="text-[9px] font-black uppercase">First Name</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-xl border-none bg-muted/30" /></div>
                <div className="space-y-2"><Label className="text-[9px] font-black uppercase">Last Name</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-xl border-none bg-muted/30" /></div>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase">Gender (Binary Identity Protocol)</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-xl border-none bg-muted/30"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
              <div className="space-y-2"><Label className="text-[9px] font-black uppercase">Address Line 1</Label><Input value={address1} onChange={e => setAddress1(e.target.value)} className="rounded-xl border-none bg-muted/30" /></div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="rounded-xl border-none bg-muted/30"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64">{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
              <div className="space-y-2"><Label className="text-[9px] font-black uppercase">Unique Nickname</Label><Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} className="rounded-xl border-none bg-muted/30 font-black text-primary" /></div>
              <div className="space-y-2"><Label className="text-[9px] font-black uppercase">Public Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="rounded-xl border-none bg-muted/30 min-h-[100px]" /></div>
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="space-y-1"><h4 className="text-[10px] font-black uppercase">Discovery Photos</h4><p className="text-[8px] text-muted-foreground italic">Visible in mystery carousel.</p></div>
                <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-6">
              <div className="text-center space-y-2 mb-4">
                <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
                <h3 className="font-black uppercase text-sm">Security & Policy Verification</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "I am 18+ years old", state: isAgeVerified, set: setIsAgeVerified },
                  { label: "Respect & Love is Mandatory", state: isRespectful, set: setIsRespectful },
                  { label: "Verified Human Status", state: isHuman, set: setIsHuman }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl cursor-pointer" onClick={() => item.set(!item.state)}>
                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", item.state ? "bg-primary border-primary" : "border-slate-300")}>{item.state && <CheckCircle2 className="w-4 h-4 text-white" />}</div>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", item.state ? "text-primary" : "text-slate-400")}>{item.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <LiveCamera isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleLiveCapture} />
      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}><ProfileContent /></Suspense>;
}
