"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2, ArrowLeft, ShieldCheck, User, AtSign, Lock } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Join Gateway (Sign Up).
 * Frictionless registration for new hearts entering the Prosperity Revolution.
 */
export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !nickname) return;
    
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth!, email.trim(), password);
      
      const userData = {
        uid: res.user.uid,
        email: email.trim(),
        username: nickname.trim(),
        displayName: nickname.trim(),
        accountType: 'Member',
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db!, 'users', res.user.uid), userData);

      toast({ title: "Welcome to the Revolution!", description: "Your heart signature has been secured. ❤️" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Access Ripple", description: error.message || "Could not establish heart signature." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <Link href="/" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <Heart className="w-16 h-16 fill-primary text-primary mx-auto animate-heartbeat" />
          <div className="space-y-2">
            <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">JOIN</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">PROSPERITY REVOLUTION</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b text-center">
            <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Identity Registry Protocol</p>
          </div>

          <CardContent className="p-10">
            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Community Nickname" className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" required />
                </div>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Secure Phrase" className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" required />
                </div>
              </div>

              <Button type="submit" disabled={isLoading || !email || !password || !nickname} className="w-full h-16 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 gradient-bg shadow-primary/20">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Mission'}
              </Button>

              <p className="text-center text-[10px] font-bold text-muted-foreground">
                Already part of the revolution? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
