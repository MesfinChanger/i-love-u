'use client';

import { useEffect, useState, use } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Plus, Loader2, Users, ArrowLeft } from "lucide-react";
import { createCirclePost, getCirclePosts } from "@/services/circle.post.service";
import { useCircleRole } from "@/hooks/use-circle-role";
import { moderateText } from "@/ai/flows/moderate-text-flow";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

/**
 * @fileOverview Circle Idea Pool Module.
 * Protected by the Circle Access Protocol to ensure only members contribute innovations.
 */
export default function CirclePostsPage() {
  const params = useParams();
  const circleId = params?.circleId as string;
  const { toast } = useToast();

  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Authority Verification Protocol
  const { isMember, loading: roleLoading } = useCircleRole(circleId);

  async function load() {
    if (!circleId) return;
    const data = await getCirclePosts(circleId);
    setPosts(data);
  }

  useEffect(() => {
    if (isMember) {
      load();
    }
  }, [circleId, isMember]);

  async function publish() {
    if (!title.trim() || !content.trim() || !circleId || isPublishing) return;

    setIsPublishing(true);
    try {
      const moderation = await moderateText({ 
        text: `${title} - ${content}`,
        context: "chat",
      });
      if (moderation.isFlagged) {
        toast({ variant: "destructive", title: "Respect Protocol", description: moderation.reason });
        setIsPublishing(false);
        return;
      }

      await createCirclePost(circleId, "member", {
        title: title.trim(),
        content: content.trim()
      });

      setTitle("");
      setContent("");
      load();
    } catch (error) {
      console.error("Idea sync ripple:", error);
    } finally {
      setIsPublishing(false);
    }
  }

  // Access Restriction UI
  if (!roleLoading && !isMember) {
    return (
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />
        <main className="container mx-auto max-w-5xl p-6">
          <Card className="m-10 p-12 text-center rounded-[3.5rem] border-none shadow-2xl bg-white space-y-8">
             <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto">
                <Lightbulb className="w-10 h-10 text-primary opacity-20" />
             </div>
             <div className="space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tighter">Members Only</h1>
                <p className="text-muted-foreground italic font-medium">Join this Circle to view and contribute ideas. ❤️</p>
             </div>
             <Button asChild className="h-14 px-8 rounded-2xl gradient-bg font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
                <Link href={`/circles/${circleId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Circle
                </Link>
             </Button>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <GuestAccessGuard feature="circle">
      <div className="min-h-screen bg-muted/30 pb-24">
        <Header />

        <main className="container mx-auto max-w-5xl p-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Circle Ideas</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-2">Shared Prosperity Pool</p>
            </div>
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Innovation Title</p>
                <Input
                  placeholder="The name of your idea..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="h-14 rounded-2xl bg-muted/20 border-none font-bold text-lg"
                  disabled={isPublishing}
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Concept Details</p>
                <textarea
                  placeholder="Describe your vision for prosperity..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full min-h-[150px] rounded-[2rem] bg-muted/20 border-none p-6 font-medium italic text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  disabled={isPublishing}
                />
              </div>

              <Button
                onClick={publish}
                disabled={!title.trim() || !content.trim() || isPublishing}
                className="w-full h-16 rounded-2xl gradient-bg font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2"
              >
                {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Publish Idea
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <Card key={post.id} className="rounded-[2.5rem] border-none shadow-md bg-white hover:shadow-lg transition-all group overflow-hidden">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                       <h2 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                        {post.title}
                       </h2>
                    </div>
                    <p className="text-lg font-medium text-slate-600 italic leading-relaxed border-l-8 border-primary/5 pl-8 py-2">
                      "{post.content}"
                    </p>
                    <div className="pt-4 flex items-center justify-between opacity-40">
                       <span className="text-[8px] font-black uppercase tracking-widest">Shared Prosperity Goal</span>
                       <Lightbulb className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-20 text-center opacity-20 space-y-4">
                 <Lightbulb className="w-20 h-20 mx-auto" />
                 <p className="text-xl font-black uppercase tracking-widest italic">"Silence is the birth of the next big idea."</p>
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </GuestAccessGuard>
  );
}
