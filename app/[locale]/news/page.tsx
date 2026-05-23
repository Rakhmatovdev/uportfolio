'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import { newsArticles, NewsArticle } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, User, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'trends' | 'tech' | 'business'>('all');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [page, setPage] = useState(1);

  const categories = [
    { key: 'all', label: t('news.categories.all') },
    { key: 'trends', label: t('news.categories.trends') },
    { key: 'tech', label: t('news.categories.tech') },
    { key: 'business', label: t('news.categories.business') },
  ];

  // Reset to first page when search or category filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  // Filtering articles based on category and search query
  const filteredArticles = newsArticles.filter((article) => {
    const matchesCategory = filter === 'all' || article.category === filter;
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase()) ||
      article.author.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const featuredArticle = newsArticles[0];

  return (
    <div className="relative min-h-screen pb-24 page-transition">
      <PageHeader title={t('news.header.title')} subtitle={t('news.header.subtitle')} />

      {/* Featured Banner */}
      {featuredArticle && filter === 'all' && !search && (
        <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setActiveArticle(featuredArticle)}
            className="group relative rounded-[40px] overflow-hidden glassmorphism bg-white/20 dark:bg-black/25 border border-white/10 dark:border-white/5 p-6 md:p-12 flex flex-col lg:flex-row gap-8 items-center cursor-pointer shadow-xl glow-card"
          >
            {/* Aspect image banner */}
            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-6 items-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-xs font-bold text-indigo-500 uppercase">
                {t('news.featured')}
              </span>
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  {featuredArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {featuredArticle.readTime} {t('news.readTime')}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  {featuredArticle.author}
                </span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Filter and Search */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
        {/* Category switches */}
        <div className="flex flex-wrap items-center gap-2.5 order-2 md:order-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key as any)}
              className={`h-11 px-5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer focus:outline-none uppercase ${
                filter === cat.key
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black shadow-lg'
                  : 'glassmorphism hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Search Box */}
        <div className="relative w-full md:w-72 order-1 md:order-2">
          <input
            type="text"
            placeholder={t('news.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 px-4 pl-10 rounded-full text-sm glassmorphism bg-white dark:bg-black/20 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-10 max-w-7xl mx-auto px-6 relative z-10">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedArticles.map((article, idx) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                onClick={() => setActiveArticle(article)}
                className="group p-5 rounded-[28px] glassmorphism bg-white/20 dark:bg-black/25 border border-white/10 dark:border-white/5 flex flex-col gap-5 hover:shadow-2xl hover:border-indigo-500/25 transition-all duration-500 cursor-pointer glow-card"
              >
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
                    {article.category === 'trends' ? 'DESIGN TRENDS' : article.category === 'tech' ? 'ENGINEERING' : 'AGENCY NEWS'}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-900 pt-4 text-[10px] text-neutral-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    {article.readTime} {t('news.readTime')}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 p-8 rounded-3xl glassmorphism max-w-md mx-auto">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">{t('news.noResults')}</p>
          </div>
        )}
      </section>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <section className="py-10 max-w-7xl mx-auto px-6 relative z-10 flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-10 h-10 rounded-full text-xs font-bold font-mono transition-all duration-300 cursor-pointer focus:outline-none ${
                page === num
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-black shadow-lg scale-105'
                  : 'glassmorphism hover:bg-black/5 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </section>
      )}

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-3xl max-h-[90vh] rounded-[36px] glassmorphism bg-white dark:bg-[#080d19] border border-white/20 dark:border-white/5 overflow-y-auto p-6 sm:p-10 md:p-12 shadow-2xl flex flex-col gap-6 text-neutral-900 dark:text-neutral-100"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-800 dark:text-neutral-200 hover:scale-105 transition-transform focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-4 mt-4">
                <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase">
                  {activeArticle.category === 'trends' ? 'DESIGN TRENDS' : activeArticle.category === 'tech' ? 'ENGINEERING' : 'AGENCY NEWS'}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  {activeArticle.title}
                </h2>
              </div>

              {/* Author metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 border-y border-neutral-100 dark:border-neutral-900 py-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {activeArticle.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  {activeArticle.readTime} {t('news.readTime')}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-500" />
                  {activeArticle.author}
                </span>
              </div>

              {/* Photo inside layout details */}
              <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-900">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <p className="text-sm sm:text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                {activeArticle.body}
              </p>

              <div className="flex items-center justify-end pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="h-12 px-6 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-95 transition-opacity cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
