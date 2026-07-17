'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth, db } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Ghost, 
  LogIn, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview Universal Auth Gate Protocol.
 * A high-fidelity dialog providing frictionless sign-in access for guests from any page.
 */
export function AuthGateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-auth-gate', handleOpen);
    return () => window.removeEventListener('open-auth-gate', handleOpen);
  }, []);

  const handleGuestLogin = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Bridge Disconnected",
        description: "The authentication bridge is waiting for cloud credentials. ❤️"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInAnonymously(auth);
      
      console.log("Guest:", result.user.uid);

      if (db) {
         await setDoc(doc(db, 'users', result.user.uid), {
           uid: result.user.uid,
           name: "Guest Heart",
           email: "Guest Account",
           accountType: "Guest",
           createdAt: serverTimestamp(),
           lastLogin: serverTimestamp()
         }, { merge: true });
      }

      setIsOpen(false);
      toast({ 
        title: "Guest Session Launched", 
        description: "Welcome! You are exploring as a guest heart. ❤️" 
      });

      router.push("/");
    } catch (error: any) {
      console.error(error);
      
      let title = "Guest Access Ripple";
      let message = "Could not launch guest session. Please check your connection. ❤️";

      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/admin-restricted-operation') {
        title = "Mission Configuration Required";
        message = "Anonymous Sign-in is currently disabled or restricted in your project. Please enable it in your Firebase Console. ✨";
      }

      toast({ 
        variant: "destructive", 
        title: title, 
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white animate-in zoom-in-95 duration-300">
        <div className="bg-primary/5 p-10 text-center border-b relative overflow-hidden group">
           <div className="absolute top-6 right-6">
              <Sparkles className="w-6 h-6 text-primary opacity-20 animate-pulse" />
           </div>
           <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5 mb-4 transition-transform hover:rotate-6">
              <Heart className="w-10 h-10 text-primary fill-primary animate-heartbeat" />
           </div>
           <DialogTitle className="text-3xl font-black tracking-tighter uppercase leading-none">Identify Your Heart</DialogTitle>
           <DialogDescription className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-3">
             Mission Protocol: Authentication Required
           </DialogDescription>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <p className="text-base text-center text-muted-foreground font-medium italic leading-relaxed">
              "Every spark needs a signature." Launch a guest session or secure your permanent identity to interact with the community.
            </p>

            <div className="grid gap-4">
              <Button 
                onClick={handleGuestLogin} 
                disabled={isLoading}
                className="h-20 rounded-[1.8rem] bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-900 font-black uppercase tracking-[0.2em] text-[11px] shadow-sm transition-all active:scale-95 gap-3"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <Ghost className="w-5 h-5 text-primary" />
                    Launch as Guest
                  </>
                )}
              </Button>

              <div className="relative flex items-center gap-4 py-2">
                 <div className="flex-grow h-px bg-slate-100" />
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">or</span>
                 <div className="flex-grow h-px bg-slate-100" />
              </div>

              <Button 
                asChild
                className="h-20 rounded-[1.8rem] gradient-bg font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 transition-all active:scale-95 gap-3"
              >
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <LogIn className="w-5 h-5" />
                  Permanent Identity
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] space-y-4 shadow-xl relative overflow-hidden group">
             <Zap className="absolute -bottom-2 -right-2 w-16 h-16 text-primary opacity-5 group-hover:rotate-12 transition-transform" />
             <div className="flex items-center gap-3 text-primary">
                <ShieldCheck className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Universal Protocol</span>
             </div>
             <p className="text-[10px] text-white/70 font-bold leading-relaxed uppercase tracking-widest italic">
                Guests can explore, but permanent members build prosperity through job creation. Respect is Mandatory. ❤️
             </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
