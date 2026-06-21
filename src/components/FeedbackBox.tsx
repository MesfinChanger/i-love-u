
'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  Heart, 
  ShieldCheck, 
  Globe, 
  Zap,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

export function FeedbackBox() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<'app' | 'mission' | 'story'>('mission');
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(true);
      setIsSuccess(false);
      setText('');
    };
    window.addEventListener('toggle-feedback-box', handleToggle);
    return () => window.removeEventListener('toggle-feedback-box', handleToggle);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !text.trim() || isSending) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        uid: user.uid,
        email: user.email || 'anonymous',
        category,
        text: text.trim(),
        timestamp: serverTimestamp(),
      });
      setIsSuccess(true);
      setTimeout(() => setIsOpen(false), 3000);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not send heartbeat." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
        <div className="bg-primary/5 p-10 text-center border-b relative">
           <div className="absolute top-6 right-6">
              <Sparkles className="w-6 h-6 text-primary opacity-20 animate-pulse" />
           </div>
           <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-4 ring-primary/5 mb-4 transition-transform hover:rotate-6">
              <MessageSquare className="w-10 h-10 text-primary" />
           </div>
           <DialogTitle className="text-3xl font-black tracking-tighter uppercase">{t('feedback.title')}</DialogTitle>
           <DialogDescription className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mt-2">
             {t('feedback.subtitle')}
           </DialogDescription>
        </div>
        
        <div className="p-8">
          {isSuccess ? (
            <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-green-200">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">{t('feedback.successTitle')}</h3>
                  <p className="text-sm text-muted-foreground italic font-medium leading-relaxed max-w-[240px] mx-auto">
                    "{t('feedback.successDesc')}"
                  </p>
               </div>
               <div className="pt-4 flex items-center justify-center gap-2 opacity-30">
                  <Globe className="w-3.5 h-3.5" />
                  <p className="text-[8px] font-black uppercase tracking-widest">Eliminating Poverty Together</p>
               </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('feedback.category')}</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-bold text-base focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="mission" className="rounded-xl py-3 font-bold">{t('feedback.mission')}</SelectItem>
                    <SelectItem value="story" className="rounded-xl py-3 font-bold">{t('feedback.story')}</SelectItem>
                    <SelectItem value="app" className="rounded-xl py-3 font-bold">{t('feedback.app')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message</Label>
                <Textarea 
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={t('feedback.placeholder')}
                  className="min-h-[140px] rounded-[2rem] bg-muted/30 border-none p-6 font-medium italic text-sm leading-relaxed focus-visible:ring-2 focus-visible:ring-primary/20"
                  required
                />
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl space-y-3 shadow-xl relative overflow-hidden group">
                 <Zap className="absolute -bottom-2 -right-2 w-12 h-12 text-primary opacity-5 group-hover:rotate-12 transition-transform" />
                 <div className="flex items-center gap-3 text-primary">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Confidential Protocol</span>
                 </div>
                 <p className="text-[9px] text-white/70 font-bold leading-relaxed uppercase tracking-widest">
                    Your feedback is direct and private. We use it to ensure the "Respect & Love" policy is enforced globally.
                 </p>
              </div>

              <Button 
                type="submit" 
                disabled={!text.trim() || isSending}
                className="w-full h-16 rounded-2xl gradient-bg text-lg font-black shadow-xl shadow-primary/20 active:scale-95 transition-all gap-3"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {t('feedback.submit')}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
