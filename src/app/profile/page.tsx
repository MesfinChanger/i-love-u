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
  Loader2, 
  Save, 
  User, 
  ShieldCheck,
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc, useFirebaseStorage } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/avatar';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/lib/world-data';
import Image from 'next/image';
import { LiveCamera } from '@/components/LiveCamera';
import { Progress } from "@/components/ui/progress";

/**
 * @fileOverview Profile Console.
 * Strictly enforces Binary Identity Protocol (Male/Female only).
 * accessibility: High-contrast inputs and screen-reader labels for media.
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
  const router = useRouter();
  
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

  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  const handleLiveCapture = async (data: { url: string; file: File; type: 'image' | 'video' }) => {
    if (!user) return;
    try {
      const url = await uploadFile(`profiles/${user.uid}/${cameraTarget}_${Date.now()}`, data.file);
      if (cameraTarget === 'avatar') setPhotoUrl(url);
      else if (cameraTarget === 'gallery') setAdditionalPhotoUrls(prev => [...prev, url]);
      else if (cameraTarget === 'video') setPublicVideoUrl(url);
      toast({ title: "Media Secured", description: "Your identity highlight is live! ✨" });
    } catch (e: any) {
      if (e.code === 'storage/unknown' || e.message?.includes('storage')) {
        toast({ 
          variant: "destructive", 
          title: "Storage Configuration Ripple", 
          description: "Firebase Storage needs setup. Check Rules & CORS in console. 🛠️",
          action: <Button variant="outline" size="sm" className="h-8 text-[10px]" onClick={() => window.open('https://console.firebase.google.com/')}>Open Console</Button>
        });
      } else {
        toast({ variant: "destructive", title: "Upload Ripple", description: "Mission Control rejected media." });
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

  if (!mounted || profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-6" role="main">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div 
              className="relative cursor-pointer group" 
              onClick={() => { setCameraTarget('avatar'); setIsCameraOpen(true); }}
              role="button"
              aria-label="Update profile photo"
            >
              <Avatar className="w-20 h-20 border-4 border-white shadow-xl group-hover:opacity-80 transition-opacity">
                <AvatarImage src={photoUrl} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground">{isStorageUploading && cameraTarget === 'avatar' ? <Loader2 className="animate-spin" /> : <User className="w-10 h-10" />}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full border-4 border-white shadow-lg"><Camera className="w-4 h-4" /></div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Profile Console</h1>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1">Universal Identity Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full font-black uppercase text-[9px] h-10 px-6 border-2">Sign Out</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving || !isProtocolComplete} className="gradient-bg rounded-full font-black uppercase text-[9px] h-10 px-6 shadow-xl active:scale-95 transition-all">Save Identity</Button>
          </div>
        </div>

        {isStorageUploading && (
          <div className="mb-6 space-y-2 p-6 bg-white rounded-[2rem] shadow-sm animate-in fade-in" role="status" aria-label={`Securing Cloud Bridge: ${Math.round(uploadProgress)}%`}>
             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                <span>Securing Cloud Bridge...</span>
                <span>{Math.round(uploadProgress)}%</span>
             </div>
             <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-16 bg-white/50 rounded-[2rem] p-1 mb-8 border shadow-sm backdrop-blur-md overflow-x-auto no-scrollbar">
            <TabsTrigger value="personal" className="flex-1 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-2">Personal</TabsTrigger>
            <TabsTrigger value="address" className="flex-1 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-2">Location</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-2">Public</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-2">Protocol</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">First Name</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold" aria-label="First Name" /></div>
                <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Last Name</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold" aria-label="Last Name" /></div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Gender (Binary Protocol)</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold" aria-label="Select Gender"><SelectValue placeholder="Select Identity" /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">{GENDERS.map(g => <SelectItem key={g.value} value={g.value} className="py-4 rounded-xl font-bold">{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 space-y-8">
              <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Business Address / Line 1</Label><Input value={address1} onChange={e => setAddress1(e.target.value)} className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold" aria-label="Address" /></div>
              <div className="grid sm:grid-cols-2 gap-8">
                 <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Country Origin</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-2xl border-none bg-muted/40 h-14 px-6 font-bold" aria-label="Select Country"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-80 rounded-2xl border-none shadow-2xl">{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code} className="py-3">{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Tax Identification / SSN</Label><Input type="password" value={profileData?.taxId || ''} readOnly className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold opacity-40 cursor-not-allowed" aria-label="Tax ID" /></div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public" className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 space-y-8">
              <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Community Nickname</Label><Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-xl font-black text-primary" aria-label="Community Nickname" /></div>
              <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Mystery Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="rounded-3xl border-none bg-muted/40 min-h-[120px] p-6 text-base font-medium italic leading-relaxed" placeholder="Tell the revolution about your mission..." aria-label="Bio" /></div>
              
              <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-tighter">Public Discovery</h4>
                  <p className="text-[10px] text-muted-foreground italic">Toggle visibility in the mystery carousel.</p>
                </div>
                <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} aria-label="Toggle Public Discovery" />
              </div>

              <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Identity Gallery</Label>
                 <div className="grid grid-cols-3 gap-4" role="group" aria-label="Gallery photos">
                    {additionalPhotoUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md">
                         <Image src={url} alt={`Identity ${i+1}`} fill className="object-cover" />
                         <button onClick={() => setAdditionalPhotoUrls(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/40 text-white p-1 rounded-full backdrop-blur-md" aria-label="Delete photo"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button 
                      onClick={() => { setCameraTarget('gallery'); setIsCameraOpen(true); }}
                      className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-2 group hover:bg-primary/10 transition-all"
                      aria-label="Add photo to gallery"
                    >
                       <Plus className="w-6 h-6 text-primary/40 group-hover:scale-110 transition-transform" />
                       <span className="text-[8px] font-black uppercase text-primary/40">Add Live</span>
                    </button>
                 </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 space-y-8">
              <div className="text-center space-y-3 mb-4">
                <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center mx-auto border-2 border-dashed border-primary/20">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-black uppercase text-lg tracking-tighter">Mission Verification</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Protocol Version 2.0.0</p>
              </div>
              <div className="space-y-4" role="group" aria-label="Mission verification items">
                {[
                  { label: "I am 18+ years old", state: isAgeVerified, set: setIsAgeVerified, desc: "Legal compliance for global hearts." },
                  { label: "Respect & Love is Mandatory", state: isRespectful, set: setIsRespectful, desc: "Zero tolerance for meanness or toxicity." },
                  { label: "Verified Human Status", state: isHuman, set: setIsHuman, desc: "Accountability for every connection." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-muted/20 rounded-[1.5rem] cursor-pointer hover:bg-muted/30 transition-all" onClick={() => item.set(!item.state)} role="checkbox" aria-checked={item.state} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && item.set(!item.state)}>
                    <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0", item.state ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-slate-300")}>{item.state && <CheckCircle2 className="w-5 h-5 text-white" />}</div>
                    <div className="space-y-0.5">
                       <span className={cn("text-[11px] font-black uppercase tracking-widest", item.state ? "text-primary" : "text-slate-400")}>{item.label}</span>
                       <p className="text-[9px] text-muted-foreground italic font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-dashed">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" className="w-full text-red-500 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-red-50 hover:text-red-600 h-14 rounded-2xl" aria-label="Delete account">Delete My Entire Mission</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[3rem] p-10 border-none shadow-2xl">
                       <AlertDialogHeader>
                          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-10 h-10" /></div>
                          <AlertDialogTitle className="text-3xl font-black tracking-tighter uppercase text-center">Final Purge?</AlertDialogTitle>
                          <AlertDialogDescription className="text-center font-medium italic">All matches, messages, and mission history will be permanently erased. Respectfully, there is no turning back. ❤️</AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter className="flex-col sm:flex-row gap-4 mt-8">
                          <AlertDialogCancel className="flex-1 h-14 rounded-2xl border-none bg-muted/50 font-bold">Keep Connecting</AlertDialogCancel>
                          <AlertDialogAction onClick={() => router.push('/')} className="flex-1 h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black shadow-xl shadow-red-500/20">Purge Forever</AlertDialogAction>
                       </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>
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
