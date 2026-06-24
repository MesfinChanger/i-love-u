"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  AtSign,
  Lock,
  Globe,
  Sparkles,
  Scale,
  AlertTriangle,
  ScrollText,
  Gavel,
  FileText,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateKeyPair } from '@/lib/crypto';
import { COUNTRIES } from '@/lib/world-data';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

function LoginContent() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pre-Sign-Up Consent State
  const [agreedAge, setAgreedAge] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedResponsibility, setAgreedResponsibility] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      const hasAccepted = localStorage.getItem('iloveu_policy_accepted') === 'true';
      router.push(hasAccepted ? '/discover' : '/policy/agree');
    }
  }, [user, authLoading, router]);

  const handleAuth = async () => {
    if (!email || !password || !auth) return;
    
    if (mode === 'signup') {
      if (!nickname) {
        toast({ variant: "destructive", title: "Identity Required", description: "Please choose a community nickname. ❤️" });
        return;
      }
      if (!agreedAge || !agreedTerms || !agreedResponsibility) {
        toast({ variant: "destructive", title: "Consent Required", description: "You must check all mandatory agreements to join. ✨" });
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const { publicKey, privateKey } = await generateKeyPair();
        localStorage.setItem(`spark_priv_${res.user.uid}`, privateKey);
        localStorage.setItem('iloveu_policy_accepted', 'true');

        if (db) {
          await setDoc(doc(db, 'users', res.user.uid), {
            uid: res.user.uid, 
            email, 
            country, 
            publicKey,
            publicNickname: nickname,
            displayName: nickname,
            preferredLanguage: language,
            createdAt: serverTimestamp(),
            policyAccepted: true,
            policyAcceptedAt: serverTimestamp(),
            legalConsent: {
              ageVerified: true,
              termsAgreed: true,
              responsibilityAcknowledged: true,
              timestamp: new Date().toISOString()
            }
          }, { merge: true });

          await setDoc(doc(db, 'publicProfiles', res.user.uid), {
            uid: res.user.uid,
            publicNickname: nickname,
            country: country || 'Global',
            verified: false,
            bio: "New heart joining the revolution.",
            photoUrl: null,
            age: 18
          });
        }
        router.push('/discover');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({ 
        variant: "destructive", 
        title: "Access Ripple", 
        description: error.message || "Verify your credentials and join again. ❤️" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSignupDisabled = isLoading || !email || !password || !nickname || !agreedAge || !agreedTerms || !agreedResponsibility;

  if (authLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <Link href="/" className="absolute top-12 left-10 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-[10px] uppercase tracking-widest">
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      <div className="w-full max-w-md space-y-10 z-10">
        <div className="text-center space-y-6">
          <Heart className="w-16 h-16 fill-primary text-primary mx-auto animate-heartbeat" />
          <div className="space-y-2">
            <h1 className="font-black text-3xl tracking-[0.6em] text-primary uppercase ml-[0.6em]">I LOVE U</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">Prosperity Revolution</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_30px_100px_-10px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden bg-white">
          <div className="bg-primary/5 p-8 border-b text-center relative overflow-hidden group">
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-primary/10 group-hover:rotate-12 transition-transform" />
            <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Mission Protocol</p>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 h-16 bg-white p-1 border-b">
              <TabsTrigger value="signin" className="font-black uppercase text-[10px] tracking-widest data-[state=active]:text-primary">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-black uppercase text-[10px] tracking-widest data-[state=active]:text-primary">Join</TabsTrigger>
            </TabsList>
            
            <CardContent className="p-10 space-y-6">
              {mode === 'signup' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      value={nickname} 
                      onChange={e => setNickname(e.target.value)} 
                      placeholder="Community Nickname" 
                      className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" 
                    />
                  </div>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="h-14 rounded-2xl border-none bg-muted/30 px-6 font-bold">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <SelectValue placeholder="Select Country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-64 rounded-2xl border-none shadow-2xl">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code} className="rounded-xl py-3 font-medium">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email Address" 
                    className="h-14 pl-12 rounded-2xl border-none bg-muted/30 font-bold" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Secure Phrase" 
                      className="h-14 pl-12 pr-12 rounded-2xl border-none bg-muted/30 font-bold" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {mode === 'signin' && (
                    <div className="flex justify-end px-1">
                      <Link href="/login/reset" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                        Forgot Secure Phrase?
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-4 pt-2 border-t border-dashed animate-in fade-in duration-500">
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <Checkbox 
                      id="age-verify" 
                      checked={agreedAge} 
                      onCheckedChange={(checked) => setAgreedAge(!!checked)} 
                      className="mt-1 border-slate-400 data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="age-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700 cursor-pointer">
                      I am at least 18 years old.
                    </label>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <Checkbox 
                      id="terms-verify" 
                      checked={agreedTerms} 
                      onCheckedChange={(checked) => setAgreedTerms(!!checked)} 
                      className="mt-1 border-slate-400 data-[state=checked]:bg-primary"
                    />
                    <div className="text-[10px] font-black uppercase tracking-tight text-slate-700">
                      I have read and agree to the <TermsDialog /> and <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                    <Checkbox 
                      id="responsibility-verify" 
                      checked={agreedResponsibility} 
                      onCheckedChange={(checked) => setAgreedResponsibility(!!checked)} 
                      className="mt-1 border-primary data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="responsibility-verify" className="text-[10px] font-black uppercase tracking-tight text-slate-700 cursor-pointer">
                      I understand that interactions with other users are my own responsibility and that the platform does not guarantee identity, safety, compatibility, employment, business opportunities, or relationship outcomes.
                    </label>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleAuth} 
                disabled={mode === 'signup' ? isSignupDisabled : (isLoading || !email || !password)} 
                className={cn(
                  "w-full h-16 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95",
                  (mode === 'signup' && isSignupDisabled) ? "bg-slate-200 text-slate-400" : "gradient-bg shadow-primary/20"
                )}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'signin' ? 'Launch Spark' : 'Join the Revolution'}
              </Button>

              <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-[0.3em]">
                Mandatory Respect • Secured Journey
              </p>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function TermsDialog() {
  const [lastUpdated, setLastUpdated] = useState('');
  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-primary underline uppercase hover:text-primary/80 transition-colors">Terms of Service</button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh] overflow-hidden flex flex-col p-0 rounded-[3rem] border-none shadow-2xl bg-white">
        <DialogHeader className="p-8 bg-slate-900 text-white shrink-0 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase leading-none">Terms of Service</DialogTitle>
              <DialogDescription className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Legal Control • v2.1.0</DialogDescription>
            </div>
          </div>
          <DialogClose className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </DialogClose>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-10 space-y-10 no-scrollbar">
          <div className="space-y-4">
             <h2 className="text-xl font-black tracking-tighter uppercase">I LOVE U – TERMS OF SERVICE & LEGAL DISCLAIMER</h2>
             <p className="text-xs text-muted-foreground font-bold italic">Last Updated: {lastUpdated}</p>
          </div>

          <div className="grid gap-10">
            <LegalSection number="1" title="Acceptance of Terms">
              By accessing, downloading, registering for, or using the I Love U platform ("Platform"), you agree to be legally bound by these Terms of Service, Privacy Policy, Community Standards, and all applicable laws and regulations. If you do not agree to these Terms, you must discontinue use of the Platform immediately.
            </LegalSection>

            <LegalSection number="2" title="Eligibility">
              You represent and warrant that: You are at least 18 years of age; You possess legal capacity to enter into a binding agreement; You will provide accurate information; You are not prohibited from using the Platform under applicable laws. The Platform may suspend or terminate accounts that provide false information or violate eligibility requirements.
            </LegalSection>

            <LegalSection number="3" title="User Conduct">
              Users agree not to: Harass, threaten, stalk, or abuse others; Publish unlawful, defamatory, misleading, fraudulent, or harmful content; Upload content that infringes intellectual property rights; Distribute malware, spam, or unauthorized advertising; Circumvent security protections; Create fake identities intended to deceive others.
            </LegalSection>

            <LegalSection number="4" title="User Generated Content">
              Users retain ownership of content they submit. By posting content, you grant the Platform a worldwide, non-exclusive, royalty-free license to host, display, reproduce, distribute, and operate such content solely for purposes of providing and improving the service.
            </LegalSection>

            <LegalSection number="5" title="Community Guidelines">
              Respect is mandatory. Users agree to engage in lawful, respectful, and non-discriminatory conduct. Content promoting violence, exploitation, hate speech, harassment, illegal activities, or abuse may be removed without notice.
            </LegalSection>

            <LegalSection number="6" title="Messaging and Communications">
              The Platform may provide messaging features, including encrypted communications. While reasonable security measures may be implemented, no system can guarantee absolute security. Users acknowledge that electronic communications involve inherent risks.
            </LegalSection>

            <LegalSection number="7" title="Relationships and Personal Interactions">
              The Platform facilitates introductions and communication between users. The Platform: Does not conduct comprehensive background investigations; Does not guarantee user identity; Does not guarantee compatibility; Does not guarantee relationship outcomes. Users assume full responsibility for their interactions and personal decisions.
            </LegalSection>

            <LegalSection number="8" title="Marketplace, Donations, and Payments">
              Transactions are processed through third-party payment providers. The Platform is not responsible for: Banking failures, Payment processor interruptions, Currency fluctuations, Tax obligations, or Third-party merchant conduct. Users are responsible for compliance with applicable tax regulations.
            </LegalSection>

            <LegalSection number="9" title="Intellectual Property">
              All trademarks, logos, branding, software, designs, graphics, and platform content are protected by intellectual property laws. No rights are granted except those expressly provided herein.
            </LegalSection>

            <div className="p-8 bg-red-50 rounded-[2rem] border-2 border-dashed border-red-200">
               <h4 className="text-sm font-black uppercase text-red-600 mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4" /> 10. Limitation of Liability
               </h4>
               <div className="text-[10px] text-red-900/60 font-black uppercase leading-relaxed tracking-widest italic space-y-4">
                  <p>THE PLATFORM SHALL NOT BE LIABLE FOR: INDIRECT DAMAGES, INCIDENTAL DAMAGES, SPECIAL DAMAGES, CONSEQUENTIAL DAMAGES, LOSS OF PROFITS, LOSS OF DATA, OR PERSONAL INJURY.</p>
               </div>
            </div>

            <LegalSection number="11" title="Indemnification">
              You agree to defend, indemnify, and hold harmless the Platform, its owners, affiliates, and agents from claims arising from your use of the service, your content, your conduct, or your violation of these Terms.
            </LegalSection>

            <LegalSection number="12" title="Account Suspension and Termination">
              The Platform may suspend, restrict, or terminate any account at any time for violations, fraud, security concerns, or legal compliance. Termination may occur without prior notice.
            </LegalSection>

            <LegalSection number="13" title="Privacy">
              Collection and processing of personal information are governed by the Privacy Policy. By using the Platform, you consent to the collection, storage, and processing of information as described therein.
            </LegalSection>

            <LegalSection number="14" title="Governing Law">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Platform operator is established.
            </LegalSection>

            <LegalSection number="15" title="Changes to Terms">
              The Platform may modify these Terms at any time. Continued use of the Platform after modifications constitutes acceptance of the revised Terms.
            </LegalSection>

            <LegalSection number="16" title="Contact">
              Questions regarding these Terms may be submitted through the Platform's official support channels.
            </LegalSection>
          </div>
        </div>

        <div className="p-8 border-t bg-slate-50/50 flex flex-col items-center gap-4 text-center shrink-0">
           <Heart className="w-6 h-6 text-primary" />
           <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
             Eliminating World Poverty Together ❤️ Reaching Every Heart
           </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LegalSection({ number, title, children }: { number: string, title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black shrink-0">{number}</span>
        <h5 className="font-black text-xs uppercase tracking-tight">{title}</h5>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground font-medium pl-11">
        {children}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
