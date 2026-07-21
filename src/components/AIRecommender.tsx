"use client";

import { useState } from 'react';
import { projectBasedTemplateEnhancement, ProjectBasedTemplateEnhancementOutput } from '@/ai/flows/project-based-template-enhancement-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Code, Box, Zap, BookOpen, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function AIRecommender({ templateName }: { templateName: string }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectBasedTemplateEnhancementOutput | null>(null);

  const handleEnhance = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const output = await projectBasedTemplateEnhancement({
        projectDescription: description,
        selectedTemplateName: templateName
      });
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-primary">
            <Sparkles className="w-5 h-5 text-accent" /> AI Enhancer
          </CardTitle>
          <CardDescription>Add specific features to your {templateName} project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="e.g., Add Firebase authentication..." className="min-h-[100px] bg-white" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button onClick={handleEnhance} disabled={loading || !description.trim()} className="w-full gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Get Implementation Suggestions</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-primary/10 p-2 rounded-md text-primary"><Zap className="w-4 h-4" /></div>
                    <div><div className="text-sm font-semibold">{suggestion.title}</div><div className="text-xs text-muted-foreground">{suggestion.type}</div></div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2"><p className="text-sm text-muted-foreground leading-relaxed">{suggestion.description}</p></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
