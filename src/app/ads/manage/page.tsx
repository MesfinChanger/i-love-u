
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Megaphone, 
  Plus, 
  TrendingUp, 
  Target, 
  CreditCard, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createAdCampaignSession } from '@/lib/stripe-actions';
import { useSearchParams } from 'next/navigation';

export default function AdvertiserManagePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [budget, setBudget] = useState('50');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Campaign Funded",
        description: "Your advertisement is being reviewed for respect & love guidelines! ✨",
      });
    }
  }, [searchParams, toast]);

  const userCurrency = profile?.currency || 'USD';

  const handleCreateCampaign = async () => {
    if (!user || !db || !title || !description) return;

    const amount = parseFloat(budget);
    if (isNaN(amount) || amount < 10) {
      toast({
        variant: "destructive",
        title: "Minimum Budget",
        description: `Minimum ad spend is 10 ${userCurrency}.`
      });
      return;
    }

    setIsCreating(true);
    try {
      // Create the record first (pending payment)
      await addDoc(collection(db, 'ads'), {
        advertiserId: user.uid,
        title,
        description,
        targetUrl,
        budget: amount,
        currency: userCurrency,
        status: 'pending',
        timestamp: serverTimestamp(),
      });

      await createAdCampaignSession(amount, userCurrency, user.uid, title);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Payment redirect failed." });
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl" role="main">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              <Megaphone className="w-10 h-10 text-primary" aria-hidden="true" />
              Advertiser Tools
            </h1>
            <p className="text-muted-foreground">Promote your brand to our "Respect & Love" community.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-primary/10 text-primary p-4 rounded-2xl border border-primary/20 flex items-center gap-3">
               <TrendingUp className="w-5 h-5" />
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Market Reach</p>
                  <p className="text-lg font-bold">12k+ Active Sparks</p>
               </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  New Ad Campaign
                </CardTitle>
                <CardDescription>Ads are shown directly in the Discover Feed.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ad-title">Campaign Title</Label>
                  <Input 
                    id="ad-title" 
                    placeholder="e.g. Visit our local bakery!" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-desc">Ad Description (Message)</Label>
                  <Textarea 
                    id="ad-desc" 
                    placeholder="What do you want to tell our community?" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="rounded-xl min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-url">Target Website/Link</Label>
                  <Input 
                    id="ad-url" 
                    type="url" 
                    placeholder="https://yourwebsite.com" 
                    value={targetUrl}
                    onChange={e => setTargetUrl(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-budget">Campaign Budget ({userCurrency})</Label>
                  <Input 
                    id="ad-budget" 
                    type="number" 
                    min="10"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="rounded-xl font-bold"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-dashed flex items-start gap-3">
                   <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                   <p className="text-[10px] text-slate-600 font-medium leading-relaxed uppercase tracking-tighter">
                     All advertisements must adhere to the <strong>Respect & Love Mandatory</strong> policy. Any disrespectful or unloving content will be removed without refund.
                   </p>
                </div>

                <Button 
                  className="w-full h-14 rounded-xl gradient-bg text-lg font-bold shadow-xl shadow-primary/20"
                  onClick={handleCreateCampaign}
                  disabled={isCreating || !title || !description}
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                  Launch Campaign
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-black tracking-tight">Active Campaigns</h2>
            {adsLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
            ) : myAds && myAds.length > 0 ? (
              myAds.map((ad: any) => (
                <Card key={ad.id} className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                  <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{new Date(ad.timestamp?.toDate()).toLocaleDateString()}</span>
                    <Badge variant={ad.status === 'active' ? 'default' : 'outline'} className={ad.status === 'active' ? 'bg-green-500' : ''}>
                      {ad.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardContent className="p-5 space-y-2">
                    <h3 className="font-bold">{ad.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t mt-2">
                       <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Target className="w-3 h-3 text-primary" />
                          <span>Budget: {ad.budget} {ad.currency}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-xs text-blue-500 font-black">
                          <Globe2 className="w-3 h-3" />
                          <span>GLOBAL REACH</span>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 bg-white/50 rounded-3xl border-2 border-dashed border-muted">
                <p className="text-muted-foreground text-sm font-medium">No active campaigns.</p>
              </div>
            )}

            <Card className="rounded-3xl border-none bg-blue-500 text-white shadow-xl shadow-blue-500/20">
               <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-black">Why Advertise Here?</h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-bold">100% Respectful Audience</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-bold">Local Community Targeting</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-bold">No Bottled Traffic</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
