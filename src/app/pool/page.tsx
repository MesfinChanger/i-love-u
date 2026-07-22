'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { 
  Waves, 
  Loader2, 
  Plus
} from 'lucide-react';
import { useUser, db, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, where, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';
import { ideaCategories } from '@/constants/categories';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * @fileOverview Prosperity Pool Module.
 */
export default function ProsperityPoolPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [activeTopic, setActiveTopic] = useState('All');
  const [title, setTitle] = useState('');
  const [newThought, setNewThought] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('general');
  const [isSending, setIsSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const checkAccess = (topicId: string) => {
    if (!myProfile) return false;
    if ((myProfile as any).role === 'admin') return true;
    switch (topicId) {
      case 'general': return true;
      case 'economics': return !!((myProfile as any).isSeller || (myProfile as any).isAdvertiser);
      default: return true;
    }
  };

  const poolQuery = useMemoFirebase(() => {
    if (!db) return null;
    let q = query(collection(db, 'ideaPool'), orderBy('createdAt', 'desc'), limit(50));
    if (activeTopic !== 'All') {
      q = query(collection(db, 'ideaPool'), where('category', '==', activeTopic), orderBy('createdAt', 'desc'), limit(50));
    }
    return q;
  }, [db, activeTopic]);

  const { data: thoughts, loading } = useCollection(poolQuery);

  const handlePostThought = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) { window.dispatchEvent(new CustomEvent('open-auth-gate')); return; }
    if (!title.trim() || !newThought.trim() || !db || isSending) return;
    
    setIsSending(true);
    try {
      const moderation = await moderateText({ 
        text: `${title} - ${newThought}`,
        context: "chat",
      });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Protocol", description: moderation.reason });
        setIsSending(false);
        return;
      }

      const collectionRef = collection(db, 'ideaPool');
      const data = { authorId: user.uid, category: selectedTopic, title: title.trim(), content: newThought.trim(), createdAt: serverTimestamp() };

      addDoc(collectionRef, data)
        .then(() => { setTitle(''); setNewThought(''); setIsSending(false); toast({ title: "Thought Launched", description: "Spark synchronized! ✨" }); })
        .catch(async () => { setIsSending(false); errorEmitter.emit('permission-error', new FirestorePermissionError({ path: collectionRef.path, operation: 'create', requestResourceData: data })); });
    } catch (e) {
      setIsSending(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <section className="bg-slate-900 py-16 px-6 text-white text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <Waves className="w-10 h-10 text-blue-400 mx-auto animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Prosperity <span className="text-blue-400">Pool</span></h1>
            <p className="text-lg text-white/60 font-medium italic">"Dive into the global consciousness."</p>
         </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-8 mt-10">
        <div className="lg:col-span-4 space-y-8">
           <Card className="rounded-[2.5rem] p-8 space-y-6 sticky top-24 border-none shadow-xl bg-white">
              <h3 className="font-black text-xl uppercase flex items-center gap-3"><Plus className="text-primary" /> Launch Thought</h3>
              <div className="grid grid-cols-2 gap-2">
                 {ideaCategories.map(topic => (
                   <button key={topic.value} onClick={() => checkAccess(topic.value) && setSelectedTopic(topic.value)} className={cn("p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all", selectedTopic === topic.value ? "bg-slate-900 text-white border-slate-900" : "bg-white", !checkAccess(topic.value) && "opacity-40 grayscale cursor-not-allowed")}>
                      <span className="text-lg">{topic.icon}</span><span className="text-[9px] font-black uppercase">{topic.name}</span>
                   </button>
                 ))}
              </div>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="h-12 rounded-xl bg-muted/20 border-none font-bold" />
              <Textarea value={newThought} onChange={e => setNewThought(e.target.value)} placeholder="Thought..." className="min-h-[140px] rounded-xl bg-muted/20 border-none font-medium italic" />
              <Button onClick={handlePostThought} disabled={isSending} className="w-full h-14 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[10px]">Launch Thought</Button>
           </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              <Button variant={activeTopic === 'All' ? 'default' : 'ghost'} onClick={() => setActiveTopic('All')} className="rounded-full uppercase font-black text-[10px] h-10 px-6 shrink-0">The Pool</Button>
              {ideaCategories.map(topic => <Button key={topic.value} variant={activeTopic === topic.value ? 'default' : 'ghost'} onClick={() => setActiveTopic(topic.value)} className="rounded-full uppercase font-black text-[10px] h-10 px-6 shrink-0">{topic.name}</Button>)}
           </div>
           <div className="space-y-6">
              {loading ? <Loader2 className="animate-spin mx-auto opacity-20" /> : thoughts?.map((thought: any) => (
                <Card key={thought.id} className="rounded-[2.5rem] p-8 shadow-lg bg-white border-none group">
                   <h4 className="font-black uppercase text-[10px] text-primary mb-4 tracking-[0.2em] opacity-60">{thought.category}</h4>
                   <h3 className="text-xl font-black tracking-tighter mb-2 uppercase group-hover:text-primary transition-colors">{thought.title}</h3>
                   <p className="text-base font-medium text-slate-600 italic leading-relaxed">"{thought.content}"</p>
                </Card>
              ))}
           </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
