
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2, ArrowLeft, ShieldCheck, AtSign, Lock } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

export default function LoginPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      toast({ 
        variant: "destructive", 
        title: "Access Ripple", 
        description: "Please check your credentials and try again. ❤️" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 text-primary fill-primary mx-auto animate-heartbeat" />
          <h1 className="text-4xl font-bold tracking-tighter uppercase">🔐 Sign In</h1>
          <p className="text-muted-foreground font-medium italic">Identify your heart and continue the mission.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Secure Phrase" 
                  className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold" 
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-xs shadow-xl active:scale-95 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login ❤️"}
              </Button>
            </form>

            <Link 
              href="/signup" 
              className="block text-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              Need an account? Join the Mission
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
