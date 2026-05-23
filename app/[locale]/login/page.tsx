'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Sparkles, Globe, ArrowLeft } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';
import { loginAction } from '@/actions/adminActions';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const LOCALIZED_TEXT: Record<string, any> = {
  en: {
    title: 'Sign In',
    subtitle: 'Enter your credentials to access BEXA Studio',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signInBtn: 'Sign In',
    signingIn: 'Authenticating...',
    noAccount: "Don't have an account?",
    register: 'Create one',
    socialOr: 'or continue with',
    errorTitle: 'Authentication Failed',
    successTitle: 'Welcome Back!',
    phoneLogin: 'Sign in with Phone',
  },
  ru: {
    title: 'Войти',
    subtitle: 'Введите свои данные для доступа к BEXA Studio',
    username: 'Имя пользователя',
    password: 'Пароль',
    rememberMe: 'Запомнить меня',
    forgotPassword: 'Забыли пароль?',
    signInBtn: 'Войти',
    signingIn: 'Авторизация...',
    noAccount: 'Нет аккаунта?',
    register: 'Создать аккаунт',
    socialOr: 'или войти через',
    errorTitle: 'Ошибка авторизации',
    successTitle: 'С возвращением!',
    phoneLogin: 'Войти по телефону',
  },
  uz: {
    title: 'Kirish',
    subtitle: 'BEXA Studio-ga kirish uchun ma‘lumotlarni kiriting',
    username: 'Foydalanuvchi nomi',
    password: 'Parol',
    rememberMe: 'Eslab qolish',
    forgotPassword: 'Parolni unutdingizmi?',
    signInBtn: 'Kirish',
    signingIn: 'Tekshirilmoqda...',
    noAccount: 'Akkauntingiz yo‘qmi?',
    register: 'Yaratish',
    socialOr: 'yoki quyidagilar orqali kirish',
    errorTitle: 'Kirishda xatolik',
    successTitle: 'Xush kelibsiz!',
    phoneLogin: 'Telefon orqali kirish',
  }
};

export default function LoginPage() {
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
      setSuccess(true);
      setTimeout(() => {
        if (res.user?.role && res.user.role !== 'user') {
          router.push(`/${locale}/admin`);
        } else {
          router.push(`/${locale}/profile`);
        }
      }, 1500);
    } else {
      setError(res.error || 'Server error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden bg-background text-foreground transition-colors duration-500 select-none">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Floating back button & Theme swapper */}
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

      {/* Premium Glassmorphic Card */}
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
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2 font-light">
            {text.subtitle}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm flex flex-col gap-1">
            <span className="font-semibold">{text.errorTitle}</span>
            <span className="text-xs text-red-500/90">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{text.successTitle}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username Input */}
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
                placeholder="login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {text.password}
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-[10px] text-indigo-500 hover:text-indigo-400 hover:underline font-bold uppercase tracking-wider transition-colors"
              >
                {text.forgotPassword}
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading || success}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-12 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold text-xs"
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

          {/* Remember me */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="remember"
              disabled={loading || success}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 checked:bg-indigo-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-neutral-500 dark:text-neutral-400 select-none cursor-pointer font-medium">
              {text.rememberMe}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-12 btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 focus:outline-none"
          >
            {loading ? text.signingIn : text.signInBtn}
          </button>
        </form>

        {/* Social login buttons */}
        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
            <span className="relative px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
              {text.socialOr}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => alert('Social Google login initiated.')}
              className="h-11 rounded-2xl border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 bg-black/5 dark:bg-white/5 flex items-center justify-center gap-2 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer text-xs font-semibold text-neutral-700 dark:text-white"
            >
              <Globe className="w-4 h-4 text-red-500" />
              <span>Google</span>
            </button>
            <button
              onClick={() => alert('Social GitHub login initiated.')}
              className="h-11 rounded-2xl border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 bg-black/5 dark:bg-white/5 flex items-center justify-center gap-2 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer text-xs font-semibold text-neutral-700 dark:text-white"
            >
              <GithubIcon className="w-4 h-4 text-neutral-800 dark:text-white" />
              <span>GitHub</span>
            </button>
          </div>
          
          <button
            onClick={() => router.push(`/${locale}/verify`)}
            className="w-full h-11 mt-4 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center gap-2 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer text-xs font-semibold text-neutral-700 dark:text-white"
          >
            <span>{text.phoneLogin}</span>
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-neutral-500">
          <span>{text.noAccount}</span>{' '}
          <Link
            href={`/${locale}/register`}
            className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
          >
            {text.register}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
