
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
  Image as ImageIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateImage } from '@/ai/flows/moderate-image-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc, useFirebaseStorage } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { COUNTRIES, LANGUAGES, CURRENCIES, WORLD_LOCATIONS } from '@/lib/world-data';
import Image from 'next/image';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

function ProfileContent() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { uploadFile, isUploading: isStorageUploading } = useFirebaseStorage();
  const { toast } = useToast();
  const router = useRouter();
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);
  const publicVideoInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);

  // Identity Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [additionalPhotoUrls, setAdditionalPhotoUrls] = useState<string[]>([]);
  const [publicVideoUrl, setPublicVideoUrl] = useState('');
  
  // Granular Location Fields
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState(''); // Used for City / Village / District / Wereda
  const [state, setState] = useState(''); // Used for State / Province / Region
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
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

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
      setBirthdate(profileData.birthdate || '');
      setPhotoUrl(profileData.photoUrl || '');
      setAdditionalPhotoUrls(profileData.additionalPhotoUrls || []);
      setPublicVideoUrl(profileData.publicVideoUrl || '');
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

  // Hierarchical Location Logic
  const availableRegions = useMemo(() => {
    const data = WORLD_LOCATIONS[country] || WORLD_LOCATIONS['DEFAULT'];
    return data.regions || [];
  }, [country]);

  const availableCities = useMemo(() => {
    const region = availableRegions.find(r => r.name === state);
    return region ? region.cities : [];
  }, [state, availableRegions]);

  const calculateAge = (bday: string) => {
    if (!bday) return 0;
    const today = new Date();
    const birthDate = new Date(bday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      if (isGallery) setIsUploadingGallery(true);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        const moderation = await moderateImage({ photoDataUri: dataUri });
        
        if (moderation.isSensitive) {
          toast({ variant: "destructive", title: "Respect Rule Violation", description: "This image was flagged by AI and cannot be used. ✨" });
          if (isGallery) setIsUploadingGallery(false);
          return;
        }

        const path = isGallery ? `profiles/${user.uid}/gallery_${Date.now()}` : `profiles/${user.uid}/avatar`;
        const url = await uploadFile(path, file);
        
        if (isGallery) {
          setAdditionalPhotoUrls(prev => [...prev, url]);
          setIsUploadingGallery(false);
        } else {
          setPhotoUrl(url);
        }
        
        toast({ title: "Photo Secured", description: "Your respectful image has been uploaded." });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Ripple", description: "Could not process image." });
      if (isGallery) setIsUploadingGallery(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingVideo(true);
    try {
      const path = `profiles/${user.uid}/highlight_video`;
      const url = await uploadFile(path, file);
      setPublicVideoUrl(url);
      toast({ title: "Video Secured", description: "Your public highlight is live! ✨" });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload video." });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const removeGalleryPhoto = (url: string) => {
    setAdditionalPhotoUrls(prev => prev.filter(p => p !== url));
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
      const locationHint = `${city || state || 'Unknown Community'}, ${COUNTRIES.find(c => c.code === country)?.name || 'Global'}`;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid, 
        firstName, 
        lastName, 
        displayName, 
        birthdate, 
        photoUrl,
        additionalPhotoUrls,
        publicVideoUrl,
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
        publicPhotoUrl: isPhotoPublic ? photoUrl || null : null,
        publicVideoUrl: isPhotoPublic ? publicVideoUrl || null : null,
        additionalPhotoUrls: isPhotoPublic ? additionalPhotoUrls : [],
        country, 
        locationHint,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Identity Synced", description: "Your account details have been updated! ❤️" });
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

  if (!mounted || profileLoading) return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white">
       <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  const isProtocolComplete = isAgeVerified && isRespectful && isHuman;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-lg">
                      <AvatarImage src={photoUrl} className="object-cover" />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {isStorageUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <User className="w-8 h-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                      <Plus className="w-3 h-3" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="rounded-2xl p-2 border-none shadow-xl">
                  <DropdownMenuItem onClick={() => cameraInputRef.current?.click()} className="rounded-xl gap-3 py-3 cursor-pointer">
                    <Camera className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Take Photo</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => galleryInputRef.current?.click()} className="rounded-xl gap-3 py-3 cursor-pointer">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm">Choose from Gallery</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e)} />
              <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="user" onChange={(e) => handlePhotoUpload(e)} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                My Account
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest ml-1">Manage your global presence.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => signOut(auth!)} className="h-9 px-4 text-[9px] font-black uppercase rounded-full">Sign Out</Button>
            <Button 
              size="sm"
              onClick={handleSave} 
              disabled={isSaving || !isProtocolComplete} 
              className={cn("h-9 px-5 text-[9px] font-black uppercase shadow-lg rounded-full", isProtocolComplete ? "gradient-bg" : "bg-slate-200 text-slate-400")}
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Save className="w-3 h-3 mr-1.5" />}
              Sync
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-12 bg-white/50 rounded-xl p-1 mb-6 border shadow-sm backdrop-blur-md overflow-x-auto no-scrollbar">
            <TabsTrigger value="personal" className="flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest gap-1.5">
              <User className="w-3.5 h-3.5" />
              Info
            </TabsTrigger>
            <TabsTrigger value="address" className="flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Address
            </TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              Public
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest relative gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Security
              {!isProtocolComplete && <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse border-2 border-white" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Home Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4" placeholder="Street address or P.O. Box" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Country / Region</Label>
                  <Select value={country} onValueChange={(v) => { setCountry(v); setState(''); setCity(''); }}>
                    <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">State / Province / Region</Label>
                    <Select value={state} onValueChange={(v) => { setState(v); setCity(''); }}>
                      <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4">
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">
                        {availableRegions.length > 0 ? (
                          availableRegions.map(r => <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>)
                        ) : (
                          <SelectItem value="Other">Other / Not Listed</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">City / Village / District / Wereda</Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4">
                        <SelectValue placeholder="Select Community" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64 overflow-y-auto">
                        {availableCities.length > 0 ? (
                          availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)
                        ) : (
                          <SelectItem value="Other">Other / Not Listed</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <p className="text-[8px] text-muted-foreground italic font-medium uppercase tracking-widest text-center mt-4">
                  "Every Village is a Community." We bridge all hearts.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Unique Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. MysteryHeart77" className="h-12 text-sm font-black text-primary bg-muted/30 border-none px-4 rounded-xl" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Preferred Language</Label>
                      <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                        <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4">
                          <Languages className="w-4 h-4 mr-2 opacity-40" />
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent className="max-h-64 overflow-y-auto">
                          {LANGUAGES.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-1">Local Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-12 text-sm rounded-xl font-bold bg-muted/30 border-none px-4"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                        <SelectContent className="max-h-64 overflow-y-auto">
                          {CURRENCIES.map(curr => <SelectItem key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10">
                     <div className="flex items-center gap-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5 cursor-pointer">
                              {isStorageUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="rounded-2xl border-none shadow-2xl p-2">
                             <DropdownMenuItem onClick={() => cameraInputRef.current?.click()} className="rounded-xl gap-3 py-3 cursor-pointer">
                               <Camera className="w-4 h-4 text-primary" />
                               <span className="font-bold text-sm">Take Photo</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => galleryInputRef.current?.click()} className="rounded-xl gap-3 py-3 cursor-pointer">
                               <ImageIcon className="w-4 h-4 text-primary" />
                               <span className="font-bold text-sm">Library</span>
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-tight">Public Photo</h4>
                          <p className="text-[9px] text-muted-foreground italic font-medium">Toggle discovery visibility.</p>
                        </div>
                     </div>
                     <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
                  </div>

                  {/* Highlight Video Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Public Highlight Video</Label>
                      <input type="file" ref={publicVideoInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />
                      <Button variant="ghost" size="sm" onClick={() => publicVideoInputRef.current?.click()} disabled={isUploadingVideo} className="text-primary gap-1.5 h-8 px-4 bg-primary/5 rounded-full text-[9px] font-black uppercase">
                        {isUploadingVideo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3" />}
                        {publicVideoUrl ? 'Change Video' : 'Add Video'}
                      </Button>
                    </div>
                    {publicVideoUrl && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                        <video src={publicVideoUrl} controls className="w-full h-full" />
                        <button onClick={() => setPublicVideoUrl('')} className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>

                  {/* Photo Gallery Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Photo Gallery</Label>
                      <input 
                        type="file" 
                        ref={additionalInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handlePhotoUpload(e, true)} 
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={isUploadingGallery || additionalPhotoUrls.length >= 5}
                        onClick={() => additionalInputRef.current?.click()} 
                        className="text-primary gap-1.5 h-8 px-4 bg-primary/5 rounded-full text-[9px] font-black uppercase hover:bg-primary/10"
                      >
                        {isUploadingGallery ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Add Pic
                      </Button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                       {additionalPhotoUrls.map((url, idx) => (
                         <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-muted group">
                           <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                           <button 
                             onClick={() => removeGalleryPhoto(url)}
                             className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex transition-opacity"
                           >
                             <Trash2 className="w-5 h-5 text-white" />
                           </button>
                         </div>
                       ))}
                       {Array.from({ length: 5 - additionalPhotoUrls.length }).map((_, i) => (
                         <div key={`empty-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-muted bg-muted/10 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground/30" />
                         </div>
                       ))}
                    </div>
                    <p className="text-[8px] text-muted-foreground italic text-center uppercase tracking-widest font-bold">Limit: 5 Additional Sacred Moments</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Personal Bio</Label>
                      <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-1.5 h-8 px-4 bg-primary/5 rounded-full text-[9px] font-black uppercase hover:bg-primary/10">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        AI Spark Bio
                      </Button>
                    </div>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[160px] rounded-[1.5rem] text-sm italic p-6 bg-muted/30 border-none font-medium leading-relaxed" placeholder="Tell the community about your mission and what sparks joy for you..." />
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner border-2 border-primary/5">
                  <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Security Protocol</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Mandatory community safety</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                    <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110", isAgeVerified ? "border-primary bg-primary" : "border-slate-300")}>
                        {isAgeVerified && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", isAgeVerified ? "text-primary" : "text-slate-400")}>I am 18+ years old</span>
                    </div>
                    <div className="h-px bg-primary/10 w-full" />
                    <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setIsRespectful(!isRespectful)}>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110", isRespectful ? "border-primary bg-primary" : "border-slate-300")}>
                        {isRespectful && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", isRespectful ? "text-primary" : "text-slate-400")}>Respect is Mandatory</span>
                    </div>
                    <div className="h-px bg-primary/10 w-full" />
                    <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setIsHuman(!isHuman)}>
                      <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110", isHuman ? "border-primary bg-primary" : "border-slate-300")}>
                        {isHuman && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", isHuman ? "text-primary" : "text-slate-400")}>Verify Human Status</span>
                    </div>
                </div>
                
                <div className="p-5 bg-slate-900 rounded-2xl flex items-center gap-4 shadow-lg border border-primary/20">
                  <Lock className="w-6 h-6 text-primary shrink-0" />
                  <p className="text-[9px] text-white/80 italic uppercase tracking-widest font-black leading-relaxed">
                    Account syncing is locked until all security protocols are confirmed.
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
