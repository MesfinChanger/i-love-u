"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously
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
  ShieldCheck,
  CheckCircle2,
  Zap,
  RefreshCw,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { generateKeyPair } from '@/lib/crypto';
import { COUNTRIES } from '@/lib/world-data';
import { useTranslation } from '@/components/providers/LanguageProvider';

function LoginContent() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigError, setIsConfigError] = useState(false);

  // Mandatory Security Protocols
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    if (user && !authLoading && user.uid) {
      // Snappy Policy Check Protocol
      const hasAccepted = localStorage.getItem('iloveu_policy_accepted') === 'true';
      if (hasAccepted) {
        router.push('/discover');
      } else {
        router.push('/policy/agree');
      }
    }
  }, [user, authLoading, router]);

  const handleGuestJoin = async () => {
    if (!auth) {
      setIsConfigError(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await signInAnonymously(auth);
      const { publicKey, privateKey } = await generateKeyPair();
      localStorage.setItem(`spark_priv_${res.user.uid}`, privateKey);

      if (db) {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          isAnonymous: true,
          country: country || 'GLOBAL',
          publicKey,
          isAgeVerified,
          isRespectful,
          isHuman,
          policyAccepted: false,
          preferredLanguage: language,
          createdAt: serverTimestamp()
        }, { merge: true });
      }

      toast({ title: "Welcome, Guest!", description: "Please review our sacred agreement. ❤️" });
      router.push('/policy/agree');
    } catch (e: any) {
      if (e.message?.includes('api-key-not-valid')) {
        setIsConfigError(true);
      }
      toast({ variant: "destructive", title: "Access Denied", description: "Regional bridge error. Try Prototype Mode." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!email) {
      toast({ variant: "destructive", title: "Missing Email", description: "Please enter your email to continue. ✨" });
      return;
    }
    if (!password) {
      toast({ variant: "destructive", title: "Missing Secure Phrase", description: "A password is required for your security. ❤️" });
      return;
    }
    
    if (!auth) {
      setIsConfigError(true);
      return;
    }
    
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        if (!country) {
          toast({ variant: "destructive", title: "Origin Required", description: "Please select your country to join the revolution. 🌍" });
          setIsLoading(false);
          return;
        }

        const res = await createUserWithEmailAndPassword(auth, email, password);
        const { publicKey, privateKey } = await generateKeyPair();
        localStorage.setItem(`spark_priv_${res.user.uid}`, privateKey);
        
        if (db) {
           await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid,
            email,
            country,
            publicKey,
            isAgeVerified,
            isRespectful,
            isHuman,
            policyAccepted: false,
            preferredLanguage: language,
            createdAt: serverTimestamp()
          }, { merge: true });
        }

        toast({ title: "Welcome!", description: "Identity created. Now, let's align our values. ❤️" });
        router.push('/policy/agree');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Snappy Check on login
        const hasAccepted = localStorage.getItem('iloveu_policy_accepted') === 'true';
        if (hasAccepted) {
          router.push('/discover');
        } else {
          router.push('/policy/agree');
        }
      }
    } catch (error: any) {
      // Support Protocol: Replace console.error with user-friendly feedback
      let message = "Check your credentials and try again. ❤️";
      let title = "Access Ripple";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        message = "The secure phrase or email provided does not match our records. ✨";
      } else if (error.code?.includes('api-key-not-valid')) {
        setIsConfigError(true);
        return;
      }
      
      toast({ variant: "destructive", title, description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const launchPrototype = () => {
    toast({ title: "Launching Prototype", description: "Entering the mission area without live data connection. ❤️" });
    router.push('/discover');
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <Link href="/" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" />
        Home
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-6">
            <Heart className="w-16 h-16 fill-primary text-primary" />
            <div className="space-y-2">
              <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">I LOVE U</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">{t('login.subtitle')}</p>
            </div>
          </div>
        </div>

        {(!auth || isConfigError) && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2.5rem] space-y-4 mb-6 animate-in slide-in-from-top-4">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Regional Bridge Required</p>
                    <p className="text-[9px] text-amber-600/80 font-bold leading-relaxed uppercase">
                    The platform is waiting for project credentials.
                    </p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" className="h-10 rounded-xl text-[9px] font-black uppercase border-amber-200 text-amber-700 hover:bg-amber-100" onClick={() => window.location.reload()}>
                    <RefreshCw className="w-3 h-3 mr-1.5" /> Reload
                </Button>
                <Button className="h-10 rounded-xl text-[9px] font-black uppercase bg-slate-900 text-white hover:bg-black" onClick={launchPrototype}>
                    <ArrowRight className="w-3 h-3 mr-1.5" /> Prototype Mode
                </Button>
             </div>
          </div>
        )}

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.08)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b border-primary/10">
             <div className="flex items-center justify-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t('login.protocol')}</p>
             </div>
             <div className="flex flex-col gap-4 max-w-[280px] mx-auto">
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                   <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", isAgeVerified ? "border-primary bg-primary" : "border-slate-200")}>
                     {isAgeVerified && <CheckCircle2 className="w-4 h-4 text-white" />}
                   </div>
                   <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", isAgeVerified ? "text-primary" : "text-slate-400")}>{t('login.ageVerify')}</span>
                </div>
                
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsRespectful(!isRespectful)}>
                   <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", isRespectful ? "border-primary bg-primary" : "border-slate-200")}>
                     {isRespectful && <CheckCircle2 className="w-4 h-4 text-white" />}
                   </div>
                   <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", isRespectful ? "text-primary" : "text-slate-400")}>{t('login.respectVerify')}</span>
                </div>
                
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsHuman(!isHuman)}>
                   <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", isHuman ? "border-primary bg-primary" : "border-slate-200")}>
                     {isHuman && <CheckCircle2 className="w-4 h-4 text-white" />}
                   </div>
                   <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", isHuman ? "text-primary" : "text-slate-400")}>{t('login.humanVerify')}</span>
                </div>
             </div>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as 'signin' | 'signup')} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-16 bg-white p-1 border-b">
              <TabsTrigger value="signin" className="rounded-t-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em]">{t('login.signIn')}</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-t-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em]">{t('login.join')}</TabsTrigger>
            </TabsList>
            
            <CardContent className="p-10 space-y-8">
              <div className="space-y-6">
                {mode === 'signup' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">Origin</p>
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

                <div className="space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">EMAIL</p>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="heart@example.com"
                    className="h-12 w-full border-none border-b-2 border-slate-100 rounded-none px-0 font-bold text-base focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-slate-200 outline-none" 
                  />
                </div>
                
                <div className="space-y-4 relative">
                  <div className="flex justify-between items-baseline ml-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">SECURE PHRASE</p>
                    {mode === 'signin' && (
                      <Link href="/login/reset" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                        Forgot?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Minimum 6 characters"
                      className="h-12 w-full border-none border-b-2 border-slate-100 rounded-none px-0 font-bold text-base focus-visible:ring-0 focus-visible:border-primary transition-all pr-12 placeholder:text-slate-200 outline-none" 
                    />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 bottom-2 text-slate-300 hover:text-primary transition-colors" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleAuth} 
                  disabled={isLoading} 
                  className={cn(
                    "w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-xl active:scale-95 transition-all",
                    (!auth || isConfigError) ? "bg-slate-200 text-slate-400" : "gradient-bg"
                  )}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'signin' ? t('login.launch') : t('login.joinRevolution')}
                </Button>

                {mode === 'signup' && (
                  <div className="pt-2">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                      <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">OR</span></div>
                    </div>
                    <Button 
                      onClick={handleGuestJoin}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full h-16 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all gap-3"
                    >
                      <Sparkles className="w-4 h-4" />
                      {t('login.guest')}
                    </Button>
                  </div>
                )}
              </div>

              <p className="text-[9px] text-center text-slate-300 uppercase font-black tracking-[0.3em] pt-4">
                © {currentYear} • Global Security Protocol
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
