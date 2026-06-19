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
  UserCircle,
  Eye,
  EyeOff,
  Sparkles
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
  const [isBotChecking, setIsBotChecking] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/discover');
    }
  }, [user, authLoading, router]);

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);

    if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters (@$!%*?&)."
      };
    }
    return { isValid: true };
  };

  const validateAccess = () => {
    if (!isAgeVerified) {
      toast({ variant: "destructive", title: "Age Verification Required", description: "You must be 18+ to join." });
      return false;
    }
    if (!isRespectful) {
      toast({ variant: "destructive", title: "Respect Policy", description: "Please pledge to bring love and respect." });
      return false;
    }
    if (!isHuman) {
      toast({ variant: "destructive", title: "Security Check", description: "Please confirm you are a human." });
      return false;
    }
    return true;
  };

  const handleBotCheck = (checked: boolean) => {
    if (checked) {
      setIsBotChecking(true);
      setTimeout(() => {
        setIsHuman(true);
        setIsBotChecking(false);
        toast({ title: "Human Verified", description: "Welcome to a joyful space! ✨" });
      }, 800);
    } else {
      setIsHuman(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!validateAccess() || !email || !password) return;

    if (mode === 'signup') {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        toast({ variant: "destructive", title: "Weak Password", description: validation.message });
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome!", description: "Your account has been created successfully. ❤️" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/discover');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ variant: "destructive", title: "Email Required", description: "Please enter your email address first." });
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Reset Email Sent", description: "Check your inbox for the link. ❤️" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handleSendPhoneCode = async () => {
    if (!validateAccess() || !phoneNumber) return;
    setIsLoading(true);
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setIsVerifying(true);
      toast({ title: "Code Sent", description: "Check your phone for the 6-digit code." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Phone Auth Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!verificationCode || !confirmationResult) return;
    setIsLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      router.push('/discover');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Invalid Code", description: "The verification code is incorrect." });
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
      toast({ variant: "destructive", title: "Google Login Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  if (isVerifying) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[3.5rem] p-12 bg-white text-center space-y-8">
           <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner"><Phone className="w-10 h-10 text-primary" /></div>
           <div className="space-y-2">
             <h2 className="text-3xl font-black tracking-tighter uppercase">Verification</h2>
             <p className="text-muted-foreground text-sm leading-relaxed">Enter code sent to {phoneNumber}.</p>
           </div>
           <div className="space-y-6">
              <Input type="text" placeholder="000000" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} className="rounded-2xl h-16 text-3xl font-black text-center tracking-[0.5em] bg-muted/20 border-none" />
              <Button onClick={handleVerifyPhoneCode} disabled={isLoading || verificationCode.length < 6} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Code'}
              </Button>
           </div>
           <Button variant="ghost" onClick={() => setIsVerifying(false)} className="w-full text-muted-foreground font-black uppercase text-[10px] tracking-widest"><ArrowLeft className="w-3 h-3 mr-2" />Method</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-black text-[10px] uppercase tracking-widest"><ArrowLeft className="w-4 h-4" />Home</Link>
      <div className="w-full max-w-md space-y-10 py-10">
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="shiny-icon p-4 rounded-[2.5rem] bg-primary/5"><Heart className="w-16 h-16 fill-primary text-primary animate-heartbeat" /></div>
            <span className="font-black text-2xl tracking-tighter text-primary">I LOVE YOU</span>
          </div>
          <p className="text-primary font-black text-[9px] uppercase tracking-[0.3em] opacity-60">Happiness is Mandatory ❤️</p>
        </div>
        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-16 bg-muted/30 p-1">
              <TabsTrigger value="email" className="rounded-2xl gap-2 text-[10px] font-black uppercase tracking-widest"><Mail className="w-3 h-3" />Email</TabsTrigger>
              <TabsTrigger value="phone" className="rounded-2xl gap-2 text-[10px] font-black uppercase tracking-widest"><Phone className="w-3 h-3" />Phone</TabsTrigger>
              <TabsTrigger value="social" className="rounded-2xl gap-2 text-[10px] font-black uppercase tracking-widest"><Chrome className="w-3 h-3" />Social</TabsTrigger>
            </TabsList>
            <CardContent className="pt-8 px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="age-check" checked={isAgeVerified} onCheckedChange={(checked) => setIsAgeVerified(checked as boolean)} className="mt-0.5 w-5 h-5 rounded-md border-2 border-primary" />
                      <label htmlFor="age-check" className="text-[10px] font-black leading-none text-primary uppercase tracking-widest cursor-pointer">I AM 18+ YEARS OLD</label>
                    </div>
                    <div className="flex items-start space-x-3 border-t border-primary/10 pt-4">
                      <Checkbox id="respect-check" checked={isRespectful} onCheckedChange={(checked) => setIsRespectful(checked as boolean)} className="mt-0.5 w-5 h-5 rounded-md border-2 border-primary" />
                      <label htmlFor="respect-check" className="text-[10px] font-black leading-none text-primary uppercase tracking-widest cursor-pointer">HAPPINESS PLEDGE</label>
                    </div>
                </div>
                <div className={cn("flex items-center space-x-3 p-4 rounded-[1.5rem] border-2 transition-all", isHuman ? "bg-green-50 border-green-200" : "bg-muted/20 border-dashed")}>
                  <Checkbox id="bot-check" checked={isHuman} disabled={isBotChecking} onCheckedChange={(checked) => handleBotCheck(checked as boolean)} className="w-5 h-5 rounded-md" />
                  <label htmlFor="bot-check" className={cn("text-[10px] font-black uppercase tracking-widest cursor-pointer", isHuman ? "text-green-600" : "text-muted-foreground")}>{isBotChecking ? "Verifying..." : isHuman ? "Verified Human" : "Confirm Human"}</label>
                </div>
              </div>
              <TabsContent value="email" className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[9px] font-black ml-2 uppercase opacity-60">Identity</Label>
                  <Input id="email" type="email" placeholder="heart@iloveu.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl h-14 bg-muted/20 border-none px-6 font-bold" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center ml-2">
                    <Label htmlFor="password" id="pass-label" className="text-[9px] font-black uppercase opacity-60">Secure Phrase</Label>
                    <Button variant="link" onClick={handleForgotPassword} className="text-[9px] font-black uppercase text-primary h-auto p-0">Forgot?</Button>
                  </div>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl h-14 bg-muted/20 border-none pl-6 pr-12 font-bold" />
                    <Button variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                  </div>
                </div>
                <Button onClick={handleEmailAuth} disabled={isLoading || isBotChecking || !email || !password} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'signin' ? 'Launch' : 'Join'}
                </Button>
                <Button variant="ghost" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">{mode === 'signin' ? "Sign Up" : "Sign In"}</Button>
              </TabsContent>
              <TabsContent value="phone" className="space-y-6">
                <Input id="phone" type="tel" placeholder="+1..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="rounded-2xl h-14 bg-muted/20 border-none px-6 font-bold" />
                <Button onClick={handleSendPhoneCode} disabled={isLoading || !phoneNumber || isBotChecking} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px]">Send Code</Button>
                <div id="recaptcha-container"></div>
              </TabsContent>
              <TabsContent value="social" className="space-y-6">
                <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading || isBotChecking} className="w-full h-16 rounded-2xl gap-3 font-black uppercase tracking-widest text-[10px] border-2"><Chrome className="w-4 h-4 text-primary" />Google</Button>
                <div className="text-center py-2"><span className="text-[9px] font-black uppercase text-muted-foreground">Community Login</span></div>
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