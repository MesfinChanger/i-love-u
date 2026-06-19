'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { 
  Sparkles, 
  Loader2, 
  Save, 
  LogOut, 
  Globe2,
  User,
  ShieldCheck,
  Camera,
  MapPin,
  Lock
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
import { cn } from '@/lib/utils';

const GENDERS = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AX', name: 'Aland Islands' }, { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' }, { code: 'AS', name: 'American Samoa' }, { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' }, { code: 'AI', name: 'Anguilla' }, { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' }, { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' }, { code: 'AU', name: 'Australia' }, { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' }, { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' }, { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' }, { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
  { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' }, { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' }, { code: 'BV', name: 'Bouvet Island' }, { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' }, { code: 'BN', name: 'Brunei Darussalam' },
  { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' }, { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde' }, { code: 'KH', name: 'Cambodia' }, { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' }, { code: 'KY', name: 'Cayman Islands' }, { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' }, { code: 'CC', name: 'Cocos (Keeling) Islands' }, { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' }, { code: 'CD', name: 'Congo, Democratic Republic of the' },
  { code: 'CK', name: 'Cook Islands' }, { code: 'CR', name: 'Costa Rica' }, { code: 'CI', name: 'Cote d\'Ivoire' },
  { code: 'HR', name: 'Croatia' }, { code: 'CU', name: 'Cuba' }, { code: 'CW', name: 'Curaçao' },
  { code: 'CY', name: 'Cyprus' }, { code: 'CZ', name: 'Czechia' }, { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' }, { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' }, { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' }, { code: 'ET', name: 'Ethiopia' }, { code: 'FK', name: 'Falkland Islands (Malvinas)' },
  { code: 'FO', name: 'Faroe Islands' }, { code: 'FJ', name: 'Fiji' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' }, { code: 'GF', name: 'French Guiana' }, { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' }, { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' }, { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' }, { code: 'GR', name: 'Greece' }, { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' }, { code: 'GP', name: 'Guadeloupe' }, { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' }, { code: 'GG', name: 'Guernsey' }, { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' }, { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island and McDonald Islands' }, { code: 'VA', name: 'Holy See' }, { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' }, { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' }, { code: 'IE', name: 'Ireland' }, { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' }, { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' }, { code: 'JE', name: 'Jersey' }, { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' }, { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'Korea, Democratic People\'s Republic of' }, { code: 'KR', name: 'Korea, Republic of' },
  { code: 'KW', name: 'Kuwait' }, { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Lao People\'s Democratic Republic' },
  { code: 'LV', name: 'Latvia' }, { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' }, { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' }, { code: 'MO', name: 'Macao' },
  { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' }, { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' }, { code: 'MQ', name: 'Martinique' }, { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' }, { code: 'YT', name: 'Mayotte' }, { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia (Federated States of)' }, { code: 'MD', name: 'Moldova (Republic of)' },
  { code: 'MC', name: 'Monaco' }, { code: 'MN', name: 'Mongolia' }, { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' }, { code: 'MA', name: 'Morocco' }, { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' }, { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' }, { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' }, { code: 'NU', name: 'Niue' }, { code: 'NF', name: 'Norfolk Island' },
  { code: 'MK', name: 'North Macedonia' }, { code: 'MP', name: 'Northern Mariana Islands' }, { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' }, { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine, State of' }, { code: 'PA', name: 'Panama' }, { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' }, { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' }, { code: 'QA', name: 'Qatar' }, { code: 'RE', name: 'Réunion' },
  { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russian Federation' }, { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'Saint Barthélemy' }, { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
  { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' },
  { code: 'MF', name: 'Saint Martin (French part)' }, { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' }, { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' }, { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' }, { code: 'SX', name: 'Sint Maarten (Dutch part)' }, { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' }, { code: 'SB', name: 'Solomon Islands' }, { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' }, { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'SS', name: 'South Sudan' }, { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' }, { code: 'SR', name: 'Suriname' }, { code: 'SJ', name: 'Svalbard and Jan Mayen' },
  { code: 'SE', name: 'Sweden' }, { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'TW', name: 'Taiwan, Province of China' }, { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania, United Republic of' }, { code: 'TH', name: 'Thailand' }, { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' }, { code: 'TK', name: 'Tokelau' }, { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' }, { code: 'TC', name: 'Turks and Caicos Islands' }, { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' }, { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom of Great Britain and Northern Ireland' }, { code: 'US', name: 'United States of America' },
  { code: 'UM', name: 'United States Minor Outlying Islands' }, { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' }, { code: 'VU', name: 'Vanuatu' }, { code: 'VE', name: 'Venezuela (Bolivarian Republic of)' },
  { code: 'VN', name: 'Viet Nam' }, { code: 'VG', name: 'Virgin Islands (British)' }, { code: 'VI', name: 'Virgin Islands (U.S.)' },
  { code: 'WF', name: 'Wallis and Futuna' }, { code: 'EH', name: 'Western Sahara' }, { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' }
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

  // New Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('US');

  // Existing Fields
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [publicNickname, setPublicNickname] = useState('');
  const [isPhotoPublic, setIsPhotoPublic] = useState(false);

  // Security Protocol (Mandatory for saving)
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isRespectful, setIsRespectful] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setBirthdate(profileData.birthdate || '');
      setAddress1(profileData.address1 || '');
      setAddress2(profileData.address2 || '');
      setCity(profileData.city || '');
      setState(profileData.state || '');
      setCountry(profileData.country || 'US');
      setDisplayName(profileData.displayName || '');
      setGender(profileData.gender || '');
      setBio(profileData.bio || '');
      setPublicNickname(profileData.publicNickname || '');
      setIsPhotoPublic(profileData.isPhotoPublic || false);
      
      // Load security status if available
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

  const handleSave = async () => {
    if (!user || !db || isSaving) return;

    // Mandatory Security check
    if (!isAgeVerified || !isRespectful || !isHuman) {
      toast({ 
        variant: "destructive", 
        title: "Security Protocol Required", 
        description: "Please complete the mandatory security protocol confirmations before syncing your identity." 
      });
      return;
    }

    const userAge = calculateAge(birthdate);
    if (birthdate && userAge < 18) {
      toast({ variant: "destructive", title: "Age Requirement", description: "You must be 18+ to join the Prosperity Revolution." });
      return;
    }

    setIsSaving(true);
    try {
      const moderation = await moderateText({ text: `${displayName} ${bio} ${publicNickname}` });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Policy Violation", description: moderation.reason });
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

      // Privacy logic: birthMonthDay only
      let monthDayStr = "Secret";
      if (birthdate) {
        const d = new Date(birthdate);
        monthDayStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }

      await setDoc(doc(db, 'publicProfiles', user.uid), {
        uid: user.uid,
        bio,
        publicNickname: publicNickname || "Mystery Heart",
        publicPhotoUrl: isPhotoPublic ? profileData?.photoUrl || null : null,
        country: country,
        birthMonthDay: monthDayStr,
        updatedAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Identity Synced", description: "Global presence updated successfully. ❤️" });
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
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Enter first name" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Enter last name" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Display Name</Label>
                  <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="How you appear to matches" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Birthdate</Label>
                  <Input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" />
                  <p className="text-[8px] text-muted-foreground ml-2 uppercase font-black tracking-widest">* Birth year is strictly hidden from public profiles.</p>
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
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Street address" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Address Line 2 (Optional)</Label>
                  <Input value={address2} onChange={e => setAddress2(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="Apartment, suite, etc." />
                </div>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">City</Label>
                    <Input value={city} onChange={e => setCity(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="City" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">State / Province</Label>
                    <Input value={state} onChange={e => setState(e.target.value)} className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner" placeholder="State" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Country of Origin</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className="rounded-xl h-14 bg-muted/20 border-none px-6 font-bold shadow-inner"><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="public">
             <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 space-y-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest opacity-60 ml-2">Unique Nickname</Label>
                    <Input value={publicNickname} onChange={e => setPublicNickname(e.target.value)} placeholder="e.g. MysteryHeart77" className="rounded-xl h-14 bg-muted/10 border-2 border-primary/5 px-6 font-black text-primary shadow-inner" />
                  </div>
                  <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Camera className="w-5 h-5" /></div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-tight">Show Public Photo</h4>
                          <p className="text-[9px] opacity-60 font-medium italic mt-0.5">Toggle visibility in global discovery.</p>
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
                <p className="text-xs text-muted-foreground font-medium italic">Mandatory confirmations for every global identity.</p>
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
                  * All boxes must be checked and mandatory to Sync your Identity.
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
