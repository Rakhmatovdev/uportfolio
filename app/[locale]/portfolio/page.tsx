'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import { portfolioProjects, PortfolioProject } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, User, Eye, Layers } from 'lucide-react';

export default function PortfolioPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'design' | 'development' | 'branding' | 'threeD'>('all');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  const categories = [
    { key: 'all', label: t('portfolio.categories.all') },
    { key: 'design', label: t('portfolio.categories.design') },
    { key: 'development', label: t('portfolio.categories.development') },
    { key: 'branding', label: t('portfolio.categories.branding') },
    { key: 'threeD', label: t('portfolio.categories.threeD') },
  ];

  const filteredProjects = portfolioProjects.filter((project) => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  return (
    <div className="relative min-h-screen pb-24 page-transition">
      <PageHeader title={t('portfolio.header.title')} subtitle={t('portfolio.header.subtitle')} />

      {/* Filter Buttons */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key as any)}
              className={`h-11 px-6 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer focus:outline-none ${
                filter === cat.key
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5 scale-[1.02]'
                  : 'glassmorphism hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveProject(project)}
                className="relative rounded-[36px] overflow-hidden aspect-[4/3] cursor-pointer group shadow-xl border border-white/10 dark:border-white/5"
              >
                {/* Background image */}
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-900 transition-transform duration-700 group-hover:scale-105">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Hover backdrop gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Project Brief Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 flex flex-col gap-3 text-white">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
                    {project.category === 'threeD' ? '3D IMMERSIVE' : project.category.toUpperCase()}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-neutral-300 font-medium group-hover:translate-x-1.5 transition-transform duration-300">
                    <span>{t('portfolio.details.visit')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-[36px] glassmorphism bg-white dark:bg-[#080d19] border border-white/20 dark:border-white/5 overflow-y-auto p-6 sm:p-10 md:p-14 shadow-2xl flex flex-col gap-8 text-neutral-900 dark:text-neutral-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-800 dark:text-neutral-200 hover:scale-105 transition-transform focus:outline-none"
                aria-label={t('portfolio.details.close')}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-6">
                <span className="text-xs font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
                  {activeProject.category === 'threeD' ? '3D IMMERSIVE' : activeProject.category.toUpperCase()}
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  {activeProject.title}
                </h2>
              </div>

              {/* Case Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-neutral-100 dark:border-neutral-900">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    {t('portfolio.details.client')}
                  </span>
                  <span className="text-sm font-semibold">{activeProject.client}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    {t('portfolio.details.year')}
                  </span>
                  <span className="text-sm font-semibold">{activeProject.year}</span>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    {t('portfolio.details.services')}
                  </span>
                  <span className="text-xs font-semibold leading-relaxed">
                    {activeProject.services.join(', ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white">
                    {t('portfolio.details.overview')}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {activeProject.overview}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white">
                    {t('portfolio.details.results')}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {activeProject.results}
                  </p>
                </div>
              </div>

              {/* Image banner inside details */}
              <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-neutral-100 dark:border-neutral-900 mt-2">
                <button
                  onClick={() => setActiveProject(null)}
                  className="h-12 px-6 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-95 transition-opacity cursor-pointer"
                >
                  {t('portfolio.details.close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
