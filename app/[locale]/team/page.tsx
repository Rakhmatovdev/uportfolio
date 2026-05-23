'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import { teamMembers, TeamMember } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { TwitterIcon, GithubIcon, LinkedinIcon, DribbbleIcon } from '@/components/Icons';

export default function TeamPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'design' | 'engineering' | 'strategy' | 'management'>('all');
  const [activeBioMember, setActiveBioMember] = useState<TeamMember | null>(null);

  const departments = [
    { key: 'all', label: t('team.departments.all') },
    { key: 'design', label: t('team.departments.design') },
    { key: 'engineering', label: t('team.departments.engineering') },
    { key: 'strategy', label: t('team.departments.strategy') },
    { key: 'management', label: t('team.departments.management') },
  ];

  const filteredMembers = teamMembers.filter((member) => {
    if (filter === 'all') return true;
    return member.department === filter;
  });

  return (
    <div className="relative min-h-screen pb-24 page-transition">
      <PageHeader title={t('team.header.title')} subtitle={t('team.header.subtitle')} />

      {/* Filter Buttons */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {departments.map((dept) => (
            <button
              key={dept.key}
              onClick={() => setFilter(dept.key as any)}
              className={`h-11 px-6 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer focus:outline-none ${
                filter === dept.key
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black shadow-lg scale-[1.02]'
                  : 'glassmorphism hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>
      </section>

      {/* Team Cards Grid */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                onClick={() => setActiveBioMember(member)}
                className="group relative rounded-[32px] overflow-hidden glassmorphism bg-white/20 dark:bg-black/25 border border-white/10 dark:border-white/5 p-6 hover:shadow-2xl hover:border-indigo-500/25 transition-all duration-500 cursor-pointer flex flex-col justify-between aspect-[3/4] glow-card"
              >
                {/* Profile Image Wrap */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative shadow-inner">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-4">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
                    {member.department.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                    {member.name}
                  </h3>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {member.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Bio Drawer Modal */}
      <AnimatePresence>
        {activeBioMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg rounded-[36px] glassmorphism bg-white dark:bg-[#080d19] border border-white/20 dark:border-white/5 p-8 sm:p-10 md:p-12 shadow-2xl flex flex-col gap-6 text-neutral-900 dark:text-neutral-100"
            >
              {/* Close Drawer */}
              <button
                onClick={() => setActiveBioMember(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-800 dark:text-neutral-200 hover:scale-105 transition-transform focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-6 mt-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                  <img
                    src={activeBioMember.image}
                    alt={activeBioMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
                    {activeBioMember.department.toUpperCase()}
                  </span>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {activeBioMember.name}
                  </h2>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {activeBioMember.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-neutral-100 dark:border-neutral-900 pt-6">
                <h3 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">About</h3>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {activeBioMember.bio}
                </p>
              </div>

              {/* Social Channels inside Profile */}
              <div className="flex items-center gap-3 border-t border-neutral-100 dark:border-neutral-900 pt-6">
                {activeBioMember.socials.twitter && (
                  <a
                    href={activeBioMember.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:scale-110 transition-all duration-300"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                )}
                {activeBioMember.socials.linkedin && (
                  <a
                    href={activeBioMember.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:scale-110 transition-all duration-300"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {activeBioMember.socials.github && (
                  <a
                    href={activeBioMember.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:scale-110 transition-all duration-300"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {activeBioMember.socials.dribbble && (
                  <a
                    href={activeBioMember.socials.dribbble}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:scale-110 transition-all duration-300"
                  >
                    <DribbbleIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
