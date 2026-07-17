"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2, AtSign, Lock, Sparkles, KeyRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

/**
 * @fileOverview Unified Login Gateway.
 * Phase 3 — Real Login Protocol.
 * Identify returning hearts via secure email and phrase validation.
 */
export default function LoginPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !auth) return;
    
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast({ title: "Welcome Back", description: "Identity synchronized. ❤️" });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast({ 
        variant: "destructive", 
        title: "Access Ripple", 
        description: "Please check your credentials or reset your phrase. ❤️" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
       <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5">
            <Heart className="w-10 h-10 text-primary fill-primary animate-heartbeat" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Identify Heart</h1>
          <p className="text-muted-foreground font-medium italic">"Every spark starts with a signature."</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-6 border-b flex items-center justify-center gap-2">
             <KeyRound className="w-4 h-4 text-primary" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Secure Access Protocol</p>
          </div>

          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">Heart Signature</p>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email Address" 
                    className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Secure Phrase</p>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Your secure phrase" 
                    className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-18 rounded-[1.8rem] gradient-bg font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all gap-3"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Synchronize
                  </>
                )}
              </Button>

              {error && <p className="text-xs text-red-500 text-center font-bold">{error}</p>}
            </form>

            <div className="flex flex-col gap-4 text-center">
              <Link 
                href="/forgot-password" 
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Forgot Password?
              </Link>
              <Link 
                href="/signup" 
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Need a heart signature? <span className="text-primary underline">Join the Mission</span>
              </Link>
              <Link 
                href="/recovery" 
                className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:underline"
              >
                Recovery Hub
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
          Respect & Love is Mandatory ❤️ Prosperity Revolution
        </p>
      </div>
    </main>
  );
}
