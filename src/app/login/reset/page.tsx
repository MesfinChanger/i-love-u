"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Secure Recovery Protocol Page.
 * Hardened with Bridge Detection and Delivery Heartbeat to ensure hearts receive reset links.
 */
export default function ResetPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your registered email to receive a link. ❤️",
      });
      return;
    }

    if (!auth) {
      toast({
        variant: "destructive",
        title: "Bridge Disconnected",
        description: "The secure recovery bridge is waiting for cloud credentials. Please check your connection. ✨",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setIsSent(true);
      toast({
        title: "Email Dispatched",
        description: "Check your inbox (and spam folder) for a secure recovery link. ❤️",
      });
    } catch (error: any) {
      console.error("Reset Error Ripple:", error);
      
      let message = "We couldn't find a heart associated with that email. Please verify and try again.";
      
      if (error.code === 'auth/too-many-requests') {
        message = "Too many recovery attempts. Please wait a heartbeat and try again for security. ❤️";
      } else if (error.code === 'auth/invalid-email') {
        message = "The email format is invalid. Please double-check your entry. ✨";
      }

      toast({
        variant: "destructive",
        title: "Access Ripple",
        description: message,
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
              <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">RECOVERY</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">PROSPERITY REVOLUTION</p>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.08)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b border-primary/10">
             <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Secure Recovery Protocol</p>
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
                    A secure recovery link has been sent to <strong>{email}</strong>. 
                  </p>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 text-left">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 font-black uppercase tracking-tight">
                      Important: Look for an email from <strong>noreply@iLoveU.com</strong>. If you don't see it within 60 seconds, please check your <span className="underline">Spam or Junk</span> folder.
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                  <Link href="/login">Return to Login</Link>
                </Button>
                <button onClick={() => setIsSent(false)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                  Try a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetRequest} className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 ml-1">REGISTERED EMAIL</p>
                  <div className="relative">
                    <Input 
                      type="email" 
                      required
                      placeholder="heart@example.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="h-12 border-none border-b-2 border-slate-100 rounded-none px-0 font-bold text-base focus-visible:ring-0 focus-visible:border-primary transition-all" 
                    />
                    <Mail className="absolute right-0 bottom-3 w-4 h-4 text-slate-200" />
                  </div>
                  <p className="text-[9px] text-muted-foreground italic font-medium">
                    "Every heart is valued." Enter the email associated with your mission to reset your secure phrase.
                  </p>
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
                      Dispatch Link
                    </span>
                  )}
                </Button>

                <p className="text-[9px] text-center text-slate-300 uppercase font-black tracking-[0.3em]">
                  © {currentYear} • Global Security Protocol
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
