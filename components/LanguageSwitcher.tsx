'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { Locale, locales } from '@/lib/i18n';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const { locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale === locale) return;

    // Replace the locale segment in the pathname
    const segments = pathname.split('/');
    // segments[1] is the locale (e.g. "en" or "ru" or "uz")
    segments[1] = newLocale;
    const newPathname = segments.join('/');

    router.push(newPathname);
  };

  const languageNames: Record<Locale, string> = {
    en: 'English',
    ru: 'Русский',
    uz: 'Oʻzbekcha',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3 rounded-full flex items-center gap-2 cursor-pointer glassmorphism hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase font-semibold tracking-wider text-xs">{locale}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-36 rounded-2xl glassmorphism bg-white/80 dark:bg-neutral-950/80 p-1.5 shadow-xl border border-white/20 dark:border-white/5 z-50 overflow-hidden"
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  loc === locale
                    ? 'bg-neutral-900/10 dark:bg-white/10 text-neutral-950 dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-900/5 dark:hover:bg-white/5'
                }`}
              >
                {languageNames[loc]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
