'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/Card';
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
  ThumbsUp
} from 'lucide-react';
import { useUser, db, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, where, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';
import { ideaCategories } from '@/constants/categories';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

/**
 * @fileOverview Prosperity Pool with Topic Access Control Protocol.
 * Refactored to utilize visually balanced headings.
 */

export default function ProsperityPoolPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [activeTopic, setActiveTopic] = useState('All');
  const [title, setTitle] = useState('');
  const [newThought, setNewThought] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('general');
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
      case 'science': return myProfile.verified === true;
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
      toast({ variant: "destructive", title: "Access Restricted", description: "Agreement required. ❤️" });
      return;
    }

    if (!checkAccess(selectedTopic)) {
      toast({ variant: "destructive", title: "Access Denied", description: "Status insufficient. ✨" });
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

      const collectionRef = collection(db, 'ideaPool');
      const data = {
        authorId: user.uid,
        category: selectedTopic,
        title: title.trim(),
        content: newThought.trim(),
        media: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      };

      addDoc(collectionRef, data)
        .then(() => {
          setTitle('');
          setNewThought('');
          setIsSending(false);
          toast({ title: "Thought Launched", description: "Spark synchronized! ✨" });
        })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: collectionRef.path,
            operation: 'create',
            requestResourceData: data,
          } satisfies SecurityRuleContext);
          errorEmitter.emit('permission-error', permissionError);
          setIsSending(false);
        });
    } catch (e) {
      setIsSending(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <section className="relative overflow-hidden bg-slate-900 py-16 px-6 text-white text-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
         <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <div className="w-24 h-24 bg-blue-500/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center mx-auto border-2 border-blue-400/20 animate-pulse">
               <Waves className="w-10 h-10 text-blue-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                 Prosperity <span className="text-blue-400">Pool</span>
              </h1>
              <p className="text-lg text-white/60 font-medium italic max-w-lg mx-auto">
                 "Dive into the global consciousness."
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
                       {ideaCategories.map(topic => {
                          const hasAccess = checkAccess(topic.value);
                          return (
                            <button 
                              key={topic.value}
                              onClick={() => hasAccess && setSelectedTopic(topic.value)}
                              className={cn(
                                "p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 group relative overflow-hidden",
                                selectedTopic === topic.value ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "hover:bg-slate-50 border-slate-100",
                                !hasAccess && "opacity-40 grayscale cursor-not-allowed bg-slate-50"
                              )}
                            >
                               {!hasAccess && <Lock className="absolute top-1 right-1 w-2.5 h-2.5 text-slate-400" />}
                               <span className="text-lg">{topic.icon}</span>
                               <span className="text-[9px] font-black uppercase tracking-widest">{topic.name}</span>
                            </button>
                          );
                       })}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
                      <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Concise headline..." className="h-12 rounded-xl bg-muted/20 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Content</Label>
                      <Textarea value={newThought} onChange={e => setNewThought(e.target.value)} placeholder="Deep dive into your thought..." className="min-h-[140px] rounded-[1.5rem] border-none bg-muted/40 p-5 font-medium italic text-sm" />
                    </div>
                 </div>
                 <Button onClick={handlePostThought} disabled={isSending || !title.trim() || !newThought.trim()} className="w-full h-14 rounded-2xl gradient-bg font-black uppercase text-xs tracking-widest shadow-xl">
                   {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Launch Thought"}
                 </Button>
              </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 pb-2">
              <Button variant={activeTopic === 'All' ? 'default' : 'ghost'} onClick={() => setActiveTopic('All')} className="rounded-full font-black uppercase text-[10px] tracking-widest h-10 px-6 shrink-0">The Whole Pool</Button>
              {ideaCategories.map(topic => (
                 <Button key={topic.value} variant={activeTopic === topic.value ? 'default' : 'ghost'} onClick={() => setActiveTopic(topic.value)} className="rounded-full font-black uppercase text-[10px] tracking-widest h-10 px-6 shrink-0 gap-2">
                   <span>{topic.icon}</span> {topic.name}
                 </Button>
              ))}
           </div>
           <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-20"><Loader2 className="w-12 h-12 animate-spin text-blue-500" /></div>
              ) : thoughts?.map((thought: any) => (
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
  const categoryInfo = ideaCategories.find(t => t.value === post.category) || ideaCategories[5];
  const authorRef = useMemoFirebase(() => db ? doc(db, 'users', post.authorId) : null, [post.authorId]);
  const { data: author } = useDoc(authorRef);

  return (
    <Card className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden hover:shadow-2xl transition-all">
       <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-black">
                   {author?.username?.[0] || 'H'}
                </div>
                <div className="text-left leading-none">
                   <h4 className="font-black text-lg tracking-tight text-slate-900">{author?.username || "Mystery Heart"}</h4>
                   <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Community Diver</p>
                </div>
             </div>
             <Badge className="border-none px-4 h-7 text-[9px] font-black uppercase tracking-widest gap-2 bg-blue-50 text-blue-600">
                <span>{categoryInfo.icon}</span> {categoryInfo.name}
             </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tighter text-slate-900">{post.title}</h3>
            <p className="text-base font-medium text-slate-600 italic border-l-4 border-blue-500/10 pl-6">"{post.content}"</p>
          </div>
       </div>
    </Card>
  );
}
