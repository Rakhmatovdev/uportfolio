'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { TwitterIcon, GithubIcon, LinkedinIcon, DribbbleIcon } from '@/components/Icons';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen pb-24 page-transition">
      <PageHeader title={t('contact.header.title')} subtitle={t('contact.header.subtitle')} />

      <section className="py-16 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Social Ecosystem */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Info Cards */}
            <div className="flex flex-col gap-6">
              {[
                { icon: Mail, label: 'Email Enquiries', val: 'studio@bexa.studio' },
                { icon: Phone, label: 'Voice Connect', val: '+998 (90) 123-4567' },
                { icon: MapPin, label: t('contact.info.office'), val: t('contact.info.address') },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl glassmorphism bg-white/20 dark:bg-black/25 border border-white/10 dark:border-white/5 flex gap-4 items-center hover:scale-[1.01] transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug">
                      {item.val}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Grid */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                {t('contact.info.socials')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Twitter', url: 'https://twitter.com', icon: TwitterIcon, gradient: 'from-blue-500/10 to-blue-600/5 hover:border-blue-500/20' },
                  { name: 'GitHub', url: 'https://github.com', icon: GithubIcon, gradient: 'from-neutral-900/10 to-neutral-800/5 hover:border-neutral-500/20' },
                  { name: 'LinkedIn', url: 'https://linkedin.com', icon: LinkedinIcon, gradient: 'from-indigo-900/10 to-indigo-800/5 hover:border-indigo-500/20' },
                  { name: 'Dribbble', url: 'https://dribbble.com', icon: DribbbleIcon, gradient: 'from-pink-900/10 to-pink-800/5 hover:border-pink-500/20' },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-5 rounded-2xl glassmorphism bg-gradient-to-br ${social.gradient} flex items-center gap-3 border border-white/10 hover:scale-[1.02] transition-all`}
                  >
                    <social.icon className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs font-bold">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Brief Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-12 rounded-[36px] glassmorphism bg-white/20 dark:bg-black/25 border border-white/10 dark:border-white/5 shadow-2xl relative">
              <AnimatePresence mode="wait">
                {status !== 'success' ? (
                  <motion.form
                    key="contactForm"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Name field */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                        {t('contact.form.name')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={t('contact.form.namePlaceholder')}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl text-sm glassmorphism bg-white dark:bg-black/20 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    {/* Email field */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                        {t('contact.form.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={t('contact.form.emailPlaceholder')}
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-xl text-sm glassmorphism bg-white dark:bg-black/20 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    {/* Message field */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                        {t('contact.form.message')}
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        placeholder={t('contact.form.messagePlaceholder')}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl text-sm glassmorphism bg-white dark:bg-black/20 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      />
                    </div>

                    {/* Action Button */}
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="h-12 w-full rounded-full bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      {status === 'sending' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          <span>{t('contact.form.sending')}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t('contact.form.submit')}</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="successState"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-10 flex flex-col items-center gap-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {t('contact.form.successTitle')}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed mx-auto">
                        {t('contact.form.successDesc')}
                      </p>
                    </div>
                    <button
                      onClick={() => setStatus('idle')}
                      className="h-10 px-6 rounded-full glassmorphism text-xs font-bold hover:scale-105 transition-transform"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Real Styled Yandex Map */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="rounded-[32px] sm:rounded-[40px] overflow-hidden aspect-[4/3] sm:aspect-[21/9] border border-neutral-200 dark:border-neutral-800 relative shadow-2xl group glassmorphism p-2 bg-white/10 dark:bg-black/20">
          <div className="w-full h-full rounded-[24px] sm:rounded-[32px] overflow-hidden relative">
            <iframe
              src="https://yandex.com/map-widget/v1/?ll=69.336241%2C41.342260&z=15&l=map&lang=en_RU&pt=69.336241,41.342260,pm2blm"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
              className="w-full h-full grayscale dark:invert opacity-80 dark:opacity-75 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
