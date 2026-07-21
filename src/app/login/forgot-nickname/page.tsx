"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  Mail,
  CheckCircle2,
  Sparkles,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * @fileOverview Identity Recovery Protocol (Forgot Nickname).
 */
export default function ForgotNicknamePage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRetrieveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const q = query(collection(db, 'users'), where('email', '==', email.trim().toLowerCase()), limit(1));
      await getDocs(q);
      setIsSent(true);
      toast({ title: "Protocol Initiated", description: "Identity reminder dispatched. ❤️" });
    } catch (error) {
      toast({ variant: "destructive", title: "Access Ripple", description: "Failed to connect." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <Link href="/login" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-[10px] uppercase tracking-widest"><ArrowLeft className="w-3.5 h-3.5" /> Back to Login</Link>
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-6 flex flex-col items-center">
            <Heart className="w-16 h-16 fill-primary text-primary animate-heartbeat" />
            <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase">IDENTITY</h1>
        </div>

        <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b flex justify-center gap-2"><User className="w-5 h-5 text-primary" /><p className="text-[10px] font-black uppercase text-primary">Forgot Username</p></div>
          <CardContent className="p-10 space-y-8">
            {isSent ? (
              <div className="text-center space-y-6 animate-in fade-in duration-500">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                <h2 className="text-xl font-black uppercase">Check Your Heart</h2>
                <Button asChild className="w-full h-16 rounded-2xl gradient-bg font-black uppercase text-[10px] shadow-xl"><Link href="/login">Return to Login</Link></Button>
              </div>
            ) : (
              <form onSubmit={handleRetrieveRequest} className="space-y-8">
                <div className="space-y-4"><p className="text-[10px] font-black uppercase ml-1">REGISTERED EMAIL</p><Input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="h-12 border-none border-b-2 rounded-none font-bold" /></div>
                <Button type="submit" disabled={isLoading || !email} className="w-full h-20 rounded-[2rem] gradient-bg font-black uppercase text-sm shadow-xl transition-all">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Find Username</>}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
