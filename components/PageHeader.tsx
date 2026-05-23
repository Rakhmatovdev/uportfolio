'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  gradient?: string;
}

export default function PageHeader({
  title,
  subtitle,
  gradient = 'from-indigo-500/10 via-purple-500/5 to-transparent',
}: PageHeaderProps) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-500">
      {/* Background Animated Gradient Aura */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient} pointer-events-none`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
