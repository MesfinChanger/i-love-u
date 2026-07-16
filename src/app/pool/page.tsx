
'use client';

import { useState, useMemo, useEffect } from 'react';
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
  ShieldCheck, 
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
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Prosperity Pool with Topic Access Control Protocol.
 * Refactored to strictly adhere to the PoolPost schema.
 */

interface TopicDefinition {
  id: 'economics' | 'technology' | 'politics' | 'philosophy' | 'general';
  icon: any;
  color: string;
  bg: string;
  description: string;
}

const TOPICS: TopicDefinition[] = [
  { id: 'economics', icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-50', description: 'Requires Seller or Advertiser status' },
  { id: 'politics', icon: Scale, color: 'text-amber-500', bg: 'bg-amber-50', description: 'Restricted to Platform Administrators' },
  { id: 'philosophy', icon: Brain, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Requires Verified Heart status' },
  { id: 'technology', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Requires Seller or Admin status' },
  { id: 'general', icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-50', description: 'Open to all Community Hearts' }
];

export default function ProsperityPoolPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [activeTopic, setActiveTopic] = useState('All');
  const [title, setTitle] = useState('');
  const [newThought, setNewThought] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<TopicDefinition['id']>('general');
  const [isSending, setIsSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const isAdmin = myProfile?.role === 'admin';
  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  const isCommercial = myProfile?.isSeller || myProfile?.isAdvertiser;
  const isInteractionRestricted = isCommercial && !hasAcceptedPolicy;

  const checkAccess = (topicId: string) => {
    if (!myProfile) return false;
    if (isAdmin) return true;

    switch (topicId) {
      case 'general': return true;
      case 'economics': return myProfile.isSeller || myProfile.isAdvertiser;
      case 'technology': return myProfile.isSeller || isAdmin;
      case 'philosophy': return myProfile.verified === true;
      case 'politics': return isAdmin; 
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
  }, [activeTopic]);

  const { data: thoughts, loading } = useCollection(poolQuery);

  const handlePostThought = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) {
      window.dispatchEvent(new CustomEvent('open-auth-gate'));
      return;
    }

    if (!title.trim() || !newThought.trim() || !db || isSending) return;
    
    if (isInteractionRestricted) {
      toast({ 
        variant: "destructive", 
        title: "Access Restricted", 
        description: "Commercial users must commit to the Respect Protocol first. ❤️" 
      });
      return;
    }

    if (!checkAccess(selectedTopic)) {
      toast({ 
        variant: "destructive", 
        title: "Access Denied", 
        description: `Your profile status is insufficient for the ${selectedTopic} pool. ✨` 
      });
      return;
    }

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

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <section className="relative overflow-hidden bg-slate-900 py-20 px-6 text-white text-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
         <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="w-48 h-48 bg-blue-500/10 backdrop-blur-3xl rounded-[4rem] flex items-center justify-center mx-auto border-4 border-blue-400/20 animate-pulse shadow-[0_0_80px_-10px_rgba(59,130,246,0.3)]">
               <Waves className="w-24 h-24 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                 Prosperity <span className="text-blue-400">Pool</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-medium italic leading-relaxed max-w-2xl mx-auto">
                 "Dive into the global consciousness. Access to specific depths is granted based on your profile status."
              </p>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-6 grid lg:grid-cols-12 gap-8 mt-10">
        <div className="lg:col-span-4 space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden sticky top-24">
              <div className="bg-primary/5 p-8 border-b">
                 <div className="flex items-center gap-3">
                    <Plus className="w-5 h-5 text-primary" />
                    <h3 className="font-black text-xl tracking-tighter uppercase">Launch a Thought</h3>
                 </div>
              </div>
              <CardContent className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                       {TOPICS.map(topic => {
                          const hasAccess = checkAccess(topic.id);
                          return (
                            <button 
                              key={topic.id}
                              onClick={() => hasAccess && setSelectedTopic(topic.id)}
                              className={cn(
                                "p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 group relative overflow-hidden",
                                selectedTopic === topic.id ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "hover:bg-slate-50 border-slate-100",
                                !hasAccess && "opacity-40 grayscale cursor-not-allowed bg-slate-50"
                              )}
                              title={topic.description}
                            >
                               {!hasAccess && <Lock className="absolute top-1 right-1 w-2.5 h-2.5 text-slate-400" />}
                               <topic.icon className={cn("w-4 h-4", selectedTopic === topic.id ? "text-primary" : topic.color)} />
                               <span className="text-[9px] font-black uppercase tracking-widest">{topic.id}</span>
                            </button>
                          );
                       })}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
                      <Input 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Concise headline..."
                        className="h-12 rounded-xl bg-muted/20 border-none font-bold"
                        disabled={isInteractionRestricted || !checkAccess(selectedTopic)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Content</Label>
                      <Textarea 
                        value={newThought}
                        onChange={e => setNewThought(e.target.value)}
                        placeholder={isInteractionRestricted ? "Commercial Approval Required" : "Deep dive into your thought..."}
                        className="min-h-[140px] rounded-[1.5rem] border-none bg-muted/40 p-5 font-medium italic text-sm"
                        disabled={isInteractionRestricted || !checkAccess(selectedTopic)}
                      />
                    </div>
                 </div>
                 
                 <Button 
                   onClick={handlePostThought}
                   disabled={isSending || !title.trim() || !newThought.trim() || isInteractionRestricted || !checkAccess(selectedTopic)}
                   className="w-full h-14 rounded-2xl gradient-bg font-black uppercase text-xs tracking-widest shadow-xl gap-3"
                 >
                   {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                   Launch Thought
                 </Button>
              </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 pb-2">
              <Button 
                variant={activeTopic === 'All' ? 'default' : 'ghost'} 
                onClick={() => setActiveTopic('All')}
                className="rounded-full font-black uppercase text-[10px] tracking-widest h-10 px-6 shrink-0"
              >
                The Whole Pool
              </Button>
              {TOPICS.map(topic => (
                 <Button 
                   key={topic.id} 
                   variant={activeTopic === topic.id ? 'default' : 'ghost'} 
                   onClick={() => setActiveTopic(topic.id)}
                   className="rounded-full font-black uppercase text-[10px] tracking-widest h-10 px-6 shrink-0 gap-2"
                 >
                   <topic.icon className="w-3.5 h-3.5" />
                   {topic.id}
                 </Button>
              ))}
           </div>

           <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-20">
                   <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                </div>
              ) : thoughts?.map((thought: any) => (
                <PoolPostCard key={thought.id} post={thought} />
              ))}
              {!loading && thoughts?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center opacity-20">
                   <Waves className="w-16 h-16 mb-4" />
                   <p className="text-sm font-black uppercase tracking-widest">Quiet waters. Be the first to launch a thought.</p>
                </div>
              )}
           </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function PoolPostCard({ post }: { post: any }) {
  const topicInfo = TOPICS.find(t => t.id === post.category) || TOPICS[4];
  const authorRef = useMemoFirebase(() => db ? doc(db, 'users', post.authorId) : null, [post.authorId]);
  const { data: author } = useDoc(authorRef);

  return (
    <Card className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden hover:shadow-2xl transition-all">
       <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-black">
                   {author?.username?.[0] || author?.displayName?.[0] || 'H'}
                </div>
                <div className="text-left leading-none">
                   <h4 className="font-black text-lg tracking-tight text-slate-900">{author?.username || author?.displayName || "Mystery Heart"}</h4>
                   <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                     {author?.profession || "Community Diver"}
                   </p>
                </div>
             </div>
             <Badge className={cn("border-none px-4 h-7 text-[9px] font-black uppercase tracking-widest gap-2", topicInfo.bg, topicInfo.color)}>
                <topicInfo.icon className="w-3 h-3" />
                {post.category}
             </Badge>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black tracking-tighter text-slate-900">{post.title}</h3>
            <p className="text-lg font-medium text-slate-600 leading-relaxed italic border-l-4 border-blue-500/10 pl-6">
               "{post.content}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-dashed">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-slate-400">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-[10px] font-bold">{post.likesCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-bold">{post.commentsCount || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/30">
               <Clock className="w-3.5 h-3.5" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Synchronized in Pool</span>
            </div>
          </div>
       </div>
    </Card>
  );
}
