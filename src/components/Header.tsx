
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
  HeartHandshake,
  Menu,
  Globe2,
  ShoppingBag,
  User,
  LayoutGrid
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
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslation } from './providers/LanguageProvider';

/**
 * @fileOverview The platform header, featuring a vertical navigation menu and Notification Center.
 */
export function Header() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const pathname = usePathname();
  const { t } = useTranslation();

  const triggerAssistant = () => {
    window.dispatchEvent(new CustomEvent('toggle-spark-assistant'));
  };

  const navItems = [
    { href: '/discover', icon: Sparkles, label: t('nav.discover'), color: 'text-primary' },
    { href: '/search', icon: Search, label: t('nav.search'), color: 'text-blue-500' },
    { href: '/community', icon: Globe2, label: t('nav.global'), color: 'text-green-500' },
    { href: '/matches', icon: Heart, label: t('nav.matches'), color: 'text-primary' },
    { href: '/shop', icon: ShoppingBag, label: t('nav.shop'), color: 'text-secondary' },
    { href: '/profile', icon: User, label: t('nav.profile'), color: 'text-slate-600' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md" role="banner">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Navigation Menu + Logo */}
        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity" aria-label="Open Navigation">
                <div className="relative p-1.5 rounded-xl bg-primary/5">
                  <Heart className="w-10 h-10 fill-primary text-primary transition-transform group-hover:scale-110 animate-heartbeat" aria-hidden="true" />
                </div>
                <div className="flex flex-col leading-[0.8]">
                  <span className="font-black text-2xl tracking-tighter text-primary uppercase">I LOVE</span>
                  <span className="font-black text-[7px] tracking-[0.6em] text-muted-foreground ml-1 uppercase">YOU</span>
                </div>
                <Menu className="w-4 h-4 text-primary/40 ml-1 group-hover:text-primary transition-colors" />
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 border-none shadow-2xl rounded-r-[3rem] overflow-hidden flex flex-col bg-white">
              <SheetHeader className="p-8 bg-primary/5 border-b shrink-0 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-2xl shadow-sm">
                    <Heart className="w-8 h-8 fill-primary text-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-2xl font-black tracking-tighter uppercase leading-none">The Mission</SheetTitle>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mt-1">Universal Navigation</p>
                  </div>
                </div>
              </SheetHeader>

              <nav className="flex-grow overflow-y-auto p-6 space-y-2 no-scrollbar">
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
                        isActive ? "bg-primary text-white shadow-lg" : "bg-muted group-hover:bg-white group-hover:shadow-md"
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-8 border-t bg-slate-50/50">
                 <div className="bg-slate-900 p-6 rounded-3xl space-y-3 shadow-xl border border-primary/20">
                    <p className="text-[10px] text-white/80 font-black uppercase leading-relaxed tracking-widest">
                       "Respect & Love is Mandatory." ❤️ Reaching every heart in every village.
                    </p>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Universal Actions */}
        <div className="flex items-center gap-1">
          <DonationDialog />
          
          <Button variant="ghost" size="icon" onClick={triggerAssistant} className="text-primary/60 hover:text-primary w-10 h-10" aria-label="Ask Spark Guide">
            <CircleHelp className="w-5 h-5" aria-hidden="true" />
          </Button>

          {/* Notification Center */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground relative w-10 h-10" aria-label="View notifications">
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
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
                    <NotificationItem 
                      icon={Sparkles} 
                      title="Welcome to the Revolution!" 
                      desc="Your identity is now secured with E2EE. Start discovering mystery hearts today." 
                      time="Just Now"
                      badge="SYSTEM"
                    />
                    <NotificationItem 
                      icon={HeartHandshake} 
                      title="Eliminate Poverty" 
                      desc="A donation has been sparked in your region. The Prosperity Fund is growing! ❤️" 
                      time="2h ago"
                      badge="MISSION"
                      color="secondary"
                    />
                    <NotificationItem 
                      icon={MessageCircle} 
                      title="Pro-Tip: AI Spark" 
                      desc="Having trouble starting a chat? Use the AI Spark button in any match for a respectful icebreaker." 
                      time="5h ago"
                      badge="GUIDE"
                      color="blue"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 opacity-20">
                     <div className="relative">
                        <Bell className="w-20 h-20" />
                        <X className="absolute -bottom-2 -right-2 w-10 h-10" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-xl font-black tracking-tighter uppercase">Quiet for now</p>
                        <p className="text-sm font-medium italic">"Even a busy heart needs a moment of rest."</p>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t bg-slate-50/50 shrink-0">
                 <div className="bg-slate-900 p-6 rounded-3xl space-y-3 shadow-xl border border-primary/20">
                    <div className="flex items-center gap-2 text-primary">
                       <Star className="w-4 h-4 fill-current" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Privacy Protocol</h4>
                    </div>
                    <p className="text-[9px] text-white/60 font-bold uppercase leading-relaxed tracking-widest">
                       All notifications are ephemeral and deleted after 30 days to protect your privacy. Respect is Mandatory.
                    </p>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NotificationItem({ icon: Icon, title, desc, time, badge, color = 'primary' }: any) {
  const colors: Record<string, string> = {
    primary: 'bg-primary/10 text-primary border-primary/10',
    secondary: 'bg-secondary/10 text-secondary border-secondary/10',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/10'
  };

  const badgeColors: Record<string, string> = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    blue: 'bg-blue-600 text-white'
  };

  return (
    <div className="group p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex gap-4 items-start cursor-pointer">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${colors[color]}`}>
          <Icon className="w-6 h-6" />
       </div>
       <div className="flex-grow space-y-1">
          <div className="flex justify-between items-start">
             <Badge className={`text-[7px] font-black uppercase tracking-widest h-5 px-2 border-none ${badgeColors[color]}`}>{badge}</Badge>
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
          </div>
          <h5 className="font-black text-sm tracking-tight leading-tight">{title}</h5>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{desc}"</p>
       </div>
    </div>
  );
}
