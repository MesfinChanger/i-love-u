
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
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
  Scale,
  AlertTriangle,
  X,
  BotOff
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateKeyPair } from '@/lib/crypto';
import { COUNTRIES } from '@/lib/world-data';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

function LoginContent() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useTranslation();

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
      const hasAccepted = localStorage.getItem('iloveu_policy_accepted') === 'true';
      router.push(hasAccepted ? '/discover' : '/policy/agree');
    }
  }, [user, authLoading, router]);

  const handleAuth = async () => {
    if (!email || !password || !auth) return;
    
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
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const { publicKey, privateKey } = await generateKeyPair();
        localStorage.setItem(`spark_priv_${res.user.uid}`, privateKey);
        localStorage.setItem('iloveu_policy_accepted', 'true');

        if (db) {
          await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid, 
            email, 
            country, 
            publicKey,
            publicNickname: nickname,
            displayName: nickname,
            preferredLanguage: language,
            createdAt: serverTimestamp(),
            policyAccepted: true,
            policyAcceptedAt: serverTimestamp(),
            isHuman: true,
            legalConsent: {
              ageVerified: true,
              termsAgreed: true,
              responsibilityAcknowledged: true,
              humanVerified: true,
              timestamp: new Date().toISOString()
            }
          }, { merge: true });

          await setDoc(doc(db, 'publicProfiles', res.user.uid), {
            uid: res.user.uid,
            publicNickname: nickname,
            country: country || 'Global',
            verified: false,
            bio: "New heart joining the revolution.",
            photoUrl: null,
            age: 18
          });
        }
        router.push('/discover');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = error.message || "Verify your credentials and join again. ❤️";
      
      // Enforced Mission Messaging for missing credentials
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email') {
        message = "You do not have a valid credential. Please Subscribe to our mission by using the Join tab! ✨";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Access Ripple: Too many failed attempts. Please wait a heartbeat and try again. ❤️";
      }

      toast({ 
        variant: "destructive", 
        title: "Access Ripple", 
        description: message 
      });
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
          <div className="bg-primary/5 p-8 border-b text-center relative overflow-hidden group">
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-primary/10 group-hover:rotate-12 transition-transform" />
            <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Mission Protocol</p>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 h-16 bg-white p-1 border-b">
              <TabsTrigger value="signin" className="font-black uppercase text-[10px] tracking-widest data-[state=active]:text-primary">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-black uppercase text-[10px] tracking-widest data-[state=active]:text-primary">Join</TabsTrigger>
            </TabsList>
            
            <CardContent className="p-10 space-y-6">
              {mode === 'signup' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      value={nickname} 
                      onChange={e => setNickname(e.target.value)} 
                      placeholder="Community Nickname" 
                      className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" 
                    />
                  </div>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-14 rounded-2xl border-none bg-muted/30 px-6 font-bold">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <SelectValue placeholder="Select Country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-64 rounded-2xl border-none shadow-2xl">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code} className="rounded-xl py-3 font-medium">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email Address" 
                    className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Secure Phrase" 
                      className="h-14 pl-12 pr-12 rounded-2xl border-none bg-muted/30 font-bold" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {mode === 'signin' && (
                    <div className="flex justify-end px-1">
                      <Link href="/login/reset" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                        Forgot Secure Phrase?
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-4 pt-2 border-t border-dashed animate-in fade-in duration-500">
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <Checkbox 
                      id="age-verify" 
                      checked={agreedAge} 
                      onCheckedChange={(checked) => setAgreedAge(!!checked)} 
                      className="mt-1 border-slate-400 data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="age-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700 cursor-pointer">
                      I am at least 18 years old.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <Checkbox 
                      id="terms-verify" 
                      checked={agreedTerms} 
                      onCheckedChange={(checked) => setAgreedTerms(!!checked)} 
                      className="mt-1 border-slate-400 data-[state=checked]:bg-primary"
                    />
                    <div className="text-[10px] font-black uppercase tracking-tight text-slate-700">
                      I have read and agree to the Terms of Service and Privacy Policy.
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <Checkbox 
                      id="human-verify" 
                      checked={agreedHuman} 
                      onCheckedChange={(checked) => setAgreedHuman(!!checked)} 
                      className="mt-1 border-slate-400 data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="human-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700 cursor-pointer flex items-center gap-2">
                      <BotOff className="w-3.5 h-3.5" />
                      I am a verified human status (Anti-bot protocol).
                    </label>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                    <Checkbox 
                      id="responsibility-verify" 
                      checked={agreedResponsibility} 
                      onCheckedChange={(checked) => setAgreedResponsibility(!!checked)} 
                      className="mt-1 border-primary data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="responsibility-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700 cursor-pointer">
                      I understand that interactions with other users are my own responsibility and that the platform does not guarantee identity, safety, compatibility, employment, business opportunities, or relationship outcomes.
                    </label>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleAuth} 
                disabled={mode === 'signup' ? isSignupDisabled : (isLoading || !email || !password)} 
                className={cn(
                  "w-full h-16 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95",
                  (mode === 'signup' && isSignupDisabled) ? "bg-slate-200 text-slate-400" : "gradient-bg shadow-primary/20"
                )}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'signin' ? 'Launch Spark' : 'Join the Revolution'}
              </Button>

              <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-[0.3em]">
                Mandatory Respect • Secured Journey
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
