'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TwitterIcon, GithubIcon, LinkedinIcon, DribbbleIcon } from '@/components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const { locale, t } = useTranslation();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Skip rendering on auth or admin CMS routes
  const isAdminPath = pathname.includes('/admin') || 
                      pathname.includes('/login') || 
                      pathname.includes('/register') || 
                      pathname.includes('/forgot-password') || 
                      pathname.includes('/verify');
  if (isAdminPath) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 1200);
  };

  const currentYear = new Date().getFullYear();

  const links = [
    { name: t('nav.home'), path: `/${locale}` },
    { name: t('nav.about'), path: `/${locale}/about` },
    { name: t('nav.whatWeDo'), path: `/${locale}/what-we-do` },
    { name: t('nav.portfolio'), path: `/${locale}/portfolio` },
    { name: t('nav.team'), path: `/${locale}/team` },
    { name: t('nav.news'), path: `/${locale}/news` },
    { name: t('nav.faq'), path: `/${locale}/faq` },
  ];

  const services = [
    t('whatWeDo.services.design.title'),
    t('whatWeDo.services.development.title'),
    t('whatWeDo.services.branding.title'),
    t('whatWeDo.services.immersive.title'),
  ];

  return (
    <footer className="relative bg-neutral-50 dark:bg-[#030712] border-t border-neutral-100 dark:border-neutral-900 pt-20 pb-10 transition-colors duration-500 overflow-hidden">
      {/* Background neon light blurs */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-2 group focus:outline-none">
              <span className="text-xl font-black tracking-tight text-neutral-950 dark:text-white">
                BEXA <span className="text-indigo-500 dark:text-indigo-400 font-light">Studio</span>
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform duration-300" />
            </Link>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {t('footer.tagline')}
            </p>
            {/* Social Grid */}
            <div className="flex items-center gap-3">
              {[
                { icon: TwitterIcon, path: 'https://twitter.com', label: 'Twitter' },
                { icon: GithubIcon, path: 'https://github.com', label: 'GitHub' },
                { icon: LinkedinIcon, path: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: DribbbleIcon, path: 'https://dribbble.com', label: 'Dribbble' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.path}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
              {t('footer.links')}
            </h3>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
              {t('footer.services')}
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((service, idx) => (
                <li key={idx} className="text-sm text-neutral-500 dark:text-neutral-400">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
              {t('footer.newsletter')}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t('footer.newsletterDesc')}
            </p>

            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="subscribeForm"
                  onSubmit={handleSubscribe}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex items-center"
                >
                  <input
                    type="email"
                    required
                    placeholder={t('footer.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 pr-12 rounded-xl text-sm glassmorphism bg-white dark:bg-[#0b0f19] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1.5 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer bg-neutral-950 dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-50 transition-opacity"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="subscribeSuccess"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-neutral-100 dark:border-neutral-900 text-xs text-neutral-400 dark:text-neutral-600 gap-4">
          <div>
            &copy; {currentYear} BEXA Studio. {t('footer.rights')}
          </div>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href={`/${locale}`} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
