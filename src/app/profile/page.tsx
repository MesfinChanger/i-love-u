'use client';

import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sparkles, 
  Loader2, 
  Save, 
  LogOut, 
  Globe2,
  User,
  ShieldCheck,
  Camera,
  MapPin
} from 'lucide-react';
import { generateBio } from '@/ai/flows/generate-bio-flow';
import { moderateText } from '@/ai/flows/moderate-text-flow';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useAuth, useDoc } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, Democratic Republic' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: 'Cote d\'Ivoire' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'Korea, North' },
  { code: 'KR', name: 'Korea, South' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Barbuda' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];

function ProfileContent() {
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

  // Identity Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('GLOBAL');
  const [bio, setBio] = useState('');
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);

  // Address Fields
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Mandatory Security Protocol
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setDisplayName(profileData.displayName || '');
      setBirthdate(profileData.birthdate || '');
      setGender(profileData.gender || '');
      setCountry(profileData.country || 'GLOBAL');
      setBio(profileData.bio || '');
      setPublicNickname(profileData.publicNickname || '');
      setIsPhotoPublic(profileData.isPhotoPublic || false);
      
      setAddress1(profileData.address1 || '');
      setAddress2(profileData.address2 || '');
      setCity(profileData.city || '');
      setState(profileData.state || '');

      setIsAgeVerified(profileData.isAgeVerified || false);
      setIsRespectful(profileData.isRespectful || false);
      setIsHuman(profileData.isHuman || false);
    }
  }, [profileData]);

  const calculateAge = (bday: string) => {
    if (!bday) return 0;
    const today = new Date();
    const birthDate = new Date(bday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateSecurity = () => {
    if (!isAgeVerified || !isRespectful || !isHuman) {
      toast({ 
        variant: "destructive", 
        title: "Security Protocol Mandatory", 
        description: "Please complete the Security tab confirmations to sync identity." 
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!user || !db || isSaving) return;

    if (!validateSecurity()) return;

    const userAge = calculateAge(birthdate);
    if (birthdate && userAge < 18) {
      toast({ variant: "destructive", title: "Age Restriction", description: "You must be 18+ to join." });
      return;
    }

    setIsSaving(true);
    try {
      const moderation = await moderateText({ text: `${displayName} ${bio} ${publicNickname}` });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Policy", description: moderation.reason });
        setIsSaving(false);
        return;
      }
      
      const updateData = {
        uid: user.uid,
        firstName,
        lastName,
        displayName, 
        birthdate,
        age: userAge, 
        gender, 
        bio, 
        address1,
        address2,
        city,
        state,
        country, 
        publicNickname,
        isPhotoPublic,
        isAgeVerified,
        isRespectful,
        isHuman,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });

      // Create birth month/day string for privacy
      let monthDay = "Secret";
      if (birthdate) {
        const bDate = new Date(birthdate);
        monthDay = bDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid,
        bio,
        publicNickname: publicNickname || null,
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null,
        country: country,
        birthMonthDay: monthDay,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Profile Synced", description: "Identity updated successfully. ❤️" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not sync profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const result = await generateBio({ interests: ['Respect', 'Love', 'Prosperity'] });
      setBio(result.bio);
    } finally {
      setIsGenerating(false);
    }
  };

  if (profileLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-muted/30 pb-24">
      <Header />
      <main className="container mx-auto px-6 max-w-3xl py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">Identity</h1>
            <p className="text-muted-foreground mt-1 font-medium italic">Your community presence and global origin.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => signOut(auth)} className="rounded-xl h-12 px-6 font-black uppercase text-[9px] tracking-widest transition-all">Sign Out</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gradient-bg rounded-xl h-12 px-8 font-black uppercase text-[9px] tracking-widest shadow-xl transition-all">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}Sync
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full h-14 bg-white/50 rounded-xl p-1 mb-10 border shadow-sm backdrop-blur-md">
            <TabsTrigger value="personal" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><User className="w-3 h-3" />Personal</TabsTrigger>
            <TabsTrigger value="address" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><MapPin className="w-3 h-3" />Address</TabsTrigger>
            <TabsTrigger value="public" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><Globe2 className="w-3 h-3" />Public</TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest"><ShieldCheck className="w-3 h-3" />Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Display Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Birthdate</Label>
                  <Input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  <p className="text-[8px] text-muted-foreground ml-2 uppercase font-black tracking-widest">* Year is hidden from public profiles.</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Gender Identity</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                  <SelectContent>{GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="address">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Commercial Address</h3>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 2 (Optional)</Label>
                  <Input value={address2} onChange={e => setAddress2(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">City</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">State / Province</Label>
                    <Input value={state} onChange={e => setState(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Global Origin</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Unique Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. HeartConnector" className="rounded-xl h-14 bg-muted/10 border-2 border-primary/5 px-6 font-black text-primary shadow-inner" />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Camera className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-tight">Show Public Photo</h4>
                          <p className="text-[9px] opacity-60 font-medium italic mt-0.5">Toggle visibility in global feed.</p>
                        </div>
                     </div>
                     <Switch checked={isPhotoPublic} onCheckedChange={setIsPhotoPublic} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-2">
                      <Label className="text-[9px] font-black uppercase tracking-widest opacity-60">Personal Bio</Label>
                      <Button variant="ghost" size="sm" onClick={handleGenerateBio} disabled={isGenerating} className="text-primary gap-2 font-black text-[9px] uppercase h-9 px-4 bg-muted/20 rounded-full">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}AI Spark
                      </Button>
                    </div>
                    <Textarea value={bio} onChange={e => setBio(e.target.value)} className="min-h-[160px] rounded-2xl bg-muted/10 border-none p-6 italic font-medium leading-relaxed shadow-inner" placeholder="Tell the community about your mission..." />
                  </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-8">
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-primary mx-auto animate-pulse" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Security Protocol</h3>
                <p className="text-xs text-muted-foreground font-medium italic">Mandatory confirmations for every heart.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsAgeVerified(!isAgeVerified)}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isAgeVerified ? "border-primary bg-primary" : "border-slate-200")}>
                        {isAgeVerified && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">I AM 18+ YEARS OLD</span>
                    </div>
                    <div className="flex items-center space-x-3 pt-3 border-t border-primary/10 cursor-pointer" onClick={() => setIsRespectful(!isRespectful)}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isRespectful ? "border-primary bg-primary" : "border-slate-200")}>
                        {isRespectful && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">RESPECT & LOVE IS MANDATORY</span>
                    </div>
                    <div className="flex items-center space-x-3 pt-3 border-t border-primary/10 cursor-pointer" onClick={() => setIsHuman(!isHuman)}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isHuman ? "border-primary bg-primary" : "border-slate-200")}>
                        {isHuman && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">VERIFY HUMAN STATUS</span>
                    </div>
                </div>
                <p className="text-[8px] text-muted-foreground italic text-center uppercase tracking-widest">
                  * All boxes must be checked to sync identity.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
