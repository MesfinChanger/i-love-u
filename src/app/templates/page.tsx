
"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { FLUTTER_TEMPLATES } from '@/lib/templates';
import { TemplateCard } from '@/components/TemplateCard';
import { Input } from '@/components/ui/input';
import { Search, Filter, LayoutGrid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(FLUTTER_TEMPLATES.map(t => t.category))];

  const filteredTemplates = FLUTTER_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-10 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <h1 className="text-4xl font-black mb-4 font-headline">Explore Templates</h1>
            <p className="text-muted-foreground text-lg">
              Find the perfect foundation for your next mobile application from our curated catalog.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search templates, features, or keywords..." 
                className="pl-10 h-12 bg-white rounded-xl shadow-sm border-neutral-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0">
               <Tabs defaultValue="All" onValueChange={setActiveCategory}>
                  <TabsList className="bg-white/50 border h-12 px-1">
                    {categories.map(cat => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat} 
                        className="h-10 px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                      >
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
               </Tabs>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Showing {filteredTemplates.length} templates
            </div>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-headline">No templates found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
