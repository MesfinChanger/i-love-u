
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search as SearchIcon, 
  Loader2, 
  Heart, 
  Send, 
  MapPin, 
  Sparkles, 
  Users, 
  Ghost,
  ShieldCheck,
  Star,
  ImageIcon
} from 'lucide-react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { query, collection, doc, setDoc, serverTimestamp, where, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function SearchContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profilesQuery = useMemoFirebase(() => {
    // Only query if we have a user and uid, as security rules require authentication
    if (!db || !user?.uid) return null;
    return query(collection(db, 'publicProfiles'), limit(100));
  }, [db, user?.uid]);

  const { data: allProfiles, loading } = useCollection(profilesQuery);

  const filteredProfiles = useMemo(() => {
    if (!allProfiles) return [];
    const queryStr = searchTerm.toLowerCase();
    return allProfiles.filter((p: any) => {
      if (p.uid === user?.uid) return false;
      const nicknameMatch = p.publicNickname?.toLowerCase().includes(queryStr);
      const interestMatch = p.interests?.some((i: string) => i.toLowerCase().includes(queryStr));
      const bioMatch = p.bio?.toLowerCase().includes(queryStr);
      return queryStr === '' || nicknameMatch || interestMatch || bioMatch;
    });
  }, [allProfiles, searchTerm, user?.uid]);

  const handleAction = async (targetUid: string, type: 'friend' | 'date') => {
    if (!user || !db) return;

    setIsProcessing(targetUid);
    const uids = [user.uid, targetUid].sort();
    const matchId = uids.join('_');

    const matchData = {
      userIds: uids,
      timestamp: serverTimestamp(),
      lastMessage: type === 'date' ? "A Spark invitation has been sent! ✨" : "Connection invitation sent 🤝",
      status: "pending",
      invitedBy: user.uid,
      type: type
    };

    try {
      await setDoc(doc(db, 'matches', matchId), matchData);
      toast({ 
        title: "Invitation Sent!", 
        description: "Your respectful request is on its way. ❤️" 
      });
    } catch (e) {
      toast({ 
        variant: "destructive", 
        title: "Action Failed", 
        description: "Could not send invitation." 
      });
    } finally {
      setIsProcessing(null);
    }
  };

  if (!mounted) return (
    <div className="flex flex-col min-h-screen bg-muted/30 items-center justify-center">
       <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-4 mb-10">
           <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border border-primary/10">
              <SearchIcon className="w-10 h-10 text-primary" />
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">{t('search.title')}</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">{t('search.subtitle')}</p>
           </div>
        </div>

        <div className="relative mb-8 group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">
            <SearchIcon className="w-5 h-5" />
          </div>
          <Input 
            value={searchTerm}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="h-16 pl-14 pr-6 rounded-[2rem] bg-white border-none shadow-xl text-lg font-bold placeholder:text-muted-foreground/30 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
             <Loader2 className="w-10 h-10 animate-spin text-primary" />
             <p className="text-[10px] font-black uppercase tracking-widest">{t('search.searching')}</p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredProfiles.map((p: any) => {
              const photoCount = (p.publicPhotoUrl ? 1 : 0) + (p.additionalPhotoUrls?.length || 0);
              
              return (
                <Card key={p.uid} className="rounded-[2.5rem] border-none shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all group">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-40 aspect-square shrink-0">
                        {p.publicPhotoUrl ? (
                          <>
                            <Image 
                              src={p.publicPhotoUrl} 
                              alt={p.publicNickname} 
                              fill 
                              className="object-cover"
                            />
                            {photoCount > 1 && (
                              <Badge className="absolute bottom-2 right-2 bg-black/60 text-white border-none text-[8px] font-black h-5 px-2 gap-1 backdrop-blur-md">
                                <ImageIcon className="w-2.5 h-2.5" />
                                {photoCount}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20">
                            <Users className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:hidden" />
                      </div>

                      <div className="p-6 flex-grow flex flex-col justify-between min-w-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <h3 className="text-2xl font-black tracking-tighter truncate">{p.publicNickname || "Mystery Heart"}</h3>
                              <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest px-2 h-5 border-primary/20 text-primary">PUBLIC</Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground/60 uppercase">
                              <MapPin className="w-3 h-3" />
                              {p.country || 'Global'}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground font-medium italic line-clamp-2 leading-relaxed">
                            "{p.bio || "Searching for meaningful sparks and cultural exchange."}"
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {p.interests?.slice(0, 3).map((interest: string) => (
                              <Badge key={interest} className="bg-muted/50 text-muted-foreground border-none text-[8px] font-bold px-2 py-0.5 rounded-lg">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                          <Button 
                            onClick={() => handleAction(p.uid, 'friend')}
                            disabled={isProcessing === p.uid}
                            variant="outline" 
                            className="flex-1 h-12 rounded-xl font-black text-[9px] uppercase tracking-widest border-2 hover:bg-blue-50 transition-all gap-2"
                          >
                            {isProcessing === p.uid ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            Invite
                          </Button>
                          <Button 
                            onClick={() => handleAction(p.uid, 'date')}
                            disabled={isProcessing === p.uid}
                            className="flex-1 h-12 rounded-xl gradient-bg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all gap-2"
                          >
                            {isProcessing === p.uid ? <Loader2 className="w-3 h-3 animate-spin" /> : <Heart className="w-3 h-3 fill-current" />}
                            Spark
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-20">
             <div className="relative">
                <Ghost className="w-20 h-20" />
                <Star className="absolute -top-2 -right-2 w-6 h-6 animate-pulse" />
             </div>
             <p className="text-lg font-black tracking-tighter uppercase max-w-[200px]">
               {t('search.noResults')}
             </p>
          </div>
        )}

        <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] border border-primary/20 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
              <ShieldCheck className="w-24 h-24 text-primary" />
           </div>
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                 <ShieldCheck className="w-6 h-6" />
                 <h4 className="font-black text-xs uppercase tracking-widest">Privacy Protocol</h4>
              </div>
              <p className="text-[11px] text-white/70 font-medium italic leading-relaxed uppercase tracking-widest">
                "Safety is Mandatory." Searching is restricted to Public Profiles only. Private identities are only revealed after mutual Spark Invitations are accepted.
              </p>
           </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
