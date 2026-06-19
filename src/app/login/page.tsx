"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  Eye,
  EyeOff,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' }, { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' }, { code: 'IN', name: 'India' }, { code: 'JP', name: 'Japan' }
];

function LoginContent() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);

  // Mandatory Security Protocols (Required for BOTH Sign In and Join)
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    if (user && !authLoading) {
      router.push('/discover');
    }
  }, [user, authLoading, router]);

  const isProtocolComplete = isAgeVerified && isRespectful && isHuman;

  const syncUserProfile = async (uid: string, email: string) => {
    const defaultData = {
      uid,
      email,
      country: country || 'GLOBAL',
      isAgeVerified,
      isRespectful,
      isHuman,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', uid), defaultData, { merge: true });
    await setDoc(doc(db, 'publicProfiles', uid), {
      uid,
      country: country || 'GLOBAL',
      publicNickname: "Mystery Heart",
      bio: "Joining the movement...",
      updatedAt: serverTimestamp()
    }, { merge: true });
  };

  const handleEmailAuth = async () => {
    if (!email || !password || !isProtocolComplete) return;
    
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        if (!country) {
          toast({ variant: "destructive", title: "Origin Required", description: "Select your country to join." });
          setIsLoading(false);
          return;
        }
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile(res.user.uid, email);
        toast({ title: "Welcome!", description: "Account created successfully. ❤️" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/discover');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Access Denied", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isProtocolComplete) {
       toast({ variant: "destructive", title: "Protocol Required", description: "Verify you are human and 18+ first." });
       return;
    }

    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      if (mode === 'signup') {
        await syncUserProfile(res.user.uid, res.user.email!);
      }
      router.push('/discover');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <Link href="/" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" />
        Home
      </Link>

      {/* Decorative "N" Icon */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-black text-xs shadow-lg hidden md:flex">
        N
      </div>

      {/* Floating Assistant Bubble */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 group cursor-pointer hidden md:block">
        <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center shadow-2xl relative">
          <Heart className="w-6 h-6 fill-white text-white" />
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full text-primary border shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
      
      <div className="w-full max-md:max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-6">
            <Heart className="w-16 h-16 fill-primary text-primary" />
            <div className="space-y-2">
              <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">I LOVE U</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">PROSPERITY REVOLUTION - 18+</p>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.08)] rounded-[3.5rem] overflow-hidden bg-white max-w-md mx-auto">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'signin' | 'signup')} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-16 bg-white p-1 border-b">
              <TabsTrigger value="signin" className="rounded-t-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-t-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all">Join</TabsTrigger>
            </TabsList>
            
            <CardContent className="p-10 space-y-8">
              {/* SHARED MANDATORY SECURITY BOX */}
              <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 space-y-4">
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-2 text-center opacity-60">Mandatory Verification</p>
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                       <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isAgeVerified ? "border-primary bg-primary" : "border-slate-200")}>
                         {isAgeVerified && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <span className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", isAgeVerified ? "text-primary" : "text-slate-400")}>I am 18+ years old</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsRespectful(!isRespectful)}>
                       <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isRespectful ? "border-primary bg-primary" : "border-slate-200")}>
                         {isRespectful && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <span className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", isRespectful ? "text-primary" : "text-slate-400")}>Respect & Love is Mandatory</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsHuman(!isHuman)}>
                       <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isHuman ? "border-primary bg-primary" : "border-slate-200")}>
                         {isHuman && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <span className={cn("text-[9px] font-black uppercase tracking-widest transition-colors", isHuman ? "text-primary" : "text-slate-400")}>Verify Human (Not a Robot)</span>
                    </div>
                 </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">Global Origin</p>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-12 border-none border-b-2 border-slate-100 rounded-none px-0 font-bold text-base focus:ring-0 focus:border-primary transition-all">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-300" />
                        <SelectValue placeholder="SELECT YOUR REGION" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">EMAIL</p>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="h-12 border-none border-b-2 border-slate-100 rounded-none px-0 font-bold text-base focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-slate-200" 
                  />
                </div>
                
                <div className="space-y-4 relative">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">SECURE PHRASE</p>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="h-12 border-none border-b-2 border-slate-100 rounded-none px-0 font-bold text-base focus-visible:ring-0 focus-visible:border-primary transition-all pr-12 placeholder:text-slate-200" 
                  />
                  <Button variant="ghost" size="icon" className="absolute right-0 bottom-2 text-slate-300 hover:text-primary transition-colors" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="pt-4 space-y-8">
                <Button 
                  onClick={handleEmailAuth} 
                  disabled={isLoading || !isProtocolComplete} 
                  className={cn(
                    "w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-[0_20px_40px_-10px_rgba(255,51,102,0.4)] active:scale-95 transition-all",
                    !isProtocolComplete ? "bg-slate-200 text-slate-400" : "gradient-bg"
                  )}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'signin' ? 'Launch' : 'Join Revolution'}
                </Button>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px bg-slate-100 flex-grow" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or</span>
                  <div className="h-px bg-slate-100 flex-grow" />
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleGoogleLogin} 
                  disabled={isLoading || !isProtocolComplete} 
                  className="w-full h-16 rounded-[1.5rem] gap-4 font-black uppercase tracking-[0.2em] text-[11px] border-2 border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                >
                  <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center">
                    <Heart className="w-3 h-3 fill-primary text-primary" />
                  </div>
                  Google Login
                </Button>
              </div>

              <p className="text-[9px] text-center text-slate-300 uppercase font-black tracking-[0.3em] pt-4">
                © {currentYear || 'Prosperity Revolution'} • Global Security Protocol Active
              </p>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
