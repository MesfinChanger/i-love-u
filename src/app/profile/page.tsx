'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Camera, Loader2, Save, LogOut } from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
      const result = await generateBio({ interests: interests.split(',').map(s => s.trim()) });
      setBio(result.bio);
      toast({
        title: "Bio generated!",
        description: "Your AI-powered bio is ready."
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    const profileRef = doc(db, 'users', user.uid);
    setDoc(profileRef, {
      displayName,
      age: parseInt(age),
      bio,
      interests: interests.split(',').map(s => s.trim()),
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
            <Button onClick={handleSave} className="gradient-bg rounded-full gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-8 border">
          {/* Photo Section */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full bg-accent flex items-center justify-center border-4 border-white shadow-xl overflow-hidden relative">
                <Camera className="w-10 h-10 text-primary opacity-50" />
              </div>
              <Button size="icon" className="absolute bottom-1 right-1 rounded-full gradient-bg border-4 border-white">
                <Camera className="w-4 h-4 text-white" />
              </Button>
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
