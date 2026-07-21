'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Globe, 
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { sparkAssistant } from '@/ai/flows/spark-assistant-flow';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export function SparkAssistant() {
  const { user } = useUser();
  const db = useFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Welcome to the Revolution! I am your Spark Assistant. How can I help you spread happiness today? ❤️" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: profile } = useDoc(userRef);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      const result = await sparkAssistant({ 
        message: userMessage, 
        history: messages.map(m => ({ role: m.role, text: m.text })),
        userContext: { nickname: profile?.displayName, isSeller: profile?.isSeller, country: profile?.country, isAdvertiser: profile?.isAdvertiser }
      });
      setMessages(prev => [...prev, { role: 'model', text: result.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a reflection. Please try again in a heartbeat! ✨" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="w-16 h-16 rounded-full gradient-bg shadow-2xl p-0 border-4 border-white animate-bounce"><Heart className="w-8 h-8 text-white fill-white" /></Button>
      )}
      {isOpen && (
        <Card className="w-[calc(100vw-3rem)] sm:w-[400px] h-[540px] rounded-[2.5rem] shadow-2xl border-none overflow-hidden flex flex-col animate-in slide-in-from-bottom-10">
          <CardHeader className="gradient-bg p-6 flex flex-row items-center justify-between">
             <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-white" /><CardTitle className="text-white text-lg font-black uppercase">Spark Guide</CardTitle></div>
             <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></Button>
          </CardHeader>
          <div className="bg-primary/5 px-6 py-3 flex items-center gap-3 border-b"><Info className="w-3 h-3 text-primary" /><p className="text-[9px] font-black uppercase">AI Mission Support Active</p></div>
          <CardContent className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn("max-w-[85%] px-4 py-3 rounded-[1.5rem] text-sm font-medium shadow-sm", msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-muted/50 rounded-tl-none border')}>{msg.text}</div>
              </div>
            ))}
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary opacity-20" />}
          </CardContent>
          <div className="p-6 border-t bg-slate-50/50">
             <form onSubmit={handleSend} className="flex gap-2"><Input value={input} onChange={e => setInput(e.target.value)} placeholder="How can I support you?" className="rounded-2xl h-12" disabled={isLoading} /><Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-12 w-12 rounded-2xl gradient-bg"><Send className="w-5 h-5" /></Button></form>
          </div>
        </Card>
      )}
    </div>
  );
}
