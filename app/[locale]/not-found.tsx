'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/components/I18nProvider';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  const { locale, t } = useTranslation();

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-24 px-6 overflow-hidden page-transition">
      {/* Background Animated Gradient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[130px] dark:bg-indigo-500/15 pointer-events-none" />

      <div className="max-w-md w-full text-center flex flex-col items-center gap-8 relative z-10">
        {/* Orbital System */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-indigo-500/30"
          />
          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border border-indigo-500/20"
          />
          {/* Center Sphere */}
          <div className="w-20 h-20 rounded-full glassmorphism bg-indigo-500/10 border-indigo-500/30 flex items-center justify-center shadow-lg text-indigo-500">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          {/* Floating Orbiting Node */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-purple-500 shadow-md shadow-purple-500/50" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-4xl font-extrabold font-mono text-indigo-500">404</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('ui.page404.title')}
          </h1>
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {t('ui.page404.desc')}
          </p>
        </div>

        <Link
          href={`/${locale}`}
          className="h-11 px-6 rounded-full flex items-center gap-2 bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold text-xs transition-transform duration-300 hover:scale-105 shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('ui.page404.button')}</span>
        </Link>
      </div>
    </div>
  );
}
