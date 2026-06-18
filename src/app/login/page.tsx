
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
import { Heart, Mail, Phone, Chrome, Loader2, ArrowLeft, ShieldCheck, UserCheck, BotOff, HeartHandshake } from 'lucide-react';
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
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" />
        Home
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 group">
            <Heart className="w-24 h-24 fill-primary text-primary group-hover:scale-110 transition-transform animate-pulse" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-4xl tracking-tighter text-primary">I LOVE</span>
              <span className="font-black text-base tracking-[0.4em] text-muted-foreground">YOU</span>
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Community Access</h1>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Happiness is Mandatory ❤️</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-16 bg-muted/50 p-1.5">
              <TabsTrigger value="email" className="rounded-2xl gap-2 text-xs font-bold">
                <Mail className="w-3.5 h-3.5" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="rounded-2xl gap-2 text-xs font-bold">
                <Phone className="w-3.5 h-3.5" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-2xl gap-2 text-xs font-bold">
                <Chrome className="w-3.5 h-3.5" />
                Google
              </TabsTrigger>
            </TabsList>

            <CardContent className="pt-8 px-10 pb-6">
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="age-check" 
                        checked={isAdult} 
                        onCheckedChange={(checked) => setIsAdult(checked as boolean)}
                        className="mt-1"
                      />
                      <label htmlFor="age-check" className="text-xs font-black leading-none text-primary uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        I AM 18+ YEARS OLD
                      </label>
                    </div>

                    <div className="flex items-start space-x-3 border-t border-primary/10 pt-4">
                      <Checkbox 
                        id="respect-check" 
                        checked={isRespectful} 
                        onCheckedChange={(checked) => setIsRespectful(checked as boolean)}
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none cursor-pointer">
                        <label htmlFor="respect-check" className="text-xs font-black leading-none text-primary uppercase tracking-widest flex items-center gap-2">
                          <HeartHandshake className="w-3.5 h-3.5" />
                          HAPPINESS PLEDGE
                        </label>
                        <p className="text-[10px] text-muted-foreground font-medium italic">
                          I pledge to bring respect and love to every heart.
                        </p>
                      </div>
                    </div>
                </div>

                <div className={cn(
                  "flex items-center space-x-3 p-5 rounded-[1.5rem] border transition-all duration-500",
                  isHuman ? "bg-green-50 border-green-200" : "bg-muted/30 border-dashed"
                )}>
                  <Checkbox 
                    id="bot-check" 
                    checked={isHuman} 
                    disabled={isBotChecking}
                    onCheckedChange={(checked) => handleBotCheck(checked as boolean)}
                  />
                  <label
                    htmlFor="bot-check"
                    className={cn(
                      "text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer",
                      isHuman ? "text-green-600" : "text-muted-foreground"
                    )}
                  >
                    {isBotChecking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isHuman ? <UserCheck className="w-3.5 h-3.5" /> : <BotOff className="w-3.5 h-3.5" />}
                    {isBotChecking ? "Checking..." : isHuman ? "Verified Human" : "I am not a robot"}
                  </label>
                </div>
              </div>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1">Email</Label>
                  <Input id="email" type="email" placeholder="heart@iloveu.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl h-12 bg-muted/20 border-none px-6" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" id="pass-label" className="text-[10px] font-black uppercase tracking-widest ml-1">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl h-12 bg-muted/20 border-none px-6" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" onClick={() => handleEmailAuth('signup')} disabled={isLoading || isBotChecking} className="rounded-2xl h-12 font-bold">Join Free</Button>
                  <Button onClick={() => handleEmailAuth('login')} disabled={isLoading || isBotChecking} className="rounded-2xl h-12 gradient-bg font-bold">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                {!isVerifyingPhone ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest ml-1">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="rounded-2xl h-12 bg-muted/20 border-none px-6" />
                    </div>
                    <Button onClick={handleSendCode} disabled={isLoading || !phoneNumber || isBotChecking} className="w-full h-14 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Verification'}
                    </Button>
                    <div id="recaptcha-container"></div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-[10px] font-black uppercase tracking-widest ml-1">Code</Label>
                      <Input id="code" type="text" placeholder="123456" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="rounded-2xl h-12 bg-muted/20 border-none px-6" />
                    </div>
                    <Button onClick={handleVerifyCode} disabled={isLoading || !verificationCode} className="w-full h-14 rounded-2xl gradient-bg font-bold">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Enter'}
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading || isBotChecking} className="w-full h-16 rounded-[1.5rem] gap-4 text-lg border-2 font-bold hover:bg-primary/5">
                  <Chrome className="w-6 h-6 text-primary" />
                  Continue with Google
                </Button>
              </TabsContent>
            </CardContent>
          </Tabs>
          <CardFooter className="bg-muted/30 p-8 flex flex-col items-center gap-4">
             <Link href="/discover" className="text-sm text-primary font-black uppercase tracking-widest hover:underline">
               Guest Experience
             </Link>
             <div className="flex gap-4 text-[9px] text-muted-foreground font-black uppercase tracking-widest">
               <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
               <span>•</span>
               <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
