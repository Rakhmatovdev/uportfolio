'use client';

import React, { createContext, useContext } from 'react';
import { Locale } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: any;
  children: React.ReactNode;
}) {
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = dictionary;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === 'string' ? value : (fallback || key);
  };

  return (
    <I18nContext.Provider value={{ locale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
