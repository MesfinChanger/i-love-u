'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [currentLang, setCurrentLang] = useState(DEFAULT_LANGUAGE);

  // Immediate Snappy Hydration
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
    if (saved) {
      setCurrentLang(saved);
    } else if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      const langMap: Record<string, string> = {
        'es': 'Spanish',
        'fr': 'French',
        'sw': 'Swahili',
        'ja': 'Japanese',
        'ar': 'Arabic',
        'pt': 'Portuguese',
        'hi': 'Hindi',
        'am': 'Amharic'
      };
      
      const detected = langMap[browserLang];
      if (detected) {
        setCurrentLang(detected);
      }
    }
  }, []);

  // background sync with profile
  useEffect(() => {
    if (profile?.preferredLanguage && profile.preferredLanguage !== currentLang) {
      setCurrentLang(profile.preferredLanguage);
    }
  }, [profile?.preferredLanguage]);

  const setLanguage = async (newLang: string) => {
    // Immediate UI Feedback
    setCurrentLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, newLang);
    }
    
    // Background Sync (non-blocking)
    if (db && user) {
      updateDoc(doc(db, 'users', user.uid), {
        preferredLanguage: newLang
      }).catch(e => console.warn("Language sync deferred:", e));
    }
  };

  const t = useCallback((path: string) => {
    const keys = path.split('.');
    
    const getValue = (dict: any) => {
      let result = dict;
      if (!result) return undefined;
      for (const key of keys) {
        if (result[key] === undefined) return undefined;
        result = result[key];
      }
      return result;
    };

    // 1. Try current language
    // 2. Try default language
    // 3. Fallback to path string
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS[DEFAULT_LANGUAGE];
    const value = getValue(langDict) || getValue(TRANSLATIONS[DEFAULT_LANGUAGE]);
    
    return typeof value === 'string' ? value : path;
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ language: currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
}
