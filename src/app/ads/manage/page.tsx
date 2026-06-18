
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
  Globe2,
  Video,
  Type,
  Badge,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { createAdCampaignSession } from '@/lib/stripe-actions';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { moderateText } from '@/ai/flows/moderate-text-flow';

const COUNTRIES = [
  { code: 'GLOBAL', name: 'Global (All Safe Countries)' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'JP', name: 'Japan' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' }
];

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

  const [adType, setAdType] = useState<'text' | 'video'>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [targetCountry, setTargetCountry] = useState('GLOBAL');
  const [budget, setBudget] = useState('50');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Campaign Funded",
        description: "Your advertisement is being reviewed for legal and community guidelines! ✨",
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
      // Moderate content for legal compliance
      const moderation = await moderateText({ 
        text: `${title} - ${description}`,
        context: 'advertisement' 
      });

      if (moderation.isFlagged) {
        toast({
          variant: "destructive",
          title: "Legal or Respect Policy Violation",
          description: moderation.reason || "Your ad content is not allowed on Spark."
        });
        setIsCreating(false);
        return;
      }

      // Create the record first (pending payment)
      await addDoc(collection(db, 'ads'), {
        advertiserId: user.uid,
        adType,
        title,
        description,
        targetUrl,
        videoUrl: adType === 'video' ? videoUrl : null,
        targetCountries: targetCountry === 'GLOBAL' ? COUNTRIES.map(c => c.code) : [targetCountry],
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
            <p className="text-muted-foreground">Promote legally and respectfully to our community.</p>
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
                <CardDescription>Target legally compliant regions.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <Tabs value={adType} onValueChange={(v) => setAdType(v as 'text' | 'video')} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full h-12 rounded-xl mb-6">
                    <TabsTrigger value="text" className="rounded-lg gap-2">
                      <Type className="w-4 h-4" />
                      Text Ad
                    </TabsTrigger>
                    <TabsTrigger value="video" className="rounded-lg gap-2">
                      <Video className="w-4 h-4" />
                      Video Ad
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ad-title">Campaign Title</Label>
                    <Input 
                      id="ad-title" 
                      placeholder="e.g. Visit our local bakery!" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target-country">Legal Target Region</Label>
                    <Select value={targetCountry} onValueChange={setTargetCountry}>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder="Select Target Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(c => (
                          <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {adType === 'video' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                      <Label htmlFor="ad-video">Video URL (Direct link to MP4)</Label>
                      <Input 
                        id="ad-video" 
                        type="url"
                        placeholder="https://example.com/ad-video.mp4" 
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        className="rounded-xl h-12"
                      />
                    </div>
                  )}

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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ad-url">Website Link</Label>
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
                      <Label htmlFor="ad-budget">Budget ({userCurrency})</Label>
                      <Input 
                        id="ad-budget" 
                        type="number" 
                        min="10"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        className="rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-dashed border-amber-200 flex items-start gap-3">
                   <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tighter">
                     Legal Notice: You are responsible for ensuring your advertisement complies with the laws of your country and targeted regions. Illegal solicitation will result in permanent ban without refund.
                   </p>
                </div>

                <Button 
                  className="w-full h-14 rounded-xl gradient-bg text-lg font-bold shadow-xl shadow-primary/20"
                  onClick={handleCreateCampaign}
                  disabled={isCreating || !title || !description}
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                  Launch Legal Campaign
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
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{ad.targetCountries?.[0] || 'GLOBAL'}</span>
                    </div>
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
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="uppercase">Legally Verified</span>
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
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
