'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const LOCALIZED_TEXT: Record<string, any> = {
  en: {
    title: 'Verification',
    subtitle: 'We have dispatched a 4-digit code to your registered device',
    codeLabel: 'Security Code',
    verifyBtn: 'Verify Code',
    verifying: 'Checking Matrix...',
    resend: 'Resend code',
    wait: 'Wait',
    sec: 's',
    success: 'Secure Access Granted!',
    back: 'Back to Sign In',
  },
  ru: {
    title: 'Подтверждение',
    subtitle: 'Мы отправили 4-значный код на ваше зарегистрированное устройство',
    codeLabel: 'Код безопасности',
    verifyBtn: 'Подтвердить код',
    verifying: 'Проверка кода...',
    resend: 'Отправить код еще раз',
    wait: 'Подождите',
    sec: 'сек',
    success: 'Доступ предоставлен!',
    back: 'Назад к входу',
  },
  uz: {
    title: 'Tasdiqlash',
    subtitle: 'Biz ro‘yxatdan o‘tgan qurilmangizga 4 xonali kod yubordik',
    codeLabel: 'Xavfsizlik kodi',
    verifyBtn: 'Kodni tasdiqlash',
    verifying: 'Tekshirilmoqda...',
    resend: 'Kodni qayta yuborish',
    wait: 'Kuting',
    sec: 'soniya',
    success: 'Tizimga kirish tasdiqlandi!',
    back: 'Kirish sahifasiga qaytish',
  }
};

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const text = LOCALIZED_TEXT[locale] || LOCALIZED_TEXT.en;

  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(59);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Resend code timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // Allow only digits
    const newDigits = [...digits];
    // Keep only last char if filled
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);

    // Auto-focus next slot
    if (val && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Focus previous slot on backspace
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 4) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}`);
      }, 1200);
    }, 1500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(59);
    setDigits(['', '', '', '']);
    inputRefs[0].current?.focus();
    alert('SMS verification code has been re-transmitted!');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12 overflow-hidden bg-background text-foreground transition-colors duration-500 select-none">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation Headers */}
      <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
        <Link
          href={`/${locale}/login`}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer glassmorphism py-2.5 px-4 rounded-xl border border-black/5 dark:border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{text.back}</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeSwitcher />
      </div>

      {/* Main glass frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 p-8 rounded-3xl glassmorphism shadow-2xl glow-border-card"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
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
            className="flex flex-col items-center text-center p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 mb-2 font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3 animate-bounce">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3>{text.success}</h3>
          </motion.div>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 text-center">
                {text.codeLabel}
              </label>

              {/* Numerical slot cards */}
              <div className="flex items-center justify-center gap-4 mt-2">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    required
                    disabled={loading}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white text-center font-extrabold text-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>

            {/* Verify submit */}
            <button
              type="submit"
              disabled={loading || digits.some(d => !d)}
              className="w-full h-12 btn-primary font-bold text-xs uppercase tracking-wider disabled:opacity-50 focus:outline-none"
            >
              <span>{loading ? text.verifying : text.verifyBtn}</span>
            </button>

            {/* Countdown resend block */}
            <div className="text-center">
              {timer > 0 ? (
                <span className="text-xs text-neutral-500">
                  {text.wait} {timer}{text.sec}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-400 uppercase tracking-wider transition-colors focus:outline-none cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{text.resend}</span>
                </button>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
