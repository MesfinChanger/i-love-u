'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Camera, Loader2, Save } from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-10 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-black">Your Profile</h1>
            <Button onClick={handleSave} className="gradient-bg gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>

          <div className="space-y-8">
            {/* Photo Section */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-accent flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                  <Camera className="w-10 h-10 text-primary opacity-50" />
                </div>
                <Button size="icon" className="absolute bottom-1 right-1 rounded-full gradient-bg">
                  <Camera className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How others see you" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma separated)</Label>
              <Input id="interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="Coffee, Hiking, Coding, Travel" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Bio</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGenerateBio} 
                  disabled={isGenerating}
                  className="text-primary font-bold gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  AI Generate
                </Button>
              </div>
              <Textarea 
                id="bio" 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                className="min-h-[150px]" 
                placeholder="Tell your story..." 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
