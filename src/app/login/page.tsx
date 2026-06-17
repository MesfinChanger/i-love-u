
'use client';

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
import { Heart, Mail, Phone, Chrome, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/discover');
    }
  }, [user, authLoading, router]);

  const handleEmailAuth = async (type: 'login' | 'signup') => {
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
    setIsLoading(true);
    setupRecaptcha();
    const appVerifier = (window as any).recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setIsVerifyingPhone(true);
      toast({
        title: "Code Sent",
        description: "Check your phone for the verification code."
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
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 font-black text-4xl tracking-tighter text-primary">
            <Heart className="w-10 h-10 fill-primary" />
            <span>SPARK</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to find your perfect match</p>
        </div>

        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-14 bg-muted/50 p-1">
              <TabsTrigger value="email" className="rounded-xl gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="rounded-xl gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-xl gap-2">
                <Chrome className="w-4 h-4" />
                Social
              </TabsTrigger>
            </TabsList>

            <CardContent className="pt-8 px-8">
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleEmailAuth('signup')}
                    disabled={isLoading}
                    className="rounded-xl"
                  >
                    Sign Up
                  </Button>
                  <Button 
                    onClick={() => handleEmailAuth('login')}
                    disabled={isLoading}
                    className="rounded-xl gradient-bg"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                {!isVerifyingPhone ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={handleSendCode}
                      disabled={isLoading || !phoneNumber}
                      className="w-full rounded-xl gradient-bg"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Verification Code'}
                    </Button>
                    <div id="recaptcha-container"></div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="code">Verification Code</Label>
                      <Input 
                        id="code" 
                        type="text" 
                        placeholder="123456" 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={handleVerifyCode}
                      disabled={isLoading || !verificationCode}
                      className="w-full rounded-xl gradient-bg"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Sign In'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsVerifyingPhone(false)}
                      className="w-full text-xs"
                    >
                      Change Phone Number
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-14 rounded-xl gap-3 text-lg border-2 hover:bg-accent"
                >
                  <Chrome className="w-6 h-6" />
                  Continue with Google
                </Button>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground px-8">
                    By continuing, you agree to Spark's Terms of Service and Privacy Policy.
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
          <CardFooter className="bg-muted/30 p-6 flex flex-col gap-2">
             <Link href="/discover" className="text-sm text-primary font-bold hover:underline">
               Browse as Guest (Optional)
             </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
