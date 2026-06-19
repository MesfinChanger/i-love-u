
"use client";

import { use, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { FLUTTER_TEMPLATES } from '@/lib/templates';
import { LivePreview } from '@/components/LivePreview';
import { AIRecommender } from '@/components/AIRecommender';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  Settings2, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Info,
  Palette,
  Briefcase,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

function TemplateDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isCustomizing = searchParams.get('customize') === 'true';
  
  const template = FLUTTER_TEMPLATES.find(t => t.id === id);
  const [appName, setAppName] = useState(template?.name || '');
  const [packageName, setPackageName] = useState(template?.defaultConfig.packageName || '');
  const [primaryColor, setPrimaryColor] = useState(template?.defaultConfig.primaryColor || '#4C26DB');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Template Not Found</h1>
        <Button asChild>
          <Link href="/templates">Back to Templates</Link>
        </Button>
      </div>
    );
  }

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Mock download started: Project ZIP generated successfully.');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4">
      <Link href="/templates" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group">
        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        All Templates
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          <section>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">{template.category}</span>
              <div className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-muted-foreground text-xs">V 1.2.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">{template.name}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {template.description}
            </p>
          </section>

          <Tabs defaultValue={isCustomizing ? "customize" : "details"} className="w-full">
            <TabsList className="bg-neutral-100 p-1 w-full flex rounded-xl">
              <TabsTrigger value="details" className="flex-1 py-3 text-sm gap-2 rounded-lg">
                <Info className="w-4 h-4" />
                Project Details
              </TabsTrigger>
              <TabsTrigger value="customize" className="flex-1 py-3 text-sm gap-2 rounded-lg">
                <Settings2 className="w-4 h-4" />
                Customize
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1 py-3 text-sm gap-2 rounded-lg">
                <Sparkles className="w-4 h-4" />
                AI Enhancer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-8 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {template.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Flutter 3.10+', 'Dart', 'Provider', 'Dio', 'Clean Architecture'].map(tech => (
                      <div key={tech} className="bg-neutral-100 px-3 py-1.5 rounded-md text-xs font-medium">{tech}</div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customize" className="pt-8 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">App Display Name</Label>
                  <Input 
                    id="app-name" 
                    value={appName} 
                    onChange={(e) => setAppName(e.target.value)} 
                    className="bg-white h-11"
                    placeholder="e.g., My Awesome App"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package-id">Package Name / Bundle ID</Label>
                  <Input 
                    id="package-id" 
                    value={packageName} 
                    onChange={(e) => setPackageName(e.target.value)} 
                    className="bg-white h-11"
                    placeholder="e.g., com.example.app"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Brand Styling
                </Label>
                <div className="flex items-center gap-6 p-6 bg-white border rounded-2xl">
                   <div className="space-y-2 flex-1">
                      <Label className="text-xs text-muted-foreground">Primary Color</Label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <code className="bg-neutral-100 px-3 py-1 rounded text-sm">{primaryColor.toUpperCase()}</code>
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleDownload} disabled={isGenerating} size="lg" className="w-full h-14 text-lg rounded-xl gap-2 shadow-xl shadow-primary/10">
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Generate & Download ZIP
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="pt-8 animate-in fade-in duration-300">
              <AIRecommender templateName={template.name} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-24 pt-4">
            <LivePreview template={template} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-8 pb-20">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>}>
          <TemplateDetailContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
