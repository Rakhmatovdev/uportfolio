'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import { faqItems, FAQItem } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, X } from 'lucide-react';

export default function FAQPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'general' | 'process' | 'tech' | 'pricing'>('all');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: t('faq.categories.all') },
    { key: 'general', label: t('faq.categories.general') },
    { key: 'process', label: t('faq.categories.process') },
    { key: 'tech', label: t('faq.categories.tech') },
    { key: 'pricing', label: t('faq.categories.pricing') },
  ];

  // Filtering FAQ items based on category and search query
  const filteredFAQs = faqItems.filter((faq) => {
    const matchesCategory = filter === 'all' || faq.category === filter;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-screen pb-24 page-transition">
      <PageHeader title={t('faq.header.title')} subtitle={t('faq.header.subtitle')} />

      {/* Filter and Search */}
      <section className="py-10 max-w-4xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        {/* Category triggers */}
        <div className="flex flex-wrap items-center gap-2 order-2 md:order-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key as any)}
              className={`h-10 px-5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer focus:outline-none ${
                filter === cat.key
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black shadow-md'
                  : 'glassmorphism hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Search Box */}
        <div className="relative w-full md:w-64 order-1 md:order-2">
          <input
            type="text"
            placeholder={t('faq.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-4 pl-10 rounded-full text-sm glassmorphism bg-white dark:bg-black/20 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        </div>
      </section>

      {/* FAQ Accordion list */}
      <section className="py-10 max-w-3xl mx-auto px-6 relative z-10">
        {filteredFAQs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredFAQs.map((faq) => {
              const isOpen = openItem === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-3xl glassmorphism bg-white/20 dark:bg-black/25 border border-white/10 dark:border-white/5 overflow-hidden transition-all duration-500 hover:border-indigo-500/20"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                      <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-indigo-500' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-8 sm:px-8 border-t border-neutral-100 dark:border-neutral-900 pt-6">
                          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 p-8 rounded-3xl glassmorphism max-w-md mx-auto">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">{t('faq.noResults')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
