'use client';

import Link from 'next/link';
import { 
  Heart, 
  Search, 
  Bell, 
  CircleHelp, 
  X, 
  Sparkles, 
  Star, 
  MessageCircle, 
  Menu,
  Globe2,
  ShoppingBag,
  User,
  LogOut,
  LogIn,
  Loader2,
  Languages,
  Check,
  MessageSquare,
  Home,
  TrendingDown,
  Waves
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
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from './providers/LanguageProvider';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { SUPPORTED_LANGUAGES } from '@/lib/world-data';

/**
 * @fileOverview The Unified Mission Hub Header.
 * Consolidates all navigation and platform tools into a single control center.
 * Features the requested Unified Sign-Out Protocol.
 */
export function Header() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();

  const triggerAssistant = () => {
    window.dispatchEvent(new CustomEvent('toggle-spark-assistant'));
  };

  const triggerFeedback = () => {
    window.dispatchEvent(new CustomEvent('toggle-feedback-box'));
  };

  const triggerAuthGate = () => {
    window.dispatchEvent(new CustomEvent('open-auth-gate'));
  };

  // Unified Sign-Out Protocol
  const handleSignOut = async () => {
    if (!auth || isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been safely signed out.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const navItems = [
    { href: '/', icon: Home, label: t('nav.home'), color: 'text-slate-600' },
    { href: '/discover', icon: Sparkles, label: t('nav.discover'), color: 'text-primary' },
    { href: '/pool', icon: Waves, label: t('nav.pool'), color: 'text-blue-500' },
    { href: '/search', icon: Search, label: t('nav.search'), color: 'text-blue-500' },
    { href: '/community', icon: Globe2, label: t('nav.global'), color: 'text-green-500' },
    { href: '/matches', icon: Heart, label: t('nav.matches'), color: 'text-primary' },
    { href: '/shop', icon: ShoppingBag, label: t('nav.shop'), color: 'text-secondary' },
    { href: '/profile', icon: User, label: t('nav.profile'), color: 'text-slate-600' },
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
                  const isActive = pathname === item.href || (item.href === '/matches' && pathname?.startsWith('/matches')) || (item.href === '/shop' && pathname?.startsWith('/shop'));
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
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
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

                   <button 
                    onClick={triggerFeedback}
                    className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-slate-600 hover:bg-primary/5 hover:text-primary group text-left"
                   >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest">Give Feedback</span>
                   </button>

                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-slate-600 hover:bg-muted/50 group text-left">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all text-slate-500">
                             <Languages className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-sm uppercase tracking-widest">Language</span>
                             <span className="text-[9px] font-bold text-primary uppercase">{language}</span>
                          </div>
                        </button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-56 rounded-2xl p-2 border-none shadow-2xl max-h-80 overflow-y-auto" side="right" align="start">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <DropdownMenuItem 
                            key={lang.name} 
                            onClick={() => setLanguage(lang.name)}
                            className={cn(
                              "rounded-xl py-3 px-4 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-between",
                              language === lang.name ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            )}
                          >
                            <div className="flex flex-col">
                              <span>{lang.name}</span>
                              <span className="text-[9px] opacity-40 font-medium">{lang.native}</span>
                            </div>
                            {language === lang.name && <Check className="w-4 h-4" />}
                          </DropdownMenuItem>
                        ))}
                     </DropdownMenuContent>
                   </DropdownMenu>

                  <div className="pt-6 mt-6 border-t border-dashed">
                    {user ? (
                      <button 
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-slate-400 hover:text-red-500 hover:bg-red-50 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                          {isSigningOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                        </div>
                        <span className="font-black text-sm uppercase tracking-widest">Sign Out</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => { triggerAuthGate(); }}
                        className="flex items-center gap-4 p-4 rounded-[1.5rem] transition-all w-full text-primary hover:bg-primary/5 group"
                      >
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
                {hasNotifications && (
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
                  <Button variant="ghost" size="sm" onClick={() => setHasNotifications(false)} className="h-8 text-[9px] font-black uppercase rounded-full hover:bg-primary/10">Clear All</Button>
                </div>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
                {hasNotifications ? (
                  <div className="space-y-3">
                    <NotificationItem 
                      icon={Sparkles} 
                      title="Welcome to the Revolution!" 
                      desc="Your identity is now secured with E2EE. Start discovering mystery hearts today." 
                      time="Just Now"
                      badge="SYSTEM"
                    />
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

function NotificationItem({ icon: Icon, title, desc, time, badge, color = 'primary' }: any) {
  const badgeColors: Record<string, string> = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    blue: 'bg-blue-600 text-white'
  };

  return (
    <div className="group p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start cursor-pointer">
       <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-primary/5 text-primary">
          <Icon className="w-6 h-6" />
       </div>
       <div className="flex-grow space-y-1">
          <div className="flex justify-between items-start">
             <Badge className={`text-[7px] font-black uppercase h-5 px-2 border-none ${badgeColors[color]}`}>{badge}</Badge>
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
          </div>
          <h5 className="font-black text-sm tracking-tight leading-tight">{title}</h5>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{desc}"</p>
       </div>
    </div>
  );
}
