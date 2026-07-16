'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  TrendingUp, 
  Globe, 
  Zap, 
  Cpu, 
  Microscope, 
  MessageSquare, 
  Loader2, 
  ShieldCheck,
  Plus,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  Scale,
  Brain,
  Clock,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, limit, where, doc } from 'firebase/firestore';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Prosperity Pool with Topic Access Control.
 * Grants posting access based on user role and profile status.
 */

interface TopicDefinition {
  id: string;
  icon: any;
  color: string;
  bg: string;
  requiredRole?: string;
  description: string;
}

const TOPICS: TopicDefinition[] = [
  { id: 'Economy', icon: TrendingDown, color: 'text-green-500', bg: 'bg-green-50', description: 'Requires Seller or Advertiser status' },
  { id: 'Politics', icon: Scale, color: 'text-amber-500', bg: 'bg-amber-50', requiredRole: 'admin', description: 'Restricted to Platform Administrators' },
  { id: 'Science', icon: Microscope, color: 'text-purple-500', bg: 'bg-purple-50', description: 'Requires Verified Heart status' },
  { id: 'Technology', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50', description: 'Requires Seller or Artisan status' },
  { id: 'Philosophy', icon: Brain, color: 'text-rose-500', bg: 'bg-rose-50', description: 'Requires Verified Heart status' },
  { id: 'General', icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-50', description: 'Open to all Community Hearts' }
];

export default function ProsperityPoolPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [activeTopic, setActiveTopic] = useState('All');
  const [newThought, setNewThought] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('General');
  const [isSending, setIsSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => db && user?.uid ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: myProfile } = useDoc(userRef);

  const hasAcceptedPolicy = myProfile?.policyAccepted === true;
  const isCommercial = myProfile?.isSeller || myProfile?.isAdvertiser;
  const isInteractionRestricted = isCommercial && !hasAcceptedPolicy;
  const isAdmin = myProfile?.role === 'admin';

  const checkAccess = (topicId: string) => {
    if (!myProfile) return false;
    if (isAdmin) return true;

    switch (topicId) {
      case 'General': return true;
      case 'Economy': return myProfile.isSeller || myProfile.isAdvertiser;
      case 'Technology': return myProfile.isSeller;
      case 'Science':
      case 'Philosophy': return myProfile.verified === true;
      case 'Politics': return false; // Admins only
      default: return true;
    }
  };

  const poolQuery = useMemoFirebase(() => {
    if (!db) return null;
    let q = query(collection(db, 'ideaPool'), orderBy('timestamp', 'desc'), limit(50));
    if (activeTopic !== 'All') {
      q = query(collection(db, 'ideaPool'), where('topic', '==', activeTopic), orderBy('timestamp', 'desc'), limit(50));
    }
    return q;
  }, [db, activeTopic]);

  const { data: thoughts, loading } = useCollection(poolQuery);

  const handlePostThought = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newThought.trim() || !user || !db || isSending) return;
    
    if (isInteractionRestricted) {
      toast({ variant: "destructive", title: "Access Restricted", description: "Sellers and Purchasers must commit to the Respect Protocol before diving in. ❤️" });
      return;
    }

    if (!checkAccess(selectedTopic)) {
      toast({ variant: "destructive", title: "Access Denied", description: `Your profile doesn't meet the requirements for ${selectedTopic}. ✨` });
      return;
    }

    setIsSending(true);
    try {
      const moderation = await moderateText({ text: newThought });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Protocol Ripple", description: moderation.reason });
        setIsSending(false);
        return;
      }

      await addDoc(collection(db, 'ideaPool'), {
        uid: user.uid,
        authorName: myProfile?.publicNickname || myProfile?.displayName || "Mystery Diver",
        topic: selectedTopic,
        text: newThought.trim(),
        timestamp: serverTimestamp(),
      });

      setNewThought('');
      toast({ title: "Thought Launched", description: "Your spark is now swimming in the pool! ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Bridge Ripple", description: "Failed to reach the pool." });
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
                 "Dive into the global consciousness. Share thoughts that dismantle poverty and build a better world for every heart."
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

                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                       <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">
                         Selected Topic: <span className="font-black">{selectedTopic}</span>
                       </p>
                       <p className="text-[8px] text-slate-400 font-medium italic leading-none mt-1">
                         {TOPICS.find(t => t.id === selectedTopic)?.description}
                       </p>
                    </div>

                    <Textarea 
                      value={newThought}
                      onChange={e => setNewThought(e.target.value)}
                      placeholder={isInteractionRestricted ? "Commercial Approval Required" : t('pool.placeholder')}
                      className="min-h-[140px] rounded-[1.5rem] border-none bg-muted/40 p-5 font-medium italic text-sm leading-relaxed"
                      disabled={isInteractionRestricted || !checkAccess(selectedTopic)}
                    />
                 </div>
                 
                 <div className="bg-slate-900 p-5 rounded-2xl space-y-3 shadow-lg relative overflow-hidden group">
                    <div className="flex items-center gap-2 text-primary">
                       <ShieldCheck className="w-4 h-4" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Pool Regulation</span>
                    </div>
                    <p className="text-[8px] text-white/60 font-bold uppercase leading-relaxed tracking-widest">
                       {isInteractionRestricted ? "Sellers and Purchasers must agree to the respect policy before contributing." : "Topic access is granted based on profile status. Respect & Love is Mandatory."}
                    </p>
                 </div>

                 <Button 
                   onClick={handlePostThought}
                   disabled={isSending || !newThought.trim() || isInteractionRestricted || !checkAccess(selectedTopic)}
                   className="w-full h-14 rounded-2xl gradient-bg font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 gap-3"
                 >
                   {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                   {t('pool.post')}
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
                <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-20">
                   <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                   <p className="font-black uppercase tracking-[0.3em] text-xs">Scanning Pool Depths...</p>
                </div>
              ) : thoughts?.length === 0 ? (
                <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-muted/50 flex flex-col items-center gap-6">
                   <Waves className="w-20 h-20 text-blue-500/20" />
                   <div className="space-y-2">
                      <p className="text-xl font-black uppercase tracking-tighter">{t('pool.empty')}</p>
                      <p className="text-xs text-muted-foreground font-medium italic">Be the first to create a ripple.</p>
                   </div>
                </div>
              ) : thoughts?.map((thought: any) => {
                const topicInfo = TOPICS.find(t => t.id === thought.topic) || TOPICS[5];
                return (
                  <Card key={thought.id} className="rounded-[2.5rem] border-none shadow-lg bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500">
                     <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-black">
                                 {thought.authorName?.[0] || 'U'}
                              </div>
                              <div className="text-left leading-none">
                                 <h4 className="font-black text-lg tracking-tight text-slate-900">{thought.authorName}</h4>
                                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Diver in Knowledge</p>
                              </div>
                           </div>
                           <Badge className={cn("border-none px-4 h-7 text-[9px] font-black uppercase tracking-widest gap-2", topicInfo.bg, topicInfo.color)}>
                              <topicInfo.icon className="w-3 h-3" />
                              {thought.topic}
                           </Badge>
                        </div>

                        <p className="text-xl font-medium text-slate-700 leading-relaxed italic border-l-4 border-blue-500/10 pl-6">
                           "{thought.text}"
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-dashed">
                           <div className="flex items-center gap-2 text-muted-foreground/40">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Recorded in Pool</span>
                           </div>
                        </div>
                     </div>
                  </Card>
                );
              })}
           </div>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
