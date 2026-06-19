
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Mail, Phone, Chrome, Loader2, ArrowLeft, ShieldCheck, UserCheck, BotOff, HeartHandshake, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const { auth } = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [isBotChecking, setIsBotChecking] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/discover');
    }
  }, [user, authLoading, router]);

  const validateAccess = () => {
    if (!isAdult) {
      toast({
        variant: "destructive",
        title: "Age Verification Required",
        description: "You must be 18 or older to use I Love U."
      });
      return false;
    }
    if (!isRespectful) {
      toast({
        variant: "destructive",
        title: "Happiness Pledge Required",
        description: "You must agree to treat everyone with respect and love."
      });
      return false;
    }
    if (!isHuman) {
      toast({
        variant: "destructive",
        title: "Security Check Required",
        description: "Please confirm you are not a robot."
      });
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
        toast({
          title: "Verification Successful",
          description: "Human status confirmed. Welcome home! ✨"
        });
      }, 800);
    } else {
      setIsHuman(false);
    }
  };

  const handleEmailAuth = async (type: 'login' | 'signup') => {
    if (!validateAccess()) return;
    setIsLoading(true);
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/discover');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message
      });
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
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handleSendCode = async () => {
    if (!validateAccess()) return;
    setIsLoading(true);
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setIsVerifyingPhone(true);
      toast({
        title: "Code Sent",
        description: "Check your phone for the happiness code."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Phone Auth Failed",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      router.push('/discover');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code you entered is incorrect."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-black text-sm uppercase tracking-widest">
        <ArrowLeft className="w-5 h-5" />
        Home
      </Link>

      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-8 group">
            <div className="shiny-icon p-6 rounded-[3.5rem] bg-primary/5 shadow-inner">
              <Heart className="w-40 h-40 fill-primary text-primary group-hover:scale-110 transition-transform animate-heartbeat" />
            </div>
            <div className="flex flex-col text-center leading-none">
              <span className="font-black text-7xl tracking-tighter text-primary shiny-text">I LOVE</span>
              <span className="font-black text-3xl tracking-[0.5em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight uppercase pt-6">Community Access</h1>
            <p className="text-primary font-black text-xs uppercase tracking-[0.3em]">The AI Dating Revolution</p>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-2">Happiness is Mandatory ❤️</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-20 bg-muted/50 p-2">
              <TabsTrigger value="email" className="rounded-3xl gap-2 text-xs font-black uppercase tracking-widest">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="rounded-3xl gap-2 text-xs font-black uppercase tracking-widest">
                <Phone className="w-4 h-4" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-3xl gap-2 text-xs font-black uppercase tracking-widest">
                <Chrome className="w-4 h-4" />
                Google
              </TabsTrigger>
            </TabsList>

            <CardContent className="pt-10 px-10 pb-8">
              <div className="space-y-6 mb-10">
                <div className="flex flex-col gap-6 bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/10">
                    <div className="flex items-start space-x-4">
                      <Checkbox 
                        id="age-check" 
                        checked={isAdult} 
                        onCheckedChange={(checked) => setIsAdult(checked as boolean)}
                        className="mt-1 w-6 h-6 rounded-lg border-2 border-primary"
                      />
                      <label htmlFor="age-check" className="text-xs font-black leading-none text-primary uppercase tracking-widest flex items-center gap-3 cursor-pointer">
                        <ShieldCheck className="w-4 h-4" />
                        I AM 18+ YEARS OLD
                      </label>
                    </div>

                    <div className="flex items-start space-x-4 border-t border-primary/10 pt-6">
                      <Checkbox 
                        id="respect-check" 
                        checked={isRespectful} 
                        onCheckedChange={(checked) => setIsRespectful(checked as boolean)}
                        className="mt-1 w-6 h-6 rounded-lg border-2 border-primary"
                      />
                      <div className="grid gap-2 leading-none cursor-pointer">
                        <label htmlFor="respect-check" className="text-xs font-black leading-none text-primary uppercase tracking-widest flex items-center gap-3">
                          <HeartHandshake className="w-4 h-4" />
                          HAPPINESS PLEDGE
                        </label>
                        <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed">
                          "I pledge to bring respect and love to every heart in this community."
                        </p>
                      </div>
                    </div>
                </div>

                <div className={cn(
                  "flex items-center space-x-4 p-6 rounded-[2rem] border-2 transition-all duration-500 shadow-sm",
                  isHuman ? "bg-green-50 border-green-200" : "bg-muted/30 border-dashed border-muted-foreground/20"
                )}>
                  <Checkbox 
                    id="bot-check" 
                    checked={isHuman} 
                    disabled={isBotChecking}
                    onCheckedChange={(checked) => handleBotCheck(checked as boolean)}
                    className="w-6 h-6 rounded-lg border-2 border-muted-foreground/30 data-[state=checked]:border-green-600"
                  />
                  <label
                    htmlFor="bot-check"
                    className={cn(
                      "text-xs font-black uppercase tracking-widest flex items-center gap-3 cursor-pointer",
                      isHuman ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    {isBotChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : isHuman ? <UserCheck className="w-4 h-4" /> : <BotOff className="w-4 h-4" />}
                    {isBotChecking ? "Verifying..." : isHuman ? "Verified Human" : "Confirm Human Status"}
                  </label>
                </div>
              </div>

              <TabsContent value="email" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Email Identity</Label>
                  <Input id="email" type="email" placeholder="heart@iloveu.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-[1.5rem] h-14 bg-muted/20 border-none px-8 text-lg font-bold" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" id="pass-label" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Secure Phrase</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-[1.5rem] h-14 bg-muted/20 border-none px-8 text-lg font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" onClick={() => handleEmailAuth('signup')} disabled={isLoading || isBotChecking} className="rounded-[1.5rem] h-16 font-black uppercase tracking-widest text-xs border-2">Join Free</Button>
                  <Button onClick={() => handleEmailAuth('login')} disabled={isLoading || isBotChecking} className="rounded-[1.5rem] h-16 gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Heart'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                {!isVerifyingPhone ? (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="rounded-[1.5rem] h-14 bg-muted/20 border-none px-8 text-lg font-bold" />
                    </div>
                    <Button onClick={handleSendCode} disabled={isLoading || !phoneNumber || isBotChecking} className="w-full h-16 rounded-[1.5rem] gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Verification'}
                    </Button>
                    <div id="recaptcha-container"></div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Verification Code</Label>
                      <Input id="code" type="text" placeholder="123456" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="rounded-[1.5rem] h-14 bg-muted/20 border-none px-8 text-2xl font-black text-center tracking-[0.5em]" />
                    </div>
                    <Button onClick={handleVerifyCode} disabled={isLoading || !verificationCode} className="w-full h-16 rounded-[1.5rem] gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Enter'}
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="social" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading || isBotChecking} className="w-full h-20 rounded-[2rem] gap-5 text-xl border-4 font-black hover:bg-primary/5 transition-all shadow-lg active:scale-95">
                  <Chrome className="w-8 h-8 text-primary" />
                  Continue with Google
                </Button>
                <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Fast Access for Spark Lovers</p>
              </TabsContent>
            </CardContent>
          </Tabs>
          <CardFooter className="bg-muted/30 p-10 flex flex-col items-center gap-6">
             <Link href="/discover" className="text-sm text-primary font-black uppercase tracking-[0.3em] hover:underline flex items-center gap-2 group">
               <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
               Guest Experience
             </Link>
             <div className="flex gap-6 text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
               <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Shield</Link>
               <span>•</span>
               <Link href="/terms" className="hover:text-primary transition-colors">Dating Pledge</Link>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
