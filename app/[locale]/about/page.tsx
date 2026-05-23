'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Target, Award, Globe, Users, Trophy, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  const timeline = [
    { year: '2018', title: 'The Genesis', desc: t('about.story.2018') },
    { year: '2020', title: 'Expansion & Scale', desc: t('about.story.2020') },
    { year: '2022', title: 'Awwwards Peak', desc: t('about.story.2022') },
    { year: '2024', title: 'Spatial Interface Era', desc: t('about.story.2024') },
    { year: '2026', title: 'AI-Agentic Mastery', desc: t('about.story.2026') },
  ];

  const stats = [
    { value: '8+', label: t('about.stats.experience'), icon: Trophy },
    { value: '25+', label: t('about.stats.team'), icon: Users },
    { value: '98%', label: t('about.stats.clients'), icon: ShieldCheck },
    { value: '4.2x', label: t('about.stats.growth'), icon: TrendingUp },
  ];

  return (
    <div className="relative min-h-screen pb-24 page-transition">
      <PageHeader title={t('about.header.title')} subtitle={t('about.header.subtitle')} />

      {/* Grid Statistics */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="p-8 rounded-3xl glassmorphism bg-white/20 dark:bg-black/25 flex flex-col gap-4 items-start relative overflow-hidden group glow-card"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-4xl font-extrabold tracking-tight font-mono text-neutral-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">{t('about.story.title')}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{t('about.story.subtitle')}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Navigation Years */}
          <div className="lg:col-span-4 flex lg:flex-col flex-wrap gap-4 justify-center">
            {timeline.map((milestone, idx) => (
              <button
                key={milestone.year}
                onClick={() => setActiveMilestone(idx)}
                className={`h-16 px-6 rounded-2xl flex items-center gap-4 text-left cursor-pointer transition-all duration-300 ${
                  activeMilestone === idx
                    ? 'glassmorphism bg-indigo-500/10 border-indigo-500/40 text-neutral-950 dark:text-white shadow-lg'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                }`}
              >
                <span className="text-xl font-extrabold font-mono">{milestone.year}</span>
                <span className="text-sm font-semibold">{milestone.title}</span>
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMilestone}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-10 md:p-14 rounded-[36px] glassmorphism bg-white/30 dark:bg-black/35 shadow-2xl relative border border-white/10"
              >
                <div className="absolute top-8 right-8 text-indigo-500/10 dark:text-indigo-500/20 font-serif text-[120px] leading-none select-none pointer-events-none font-mono">
                  {timeline[activeMilestone].year}
                </div>
                <div className="relative z-10 flex flex-col gap-6">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white">
                    {timeline[activeMilestone].title}
                  </h3>
                  <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {timeline[activeMilestone].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              tag: t('about.mission.missionTitle'),
              desc: t('about.mission.missionDesc'),
              icon: Target,
              gradient: 'from-blue-600/10 to-indigo-600/5',
            },
            {
              tag: t('about.mission.visionTitle'),
              desc: t('about.mission.visionDesc'),
              icon: Award,
              gradient: 'from-purple-600/10 to-pink-600/5',
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`p-10 rounded-[32px] glassmorphism bg-gradient-to-br ${card.gradient} flex flex-col gap-6 items-start border border-white/10 shadow-xl glow-card`}
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-900/5 dark:bg-white/5 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                <card.icon className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {card.tag}
                </h3>
                <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
