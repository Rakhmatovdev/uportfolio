'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/components/I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight, Play, MessageSquare, Send, Mail, Phone, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
import { clientLogos, testimonials, faqItems } from '@/data/mockData';

export default function HomePage() {
  const { locale, t } = useTranslation();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);

  // Contact form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formType, setFormType] = useState('branding');
  const [formMsg, setFormMsg] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Statistics counters simulation
  const [counts, setCounts] = useState({ projects: 0, experience: 0, satisfaction: 0, awards: 0 });

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const targets = { projects: 120, experience: 8, satisfaction: 99, awards: 15 };

    const timer = setInterval(() => {
      currentStep++;
      setCounts({
        projects: Math.round((targets.projects / steps) * currentStep),
        experience: Math.round((targets.experience / steps) * currentStep),
        satisfaction: Math.round((targets.satisfaction / steps) * currentStep),
        awards: Math.round((targets.awards / steps) * currentStep),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormMsg('');
      setTimeout(() => setFormSuccess(false), 5000);
    }, 1500);
  };

  // Mouse move handler for premium spotlight hover effect (SaaS style card glow)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const projectTypes = [
    { id: 'branding', name: 'Branding & Visual Identity' },
    { id: 'development', name: 'Frontend Edge Engineering' },
    { id: 'design', name: 'SaaS UI/UX Design System' },
    { id: 'threeD', name: 'Interactive 3D Ecosystems' }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen pt-24 page-transition bg-background text-foreground transition-colors duration-500">
      {/* Floating abstract decorative icons (micro-animations) */}
      <div className="absolute top-[18%] left-[8%] w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-indigo-500/20 shadow-md text-indigo-500 float-element pointer-events-none hidden md:flex">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute top-[35%] right-[10%] w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center border border-purple-500/20 shadow-md text-purple-500 float-element pointer-events-none hidden md:flex" style={{ animationDelay: '-3s' }}>
        <Star className="w-4 h-4 fill-purple-500/20" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-8 flex flex-col items-start gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glassmorphism text-xs font-semibold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('home.hero.tag')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.02] bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-700 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent"
            >
              {t('home.hero.title1')}{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-accent">
                {t('home.hero.title2')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed font-light"
            >
              {t('home.hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <Link href={`/${locale}/portfolio`} className="btn-primary h-12 px-7 text-xs font-bold uppercase tracking-wider group">
                <span>{t('home.hero.ctaPrimary')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1.5" />
              </Link>
              <Link href="#contact" className="btn-secondary h-12 px-7 text-xs font-bold uppercase tracking-wider">
                <span>{t('home.hero.ctaSecondary')}</span>
              </Link>
            </motion.div>
          </div>

          {/* Glowing Interactive Artistry Widget */}
          <div className="lg:col-span-4 hidden lg:flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, rotate: -8, scale: 0.95 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onMouseMove={handleMouseMove}
              className="w-80 h-[400px] rounded-3xl p-6 glassmorphism flex flex-col justify-between shadow-2xl relative z-10 overflow-hidden glow-border-card spotlight-card border border-white/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-indigo-400 dark:text-indigo-300">AURA CORE DESIGN</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              </div>
              <div className="my-8 flex flex-col gap-3">
                <div className="h-6 w-1/2 rounded-xl bg-black/5 dark:bg-white/5" />
                <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/10" />
                <div className="h-4 w-3/4 rounded-xl bg-black/5 dark:bg-white/5" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                  <Play className="w-4 h-4 fill-indigo-500/20 ml-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Interactive Artistry</span>
                  <span className="text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">Play Showcase Reel</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Logos Slider */}
      <section className="py-12 border-y border-black/5 dark:border-white/5 bg-white/20 dark:bg-[#040917]/30 transition-colors duration-500 overflow-hidden z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 md:gap-4 opacity-40 dark:opacity-30">
            {clientLogos.map((client, idx) => (
              <span
                key={idx}
                className="text-base font-black tracking-widest text-neutral-800 dark:text-neutral-200 hover:text-indigo-500 dark:hover:text-indigo-400 hover:opacity-100 transition-all duration-300"
              >
                {client.logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: `${counts.projects}+`, label: t('home.stats.projects') },
            { value: `${counts.experience}y`, label: t('home.stats.experience') },
            { value: `${counts.satisfaction}%`, label: t('home.stats.satisfaction') },
            { value: `${counts.awards}+`, label: t('home.stats.awards') },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              onMouseMove={handleMouseMove}
              className="p-8 rounded-3xl glassmorphism text-center flex flex-col gap-2 hover:scale-[1.02] transition-all glow-border-card spotlight-card"
            >
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-mono tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Short Dynamic Bio (About section) */}
      <section className="py-24 max-w-5xl mx-auto px-6 relative z-10">
        <div className="p-10 md:p-16 rounded-[40px] glassmorphism bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent flex flex-col md:flex-row gap-10 items-center border border-black/5 dark:border-white/5 shadow-2xl">
          <div className="flex flex-col gap-4 md:w-2/3 items-start">
            <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">{t('home.about.tag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-snug text-neutral-900 dark:text-white">
              {t('home.about.title')}
            </h2>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 font-light">
              {t('home.about.desc')}
            </p>
          </div>
          <div className="md:w-1/3 flex items-center justify-center">
            <Link
              href={`/${locale}/about`}
              className="w-28 h-28 rounded-full border border-indigo-500/20 flex flex-col items-center justify-center cursor-pointer text-indigo-500 dark:text-indigo-400 font-semibold hover:bg-indigo-500 hover:text-white dark:hover:text-black transition-all duration-500 hover:scale-105 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/20 group text-xs uppercase tracking-widest"
            >
              <span>{t('home.cta.button')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform mt-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 overflow-hidden">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">TESTIMONIALS</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">What Clients Say</h2>
        </div>

        <div className="relative max-w-4xl mx-auto p-8 sm:p-16 rounded-[36px] glassmorphism overflow-hidden shadow-2xl border border-black/5 dark:border-white/5">
          <div className="absolute top-10 left-10 text-indigo-500/5 font-serif text-[180px] leading-none select-none pointer-events-none">
            “
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4.5 h-4.5 text-indigo-500 fill-indigo-500" />
              ))}
            </div>

            <p className="text-lg sm:text-xl font-medium leading-relaxed italic text-neutral-800 dark:text-neutral-200">
              "{testimonials[activeTestimonial].content}"
            </p>

            <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-8 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-neutral-200 dark:bg-neutral-800 border border-black/5 dark:border-white/5">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-neutral-900 dark:text-white">
                    {testimonials[activeTestimonial].name}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-0.5">
                    {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none border border-white/20"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none border border-white/20"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: PREMIUM INTERACTIVE CONTACT FORM SECTION (PLACED BEFORE FAQ) */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6 relative z-10 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Contact details card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 sm:p-10 rounded-[32px] glassmorphism border border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Agency</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-neutral-900 dark:text-white">
                Let's shape your digital interface
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
                Have a premium spatial design or Frontend engineering requirement? Drop us a brief and our design directors will get back in 24 hours.
              </p>

              <div className="flex flex-col gap-4 mt-4 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span>hello@bexa.studio</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span>+998 71 202 22 44</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-neutral-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span>12 Apple Blvd, Silicon Sector</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mt-8">
              BEXA STUDIO &copy; {new Date().getFullYear()}
            </div>
          </div>

          {/* Contact Interactive form card */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-[32px] glassmorphism border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white/95 dark:bg-[#070e1e]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-4 text-center p-8"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                </div>
                <h3 className="text-xl font-bold">Message Transmitted!</h3>
                <p className="text-xs text-neutral-500 max-w-sm">We've securely received your project brief. A Principal Creative Director will contact you shortly.</p>
              </motion.div>
            )}

            <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Elena Romanova"
                    className="h-11 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold text-neutral-900 dark:text-white"
                  />
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="architect@bexa.studio"
                    className="h-11 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Sector</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-neutral-700 dark:text-neutral-300"
                >
                  {projectTypes.map(type => (
                    <option key={type.id} value={type.id} className="bg-white dark:bg-[#070e1e]">
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Project Brief</label>
                <textarea
                  required
                  rows={4}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="Outline your timeline, goals, and design preferences..."
                  className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 placeholder-neutral-500/60 dark:placeholder-neutral-400/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold resize-none text-neutral-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="btn-primary h-12 w-full md:w-48 mt-2 font-bold text-xs tracking-wider uppercase flex items-center gap-2 focus:outline-none"
              >
                <span>{formLoading ? 'Transmitting...' : 'Transmit Brief'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (INTERACTIVE ACCORDION PLACED DIRECTLY AFTER CONTACT) */}
      <section className="py-24 max-w-4xl mx-auto px-6 relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">QUESTIONS & ANSWERS</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqItems.map((item, idx) => {
            const isOpen = activeFAQ === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="rounded-2xl border border-black/5 dark:border-white/5 bg-white/20 dark:bg-[#070e1e]/20 overflow-hidden shadow-sm hover:border-indigo-500/20 transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFAQ(isOpen ? null : item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus:outline-none gap-4 group"
                >
                  <span className="text-sm sm:text-base font-extrabold text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-500' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 font-light">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Segment (Awwwards-Style Final Section) */}
      <section className="py-28 text-center relative max-w-7xl mx-auto px-6 overflow-hidden border-t border-black/5 dark:border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-neutral-900 dark:text-white">
            {t('home.cta.title')}
          </h2>
          <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed font-light">
            {t('home.cta.subtitle')}
          </p>
          <a
            href="#contact"
            className="btn-primary h-14 px-9 font-bold text-xs tracking-wider uppercase group active:scale-95"
          >
            <span>{t('home.cta.button')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform ml-1.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
