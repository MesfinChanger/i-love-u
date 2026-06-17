
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code_snippet': return <Code className="w-4 h-4" />;
      case 'ui_component': return <Box className="w-4 h-4" />;
      case 'architectural_pattern': return <Zap className="w-4 h-4" />;
      case 'best_practice': return <BookOpen className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-primary">
            <Sparkles className="w-5 h-5 text-accent" />
            AI Enhancement Assistant
          </CardTitle>
          <CardDescription>
            Describe the specific features you want to add to your {templateName} project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="e.g., I want to add Firebase authentication and a user review system for products..."
            className="min-h-[100px] bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button 
            onClick={handleEnhance} 
            disabled={loading || !description.trim()}
            className="w-full gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing requirements...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get Implementation Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && result.suggestions.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">AI Suggestions</h4>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-primary/10 p-2 rounded-md text-primary">
                      {getTypeIcon(suggestion.type)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{suggestion.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{suggestion.type.replace('_', ' ')}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.dependencies && suggestion.dependencies.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-muted-foreground uppercase">Dependencies</div>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.dependencies.map((dep, i) => (
                            <code key={i} className="text-[10px] bg-neutral-100 px-2 py-1 rounded-md code-font">{dep}</code>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestion.code && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-muted-foreground uppercase">Code Implementation</div>
                        <pre className="p-4 rounded-lg bg-neutral-900 text-neutral-100 overflow-x-auto text-xs code-font">
                          <code>{suggestion.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
