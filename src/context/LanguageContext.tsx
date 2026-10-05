import React, { createContext, useContext, useState, useEffect } from 'react';
import { ARABIC_ROLES, ARABIC_LEVELS, ARABIC_STATUSES, ARABIC_QUARTERS, ARABIC_CATEGORIES, ARABIC_CLASSIFICATIONS, t as arT } from '../locales/ar';
import { ENGLISH_ROLES, ENGLISH_LEVELS, ENGLISH_STATUSES, ENGLISH_QUARTERS, ENGLISH_CATEGORIES, ENGLISH_CLASSIFICATIONS, tEn as enT } from '../locales/en';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  t: typeof arT;
  ROLES: typeof ARABIC_ROLES;
  LEVELS: typeof ARABIC_LEVELS;
  STATUSES: typeof ARABIC_STATUSES;
  QUARTERS: typeof ARABIC_QUARTERS;
  CATEGORIES: typeof ARABIC_CATEGORIES;
  CLASSIFICATIONS: typeof ARABIC_CLASSIFICATIONS;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const isRTL = language === 'ar';
  
  const translations = language === 'ar' ? {
    t: arT,
    ROLES: ARABIC_ROLES,
    LEVELS: ARABIC_LEVELS,
    STATUSES: ARABIC_STATUSES,
    QUARTERS: ARABIC_QUARTERS,
    CATEGORIES: ARABIC_CATEGORIES,
    CLASSIFICATIONS: ARABIC_CLASSIFICATIONS,
  } : {
    t: enT,
    ROLES: ENGLISH_ROLES,
    LEVELS: ENGLISH_LEVELS,
    STATUSES: ENGLISH_STATUSES,
    QUARTERS: ENGLISH_QUARTERS,
    CATEGORIES: ENGLISH_CATEGORIES,
    CLASSIFICATIONS: ENGLISH_CLASSIFICATIONS,
  };

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage,
      dir: isRTL ? 'rtl' : 'ltr',
      isRTL,
      ...translations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
