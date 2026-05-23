'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react';
import { loginAction } from '@/actions/adminActions';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const LOCALIZED_TEXT: Record<string, any> = {
  en: {
    title: 'CMS Portal',
    subtitle: 'Administrative Control Center | BEXA Studio',
    username: 'Admin Username',
    password: 'Security Password',
    rememberMe: 'Remember session',
    signInBtn: 'Initialize Dashboard',
    signingIn: 'Checking Credentials...',
    errorTitle: 'System Access Denied',
    successTitle: 'Matrix Access Granted',
    hintText: 'Default Admin: login "balu" / password "root123#"',
  },
  ru: {
    title: 'Панель CMS',
    subtitle: 'Центр административного управления | BEXA Studio',
    username: 'Имя администратора',
    password: 'Пароль безопасности',
    rememberMe: 'Запомнить сессию',
    signInBtn: 'Войти в панель',
    signingIn: 'Проверка прав доступа...',
    errorTitle: 'В доступе отказано',
    successTitle: 'Доступ разрешен',
    hintText: 'Администратор по умолчанию: "balu" / пароль "root123#"',
  },
  uz: {
    title: 'CMS Portal',
    subtitle: 'Ma‘muriy boshqaruv markazi | BEXA Studio',
    username: 'Admin foydalanuvchi nomi',
    password: 'Xavfsizlik paroli',
    rememberMe: 'Sessiyani eslab qolish',
    signInBtn: 'Panelni yuklash',
    signingIn: 'Huquqlar tekshirilmoqda...',
    errorTitle: 'Kirish taqiqlangan',
    successTitle: 'Tizimga kirish tasdiqlandi',
    hintText: 'Admin: login "balu" / parol "root123#"',
  }
};

export default function AdminLoginPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const text = LOCALIZED_TEXT[locale] || LOCALIZED_TEXT.en;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError('');

    const res = await loginAction({ username, password, rememberMe });

    if (res.success) {
      if (res.user?.role && res.user.role === 'user') {
        setError(locale === 'uz' ? 'Kechirasiz, sizda admin huquqlari yo‘q!' : locale === 'ru' ? 'Извините, у вас нет прав администратора!' : 'Sorry, you do not possess administrative privileges!');
        setLoading(false);
        return;
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/admin`);
        router.refresh();
      }, 1000);
    } else {
      setError(res.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden bg-[#030712] text-white select-none">
      {/* Dynamic Grid Overlay & Glowing Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[70%] rounded-full bg-red-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

      {/* Navigation and Swapper */}
      <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer glassmorphism py-2 px-4 rounded-xl border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BEXA Studio</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeSwitcher />
      </div>

      {/* Main glass frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-8 rounded-3xl border border-red-500/10 shadow-2xl backdrop-blur-2xl bg-black/60"
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-500/5">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            {text.title}
          </h1>
          <p className="text-xs text-neutral-400 uppercase tracking-widest mt-2 font-semibold">
            {text.subtitle}
          </p>
        </div>

        {/* Credentials Hints */}
        <div className="mb-6 py-2.5 px-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-indigo-400/90 text-center font-medium leading-relaxed">
          {text.hintText}
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm flex flex-col gap-1">
            <span className="font-semibold text-xs tracking-wider uppercase">{text.errorTitle}</span>
            <span className="text-xs text-red-500/90 font-light">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-semibold text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{text.successTitle}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Admin User */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {text.username}
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                required
                disabled={loading || success}
                placeholder="login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-light text-sm"
              />
            </div>
          </div>

          {/* Security Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {text.password}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading || success}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-11 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-light text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember option */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="remember"
              disabled={loading || success}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-red-500 checked:border-red-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-neutral-400 select-none cursor-pointer">
              {text.rememberMe}
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-12 mt-2 rounded-2xl bg-red-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-500 transition-colors shadow-lg hover:shadow-red-500/20 disabled:opacity-50 cursor-pointer text-sm"
          >
            <span>{loading ? text.signingIn : text.signInBtn}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
