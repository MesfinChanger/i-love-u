"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendPasswordResetEmail
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Mail, 
  Phone, 
  Chrome, 
  Loader2, 
  ArrowLeft, 
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

function LoginContent() {
  const auth = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isVerifying, setIsVerifying] = useState(false); 
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/discover');
    }
  }, [user, authLoading, router]);

  const validateAccess = () => {
    if (!isAgeVerified) {
      toast({ variant: "destructive", title: "Age Verification", description: "You must be 18+ to join the revolution." });
      return false;
    }
    if (!isRespectful) {
      toast({ variant: "destructive", title: "Respect Policy", description: "Please pledge to bring love and respect." });
      return false;
    }
    if (!isHuman) {
      toast({ variant: "destructive", title: "Security", description: "Please confirm you are a human." });
      return false;
    }
    return true;
  };

  const handleEmailAuth = async () => {
    if (!validateAccess() || !email || !password) return;

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome!", description: "Identity created. Let's find your Spark. ❤️" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/discover');
    } catch (error: any) {
      const message = error.code === 'auth/api-key-not-valid' 
        ? "Firebase Configuration Error: Please check your API Key in environment variables." 
        : error.message;
      toast({ variant: "destructive", title: "Access Denied", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!validateAccess()) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/discover');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-6">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-black text-[10px] uppercase tracking-widest"><ArrowLeft className="w-4 h-4" />Home</Link>
      
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-6">
            <Heart className="w-16 h-16 fill-primary text-primary animate-heartbeat" />
            <span className="font-black text-3xl tracking-tighter text-primary uppercase">I LOVE U</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Prosperity Revolution ❤️ 18+</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-16 bg-muted/30 p-1">
              <TabsTrigger value="email" className="rounded-[1.8rem] gap-2 text-[10px] font-black uppercase tracking-widest">Launch</TabsTrigger>
              <TabsTrigger value="social" className="rounded-[1.8rem] gap-2 text-[10px] font-black uppercase tracking-widest">Connect</TabsTrigger>
            </TabsList>
            <CardContent className="p-10">
              <div className="space-y-4 mb-10">
                <div className="flex flex-col gap-4 bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
                    <div className="flex items-start space-x-4">
                      <Checkbox id="age-check" checked={isAgeVerified} onCheckedChange={(c) => setIsAgeVerified(c as boolean)} className="mt-1 w-5 h-5 rounded-md border-2 border-primary" />
                      <label htmlFor="age-check" className="text-[10px] font-black leading-tight text-primary uppercase tracking-widest cursor-pointer">I AM 18+ YEARS OLD</label>
                    </div>
                    <div className="flex items-start space-x-4 pt-4 border-t border-primary/10">
                      <Checkbox id="respect-check" checked={isRespectful} onCheckedChange={(c) => setIsRespectful(c as boolean)} className="mt-1 w-5 h-5 rounded-md border-2 border-primary" />
                      <label htmlFor="respect-check" className="text-[10px] font-black leading-tight text-primary uppercase tracking-widest cursor-pointer">RESPECT & LOVE IS MANDATORY</label>
                    </div>
                    <div className="flex items-start space-x-4 pt-4 border-t border-primary/10">
                      <Checkbox id="bot-check" checked={isHuman} onCheckedChange={(c) => setIsHuman(c as boolean)} className="mt-1 w-5 h-5 rounded-md border-2 border-primary" />
                      <label htmlFor="bot-check" className="text-[10px] font-black leading-tight text-primary uppercase tracking-widest cursor-pointer">I AM A HUMAN HEART</label>
                    </div>
                </div>
              </div>

              <TabsContent value="email" className="space-y-6">
                <div className="space-y-4">
                  <Input type="email" placeholder="YOUR EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl h-16 bg-muted/20 border-none px-8 font-bold text-lg" />
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="SECURE PHRASE" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl h-16 bg-muted/20 border-none pl-8 pr-16 font-bold text-lg" />
                    <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</Button>
                  </div>
                </div>
                <Button onClick={handleEmailAuth} disabled={isLoading} className="w-full h-20 rounded-[2rem] gradient-bg font-black uppercase tracking-widest text-lg shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : mode === 'signin' ? 'Launch Spark' : 'Join Community'}
                </Button>
                <Button variant="ghost" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">{mode === 'signin' ? "Create an account" : "Back to sign in"}</Button>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="w-full h-20 rounded-[2rem] gap-4 font-black uppercase tracking-widest text-sm border-2 active:scale-95 transition-all"><Chrome className="w-6 h-6 text-primary" />Continue with Google</Button>
                <p className="text-[9px] text-center text-muted-foreground uppercase font-black tracking-widest pt-4">Global Security Protocol Active</p>
              </TabsContent>
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
