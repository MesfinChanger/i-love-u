"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  Mail,
  CheckCircle2,
  Sparkles,
  User,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * @fileOverview Identity Recovery Protocol (Forgot Nickname).
 * Connects to Firestore 'users' collection to retrieve community nickname via email.
 */
export default function ForgotNicknamePage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const handleRetrieveRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your registered email. ❤️",
      });
      return;
    }

    if (!db) {
      toast({
        variant: "destructive",
        title: "Bridge Disconnected",
        description: "Firestore is waiting for cloud credentials. ✨",
      });
      return;
    }

    setIsLoading(true);
    setMessage('');
    try {
      // Connect to Firestore: users collection
      const usersQuery = query(
        collection(db, 'users'), 
        where('email', '==', cleanEmail), 
        limit(1)
      );
      
      const querySnapshot = await getDocs(usersQuery);
      
      if (!querySnapshot.empty) {
        // Heart found in registry
        setIsSent(true);
        setMessage("Username recovery request submitted.");
        toast({
          title: "Identity Found",
          description: "A nickname reminder has been dispatched to your email. ❤️",
        });
      } else {
        // No heart found with this email (Security: Show generic success to prevent enumeration)
        setIsSent(true);
        setMessage("Username recovery request submitted.");
      }
    } catch (error: any) {
      console.error("Retrieval ripple:", error);
      toast({
        variant: "destructive",
        title: "Access Ripple",
        description: "Failed to connect to the Identity Registry. ❤️",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <Link href="/login" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Login
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-6">
            <Heart className="w-16 h-16 fill-primary text-primary animate-heartbeat" />
            <div className="space-y-2">
              <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">IDENTITY</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">PROSPERITY REVOLUTION</p>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.08)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b border-primary/10">
             <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Forgot Username</p>
             </div>
          </div>

          <CardContent className="p-10 space-y-8">
            {isSent ? (
              <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-dashed border-green-200">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Check Your Heart</h2>
                  <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                    {message} ❤️ <br/> If an account exists for <strong>{email}</strong>, you will receive a reminder.
                  </p>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3 text-left">
                    <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-800 font-black uppercase tracking-tight">
                      Note: Remember to check your <span className="underline">Spam</span> folder.
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRetrieveRequest} className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">REGISTERED EMAIL</p>
                  <div className="relative">
                    <Input 
                      type="email" 
                      required
                      placeholder="Email address"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="h-12 border-none border-b-2 border-slate-100 rounded-none px-0 font-bold text-base focus-visible:ring-0 focus-visible:border-primary transition-all" 
                    />
                    <Mail className="absolute right-0 bottom-3 w-4 h-4 text-slate-200" />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading || !email} 
                  className={cn(
                    "w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-xl active:scale-95 transition-all",
                    (!email) ? "bg-slate-200 text-slate-400" : "gradient-bg shadow-primary/20"
                  )}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4" />
                      Find Username
                    </span>
                  )}
                </Button>

                <p className="text-[9px] text-center text-slate-300 uppercase font-black tracking-[0.3em]">
                  © {currentYear} • Identity Retrieval Protocol
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
