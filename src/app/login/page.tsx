"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck,
  CheckCircle2,
  Globe,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { generateKeyPair } from '@/lib/crypto';
import { COUNTRIES } from '@/lib/world-data';
import { useTranslation } from '@/components/providers/LanguageProvider';

function LoginContent() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);

  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      const hasAccepted = localStorage.getItem('iloveu_policy_accepted') === 'true';
      router.push(hasAccepted ? '/discover' : '/policy/agree');
    }
  }, [user, authLoading, router]);

  const handleAuth = async () => {
    if (!email || !password || !auth) return;
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const { publicKey, privateKey } = await generateKeyPair();
        localStorage.setItem(`spark_priv_${res.user.uid}`, privateKey);
        if (db) {
          await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid, email, country, publicKey,
            isAgeVerified, isRespectful, isHuman, preferredLanguage: language,
            createdAt: serverTimestamp()
          }, { merge: true });
        }
        router.push('/policy/agree');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Access Ripple", 
        description: "Verify your credentials and join again. ❤️" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <Link href="/" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <Heart className="w-16 h-16 fill-primary text-primary mx-auto animate-heartbeat" />
          <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">I LOVE U</h1>
        </div>

        <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b text-center">
            <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Mission Protocol</p>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 h-16 bg-white p-1 border-b">
              <TabsTrigger value="signin" className="font-black uppercase text-[10px] tracking-widest">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-black uppercase text-[10px] tracking-widest">Join</TabsTrigger>
            </TabsList>
            
            <CardContent className="p-10 space-y-6">
              {mode === 'signup' && (
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="rounded-xl border-none bg-muted/30 h-12"><SelectValue placeholder="Select Origin" /></SelectTrigger>
                  <SelectContent className="max-h-64">{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              )}
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="h-12 rounded-xl border-none bg-muted/30" />
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Secure Phrase" className="h-12 rounded-xl border-none bg-muted/30" />
              
              <Button onClick={handleAuth} disabled={isLoading} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest shadow-xl">
                {isLoading ? <Loader2 className="animate-spin" /> : mode === 'signin' ? 'Launch' : 'Join Revolution'}
              </Button>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}><LoginContent /></Suspense>;
}
