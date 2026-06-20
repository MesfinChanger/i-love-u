
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  MessageCircle, 
  Globe, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sparkAssistant, type SparkAssistantInput } from '@/ai/flows/spark-assistant-flow';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export function SparkAssistant() {
  const { user } = useUser();
  const db = useFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Welcome to the Revolution! I am your Spark Assistant. I have full access to guide you through our platform. How can I help you spread happiness today? ❤️" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-spark-assistant', handleToggle);
    return () => window.removeEventListener('toggle-spark-assistant', handleToggle);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const result = await sparkAssistant({ 
        message: userMessage, 
        history,
        userContext: {
          nickname: profile?.publicNickname || profile?.displayName,
          isSeller: profile?.isSeller,
          country: profile?.country,
          isAdvertiser: profile?.isAdvertiser
        }
      });
      setMessages(prev => [...prev, { role: 'model', text: result.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a small moment of reflection. Please try again in a heartbeat! ✨" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] sm:bottom-8">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full gradient-bg shadow-2xl shadow-primary/40 p-0 relative group border-4 border-white animate-bounce hover:animate-none active:scale-95 transition-all"
          aria-label="Open AI Assistant"
        >
          <Heart className="w-8 h-8 text-white fill-white group-hover:scale-110 transition-transform animate-heartbeat" />
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full text-primary shadow-sm border border-primary/20">
             <Sparkles className="w-3 h-3" />
          </div>
        </Button>
      )}

      {/* Assistant Window */}
      {isOpen && (
        <Card className="w-[calc(100vw-3rem)] sm:w-[400px] h-[540px] rounded-[2.5rem] shadow-[0_40px_100px_-10px_rgba(0,0,0,0.3)] border-none overflow-hidden flex flex-col bg-white animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
          <CardHeader className="gradient-bg p-6 flex flex-row items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="leading-none">
                  <CardTitle className="text-white text-lg font-black tracking-tighter">Spark Guide</CardTitle>
                  <p className="text-[9px] text-white/70 font-black uppercase tracking-[0.2em] mt-1">AI Mission Support</p>
                </div>
             </div>
             <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full">
               <X className="w-5 h-5" />
             </Button>
          </CardHeader>
          
          <div className="bg-primary/5 px-6 py-3 flex items-center gap-3 border-b">
             <Info className="w-3.5 h-3.5 text-primary shrink-0" />
             <p className="text-[9px] font-bold text-primary/70 leading-tight uppercase tracking-tight">
                Ask about our mission to end poverty, how to use Discovery, or how to launch free ads.
             </p>
          </div>

          <CardContent className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  "max-w-[85%] px-4 py-3 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-muted/50 text-slate-700 rounded-tl-none border'
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                 <div className="bg-muted/50 px-4 py-3 rounded-[1.5rem] rounded-tl-none border">
                    <Loader2 className="w-4 h-4 animate-spin text-primary opacity-40" />
                 </div>
              </div>
            )}
          </CardContent>

          <div className="p-6 border-t bg-slate-50/50">
             <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="How can I support you?"
                  className="rounded-2xl bg-white border-none shadow-inner h-12 px-5 font-bold text-sm"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isLoading}
                  className="h-12 w-12 rounded-2xl gradient-bg shrink-0 shadow-lg shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                </Button>
             </form>
             <div className="flex items-center justify-center gap-2 mt-4 opacity-30">
                <Globe className="w-3 h-3" />
                <p className="text-[8px] font-black uppercase tracking-widest text-center">Ending World Poverty Together ❤️ Reaching Every City</p>
             </div>
          </div>
        </Card>
      )}
    </div>
  );
}
