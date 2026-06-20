'use client';

import { useState, useEffect, Suspense } from 'react';
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
  Tag,
  AlertTriangle,
  MapPin,
  Scale,
  ShieldAlert,
  IdCard,
  Rocket,
  Save
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, query, where } from 'firebase/firestore';
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
  const [mounted, setMounted] = useState(false);

  // Hold Protocol: Load Draft
  useEffect(() => {
    setMounted(true);
    if (user?.uid) {
      const draft = localStorage.getItem(`ad_draft_${user.uid}`);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setTitle(prev => parsed.title || prev);
          setDescription(prev => parsed.description || prev);
          setTargetUrl(prev => parsed.targetUrl || prev);
          setBudget(prev => parsed.budget || prev);
        } catch (e) {}
      }
    }
  }, [user]);

  // Hold Protocol: Save Draft
  useEffect(() => {
    if (user?.uid && mounted) {
      const draft = { title, description, targetUrl, budget };
      localStorage.setItem(`ad_draft_${user.uid}`, JSON.stringify(draft));
    }
  }, [title, description, targetUrl, budget, user?.uid, mounted]);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: "Campaign Funded",
        description: "Your advertisement is being reviewed for legal and community guidelines! ✨",
      });
    }
  }, [searchParams, toast]);

  const userCurrency = profile?.currency || 'USD';
  const isSeller = profile?.isSeller || false;
  const hasFullCommercialInfo = profile?.address1 && profile?.taxId;

  const handleCreateCampaign = async () => {
    if (!user || !db || !title || !description) return;

    if (!hasFullCommercialInfo) {
      toast({
        variant: "destructive",
        title: "Verification Required",
        description: "Please complete your Business Address and SSN/TIN in Profile before launching ads."
      });
      router.push('/profile?tab=address');
      return;
    }

    const amount = parseFloat(budget);
    
    // Minimum budget of 10 for non-sellers. Sellers can do 0 for free ads.
    if (!isSeller && (isNaN(amount) || amount < 10)) {
      toast({
        variant: "destructive",
        title: "Minimum Budget",
        description: `Minimum ad spend is 10 ${userCurrency}.`
      });
      return;
    }

    setIsCreating(true);
    try {
      const moderation = await moderateText({ 
        text: `${title} - ${description}`,
        context: 'advertisement' 
      });

      if (moderation.isFlagged) {
        toast({
          variant: "destructive",
          title: "Legal or Respect Policy Violation",
          description: moderation.reason || "Your ad content is not allowed on I Love U."
        });
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
        currency: userCurrency,
        status: 'pending',
        isFreeSellerAd: isSeller && amount === 0,
        timestamp: serverTimestamp(),
      });

      // Clear draft on success
      localStorage.removeItem(`ad_draft_${user.uid}`);

      if (amount > 0) {
        await createAdCampaignSession(amount, userCurrency, user.uid, title);
      } else {
        toast({
          title: "Free Campaign Launched!",
          description: "As a Verified Seller, your free ad is now in the review queue. ✨",
        });
        setTitle('');
        setDescription('');
        setTargetUrl('');
        setVideoUrl('');
        setIsCreating(false);
      }
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Operation failed." });
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
          <div className="flex flex-col items-end gap-2">
            {isSeller && (
              <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Rocket className="w-3 h-3" />
                Verified Seller: Free Ads Active
              </Badge>
            )}
            <div className="bg-primary/10 text-primary p-4 rounded-2xl border border-primary/20 flex items-center gap-3">
               <TrendingUp className="w-5 h-5" />
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">Market Reach</p>
                  <p className="text-lg font-bold">12k+ Active Hearts</p>
               </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {!hasFullCommercialInfo && (
              <Card className="rounded-[2.5rem] border-2 border-dashed border-amber-300 bg-amber-50 p-6 flex items-center gap-4">
                 <div className="p-3 bg-white rounded-full text-amber-600 shadow-sm">
                   <IdCard className="w-6 h-6" />
                 </div>
                 <div className="flex-grow">
                   <h3 className="font-black uppercase tracking-tighter text-amber-900">Tax ID Required</h3>
                   <p className="text-xs text-amber-700">Commercial users must provide a Business Address and SSN/TIN for legal compliance before paying.</p>
                 </div>
                 <Button variant="outline" size="sm" onClick={() => router.push('/profile')} className="rounded-xl font-bold bg-white">Verify Now</Button>
              </Card>
            )}

            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 border-b p-8 flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="flex items-center gap-2 text-2xl tracking-tighter">
                     <Plus className="w-5 h-5 text-primary" />
                     New Ad Campaign
                   </CardTitle>
                   <CardDescription>Target legally compliant regions.</CardDescription>
                </div>
                <Save className="w-6 h-6 text-primary/20" />
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
                      <SelectContent className="max-h-80 overflow-y-auto">
                        <SelectItem value="GLOBAL">Global (All Safe Regions)</SelectItem>
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
                      <div className="relative">
                        <Input 
                          id="ad-budget" 
                          type="number" 
                          min={isSeller ? "0" : "10"}
                          value={budget}
                          onChange={e => setBudget(e.target.value)}
                          className={cn("rounded-xl font-bold", isSeller && budget === '0' && "text-green-600 border-green-200")}
                        />
                        {isSeller && budget === '0' && (
                          <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white text-[8px] font-black uppercase">FREE</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-3xl border border-primary/20 space-y-3 shadow-lg">
                   <div className="flex items-center gap-2 text-primary">
                     <Scale className="w-5 h-5" aria-hidden="true" />
                     <h4 className="text-sm font-black uppercase tracking-tighter">Advertiser Liability Agreement</h4>
                   </div>
                   <p className="text-[10px] text-white/80 font-bold leading-relaxed uppercase tracking-widest">
                     By launching this campaign, you acknowledge that you are SOLELY responsible for its content and legal compliance. You have provided a valid Tax ID and Address. The owners, developers, and platform are NOT liable for any damages or legal issues arising from your advertisement.
                   </p>
                </div>

                <Button 
                  className="w-full h-16 rounded-2xl gradient-bg text-lg font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2"
                  onClick={handleCreateCampaign}
                  disabled={isCreating || !title || !description}
                  aria-label="Launch Ad Campaign"
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {!hasFullCommercialInfo ? 'Complete Profile to Launch' : (isSeller && budget === '0' ? 'Launch Free Ad' : 'Accept Liability & Save')}
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
                  <CardContent className="p-5 space-y-2">
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold">{ad.title}</h3>
                       {ad.isFreeSellerAd && <Badge variant="outline" className="text-[7px] text-green-600 border-green-200">SELLER FREE</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t mt-2">
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">{ad.targetCountries?.[0] || 'GLOBAL'}</span>
                       <Badge variant="outline" className="text-[9px] uppercase font-black">{ad.status}</Badge>
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

export default function AdvertiserManagePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <AdvertiserManageContent />
    </Suspense>
  );
}
