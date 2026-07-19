
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FlutterTemplate } from '@/lib/templates';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Eye, ArrowRight } from 'lucide-react';

export function TemplateCard({ template }: { template: FlutterTemplate }) {
  const image = PlaceHolderImages.find(img => img.id === template.imageKey);

  return (
    <Card className="group overflow-hidden flex flex-col h-full border-transparent bg-white/50 hover:bg-white hover:shadow-xl hover:border-border/50 transition-all duration-300">
      <CardHeader className="p-0 relative aspect-[4/5] overflow-hidden">
        {image && (
          <Image
            src={image.imageUrl}
            alt={template.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint={image.imageHint}
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="backdrop-blur-md bg-white/80 text-primary font-semibold">
            {template.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <h3 className="text-xl font-bold mb-2 font-headline">{template.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {template.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1 gap-2 border-primary/20 hover:border-primary/50 text-primary">
          <Link href={`/templates/${template.id}`}>
            <Eye className="w-4 h-4" />
            Preview
          </Link>
        </Button>
        <Button asChild size="sm" className="flex-1 gap-2">
          <Link href={`/templates/${template.id}?customize=true`}>
            Build
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
