'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, DEFAULT_LANGUAGE } from '@/lib/translations';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const db = useFirestore();
  
  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  
  const { data: profile } = useDoc(userRef);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  useEffect(() => {
    // 1. Try profile preference
    if (profile?.preferredLanguage && TRANSLATIONS[profile.preferredLanguage]) {
      setLanguage(profile.preferredLanguage);
      return;
    }

    // 2. Try browser detection
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      const langMap: Record<string, string> = {
        'es': 'Spanish',
        'fr': 'French',
        'sw': 'Swahili',
        'ja': 'Japanese'
      };
      
      const detected = langMap[browserLang];
      if (detected && TRANSLATIONS[detected]) {
        setLanguage(detected);
      }
    }
  }, [profile]);

  const t = (path: string) => {
    const keys = path.split('.');
    let current = TRANSLATIONS[language] || TRANSLATIONS[DEFAULT_LANGUAGE];
    
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if key missing in current language
        let fallback = TRANSLATIONS[DEFAULT_LANGUAGE];
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
          if (!fallback) break;
        }
        return fallback || path;
      }
      current = current[key];
    }
    
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
