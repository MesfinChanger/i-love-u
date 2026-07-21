'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Megaphone, 
  Plus, 
  TrendingUp, 
  Loader2, 
  ShieldCheck,
  CheckCircle2,
  Video,
  Type,
  Clock,
  FileCheck,
  Save
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, addDoc, collection, serverTimestamp, query, where, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createAdCampaignSession } from '@/lib/stripe-actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { Badge } from '@/components/ui/badge';
import { COUNTRIES } from '@/lib/world-data';
import { cn } from '@/lib/utils';

function AdvertiserManageContent() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(userRef);

  const adsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'ads'), where('advertiserId', '==', user.uid));
  }, [db, user]);
  const { data: myAds, loading: adsLoading } = useCollection(adsQuery);

  const [adType, setAdType] = useState<'text' | 'video'>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [targetCountry, setTargetCountry] = useState('GLOBAL');
  const [budget, setBudget] = useState('50');
  const [isCreating, setIsCreating] = useState(false);

  const advertiserStatus = profile?.advertiserStatus || 'none';
  const isApprovedAdvertiser = profile?.isAdvertiser && advertiserStatus === 'approved';

  const handleApplyAdvertiser = async () => {
    if (!user || !db) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        advertiserStatus: 'pending'
      });
      toast({ title: "Approval Sent", description: "Review in progress. ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to apply." });
    }
  };

  const handleCreateCampaign = async () => {
    if (!user || !db || !title || !description || !isApprovedAdvertiser) return;

    const amount = parseFloat(budget);
    setIsCreating(true);
    try {
      const moderation = await moderateText({ text: `${title} - ${description}`, context: 'advertisement' });

      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Policy Violation", description: moderation.reason });
        setIsCreating(false);
        return;
      }

      await addDoc(collection(db, 'ads'), {
        advertiserId: user.uid,
        adType,
        title,
        description,
        targetUrl,
        videoUrl: adType === 'video' ? videoUrl : null,
        targetCountries: targetCountry === 'GLOBAL' ? COUNTRIES.map(c => c.code) : [targetCountry],
        budget: amount,
        status: 'pending',
        timestamp: serverTimestamp(),
      });

      if (amount > 0) {
        const result = await createAdCampaignSession(amount, profile?.currency || 'USD', user.uid, title);
        if (result?.url) window.location.href = result.url;
      }
    } catch (e) {
      setIsCreating(false);
    }
  };

  if (advertiserStatus === 'pending') {
    return (
      <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-lg text-center">
           <Card className="rounded-[3rem] p-12 space-y-8">
              <Clock className="w-16 h-16 text-blue-500 mx-auto animate-pulse" />
              <h1 className="text-3xl font-black uppercase">Ad Review Active</h1>
              <p className="text-muted-foreground italic">Verification in progress. ❤️</p>
              <Button variant="outline" className="w-full h-14 rounded-2xl" onClick={() => router.push('/discover')}>Return Home</Button>
           </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <div className="flex justify-between items-end">
          <h1 className="text-4xl font-black uppercase flex items-center gap-3"><Megaphone className="w-10 h-10" /> Ads Hub</h1>
          {!isApprovedAdvertiser && (
            <Button onClick={handleApplyAdvertiser} className="rounded-full gradient-bg h-12 px-8 font-black uppercase">Apply Now</Button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card className={cn("rounded-[3rem] p-8", !isApprovedAdvertiser && "opacity-50 grayscale pointer-events-none")}>
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-black uppercase">Launch Campaign</CardTitle>
              </CardHeader>
              <Tabs value={adType} onValueChange={(v: any) => setAdType(v)} className="space-y-6">
                <TabsList className="grid grid-cols-2 h-12">
                   <TabsTrigger value="text" className="gap-2"><Type className="w-4 h-4" /> Text</TabsTrigger>
                   <TabsTrigger value="video" className="gap-2"><Video className="w-4 h-4" /> Video</TabsTrigger>
                </TabsList>
                <div className="space-y-4">
                  <Input placeholder="Ad Title" value={title} onChange={e => setTitle(e.target.value)} className="h-12 rounded-xl" />
                  {adType === 'video' && <Input placeholder="Video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="h-12 rounded-xl" />}
                  <Textarea placeholder="Ad Message" value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px] rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="URL" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="h-12 rounded-xl" />
                    <Input placeholder="Budget" type="number" value={budget} onChange={e => setBudget(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                </div>
                <Button onClick={handleCreateCampaign} disabled={isCreating || !isApprovedAdvertiser} className="w-full h-16 rounded-2xl gradient-bg font-black uppercase shadow-xl">
                  {isCreating ? <Loader2 className="animate-spin" /> : "Confirm Liability & Launch"}
                </Button>
              </Tabs>
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-6">
             <h2 className="font-black uppercase">Active Reach</h2>
             {adsLoading ? <Loader2 className="animate-spin opacity-20" /> : myAds?.map((ad: any) => (
               <Card key={ad.id} className="p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold">{ad.title}</h4>
                  <Badge variant="outline" className="mt-2 uppercase text-[9px]">{ad.status}</Badge>
               </Card>
             ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

export default function AdvertiserManagePage() {
  return <Suspense fallback={<Loader2 className="animate-spin" />}><AdvertiserManageContent /></Suspense>;
}
