'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Waves, 
  MessageSquare, 
  Loader2, 
  Plus, 
  Zap, 
  Clock, 
  Lock, 
  Scale, 
  TrendingDown, 
  Cpu, 
  Brain,
  ThumbsUp
} from 'lucide-react';
import { useUser, db, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, where, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { cn } from '@/lib/utils';

const TOPICS = [
  { id: 'economics', icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'politics', icon: Scale, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'philosophy', icon: Brain, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'technology', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'general', icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-50' }
];

export default function IdeasPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTopic, setActiveTopic] = useState('All');
  const [title, setTitle] = useState('');
  const [newThought, setNewThought] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [isSending, setIsSending] = useState(false);

  const poolQuery = useMemoFirebase(() => {
    if (!db) return null;
    let q = query(collection(db, 'ideaPool'), orderBy('createdAt', 'desc'), limit(50));
    if (activeTopic !== 'All') {
      q = query(collection(db, 'ideaPool'), where('category', '==', activeTopic), orderBy('createdAt', 'desc'), limit(50));
    }
    return q;
  }, [activeTopic]);

  const { data: thoughts, loading } = useCollection(poolQuery);

  const handlePostThought = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user || !title.trim() || !newThought.trim() || isSending) return;

    setIsSending(true);
    try {
      const moderation = await moderateText({ text: `${title} - ${newThought}` });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Protocol Ripple", description: moderation.reason });
        setIsSending(false);
        return;
      }

      await addDoc(collection(db, 'ideaPool'), {
        authorId: user.uid,
        category: selectedTopic,
        title: title.trim(),
        content: newThought.trim(),
        media: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setNewThought('');
      toast({ title: "Thought Launched", description: "Your spark is now swimming in the pool! ✨" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <section className="bg-slate-900 py-20 px-6 text-white text-center">
         <Waves className="w-24 h-24 text-blue-400 mx-auto animate-pulse mb-8" />
         <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">Idea <span className="text-blue-400">Pool</span></h1>
         <p className="text-xl text-white/60 font-medium italic mt-4 max-w-2xl mx-auto">"Dive into the global consciousness. Respect & Love is Mandatory."</p>
      </section>
      <main className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-8 mt-10">
        <div className="lg:col-span-4 space-y-8">
           <Card className="rounded-[2.5rem] p-8 space-y-6 bg-white shadow-xl">
              <h3 className="font-black uppercase flex items-center gap-3"><Plus className="text-primary" /> Launch Thought</h3>
              <div className="grid grid-cols-2 gap-2">
                 {TOPICS.map(topic => (
                    <button key={topic.id} onClick={() => setSelectedTopic(topic.id)} className={cn("p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all", selectedTopic === topic.id ? "bg-slate-900 text-white" : "hover:bg-slate-50")}>
                       <topic.icon className={cn("w-4 h-4", selectedTopic === topic.id ? "text-primary" : topic.color)} />
                       <span className="text-[9px] font-black uppercase">{topic.id}</span>
                    </button>
                 ))}
              </div>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="h-12 rounded-xl bg-muted/20 border-none" />
              <Textarea value={newThought} onChange={e => setNewThought(e.target.value)} placeholder="Dive in..." className="min-h-[140px] rounded-[1.5rem] bg-muted/40 border-none p-5" />
              <Button onClick={handlePostThought} disabled={isSending} className="w-full h-14 rounded-2xl gradient-bg uppercase font-black">Launch Thought</Button>
           </Card>
        </div>
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              <Button variant={activeTopic === 'All' ? 'default' : 'ghost'} onClick={() => setActiveTopic('All')} className="rounded-full font-black uppercase text-[10px] h-10 px-6 shrink-0">The Pool</Button>
              {TOPICS.map(topic => (
                 <Button key={topic.id} variant={activeTopic === topic.id ? 'default' : 'ghost'} onClick={() => setActiveTopic(topic.id)} className="rounded-full font-black uppercase text-[10px] h-10 px-6 shrink-0 gap-2"><topic.icon className="w-3.5 h-3.5" /> {topic.id}</Button>
              ))}
           </div>
           <div className="space-y-6">
              {thoughts?.map((thought: any) => (
                <PoolPostCard key={thought.id} post={thought} />
              ))}
           </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function PoolPostCard({ post }: { post: any }) {
  const authorRef = useMemoFirebase(() => db ? doc(db, 'users', post.authorId) : null, [post.authorId]);
  const { data: author } = useDoc(authorRef);
  return (
    <Card className="rounded-[2.5rem] p-8 space-y-6 bg-white shadow-lg hover:shadow-2xl transition-all">
       <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-black">{author?.displayName?.[0] || 'H'}</div>
             <div>
                <h4 className="font-black text-lg">{author?.displayName || "Mystery Heart"}</h4>
                <p className="text-[9px] font-bold text-muted-foreground uppercase">{post.category}</p>
             </div>
          </div>
          <Badge className="bg-slate-900 text-white px-4 h-7 uppercase text-[9px] font-black">IDEAL SYNC</Badge>
       </div>
       <div className="space-y-3">
          <h3 className="text-2xl font-black tracking-tighter">{post.title}</h3>
          <p className="text-lg font-medium text-slate-600 italic border-l-4 border-blue-100 pl-6">"{post.content}"</p>
       </div>
       <div className="flex items-center gap-6 pt-6 border-t border-dashed">
          <div className="flex items-center gap-1.5 text-slate-400"><ThumbsUp className="w-4 h-4" /><span className="text-[10px] font-bold">{post.likesCount || 0}</span></div>
          <div className="flex items-center gap-1.5 text-slate-400"><MessageSquare className="w-4 h-4" /><span className="text-[10px] font-bold">{post.commentsCount || 0}</span></div>
       </div>
    </Card>
  );
}
