
"use client";

import { useEffect, useState } from "react";
import { discoverSparkUsers, sendSparkLike } from "@/services/spark.service";
import { useUser } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Sparkles, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function SparkPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfiles() {
      try {
        const data = await discoverSparkUsers();
        setProfiles(data);
      } catch (e) {
        console.error("Discovery Ripple:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfiles();
  }, []);

  const handleLike = async (targetId: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Identity Required", description: "Please join the revolution to spark connections. ❤️" });
      return;
    }
    
    setIsLiking(targetId);
    try {
      await sendSparkLike(user.uid, targetId);
      toast({ title: "Spark Sent!", description: "A message of pure respect has been dispatched. ✨" });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed", description: "Could not initiate connection." });
    } finally {
      setIsLiking(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="w-8 h-8 animate-pulse" />
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Discover Hearts</h1>
        </div>
        <p className="text-xl text-muted-foreground font-medium italic">"Building connections worldwide through pure respect."</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-sm font-black uppercase tracking-widest">Scanning Frequencies...</p>
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((p) => (
            <Card key={p.id} className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.02] transition-all">
              <div className="aspect-square bg-muted relative">
                {p.photoURL ? (
                  <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-primary/10" />
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-black/40 backdrop-blur-md text-white border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">{p.age || '??'}</Badge>
                </div>
              </div>
              <CardContent className="p-8 space-y-3">
                <CardTitle className="text-2xl font-black tracking-tighter">{p.displayName || "Mystery Heart"}</CardTitle>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{p.country || 'Global'}</span>
                </div>
                <p className="text-sm text-muted-foreground italic font-medium line-clamp-2 leading-relaxed">"{p.bio}"</p>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button 
                  onClick={() => handleLike(p.userId)} 
                  disabled={isLiking === p.userId}
                  className="w-full h-14 rounded-2xl gradient-bg font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2"
                >
                  {isLiking === p.userId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                  Spark Love
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center opacity-20">
          <Heart className="w-20 h-20 mx-auto mb-4" />
          <p className="text-lg font-black uppercase tracking-widest">All Hearts have been reached. Be the first to spark.</p>
        </div>
      )}
    </div>
  );
}
