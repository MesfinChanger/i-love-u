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
  UserCircle,
  Plus,
  Trash2,
  Video,
  PlayCircle,
  Image as ImageIcon,
  Mail,
  Phone,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  CheckCircle2,
  Heart,
  Zap,
  RefreshCw,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/avatar';
import { cn } from '@/lib/utils';
import { COUNTRIES, LANGUAGES, CURRENCIES, WORLD_LOCATIONS } from '@/lib/world-data';
import Image from 'next/image';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { LiveCamera } from '@/components/LiveCamera';
import { Progress } from "@/components/ui/progress";
import { compressImage, fileToDataUri } from '@/lib/image-utils';

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
      const initialCountry = profileData.country || 'US';
      setCountry(initialCountry);
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

  const calculateAge = (bday: string) => {
    if (!bday) return 0;
    const today = new Date();
    const birthDate = new Date(bday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleCountryChange = (newCountryCode: string) => {
    setCountry(newCountryCode);
    setState('');
    setCity('');
    const countryData = COUNTRIES.find(c => c.code === newCountryCode);
    if (countryData?.phoneCode && (!phoneNumber || phoneNumber.length < 5)) {
      setPhoneNumber(countryData.phoneCode);
    }
  };

  const handleLiveCapture = async (data: { url: string; file: File; type: 'image' | 'video' }) => {
    if (!user) return;
    
    try {
      let finalFile = data.file;
      if (data.type === 'image') {
        finalFile = await compressImage(data.file, 0.65, 1080, 1080);
      }

      const url = await uploadFile(`profiles/${user.uid}/${cameraTarget}_${Date.now()}`, finalFile);
      if (cameraTarget === 'avatar') setPhotoUrl(url);
      else if (cameraTarget === 'gallery') setAdditionalPhotoUrls(prev => [...prev, url]);
      else if (cameraTarget === 'video') setPublicVideoUrl(url);
      
      toast({ title: "Media Secured", description: "Your live capture has been saved! ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Upload Ripple", description: "Could not secure live capture. ❤️" });
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'gallery' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      let finalFile = file;
      if (file.type.startsWith('image/')) {
        finalFile = await compressImage(file, 0.65, 1080, 1080);
        const dataUri = await fileToDataUri(finalFile);
        try {
          const moderation = await moderateImage({ photoDataUri: dataUri });
          if (moderation.isSensitive) {
            toast({ variant: "destructive", title: "Policy Violation", description: "This image contains sensitive content. ❤️" });
            return;
          }
        } catch (modErr) {
          console.warn("AI Moderation Ripple deferred.");
        }
      }

      const path = `profiles/${user.uid}/${target}_${Date.now()}`;
      const url = await uploadFile(path, finalFile);

      if (target === 'avatar') setPhotoUrl(url);
      else if (target === 'gallery') setAdditionalPhotoUrls(prev => [...prev, url]);
      else if (target === 'video') setPublicVideoUrl(url);

      toast({ title: "Media Saved", description: "Your respectful content is secured. ✨" });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "The platform could not secure your media right now." });
    }
  };

  const removeGalleryPhoto = (url: string) => {
    setAdditionalPhotoUrls(prev => prev.filter(p => p !== url));
    toast({ title: "Photo Removed", description: "Identity updated respectfully. ✨" });
  };

  const removeAvatar = () => {
    setPhotoUrl('');
    toast({ title: "Avatar Removed", description: "Profile photo cleared. ❤️" });
  };

  const removeVideo = () => {
    setPublicVideoUrl('');
    toast({ title: "Video Removed", description: "Highlight video cleared. ✨" });
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    
    if (isCommercialUser && (!isAgeVerified || !isRespectful || !isHuman)) {
      toast({ variant: "destructive", title: "Protocol Required", description: "Commercial users must complete the Security tab." });
      return;
    }

    const userAge = calculateAge(birthdate);
    if (birthdate && userAge < 18) {
      toast({ variant: "destructive", title: "Age Requirement", description: "You must be 18+ to join." });
      return;
    }
    setIsSaving(true);
    try {
      const locationHint = `${city || state || 'Unknown Community'}, ${COUNTRIES.find(c => c.code === country)?.name || 'Global'}`;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid, 
        firstName, 
        lastName, 
        email,
        phoneNumber,
        displayName, 
        birthdate, 
        photoUrl,
        additionalPhotoUrls,
        publicVideoUrl,
        age: userAge, 
        gender, 
        bio, 
        address1, 
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
        publicPhotoUrl: isPhotoPublic ? photoUrl || null : null,
        publicVideoUrl: isPhotoPublic ? publicVideoUrl || null : null,
        additionalPhotoUrls: isPhotoPublic ? additionalPhotoUrls : [],
        country, 
        locationHint,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Identity Saved", description: "Your account details have been updated! ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not save changes." });
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
      toast({ title: "Session Disconnected", description: "Your heart has been safely signed out. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Sign Out Error", description: "Could not safely disconnect." });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !db || !auth?.currentUser || isDeletingAccount) return;
    setIsDeletingAccount(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteDoc(doc(db, 'publicProfiles', user.uid));
      localStorage.removeItem('iloveu_policy_accepted');
      localStorage.removeItem(`spark_priv_${user.uid}`);
      await deleteUser(auth.currentUser);
      toast({ title: "Account Purged", description: "Your identity and history have been permanently removed. ❤️" });
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({ 
          variant: "destructive", 
          title: "Re-Authentication Required", 
          description: "For security, please sign out and sign back in before deleting your account. ✨" 
        });
      } else {
        toast({ variant: "destructive", title: "Purge Failed", description: "Could not safely remove your identity." });
      }
    } finally {
      setIsDeletingAccount(false);
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
      toast({ title: "Bio Generated", description: "Your AI-powered respectful bio is ready! ✨" });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Ripple", description: "The AI bridge is currently disconnected. ❤️" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted || profileLoading) return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white">
       <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-6">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-lg">
                      <AvatarImage src={photoUrl} className="object-cover" />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {isStorageUploading && cameraTarget === 'avatar' ? <Loader2 className="w-5 h-5 animate-spin" /> : <User className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-2xl p-2 border-none shadow-xl">
                  <DropdownMenuItem onClick={() => { setCameraTarget('avatar'); setIsCameraOpen(true); }} className="rounded-xl gap-3 py-3 cursor-pointer">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Live Camera</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => avatarGalleryInputRef.current?.click()} className="rounded-xl gap-3 py-3 cursor-pointer">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Choose from Gallery</span>
                  </DropdownMenuItem>
                  {photoUrl && (
                    <DropdownMenuItem onClick={removeAvatar} className="rounded-xl gap-3 py-3 cursor-pointer text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                      <span className="font-bold text-sm">Delete Identity Photo</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <input type="file" ref={avatarGalleryInputRef} className="hidden" accept="image/*" onChange={(e) => handleMediaUpload(e, 'avatar')} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
                {t('profile.account')}
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest ml-1">Manage your global presence.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut} className="h-9 px-4 text-[9px] font-black uppercase rounded-full gap-2 border-2">
              {isSigningOut ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
              {t('profile.signOut')}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving || !isProtocolComplete} className={cn("h-9 px-5 text-[9px] font-black uppercase shadow-lg rounded-full", isProtocolComplete ? "gradient-bg" : "bg-slate-200 text-slate-400")}>
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Save className="w-3 h-3 mr-1.5" />}
              {t('profile.save')}
            </Button>
          </div>
        </div>

        {isStorageUploading && (
          <div className="mb-6 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between text-[9px] font-black uppercase mb-1.5">
              <span className="text-primary">Securing identity media...</span>
              <span className="text-primary">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5 bg-primary/5" />
          </div>
        )}

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-14 bg-white/50 rounded-2xl p-1 mb-6 border shadow-sm backdrop-blur-md overflow-x-auto no-scrollbar">
            <TabsTrigger value="personal" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5 group data-[state=active]:text-primary whitespace-nowrap">
              <User className="w-3.5 h-3.5" />
              {t('profile.personal')}
            </TabsTrigger>
            <TabsTrigger value="address" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5 group data-[state=active]:text-primary whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5" />
              {t('profile.address')}
            </TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest gap-1.5 group data-[state=active]:text-primary whitespace-nowrap">
              <Globe2 className="w-3.5 h-3.5" />
              {t('profile.public')}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest relative gap-1.5 group data-[state=active]:text-primary whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('profile.security')}
              {isCommercialUser && !isProtocolComplete && <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse border-2 border-white" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <h3 className="text-base font-black uppercase tracking-tighter">Identity Details</h3>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Legal First Name</Label>
                    <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Legal Last Name</Label>
                    <Input value={lastName} onChange={e => setLastName(e.target.value)} className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" placeholder="Last Name" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Email Address</Label>
                    <Input value={email} onChange={e => setEmail(e.target.value)} type="email" className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" placeholder="heart@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Phone Number</Label>
                    <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} type="tel" className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" placeholder="+1..." />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Display Name</Label>
                    <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" placeholder="How friends see you" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Birthdate</Label>
                    <Input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <h3 className="text-base font-black uppercase tracking-tighter">Regional Origin</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Home Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" placeholder="Street address" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Country / Region</Label>
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4"><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto">{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">State / Province</Label>
                    <Select value={state} onValueChange={(v) => { setState(v); setCity(''); }}>
                      <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4"><SelectValue placeholder="Select State" /></SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">{availableStates.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">City / Village</Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4"><SelectValue placeholder="Select Community" /></SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">{availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
                <h3 className="text-base font-black uppercase tracking-tighter">Public Presence</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('profile.nickname')}</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. MysteryHeart77" className="h-12 text-sm font-black text-primary bg-muted/30 border-none px-4 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('profile.language')}</Label>
                      <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                        <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4"><SelectValue placeholder="Select Language" /></SelectTrigger>
                        <SelectContent className="max-h-64 overflow-y-auto">{LANGUAGES.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">{t('profile.currency')}</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                        <SelectContent className="max-h-64 overflow-y-auto">{CURRENCIES.map(curr => <SelectItem key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-tight">Public Presence</h4>
                          <p className="text-[9px] text-muted-foreground italic font-medium">Toggle visibility in Discovery.</p>
                        </div>
                     </div>
                     <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Discovery Photos (Max 5)</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-primary gap-1.5 h-8 px-4 bg-primary/5 rounded-full text-[9px] font-black uppercase">
                            {isStorageUploading && cameraTarget === 'gallery' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                            Add Photo
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-xl">
                          <DropdownMenuItem onClick={() => { setCameraTarget('gallery'); setIsCameraOpen(true); }} className="rounded-xl gap-3 py-3 cursor-pointer">
                            <Zap className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm">Live Camera</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => galleryInputRef.current?.click()} className="rounded-xl gap-3 py-3 cursor-pointer">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm">Gallery</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={(e) => handleMediaUpload(e, 'gallery')} />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                       {additionalPhotoUrls.map((url, i) => (
                         <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                           <Image src={url} alt={`Gallery ${i}`} fill className="object-cover" />
                           <button onClick={() => removeGalleryPhoto(url)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"><X className="w-3 h-3" /></button>
                         </div>
                       ))}
                       {Array.from({ length: 5 - additionalPhotoUrls.length }).map((_, i) => (
                         <div key={`empty-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground/20">
                            <ImageIcon className="w-4 h-4" />
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Public Highlight Video</Label>
                      <div className="flex gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-primary gap-1.5 h-8 px-4 bg-primary/5 rounded-full text-[9px] font-black uppercase">
                              {isStorageUploading && cameraTarget === 'video' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3" />}
                              Capture / Replace
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-xl">
                            <DropdownMenuItem onClick={() => { setCameraTarget('video'); setIsCameraOpen(true); }} className="rounded-xl gap-3 py-3 cursor-pointer">
                              <Zap className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">Live Recording</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => videoInputRef.current?.click()} className="rounded-xl gap-3 py-3 cursor-pointer">
                              <ImageIcon className="w-4 h-4 text-primary" />
                              <span className="font-bold text-sm">Upload Video</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => handleMediaUpload(e, 'video')} />
                    </div>
                    {publicVideoUrl && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg group">
                        <video src={publicVideoUrl} controls className="w-full h-full" />
                        <button onClick={removeVideo} className="absolute top-4 right-4 bg-black/60 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 shadow-xl"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Personal Bio</Label>
                      <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-1.5 h-8 px-4 bg-primary/5 rounded-full text-[9px] font-black uppercase hover:bg-primary/10">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        AI Spark Bio
                      </Button>
                    </div>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[160px] rounded-[1.5rem] text-sm italic p-6 bg-muted/30 border-none font-medium leading-relaxed" placeholder={t('profile.bioPlaceholder')} />
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner border-2 border-primary/5">
                    <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter">{t('profile.security')}</h3>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Mandatory community safety</p>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                      <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 shrink-0", isAgeVerified ? "border-primary bg-primary" : "border-slate-300")}>
                          {isAgeVerified && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", isAgeVerified ? "text-primary" : "text-slate-400")}>I am 18+ years old</span>
                      </div>
                      <div className="h-px bg-primary/10 w-full" />
                      <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setIsRespectful(!isRespectful)}>
                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 shrink-0", isRespectful ? "border-primary bg-primary" : "border-slate-300")}>
                          {isRespectful && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", isRespectful ? "text-primary" : "text-slate-400")}>Respect is Mandatory</span>
                      </div>
                      <div className="h-px bg-primary/10 w-full" />
                      <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setIsHuman(!isHuman)}>
                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110 shrink-0", isHuman ? "border-primary bg-primary" : "border-slate-300")}>
                          {isHuman && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", isHuman ? "text-primary" : "text-slate-400")}>Verify Human Status</span>
                      </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-xl bg-red-50 p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-sm">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tighter text-red-900">{t('profile.deleteAccount')}</h3>
                    <p className="text-[10px] text-red-700 font-bold uppercase tracking-widest">Permanent Identity Removal</p>
                  </div>
                </div>
                
                <p className="text-xs text-red-800/70 font-medium italic leading-relaxed">
                  "Respecting your data means giving you the key to the exit." Deleting your account will purge all your respectful sparks and mission history.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-red-200 bg-white text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-600 transition-all">
                      Purge Identity & History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[3rem] border-none shadow-2xl p-8">
                    <AlertDialogHeader className="text-center">
                      <div className="w-20 h-20 bg-red-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4">
                         <Trash2 className="w-10 h-10 text-red-500" />
                      </div>
                      <AlertDialogTitle className="text-3xl font-black tracking-tighter uppercase">{t('profile.deleteWarningTitle')}</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground text-sm italic font-medium">
                        {t('profile.deleteWarningDesc')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
                      <AlertDialogCancel className="h-14 rounded-2xl border-none bg-muted/50 font-bold flex-1">{t('profile.deleteCancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                        className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[10px] tracking-widest flex-1 shadow-xl shadow-red-500/20"
                      >
                        {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        {t('profile.deleteConfirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <LiveCamera 
        isOpen={isCameraOpen} 
        onClose={() => { setIsCameraOpen(false); setCameraTarget(null); }} 
        onCapture={handleLiveCapture} 
      />

      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex flex-col min-h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-primary" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
