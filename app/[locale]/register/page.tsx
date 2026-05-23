'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { registerAction } from '@/actions/adminActions';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const LOCALIZED_TEXT: Record<string, any> = {
  en: {
    title: 'Create Account',
    subtitle: 'Sign up to explore the premium BEXA Studio tools',
    username: 'Username',
    email: 'Email Address',
    phone: 'Phone Number',
    password: 'Password',
    agree: 'I agree to the Terms of Service & Privacy Policy',
    submit: 'Create Account',
    registering: 'Generating Credentials...',
    hasAccount: 'Already have an account?',
    login: 'Sign In',
    errorTitle: 'Registration Failed',
    successTitle: 'Account Generated!',
    successDesc: 'Redirecting to login portal in 1.5 seconds...',
  },
  ru: {
    title: 'Регистрация',
    subtitle: 'Зарегистрируйтесь для доступа к инструментам BEXA Studio',
    username: 'Имя пользователя',
    email: 'Эл. почта',
    phone: 'Номер телефона',
    password: 'Пароль',
    agree: 'Я согласен с Условиями обслуживания и Политикой конфиденциальности',
    submit: 'Зарегистрироваться',
    registering: 'Создание аккаунта...',
    hasAccount: 'Уже есть аккаунт?',
    login: 'Войти',
    errorTitle: 'Ошибка регистрации',
    successTitle: 'Аккаунт создан!',
    successDesc: 'Перенаправление на страницу входа через 1.5 сек...',
  },
  uz: {
    title: 'Ro‘yxatdan o‘tish',
    subtitle: 'BEXA Studio dasturlaridan foydalanish uchun ro‘yxatdan o‘ting',
    username: 'Foydalanuvchi nomi',
    email: 'E-pochta manzili',
    phone: 'Telefon raqam',
    password: 'Parol',
    agree: 'Xizmat ko‘rsatish shartlari va Maxfiylik siyosatiga roziman',
    submit: 'Ro‘yxatdan o‘tish',
    registering: 'Akkaunt yaratilmoqda...',
    hasAccount: 'Akkauntingiz bormi?',
    login: 'Kirish',
    errorTitle: 'Yaratishda xatolik',
    successTitle: 'Akkaunt yaratildi!',
    successDesc: '1.5 soniyadan keyin kirish sahifasiga o‘tiladi...',
  }
};

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const text = LOCALIZED_TEXT[locale] || LOCALIZED_TEXT.en;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !phone) return;
    if (!agree) {
      setError(locale === 'uz' ? 'Shartlarga rozi bo‘lishingiz kerak' : locale === 'ru' ? 'Вы должны согласиться с условиями' : 'You must agree to the terms');
      return;
    }

    setLoading(true);
    setError('');

    const res = await registerAction({ username, email, password, phone });

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
    } else {
      setError(res.error || 'Server error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden bg-background text-foreground transition-colors duration-500 select-none">
      {/* Background neon glows */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation & Theme Switcher */}
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

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-8 rounded-3xl glassmorphism shadow-2xl glow-border-card"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-700 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
            {text.title}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2 font-light">
            {text.subtitle}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm flex flex-col gap-1">
            <span className="font-semibold">{text.errorTitle}</span>
            <span className="text-xs text-red-500/90">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm flex flex-col gap-1 text-center items-center font-semibold">
            <span>{text.successTitle}</span>
            <span className="text-xs text-emerald-500/90 font-medium">{text.successDesc}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {text.username}
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                required
                disabled={loading || success}
                placeholder="Jasur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {text.email}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="email"
                required
                disabled={loading || success}
                placeholder="jasur@bexa.studio"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {text.phone}
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-4 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                required
                disabled={loading || success}
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {text.password}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading || success}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-11 pr-12 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="agree"
              disabled={loading || success}
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 rounded border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 checked:bg-indigo-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="agree" className="text-xs text-neutral-500 dark:text-neutral-400 select-none cursor-pointer leading-tight font-medium">
              {text.agree}
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-12 btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 focus:outline-none mt-2"
          >
            {loading ? text.registering : text.submit}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          <span>{text.hasAccount}</span>{' '}
          <Link
            href={`/${locale}/login`}
            className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
          >
            {text.login}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
