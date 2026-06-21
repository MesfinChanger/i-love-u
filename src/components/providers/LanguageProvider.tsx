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

  // 1. Initial Load from LocalStorage or Browser
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
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
        'zh': 'Chinese (Simplified)',
        'hi': 'Hindi',
        'am': 'Amharic'
      };
      
      const detected = langMap[browserLang];
      if (detected) {
        setCurrentLang(detected);
      }
    }
  }, []);

  // 2. Sync from Profile (if logged in)
  useEffect(() => {
    if (profile?.preferredLanguage && profile.preferredLanguage !== currentLang) {
      setCurrentLang(profile.preferredLanguage);
    }
  }, [profile, currentLang]);

  const setLanguage = async (newLang: string) => {
    setCurrentLang(newLang);
    localStorage.setItem(LOCAL_STORAGE_KEY, newLang);
    
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

  const t = useCallback((path: string) => {
    const keys = path.split('.');
    
    // Try current language dictionary
    let current = TRANSLATIONS[currentLang];
    
    // Fallback logic: iterate through keys in the current language dictionary
    // If not found, iterate through keys in the default (English) dictionary
    const getValue = (dict: any) => {
      let result = dict;
      for (const key of keys) {
        if (!result || result[key] === undefined) return undefined;
        result = result[key];
      }
      return result;
    };

    const value = getValue(current) || getValue(TRANSLATIONS[DEFAULT_LANGUAGE]);
    
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
