
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  Camera, 
  Loader2, 
  Save, 
  LogOut, 
  Heart, 
  Zap, 
  ShieldAlert, 
  Lock, 
  Filter, 
  Trash2,
  Gift,
  Star,
  CheckCircle
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];
const RELIGIONS = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Sikhism', 'Atheist', 'Agnostic', 'None'];
const AGE_RANGES = [
  { id: '18-33', label: '18 - 33' },
  { id: '34-49', label: '34 - 49' },
  { id: '50-65', label: '50 - 65' },
  { id: '66+', label: '66+' }
];

const DONATION_TIERS = [
  { id: 'tier-1', name: 'Coffee Support', price: '$5', icon: '☕' },
  { id: 'tier-2', name: 'Big Spark', price: '$15', icon: '🔥' },
  { id: 'tier-3', name: 'Community Hero', price: '$50', icon: '👑' }
];

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profileData, loading: profileLoading } = useDoc(userRef);

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [allowSensitiveContent, setAllowSensitiveContent] = useState(false);
  const [preferredAgeRanges, setPreferredAgeRanges] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDonating, setIsDonating] = useState(false);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || '');
      setAge(profileData.age?.toString() || '');
      setGender(profileData.gender || '');
      setReligion(profileData.religion || '');
      setBio(profileData.bio || '');
      setInterests(profileData.interests?.join(', ') || '');
      setPreferredLanguage(profileData.preferredLanguage || 'English');
      setAllowSensitiveContent(profileData.settings?.allowSensitiveContent || false);
      setPreferredAgeRanges(profileData.preferences?.preferredAgeRanges || []);
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!user || !db) return;
    const userAge = parseInt(age);
    if (isNaN(userAge) || userAge < 18) {
      toast({ variant: "destructive", title: "Restricted", description: "You must be 18+ to use Spark." });
      return;
    }
    
    setDoc(doc(db, 'users', user.uid), {
      displayName, age: userAge, gender, religion, bio,
      interests: interests.split(',').map(s => s.trim()).filter(i => i),
      preferredLanguage,
      settings: { allowSensitiveContent },
      preferences: { preferredAgeRanges },
      updatedAt: new Date().toISOString()
    }, { merge: true });

    toast({ title: "Saved!", description: "Profile updated successfully." });
  };

  const handleDonate = async (tierName: string) => {
    if (!user || !db) return;
    setIsDonating(true);
    // Simulate payment processing
    setTimeout(async () => {
      await setDoc(doc(db, 'users', user.uid), {
        isSupporter: true,
      }, { merge: true });
      
      toast({ 
        title: "Thank You!", 
        description: `Your ${tierName} donation keeps Spark free for everyone.` 
      });
      setIsDonating(false);
    }, 1500);
  };

  const handleGenerateBio = async () => {
    if (!interests) return toast({ title: "Interests required", variant: "destructive" });
    setIsGenerating(true);
    try {
      const result = await generateBio({ 
        interests: interests.split(',').map(s => s.trim()), 
        language: preferredLanguage 
      });
      setBio(result.bio);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !db) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      toast({ title: "Account Deleted", description: "Your data has been removed from Spark." });
      router.push('/');
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Please re-login to verify your identity before deleting your account." 
      });
      setIsDeleting(false);
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-4 max-w-2xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black tracking-tighter">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => signOut(auth)} className="rounded-full"><LogOut className="w-4 h-4" /></Button>
            <Button onClick={handleSave} className="gradient-bg rounded-full gap-2 px-6"><Save className="w-4 h-4" />Save</Button>
          </div>
        </div>

        {/* Donation Banner */}
        <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Support the Community</h3>
              <p className="text-xs text-muted-foreground italic">Keep Spark free and AI-powered for everyone.</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full px-6 gradient-bg shadow-lg shadow-primary/20">Donate</Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-primary text-primary" />
                  Support Spark
                </DialogTitle>
                <DialogDescription className="text-base">
                  Choose a donation tier to help us cover server costs and AI development. Supporters get a special badge on their profile!
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {DONATION_TIERS.map((tier) => (
                  <Button 
                    key={tier.id} 
                    variant="outline" 
                    className="h-20 rounded-2xl flex justify-between px-6 hover:bg-primary/5 hover:border-primary transition-all group"
                    onClick={() => handleDonate(tier.name)}
                    disabled={isDonating}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{tier.icon}</span>
                      <div className="text-left">
                        <p className="font-bold text-lg leading-none mb-1">{tier.name}</p>
                        <p className="text-xs text-muted-foreground">One-time donation</p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-primary">{tier.price}</span>
                  </Button>
                ))}
              </div>
              <DialogFooter className="text-center sm:justify-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  100% of proceeds go to app maintenance
                </p>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Alert variant="destructive" className="mb-6 rounded-2xl bg-red-50 border-red-200">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">18+ Only Environment</AlertTitle>
          <AlertDescription className="text-xs">Spark strictly prohibits minors. Ensure your age is accurate.</AlertDescription>
        </Alert>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-8 border">
          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-full bg-accent flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative">
              <Camera className="w-10 h-10 text-primary opacity-30" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {profileData?.isSupporter && (
                <Badge className="bg-yellow-500 text-white gap-1 py-1 px-3 rounded-full">
                  <Star className="w-3 h-3 fill-white" /> Supporter
                </Badge>
              )}
              {profileData?.relationshipStatus === 'dating' && (
                <Badge className="bg-primary text-white gap-1 animate-pulse"><Zap className="w-3 h-3 fill-white" />Currently Sparking</Badge>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (18+)</Label>
              <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <Select value={religion} onValueChange={setReligion}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{RELIGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="font-black text-lg flex items-center gap-2"><Filter className="w-5 h-5 text-primary" />Dating Preferences</Label>
            <div className="grid grid-cols-2 gap-3">
              {AGE_RANGES.map(range => (
                <div key={range.id} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-xl border">
                  <Checkbox 
                    id={range.id} 
                    checked={preferredAgeRanges.includes(range.id)}
                    onCheckedChange={() => setPreferredAgeRanges(prev => prev.includes(range.id) ? prev.filter(p => p !== range.id) : [...prev, range.id])}
                  />
                  <Label htmlFor={range.id}>{range.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border">
            <div className="space-y-1">
              <Label className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" />Sensitive Content</Label>
              <p className="text-[10px] text-muted-foreground">Toggle image moderation filters.</p>
            </div>
            <Switch checked={allowSensitiveContent} onCheckedChange={setAllowSensitiveContent} />
          </div>

          <div className="space-y-2">
            <Label>Interests (comma separated)</Label>
            <Input value={interests} onChange={e => setInterests(e.target.value)} className="rounded-xl" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Bio</Label>
              <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2">
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}AI Bio
              </Button>
            </div>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[120px] rounded-2xl" />
          </div>

          <div className="pt-8 border-t">
            <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter text-xs">
              <Trash2 className="w-4 h-4" /> Danger Zone
            </h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full rounded-xl gap-2 h-12">
                  Delete Account & Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2rem]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your profile data, matches, and messages from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-[10px] text-muted-foreground text-center mt-4">
              Spark follows strict privacy guidelines for data deletion.
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
