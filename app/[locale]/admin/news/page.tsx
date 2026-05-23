'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, Search, Plus, Trash2, Edit2, AlertCircle, X, Check, 
  ImageIcon, Star, User, Calendar
} from 'lucide-react';
import { getNews, createNewsItem, updateNewsItem, deleteNewsItem } from '@/actions/adminActions';

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [titleUz, setTitleUz] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentUz, setContentUz] = useState('');
  const [contentRu, setContentRu] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [image, setImage] = useState('');
  const [categoryUz, setCategoryUz] = useState('');
  const [categoryRu, setCategoryRu] = useState('');
  const [categoryEn, setCategoryEn] = useState('trends');
  const [date, setDate] = useState('');
  const [authorUz, setAuthorUz] = useState('');
  const [authorRu, setAuthorRu] = useState('');
  const [authorEn, setAuthorEn] = useState('');
  const [featured, setFeatured] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getNews();
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingArticle(null);
    setTitleUz('');
    setTitleRu('');
    setTitleEn('');
    setContentUz('');
    setContentRu('');
    setContentEn('');
    setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600');
    setCategoryUz('');
    setCategoryRu('');
    setCategoryEn('trends');
    setDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setAuthorUz('');
    setAuthorRu('');
    setAuthorEn('Elena Romanova');
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (article: any) => {
    setEditingArticle(article);
    setTitleUz(article.titleUz || '');
    setTitleRu(article.titleRu || '');
    setTitleEn(article.titleEn || '');
    setContentUz(article.contentUz || '');
    setContentRu(article.contentRu || '');
    setContentEn(article.contentEn || '');
    setImage(article.image || '');
    setCategoryUz(article.categoryUz || '');
    setCategoryRu(article.categoryRu || '');
    setCategoryEn(article.categoryEn || 'trends');
    setDate(article.date || '');
    setAuthorUz(article.authorUz || '');
    setAuthorRu(article.authorRu || '');
    setAuthorEn(article.authorEn || '');
    setFeatured(article.featured || false);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      titleUz,
      titleRu,
      titleEn,
      contentUz,
      contentRu,
      contentEn,
      image,
      categoryUz: categoryUz || (categoryEn === 'trends' ? 'Trendlar' : categoryEn === 'tech' ? 'Texnologiyalar' : 'Yangiliklar'),
      categoryRu: categoryRu || (categoryEn === 'trends' ? 'Тренды' : categoryEn === 'tech' ? 'Технологии' : 'Новости'),
      categoryEn,
      date,
      authorUz: authorUz || authorEn,
      authorRu: authorRu || authorEn,
      authorEn,
      featured
    };

    let res;
    if (editingArticle) {
      res = await updateNewsItem(editingArticle.id, payload);
    } else {
      res = await createNewsItem(payload);
    }

    if (res.success) {
      setSuccess(editingArticle ? 'News article modified successfully!' : 'News article published successfully!');
      setModalOpen(false);
      await loadData();
    } else {
      setError(res.error || 'Operation failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete news article "${title}"?`)) return;
    setError('');
    setSuccess('');

    const res = await deleteNewsItem(id);
    if (res.success) {
      setSuccess(`Article "${title}" removed from catalog.`);
      await loadData();
    } else {
      setError(res.error || 'Failed to delete');
    }
  };

  // Filter
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      article.contentEn.toLowerCase().includes(search.toLowerCase()) ||
      article.authorEn.toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = categoryFilter === 'ALL' || article.categoryEn === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-[var(--admin-accent)]" />
            <span>News & Journals</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
            Crate, edit and publish news articles, modify blog contents in multiple languages, and curate trending visual journals.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="h-11 px-5 rounded-2xl bg-white text-black font-semibold flex items-center gap-2 cursor-pointer hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 font-medium shrink-0 self-start sm:self-auto text-xs"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Publish Article</span>
        </button>
      </div>

      {/* FEEDBACK ALERTS */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center justify-between"
          >
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="cursor-pointer font-bold focus:outline-none"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="cursor-pointer font-bold focus:outline-none"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-white/5 backdrop-blur-md">
        <div className="relative flex items-center flex-1 max-w-md">
          <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-sm placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-11 px-4 rounded-xl bg-neutral-200/50 dark:bg-[#0b0f19] border border-neutral-200 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-500 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="trends">Design Trends</option>
          <option value="tech">Engineering</option>
          <option value="business">Agency News</option>
        </select>
      </div>

      {/* ARTICLES LIST CATALOG */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <span className="text-xs text-neutral-500 font-light">Loading news catalog...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art) => (
            <motion.div
              key={art.id}
              layoutId={`art-${art.id}`}
              className="group p-5 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between gap-4 overflow-hidden"
            >
              {/* Cover cover image */}
              <div className="h-40 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-900 overflow-hidden relative border border-white/5 shadow-inner">
                {art.image ? (
                  <img src={art.image} alt={art.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500"><ImageIcon className="w-8 h-8" /></div>
                )}
                {art.featured && (
                  <span className="absolute top-3 left-3 bg-indigo-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase">
                  {art.categoryEn}
                </span>
              </div>

              {/* Title & info */}
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-base text-neutral-950 dark:text-white truncate">{art.titleEn}</h3>
                <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-semibold uppercase">
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-[var(--admin-accent)] shrink-0" /> {art.authorEn}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[var(--admin-accent)] shrink-0" /> {art.date}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-neutral-200 dark:border-white/5 pt-3 mt-1">
                <span className="text-[10px] text-neutral-500 font-mono tracking-widest font-bold">SLUG: {art.slug || 'N/A'}</span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(art)}
                    className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/5 hover:border-neutral-950 dark:hover:border-white/20 bg-neutral-100 hover:bg-neutral-950 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id, art.titleEn)}
                    className="w-8 h-8 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* DYNAMIC FORM MODAL BOX */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-2xl rounded-3xl bg-[#0b0f19] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  {editingArticle ? 'Modify News details' : 'Publish New Article'}
                </span>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white cursor-pointer focus:outline-none">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Scroll container */}
              <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5 text-white">
                
                {/* Visual Category & Featured checkbox */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Tag</label>
                    <select
                      value={categoryEn}
                      onChange={(e) => setCategoryEn(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold focus:outline-none cursor-pointer text-white"
                    >
                      <option value="trends" className="bg-[#0b0f19]">Design Trends</option>
                      <option value="tech" className="bg-[#0b0f19]">Engineering</option>
                      <option value="business" className="bg-[#0b0f19]">Agency News</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id="feat"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-indigo-500 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="feat" className="text-xs font-bold uppercase tracking-wider text-neutral-400 cursor-pointer select-none">
                      Featured Showcase
                    </label>
                  </div>
                </div>

                {/* Multilingual Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Title (EN)</label>
                    <input
                      type="text"
                      required
                      placeholder="Micro-Animations..."
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Title (UZ)</label>
                    <input
                      type="text"
                      required
                      placeholder="Mikro-Animatsiyalar..."
                      value={titleUz}
                      onChange={(e) => setTitleUz(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Title (RU)</label>
                    <input
                      type="text"
                      required
                      placeholder="Микроанимация..."
                      value={titleRu}
                      onChange={(e) => setTitleRu(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Categories Localized */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Label (UZ)</label>
                    <input
                      type="text"
                      placeholder="Trendlar"
                      value={categoryUz}
                      onChange={(e) => setCategoryUz(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Label (RU)</label>
                    <input
                      type="text"
                      placeholder="Тренды"
                      value={categoryRu}
                      onChange={(e) => setCategoryRu(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Authors Multilingual */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Author (EN)</label>
                    <input
                      type="text"
                      required
                      placeholder="Elena Romanova"
                      value={authorEn}
                      onChange={(e) => setAuthorEn(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Author (UZ)</label>
                    <input
                      type="text"
                      placeholder="Elena Romanova"
                      value={authorUz}
                      onChange={(e) => setAuthorUz(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Author (RU)</label>
                    <input
                      type="text"
                      placeholder="Елена Романова"
                      value={authorRu}
                      onChange={(e) => setAuthorRu(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cover Image & Publication Date */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cover Image URL</label>
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Publication Date</label>
                    <input
                      type="text"
                      required
                      placeholder="May 23, 2026"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Article Body contents */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Content (EN)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write article content in English..."
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Content (UZ)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Yangilik matnini o‘zbek tilida yozing..."
                    value={contentUz}
                    onChange={(e) => setContentUz(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Content (RU)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Напишите текст новости на русском..."
                    value={contentRu}
                    onChange={(e) => setContentRu(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 mt-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg disabled:opacity-50 cursor-pointer text-xs"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{submitting ? 'Transmitting Data...' : editingArticle ? 'Save Updates' : 'Publish Article'}</span>
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
