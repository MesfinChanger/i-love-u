'use client';

import Link from 'next/link';
import { 
  Heart, 
  Bell, 
  CircleHelp, 
  Menu,
  LogOut,
  LogIn,
  Loader2,
  Languages,
  Check,
  MessageSquare,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonationDialog } from '@/components/DonationDialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from './providers/LanguageProvider';
import { auth, useUser, useFirestore, useCollection } from '@/firebase';
import { signOut } from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  updateDoc, 
  doc, 
  writeBatch 
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { SUPPORTED_LANGUAGES } from '@/lib/world-data';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

export function Header() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useTranslation();

  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
  }, [db, user?.uid]);

  const { data: notifications, loading: notificationsLoading } = useCollection(notificationsQuery);

  const unreadCount = useMemo(() => {
    if (!notifications) return 0;
    return notifications.filter((n: any) => !n.read).length;
  }, [notifications]);

  const triggerAssistant = () => {
    window.dispatchEvent(new CustomEvent('toggle-spark-assistant'));
  };

  const triggerFeedback = () => {
    window.dispatchEvent(new CustomEvent('toggle-feedback-box'));
  };

  const triggerAuthGate = () => {
    window.dispatchEvent(new CustomEvent('open-auth-gate'));
  };

  const handleSignOut = async () => {
    if (!auth || isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been safely signed out." });
      router.push("/login");
    } catch (error) {
      toast({ variant: "destructive", title: "Sign Out Failed", description: "Please try again." });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleMarkAllRead = async () => {
    if (!db || !user?.uid || !notifications) return;
    const batch = writeBatch(db);
    notifications.forEach((n: any) => {
      if (!n.read) {
        const ref = doc(db, 'users', user.uid, 'notifications', n.id);
        batch.update(ref, { read: true });
      }
    });
    try {
      await batch.commit();
    } catch (e) {}
  };

  const handleMarkRead = async (id: string) => {
    if (!db || !user?.uid) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'notifications', id), { read: true });
    } catch (e) {}
  };

  const navItems = [
    { href: '/', name: "🏠 Home" },
    { href: '/spark', name: "❤️ Spark" },
    { href: '/circle', name: "🤝 Circle" },
    { href: '/shopping', name: "🛒 Shopping" },
    { href: '/ideas', name: "💡 Idea Pool" },
    { href: '/messages', name: "💬 Messages" },
    { href: '/profile', name: "👤 Profile" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md" role="banner">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition-opacity" aria-label="Go to Home">
            <div className="relative p-1.5 rounded-xl bg-primary/5">
              <Heart className="w-10 h-10 fill-primary text-primary transition-transform group-hover:scale-110 animate-heartbeat" aria-hidden="true" />
            </div>
            <span className="font-black text-xl tracking-[0.3em] text-primary uppercase ml-1 whitespace-nowrap hidden xs:inline-block">I LOVE U</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:text-primary transition-colors ml-1" aria-label="Open Mission Hub">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 border-none shadow-2xl rounded-r-[3rem] overflow-hidden flex flex-col bg-white">
              <SheetHeader className="p-8 bg-primary/5 border-b shrink-0 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-2xl shadow-sm">
                    <Heart className="w-8 h-8 fill-primary text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-2xl font-black tracking-tighter uppercase leading-none">The Mission</SheetTitle>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Unified Control Hub</p>
                  </div>
                </div>
              </SheetHeader>

              <nav className="flex-grow overflow-y-auto p-6 space-y-2 no-scrollbar">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 mb-2">Navigation</p>
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-[1.5rem] transition-all group",
                        isActive ? "bg-primary/5 text-primary shadow-sm" : "hover:bg-muted/50 text-slate-600"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        isActive ? "bg-primary text-white shadow-lg" : "bg-muted group-hover:bg-white group-hover:shadow-md transition-all"
                      )}>
                        <span className="text-lg">{item.name.split(' ')[0]}</span>
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest">{item.name.split(' ').slice(1).join(' ')}</span>
                    </Link>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-dashed space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 mb-2">Mission Tools</p>
                   
                   <DonationDialog trigger={
                      <button className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-slate-600 hover:bg-primary/5 hover:text-primary group text-left">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all text-primary">
                          <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">Support Mission</span>
                      </button>
                   } />

                   <button onClick={triggerFeedback} className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-slate-600 hover:bg-primary/5 hover:text-primary group text-left">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest">Give Feedback</span>
                   </button>

                  <div className="pt-6 mt-6 border-t border-dashed">
                    {user ? (
                      <button onClick={handleSignOut} disabled={isSigningOut} className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-slate-400 hover:text-red-500 hover:bg-red-50 group">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          {isSigningOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">Sign Out</span>
                      </button>
                    ) : (
                      <button onClick={triggerAuthGate} className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-primary hover:bg-primary/5 group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          <LogIn className="w-5 h-5" />
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">Identify Heart</span>
                      </button>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center gap-1">
          <DonationDialog />
          <Button variant="ghost" size="icon" onClick={triggerAssistant} className="text-primary/60 hover:text-primary w-10 h-10">
            <CircleHelp className="w-5 h-5" aria-hidden="true" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground relative w-10 h-10">
                <Bell className="w-5 h-5" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse" aria-hidden="true" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 border-none shadow-2xl rounded-l-[3rem] overflow-hidden flex flex-col bg-white">
              <SheetHeader className="p-8 bg-primary/5 border-b shrink-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <SheetTitle className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                      <Bell className="w-6 h-6 text-primary" />
                      Alerts
                    </SheetTitle>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Community Updates</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-8 text-[9px] font-black uppercase rounded-full hover:bg-primary/10">Mark All Read</Button>
                </div>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
                {notificationsLoading ? (
                  <div className="flex justify-center py-20 opacity-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notif: any) => (
                      <NotificationItem 
                        key={notif.id}
                        notif={notif}
                        onRead={() => handleMarkRead(notif.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 opacity-20">
                     <Bell className="w-20 h-20" />
                     <p className="text-xl font-black tracking-tighter uppercase">Quiet for now</p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NotificationItem({ notif, onRead }: { notif: any, onRead: () => void }) {
  const timeString = useMemo(() => {
    if (!notif.createdAt) return 'Now';
    try {
      const d = notif.createdAt.toDate ? notif.createdAt.toDate() : new Date(notif.createdAt);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return 'Recent'; }
  }, [notif.createdAt]);

  return (
    <div 
      onClick={onRead}
      className={cn(
        "group p-5 rounded-[2rem] border transition-all flex gap-4 items-start cursor-pointer relative overflow-hidden",
        notif.read ? "bg-white border-slate-100 opacity-60" : "bg-white border-primary/10 shadow-md hover:shadow-lg"
      )}
    >
       {!notif.read && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />}
       <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-muted">
          <span className="text-lg">🔔</span>
       </div>
       <div className="flex-grow space-y-1">
          <div className="flex justify-between items-start">
             <Badge className={cn("text-[7px] font-black uppercase h-5 px-2 border-none", notif.read ? "bg-slate-100 text-slate-400" : "bg-primary text-white")}>
               {notif.type}
             </Badge>
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-2 h-2" /> {timeString}
             </span>
          </div>
          <h5 className="font-black text-sm tracking-tight leading-tight">{notif.title}</h5>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{notif.body}"</p>
       </div>
    </div>
  );
}
