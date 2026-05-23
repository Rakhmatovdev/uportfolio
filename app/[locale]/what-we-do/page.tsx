'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Palette, Cpu, Layers, Sparkles, Compass, Eye, Terminal, Rocket } from 'lucide-react';

export default function WhatWeDoPage() {
  const { t } = useTranslation();
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      id: 'design',
      title: t('whatWeDo.services.design.title'),
      desc: t('whatWeDo.services.design.desc'),
      icon: Palette,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'development',
      title: t('whatWeDo.services.development.title'),
      desc: t('whatWeDo.services.development.desc'),
      icon: Cpu,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'branding',
      title: t('whatWeDo.services.branding.title'),
      desc: t('whatWeDo.services.branding.desc'),
      icon: Layers,
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      id: 'immersive',
      title: t('whatWeDo.services.immersive.title'),
      desc: t('whatWeDo.services.immersive.desc'),
      icon: Sparkles,
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  const processSteps = [
    {
      title: t('whatWeDo.process.discover'),
      desc: t('whatWeDo.process.discoverDesc'),
      icon: Compass,
    },
    {
      title: t('whatWeDo.process.design'),
      desc: t('whatWeDo.process.designDesc'),
      icon: Eye,
    },
    {
      title: t('whatWeDo.process.develop'),
      desc: t('whatWeDo.process.developDesc'),
      icon: Terminal,
    },
    {
      title: t('whatWeDo.process.deliver'),
      desc: t('whatWeDo.process.deliverDesc'),
      icon: Rocket,
    },
  ];

  return (
    <div className="relative min-h-screen pb-24 page-transition">
      <PageHeader title={t('whatWeDo.header.title')} subtitle={t('whatWeDo.header.subtitle')} />

      {/* Services 3D Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onMouseEnter={() => setHoveredService(idx)}
              onMouseLeave={() => setHoveredService(null)}
              className="relative p-10 rounded-[36px] glassmorphism bg-white/20 dark:bg-black/25 flex flex-col gap-6 items-start overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer shadow-xl min-h-[280px] justify-between group"
            >
              {/* Dynamic 3D card scale aura */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-opacity duration-500`}
              />

              <div className="flex items-center justify-between w-full relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${service.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 group-hover:text-indigo-400 uppercase transition-colors">
                  0{idx + 1} / SERVICE
                </span>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white group-hover:translate-x-1 transition-transform">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Roadmap Timeline */}
      <section className="py-20 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/30 dark:bg-[#030712]/40 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-4 mb-20">
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">{t('whatWeDo.process.title')}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{t('whatWeDo.process.subtitle')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="relative p-8 rounded-3xl glassmorphism bg-white/30 dark:bg-black/25 flex flex-col gap-5 items-start border border-white/10 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {step.desc}
                  </p>
                </div>

                {/* Connector arrow line on desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 w-8 h-[2px] bg-neutral-200 dark:bg-neutral-800" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
