'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const LOCALIZED_TEXT: Record<string, any> = {
  en: {
    title: 'Recover Password',
    subtitle: 'Enter your email address to receive password recovery details',
    email: 'Email Address',
    submit: 'Recover Password',
    sending: 'Transmitting Details...',
    backToLogin: 'Back to Sign In',
    successTitle: 'Reset Instructions Transmitted!',
    successDesc: 'A password recovery link has been dispatched to your inbox. Check spam if not received in 5 minutes.',
  },
  ru: {
    title: 'Восстановление пароля',
    subtitle: 'Введите адрес электронной почты для восстановления доступа',
    email: 'Эл. почта',
    submit: 'Восстановить пароль',
    sending: 'Отправка данных...',
    backToLogin: 'Назад к входу',
    successTitle: 'Инструкции отправлены!',
    successDesc: 'Ссылка для сброса пароля отправлена на ваш почтовый ящик. Проверьте папку спама в течение 5 минут.',
  },
  uz: {
    title: 'Parolni tiklash',
    subtitle: 'Parolni tiklash yo‘riqnomasini olish uchun e-pochta kiriting',
    email: 'E-pochta manzili',
    submit: 'Parolni tiklash',
    sending: 'Yuborilmoqda...',
    backToLogin: 'Kirish sahifasiga qaytish',
    successTitle: 'Yo‘riqnoma yuborildi!',
    successDesc: 'Parolni o‘zgartirish havolasi e-pochtangizga yuborildi. Agar kelmasa, spam qutisini tekshiring.',
  }
};

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const text = LOCALIZED_TEXT[locale] || LOCALIZED_TEXT.en;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden bg-background text-foreground transition-colors duration-500 select-none">
      {/* Background gradients */}
      <div className="absolute top-[-25%] left-[-25%] w-[65%] h-[65%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-25%] w-[65%] h-[65%] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />

      {/* Floating Header Actions */}
      <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer glassmorphism py-2.5 px-4 rounded-xl border border-black/5 dark:border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BEXA Studio</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeSwitcher />
      </div>

      {/* Premium Glass Box */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-8 rounded-3xl glassmorphism shadow-2xl glow-border-card"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-700 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
            {text.title}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2 font-light leading-relaxed">
            {text.subtitle}
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 mb-6 font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3 animate-bounce">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="mb-2">{text.successTitle}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">{text.successDesc}</p>
            <Link
              href={`/${locale}/login`}
              className="mt-6 text-xs font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              {text.backToLogin}
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {text.email}
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 focus:outline-none"
            >
              <Send className="w-4 h-4 shrink-0 mr-2" />
              <span>{loading ? text.sending : text.submit}</span>
            </button>

            <div className="text-center">
              <Link
                href={`/${locale}/login`}
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {text.backToLogin}
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
