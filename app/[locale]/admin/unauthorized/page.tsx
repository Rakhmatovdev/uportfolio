'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const LOCALIZED_TEXT: Record<string, any> = {
  en: {
    title: '403 | Access Denied',
    desc: 'You do not possess the required security privileges or role authorizations to enter this sector of BEXA Studio Administration.',
    btnBack: 'Return to Base',
    btnHome: 'Home Station',
  },
  ru: {
    title: '403 | В доступе отказано',
    desc: 'У вас нет необходимых прав безопасности или административных ролей для входа в этот сектор BEXA Studio Administration.',
    btnBack: 'Вернуться назад',
    btnHome: 'Главная станция',
  },
  uz: {
    title: '403 | Kirish Taqiqlangan',
    desc: 'Sizda BEXA Studio boshqaruv panelining ushbu bo‘limiga kirish uchun yetarli xavfsizlik ruxsatnomalari yoki rollari mavjud emas.',
    btnBack: 'Orqaga qaytish',
    btnHome: 'Bosh sahifa',
  }
};

export default function UnauthorizedPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const text = LOCALIZED_TEXT[locale] || LOCALIZED_TEXT.en;

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden bg-[#030712] text-white select-none">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Floating Theme Swapper */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-8 rounded-3xl border border-red-500/20 glassmorphism shadow-2xl backdrop-blur-2xl bg-black/60 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-6 shadow-lg shadow-red-500/10">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
        </div>
        
        <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-red-400 bg-clip-text text-transparent mb-4">
          {text.title}
        </h1>
        
        <p className="text-sm text-neutral-400 font-light leading-relaxed mb-8">
          {text.desc}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link
            href={`/${locale}/login`}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer text-xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{text.btnBack}</span>
          </Link>
          
          <Link
            href={`/${locale}`}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer text-xs font-semibold"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>{text.btnHome}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
