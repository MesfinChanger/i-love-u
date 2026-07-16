
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  AtSign,
  Lock,
  Globe,
  Sparkles,
  BotOff,
  Ghost
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateKeyPair, exportPublicKey, exportPrivateKey } from '@/lib/crypto';
import { COUNTRIES } from '@/lib/world-data';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Identity Recovery Hub.
 * Optimized with the Unified Heart Identity and Discovery Layer.
 */
function LoginContent() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { language, t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [agreedAge, setAgreedAge] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedResponsibility, setAgreedResponsibility] = useState(false);
  const [agreedHuman, setAgreedHuman] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/discover');
    }
  }, [user, authLoading, router]);

  const handleAuth = async () => {
    if (!email || !password) return;
    
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Bridge Disconnected",
        description: "The authentication bridge is waiting for cloud credentials. ❤️"
      });
      return;
    }
    
    const cleanEmail = email.trim();

    if (mode === 'signup') {
      if (!nickname) {
        toast({ variant: "destructive", title: "Identity Required", description: "Please choose a community nickname. ❤️" });
        return;
      }
      if (!agreedAge || !agreedTerms || !agreedResponsibility || !agreedHuman) {
        toast({ variant: "destructive", title: "Consent Required", description: "You must check all mandatory agreements to join. ✨" });
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        
        // E2EE Identity Generation
        const keyPair = await generateKeyPair();
        if (keyPair) {
          const publicKeyStr = await exportPublicKey(keyPair.publicKey);
          const privateKeyStr = await exportPrivateKey(keyPair.privateKey);
          
          localStorage.setItem(`spark_priv_${res.user.uid}`, privateKeyStr);
          localStorage.setItem('iloveu_policy_accepted', 'true');

          if (db) {
            // Unified Heart Identity + Discovery Layer
            const userData = {
              uid: res.user.uid,
              userId: res.user.uid, 
              email: cleanEmail, 
              phone: null,
              username: nickname,
              displayName: nickname,
              photoURL: '',
              accountType: 'free',
              status: 'active',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              country: country || 'Global',
              language: language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              publicKey: publicKeyStr,
              role: 'member',
              policyAccepted: true,
              
              // Personality Layer Default
              bio: "New heart joining the revolution.",
              languages: [language],
              interests: [],
              hobbies: [],
              values: [],
              
              // Discovery Layer Default
              datingGoal: 'exploring',
              preferredAgeRange: '18-99',
              preferredCountries: country ? [country] : [],
              personalityTags: [],
              verified: false,
              visibility: 'public'
            };

            await setDoc(doc(db, 'users', res.user.uid), userData, { merge: true });

            await setDoc(doc(db, 'publicProfiles', res.user.uid), {
              uid: res.user.uid,
              userId: res.user.uid,
              username: nickname,
              displayName: nickname,
              country: country || 'Global',
              verified: false,
              bio: "New heart joining the revolution.",
              photoURL: '',
              accountType: 'free',
              status: 'active',
              datingGoal: 'exploring',
              personalityTags: [],
              visibility: 'public'
            });
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        if (db && auth.currentUser) {
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = "Please check your secure phrase and try again. ❤️";
      toast({ variant: "destructive", title: "Access Ripple", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      const res = await signInAnonymously(auth);
      if (db) {
         await setDoc(doc(db, 'users', res.user.uid), {
           uid: res.user.uid,
           userId: res.user.uid,
           accountType: 'guest',
           status: 'active',
           username: `Guest_${res.user.uid.slice(0, 5)}`,
           displayName: 'Guest Heart',
           createdAt: serverTimestamp(),
           lastLogin: serverTimestamp()
         }, { merge: true });
      }
      toast({ title: "Guest Session Launched", description: "Welcome! ❤️" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Guest Access Ripple", description: "Could not launch guest session." });
    } finally {
      setIsLoading(false);
    }
  };

  const isSignupDisabled = isLoading || !email || !password || !nickname || !agreedAge || !agreedTerms || !agreedResponsibility || !agreedHuman;

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <Link href="/" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <Heart className="w-16 h-16 fill-primary text-primary mx-auto animate-heartbeat" />
          <div className="space-y-2">
            <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">I LOVE U</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Prosperity Revolution</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b text-center relative overflow-hidden">
            <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Mission Protocol</p>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 h-16 bg-white p-1 border-b">
              <TabsTrigger value="signin" className="font-black uppercase text-[10px] tracking-widest">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-black uppercase text-[10px] tracking-widest">Join</TabsTrigger>
            </TabsList>
            
            <CardContent className="p-10 space-y-6">
              {mode === 'signup' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Community Nickname" className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" />
                  </div>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-14 rounded-2xl border-none bg-muted/30 px-6 font-bold">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <SelectValue placeholder="Select Country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-64 rounded-2xl border-none shadow-2xl">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Secure Phrase" className="h-14 pl-12 pr-12 rounded-2xl border-none bg-muted/30 font-bold" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {mode === 'signin' && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <Link href="/login/reset" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Forgot Password?</Link>
                      <Link href="/login/forgot-nickname" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Forgot Username?</Link>
                    </div>
                    <Button onClick={handleAuth} disabled={isLoading || !email || !password} className="w-full h-16 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 gradient-bg shadow-primary/20">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Launch Spark'}
                    </Button>
                  </div>
                )}
              </div>

              {mode === 'signup' && (
                <div className="space-y-6">
                  <div className="space-y-4 pt-2 border-t border-dashed">
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl">
                      <Checkbox id="age-verify" checked={agreedAge} onCheckedChange={(checked) => setAgreedAge(!!checked)} />
                      <label htmlFor="age-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700">I am 18+ years old.</label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl">
                      <Checkbox id="terms-verify" checked={agreedTerms} onCheckedChange={(checked) => setAgreedTerms(!!checked)} />
                      <div className="text-[10px] font-black uppercase tracking-tight text-slate-700">I agree to Terms & Privacy.</div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl">
                      <Checkbox id="human-verify" checked={agreedHuman} onCheckedChange={(checked) => setAgreedHuman(!!checked)} />
                      <label htmlFor="human-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700 flex items-center gap-2"><BotOff className="w-3.5 h-3.5" /> Verified Human.</label>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-2xl">
                      <Checkbox id="responsibility-verify" checked={agreedResponsibility} onCheckedChange={(checked) => setAgreedResponsibility(!!checked)} />
                      <label htmlFor="responsibility-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700">Interactions are my own responsibility.</label>
                    </div>
                  </div>
                  <Button onClick={handleAuth} disabled={isSignupDisabled} className={cn("w-full h-16 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95", isSignupDisabled ? "bg-slate-200 text-slate-400" : "gradient-bg shadow-primary/20")}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join the Revolution'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}><LoginContent /></Suspense>;
}
