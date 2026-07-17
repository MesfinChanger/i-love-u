
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2, Sparkles, AtSign, Lock } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !auth) return;
    
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      if (db) {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          email: email.trim(),
          accountType: 'Member',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      toast({ title: "Welcome to the Revolution!", description: "Your heart signature has been secured. ❤️" });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Access Ripple", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-4xl font-bold tracking-tighter uppercase">✨ Join</h1>
          <p className="text-muted-foreground font-medium italic">Create your permanent identity.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleJoin} className="space-y-4">
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
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Create Password" 
                  className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Identity ❤️"}
              </Button>
            </form>

            <Link 
              href="/login" 
              className="block text-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account? Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
