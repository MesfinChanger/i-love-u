"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  signInAnonymously 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
  Sparkles,
  Ghost
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Login Hub Protocol.
 * A high-fidelity gateway for hearts to identify themselves and continue the mission.
 */
export default function LoginPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !auth) return;
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast({ title: "Welcome Back", description: "Identity synchronized. ❤️" });
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({ 
        variant: "destructive", 
        title: "Access Ripple", 
        description: "Please check your secure phrase and try again. ❤️" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      const result = await signInAnonymously(auth);
      if (db) {
         await setDoc(doc(db, 'users', result.user.uid), {
           uid: result.user.uid,
           name: "Guest Heart",
           email: "Guest Account",
           accountType: "guest",
           createdAt: serverTimestamp(),
           lastLogin: serverTimestamp()
         }, { merge: true });
      }
      toast({ title: "Guest Session Launched", description: "Welcome to the Revolution! ❤️" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Guest Access Ripple", description: "Could not launch guest session." });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-primary w-10 h-10 opacity-20" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <Link href="/" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5 transition-transform hover:rotate-6">
            <Heart className="w-10 h-10 fill-primary text-primary animate-heartbeat" />
          </div>
          <div className="space-y-2">
            <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">IDENTIFY</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Prosperity Revolution</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b text-center relative overflow-hidden">
            <div className="absolute top-4 right-4">
               <Sparkles className="w-4 h-4 text-primary opacity-20" />
            </div>
            <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Mission Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email Address" 
                    className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" 
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Secure Phrase" 
                    className="h-14 pl-12 pr-12 rounded-2xl border-none bg-muted/30 font-bold" 
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || !email || !password} 
                className="w-full h-16 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 gradient-bg shadow-primary/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login ❤️'}
              </Button>
            </form>

            <div className="relative flex items-center gap-4">
               <div className="flex-grow h-px bg-slate-100" />
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">or</span>
               <div className="flex-grow h-px bg-slate-100" />
            </div>

            <div className="grid gap-4">
              <Button variant="outline" onClick={handleGuestLogin} disabled={isLoading} className="w-full h-14 rounded-2xl border-2 font-black uppercase text-[9px] tracking-widest gap-2">
                 <Ghost className="w-4 h-4" /> Explore as Guest
              </Button>
              
              <Link 
                href="/signup" 
                className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
              >
                Need an account? Join the Mission
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
          Respect & Love is Mandatory ❤️ Prosperity Revolution
        </p>
      </div>
    </div>
  );
}
