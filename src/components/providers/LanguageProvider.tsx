'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, DEFAULT_LANGUAGE } from '@/lib/translations';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/use-memo-firebase';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'iloveu_pref_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const db = useFirestore();
  
  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);
  
  const { data: profile } = useDoc(userRef);
  const [language, setInternalLanguage] = useState(DEFAULT_LANGUAGE);

  // 1. Initial Load from LocalStorage or Browser
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setInternalLanguage(saved);
      return;
    }

    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      const langMap: Record<string, string> = {
        'es': 'Spanish',
        'fr': 'French',
        'sw': 'Swahili',
        'ja': 'Japanese',
        'ar': 'Arabic',
        'zh': 'Chinese (Simplified)',
        'hi': 'Hindi'
      };
      
      const detected = langMap[browserLang];
      if (detected) {
        setInternalLanguage(detected);
      }
    }
  }, []);

  // 2. Sync from Profile (if logged in)
  useEffect(() => {
    if (profile?.preferredLanguage) {
      setInternalLanguage(profile.preferredLanguage);
    }
  }, [profile]);

  const setLanguage = async (newLang: string) => {
    setInternalLanguage(newLang);
    localStorage.setItem(LOCAL_STORAGE_KEY, newLang);
    
    // Save to Firestore if user is authenticated
    if (db && user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          preferredLanguage: newLang
        });
      } catch (e) {
        console.error("Failed to save language preference:", e);
      }
    }
  };

  const t = (path: string) => {
    const keys = path.split('.');
    // Try current language dictionary
    let current = TRANSLATIONS[language];
    
    // If dictionary doesn't exist for this language, use English
    if (!current) {
      current = TRANSLATIONS[DEFAULT_LANGUAGE];
    }
    
    for (const key of keys) {
      if (!current || current[key] === undefined) {
        // Fallback to English if key missing in current language dictionary
        let fallback = TRANSLATIONS[DEFAULT_LANGUAGE];
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
          if (!fallback) break;
        }
        return typeof fallback === 'string' ? fallback : path;
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
