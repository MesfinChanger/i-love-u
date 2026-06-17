
"use client";

import Link from 'next/link';
import { Header } from '@/components/Header';
import { FLUTTER_TEMPLATES } from '@/lib/templates';
import { TemplateCard } from '@/components/TemplateCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Zap, Smartphone, Layout, Sparkles, Download } from 'lucide-react';

export default function Home() {
  const featuredTemplates = FLUTTER_TEMPLATES.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                NOW WITH AI-POWERED CUSTOMIZATION
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight font-headline">
                Build Beautiful <span className="text-primary">Flutter Apps</span> Faster
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Launch your next project with our curated collection of professional Flutter templates. Fully customizable, performance-optimized, and ready to scale.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20">
                  <Link href="/templates">
                    Browse Templates
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-full bg-white/50 backdrop-blur-sm">
                  <Link href="/#features">View Features</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Abstract blobs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </section>

        {/* Templates Preview Grid */}
        <section className="py-20 bg-white/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4 font-headline">Popular Starters</h2>
                <p className="text-muted-foreground">
                  Our most downloaded templates across various categories. Each template comes with clean architecture and responsive UI.
                </p>
              </div>
              <Button asChild variant="link" className="text-primary font-bold">
                <Link href="/templates" className="flex items-center">
                  See all templates
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4 font-headline">Why Choose FlutterFlow Kit?</h2>
              <p className="text-muted-foreground">Everything you need to jumpstart your mobile development workflow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-8 rounded-2xl bg-white border border-transparent hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Layout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Live Preview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  See exactly how your app will look and feel on a real device before you even download the code.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white border border-transparent hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Visual Customizer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Configure brand colors, package names, and initial navigation through our intuitive dashboard.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-white border border-transparent hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Ready-to-Run Code</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Download a production-ready ZIP file containing the full source code and documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI CTA Section */}
        <section id="ai" className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-neutral-900 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  GEN-AI CAPABILITIES
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight font-headline">
                  Customize with the power of <span className="text-accent">AI</span>
                </h2>
                <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
                  Not finding the exact feature you need? Our AI enhancement tool suggests relevant code snippets and architectural patterns based on your unique project requirements.
                </p>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8 rounded-full">
                  Explore Templates
                </Button>
              </div>
              
              {/* Abstract decorative elements */}
              <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 p-12 hidden lg:block">
                <Smartphone className="w-64 h-64 text-white/5 opacity-20" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Layout className="w-5 h-5" />
              </div>
              <span className="font-headline">FlutterFlow Kit</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} FlutterFlow Kit. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
