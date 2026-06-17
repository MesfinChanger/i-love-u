
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Sparkles, Camera, Loader2, Save, LogOut, Globe, Heart, Zap } from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { Badge } from '@/components/ui/badge';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Italian', 'Portuguese', 'Russian'
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
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || '');
      setAge(profileData.age?.toString() || '');
      setBio(profileData.bio || '');
      setInterests(profileData.interests?.join(', ') || '');
      setPreferredLanguage(profileData.preferredLanguage || 'English');
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

  const handleSave = async () => {
    if (!user || !db) return;
    
    const profileRef = doc(db, 'users', user.uid);
    setDoc(profileRef, {
      displayName,
      age: parseInt(age) || 0,
      bio,
      interests: interests.split(',').map(s => s.trim()).filter(i => i),
      preferredLanguage,
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
               <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                 One date limit active
               </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How others see you" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className="rounded-xl" />
            </div>
          </div>

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
            <p className="text-[10px] text-muted-foreground ml-1">AI features will use this language.</p>
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
            <p className="text-[10px] text-muted-foreground">Generating bio in: <strong>{preferredLanguage}</strong></p>
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
