
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
import { Sparkles, Camera, Loader2, Save, LogOut, Globe, Heart, Zap, ShieldAlert, Lock, User, Church, Filter } from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Portuguese', 'Russian'
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const RELIGIONS = [
  'Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Sikhism', 'Atheist', 'Agnostic', 'Other', 'None'
];

const AGE_RANGES = [
  { id: '18-33', label: '18 - 33' },
  { id: '34-49', label: '34 - 49' },
  { id: '50-65', label: '50 - 65' },
  { id: '66+', label: '66+' }
];

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

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

  const handleGenerateBio = async () => {
    if (!interests) {
      toast({
        title: "Interests required",
        description: "Please list some interests to help the AI generate your bio.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateBio({ 
        interests: interests.split(',').map(s => s.trim()),
        language: preferredLanguage 
      });
      setBio(result.bio);
      toast({
        title: "Bio generated!",
        description: `Your bio has been generated in ${preferredLanguage}.`
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAgeRangeToggle = (rangeId: string) => {
    setPreferredAgeRanges(prev => 
      prev.includes(rangeId) 
        ? prev.filter(id => id !== rangeId) 
        : [...prev, rangeId]
    );
  };

  const handleSave = async () => {
    if (!user || !db) return;

    const userAge = parseInt(age);
    if (isNaN(userAge) || userAge < 18) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You must be 18 years or older to use Spark. Accounts for minors are prohibited."
      });
      return;
    }

    if (!gender) {
      toast({
        variant: "destructive",
        title: "Gender Required",
        description: "Please specify your gender to find compatible matches."
      });
      return;
    }
    
    const profileRef = doc(db, 'users', user.uid);
    setDoc(profileRef, {
      displayName,
      age: userAge,
      gender,
      religion,
      bio,
      interests: interests.split(',').map(s => s.trim()).filter(i => i),
      preferredLanguage,
      settings: {
        allowSensitiveContent
      },
      preferences: {
        preferredAgeRanges
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });

    toast({
      title: "Profile saved!",
      description: "Your changes have been updated."
    });
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      
      <main className="container mx-auto px-4 max-w-2xl py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black tracking-tighter">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-full">
              <LogOut className="w-4 h-4" />
            </Button>
            <Button onClick={handleSave} className="gradient-bg rounded-full gap-2 px-6">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800 rounded-2xl">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">Age Restriction Policy</AlertTitle>
          <AlertDescription className="text-xs">
            Spark is strictly for individuals 18 years of age and older. Providing false information about your age will result in permanent account suspension.
          </AlertDescription>
        </Alert>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-8 border">
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full bg-accent flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative">
                <Camera className="w-10 h-10 text-primary opacity-50" />
              </div>
              <Button size="icon" className="absolute bottom-1 right-1 rounded-full gradient-bg border-4 border-white">
                <Camera className="w-4 h-4 text-white" />
              </Button>
            </div>
            
            <div className="flex flex-col items-center gap-2">
               {profileData?.relationshipStatus === 'dating' ? (
                 <Badge className="bg-primary text-white gap-1 px-4 py-1 animate-pulse">
                   <Zap className="w-3 h-3 fill-white" />
                   Currently Sparking
                 </Badge>
               ) : (
                 <Badge variant="outline" className="text-muted-foreground gap-1 px-4 py-1">
                   <Heart className="w-3 h-3" />
                   Looking for a Spark
                 </Badge>
               )}
               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                 <ShieldAlert className="w-3 h-3" />
                 Verified Adult Space
               </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How others see you" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Your Age (18+)</Label>
              <Input 
                id="age" 
                type="number" 
                value={age} 
                onChange={e => setAge(e.target.value)} 
                placeholder="21" 
                className={`rounded-xl ${parseInt(age) < 18 ? 'border-red-500 text-red-500' : ''}`} 
              />
              {parseInt(age) < 18 && (
                <p className="text-[10px] text-red-500 font-bold">You must be 18 or older.</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Church className="w-4 h-4" />
                Religion
              </Label>
              <Select value={religion} onValueChange={setReligion}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {RELIGIONS.map(rel => (
                    <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Preferred Language
              </Label>
              <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="pt-4 space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-black tracking-tight flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Age Preferences (Multi-Select)
              </Label>
              <p className="text-xs text-muted-foreground">Select one or more age categories you are interested in (15-year intervals).</p>
              
              <div className="grid grid-cols-2 gap-4">
                {AGE_RANGES.map((range) => (
                  <div key={range.id} className="flex items-center space-x-3 p-4 bg-muted/20 rounded-xl border border-transparent hover:border-primary/20 transition-colors">
                    <Checkbox 
                      id={`range-${range.id}`} 
                      checked={preferredAgeRanges.includes(range.id)}
                      onCheckedChange={() => handleAgeRangeToggle(range.id)}
                    />
                    <Label htmlFor={`range-${range.id}`} className="cursor-pointer font-bold">{range.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Settings */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Allow Sensitive Content
                </Label>
                <p className="text-xs text-muted-foreground max-w-[250px]">
                  If enabled, you may receive explicit images in chat. We moderate all content by default.
                </p>
              </div>
              <Switch 
                checked={allowSensitiveContent} 
                onCheckedChange={setAllowSensitiveContent} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma separated)</Label>
            <Input id="interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="Coffee, Hiking, Coding, Travel" className="rounded-xl" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio">Bio</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleGenerateBio} 
                disabled={isGenerating}
                className="text-primary font-bold gap-2 hover:bg-primary/5"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                AI Generate
              </Button>
            </div>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              className="min-h-[150px] rounded-2xl resize-none" 
              placeholder="Tell your story..." 
            />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
