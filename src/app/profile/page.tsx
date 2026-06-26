'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
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
  AlertTriangle,
  Clock,
  MapPin,
  Building2,
  Map,
  Hash,
  Gavel,
  Zap,
  Star
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
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/lib/world-data';
import Image from 'next/image';
import { LiveCamera } from '@/components/LiveCamera';
import Link from 'next/link';

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const IDLE_TIMEOUT_OPTIONS = [
  { value: '30', label: '30 Seconds' },
  { value: '60', label: '1 Minute' },
  { value: '300', label: '5 Minutes' },
  { value: '600', label: '10 Minutes' },
  { value: '900', label: '15 Minutes' },
  { value: '1200', label: '20 Minutes' },
  { value: '1500', label: '25 Minutes' },
  { value: '1800', label: '30 Minutes' },
];

function ProfileContent() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { uploadFile, isUploading: isStorageUploading } = useFirebaseStorage();
  const { toast } = useToast();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'gallery' | 'video' | null>(null);
  const [sovereignId, setSovereignId] = useState<string | null>(null);

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
  const [postalCode, setPostalCode] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');
  const [idleTimeout, setIdleTimeout] = useState('300');

  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'siteSettings', 'sovereignty'), (snap) => {
      if (snap.exists()) setSovereignId(snap.data().ownerId);
    });
    return () => unsub();
  }, [db]);

  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

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
      setPostalCode(profileData.postalCode || '');
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
      setIdleTimeout(String(profileData.idleTimeout || '300'));
    }
  }, [profileData, user?.email]);

  const handleSave = async () => {
    if (!user || !db || isSaving) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        firstName, lastName, email, phoneNumber, birthdate, photoUrl,
        additionalPhotoUrls, publicVideoUrl, gender, bio, address1,
        city, state, country, postalCode, publicNickname, isPhotoPublic,
        isAgeVerified, isRespectful, isHuman, preferredLanguage, currency,
        idleTimeout: parseInt(idleTimeout),
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
      router.push('/');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleLiveCapture = async (data: { url: string; file: File; type: 'image' | 'video' }) => {
    if (!user) return;
    try {
      const url = await uploadFile(`profiles/${user.uid}/${cameraTarget}_${Date.now()}`, data.file);
      if (cameraTarget === 'avatar') setPhotoUrl(url);
      else if (cameraTarget === 'gallery') setAdditionalPhotoUrls(prev => [...prev, url]);
      else if (cameraTarget === 'video') setPublicVideoUrl(url);
      toast({ title: "Media Secured", description: "Your identity highlight is live! ✨" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Upload Ripple", description: "Mission Control rejected media." });
    }
  };

  // Sovereign check uses siteSettings
  const isUserSovereign = user?.uid === sovereignId;

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
            >
              <Avatar className="w-20 h-20 border-4 border-white shadow-xl group-hover:opacity-80 transition-opacity">
                <AvatarImage src={photoUrl} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground">{isStorageUploading && cameraTarget === 'avatar' ? <Loader2 className="animate-spin" /> : <User className="w-10 h-10" />}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full border-4 border-white shadow-lg"><Camera className="w-4 h-4" /></div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Console</h1>
                 {(isUserSovereign || profileData?.role === 'admin') && <Badge className="bg-slate-900 text-white font-black text-[7px] uppercase tracking-widest px-2 h-5 flex items-center gap-1"><Zap className="w-2 h-2 text-primary" /> Admin</Badge>}
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1">Universal Identity Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full font-black uppercase text-[9px] h-10 px-6 border-2">Sign Out</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-full font-black uppercase text-[9px] h-10 px-6 shadow-xl active:scale-95 transition-all">Save Identity</Button>
          </div>
        </div>

        {isUserSovereign && (
          <Link href="/admin/approvals">
            <Card className="rounded-3xl border-none shadow-xl bg-slate-900 text-white p-6 mb-8 hover:scale-[1.02] transition-transform group cursor-pointer overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                  <Gavel className="w-24 h-24 text-primary" />
               </div>
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Zap className="w-6 h-6 text-primary" />
                     </div>
                     <div className="text-left leading-none">
                        <h3 className="font-black text-lg tracking-tighter uppercase">Sovereign Command</h3>
                        <p className="text-[8px] font-black uppercase text-primary tracking-widest mt-1">Assign User Roles & Permissions</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full"><Star className="w-5 h-5 fill-primary text-primary" /></Button>
               </div>
            </Card>
          </Link>
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
                <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">First Name</Label><Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold" /></div>
                <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Last Name</Label><Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold" /></div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Gender (Binary Protocol)</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold"><SelectValue placeholder="Select Identity" /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">{GENDERS.map(g => <SelectItem key={g.value} value={g.value} className="py-4 rounded-xl font-bold">{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Street Address
                </Label>
                <Input value={address1} onChange={e => setAddress1(e.target.value)} placeholder="123 Heart Lane" className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-lg font-bold" />
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-primary" /> City
                  </Label>
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Metropolis" className="rounded-2xl border-none bg-muted/40 h-14 px-6 font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                    <Map className="w-3.5 h-3.5 text-primary" /> State / Province
                  </Label>
                  <Input value={state} onChange={e => setState(e.target.value)} placeholder="Region" className="rounded-2xl border-none bg-muted/40 h-14 px-6 font-bold" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-primary" /> Zip / Postal Code
                  </Label>
                  <Input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="00000" className="rounded-2xl border-none bg-muted/40 h-14 px-6 font-bold" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Country Origin</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-2xl border-none bg-muted/40 h-14 px-6 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-80 rounded-2xl border-none shadow-2xl">{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code} className="py-3">{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public" className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 space-y-8">
              <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Community Nickname</Label><Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} className="rounded-2xl border-none bg-muted/40 h-14 px-6 text-xl font-black text-primary" /></div>
              <div className="space-y-3"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Mystery Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} className="rounded-3xl border-none bg-muted/40 min-h-[120px] p-6 text-base font-medium italic leading-relaxed" placeholder="Tell the revolution about your mission..." /></div>
              
              <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-tighter">Public Discovery</h4>
                  <p className="text-[10px] text-muted-foreground italic">Toggle visibility in the mystery carousel.</p>
                </div>
                <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Protocol Version 2.1.0</p>
              </div>

              <div className="space-y-4 p-6 bg-slate-900 text-white rounded-[1.5rem] shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                    <Clock className="w-20 h-20 text-primary" />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-primary">
                       <Clock className="w-5 h-5" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Session Security (Idle Logout)</h4>
                    </div>
                    <p className="text-[9px] text-white/60 italic font-medium leading-relaxed">
                      "Security is Mandatory." For your protection, we automatically sign you out after a period of inactivity.
                    </p>
                    <Select value={idleTimeout} onValueChange={setIdleTimeout}>
                      <SelectTrigger className="w-full h-12 bg-white/10 border-white/20 text-white font-bold rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl">
                        {IDLE_TIMEOUT_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="py-3 font-bold">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "I am 18+ years old", state: isAgeVerified, set: setIsAgeVerified, desc: "Legal compliance for global hearts." },
                  { label: "Respect & Love is Mandatory", state: isRespectful, set: setIsRespectful, desc: "Zero tolerance for meanness or toxicity." },
                  { label: "Verified Human Status", state: isHuman, set: setIsHuman, desc: "Accountability for every connection." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-6 bg-muted/20 rounded-[1.5rem] cursor-pointer hover:bg-muted/30 transition-all" onClick={() => item.set(!item.state)}>
                    <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0", item.state ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-slate-300")}>{item.state && <CheckCircle2 className="w-5 h-5 text-white" />}</div>
                    <div className="space-y-0.5 text-left">
                       <span className={cn("text-[11px] font-black uppercase tracking-widest", item.state ? "text-primary" : "text-slate-400")}>{item.label}</span>
                       <p className="text-[9px] text-muted-foreground italic font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-dashed text-center">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" className="w-full text-red-500 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-red-50 hover:text-red-600 h-14 rounded-2xl">Delete My Entire Mission</Button>
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