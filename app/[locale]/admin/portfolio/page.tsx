'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit, Search, Plus, Trash2, Edit2, AlertCircle, X, Check, 
  ArrowUp, ArrowDown, ExternalLink, Image as ImageIcon, Star
} from 'lucide-react';
import { getPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/actions/adminActions';

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing / Add Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [titleUz, setTitleUz] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [categoryUz, setCategoryUz] = useState('');
  const [categoryRu, setCategoryRu] = useState('');
  const [categoryEn, setCategoryEn] = useState('design');
  const [image, setImage] = useState('');
  const [descriptionUz, setDescriptionUz] = useState('');
  const [descriptionRu, setDescriptionRu] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [featured, setFeatured] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getPortfolio();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitleUz('');
    setTitleRu('');
    setTitleEn('');
    setCategoryUz('');
    setCategoryRu('');
    setCategoryEn('design');
    setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600');
    setDescriptionUz('');
    setDescriptionRu('');
    setDescriptionEn('');
    setLink('');
    setOrder(items.length + 1);
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setTitleUz(item.titleUz || '');
    setTitleRu(item.titleRu || '');
    setTitleEn(item.titleEn || '');
    setCategoryUz(item.categoryUz || '');
    setCategoryRu(item.categoryRu || '');
    setCategoryEn(item.categoryEn || 'design');
    setImage(item.image || '');
    setDescriptionUz(item.descriptionUz || '');
    setDescriptionRu(item.descriptionRu || '');
    setDescriptionEn(item.descriptionEn || '');
    setLink(item.link || '');
    setOrder(item.order || 0);
    setFeatured(item.featured || false);
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
      categoryUz: categoryUz || (categoryEn === 'threeD' ? '3D Modellashtirish' : categoryEn.toUpperCase()),
      categoryRu: categoryRu || (categoryEn === 'threeD' ? '3D Моделирование' : categoryEn.toUpperCase()),
      categoryEn,
      image,
      descriptionUz,
      descriptionRu,
      descriptionEn,
      link,
      order: Number(order),
      featured
    };

    let res;
    if (editingItem) {
      res = await updatePortfolioItem(editingItem.id, payload);
    } else {
      res = await createPortfolioItem(payload);
    }

    if (res.success) {
      setSuccess(editingItem ? 'Portfolio case study updated!' : 'Portfolio case study published!');
      setModalOpen(false);
      await loadData();
    } else {
      setError(res.error || 'Operation failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete case study "${title}"?`)) return;
    setError('');
    setSuccess('');

    const res = await deletePortfolioItem(id);
    if (res.success) {
      setSuccess(`Case study "${title}" removed.`);
      await loadData();
    } else {
      setError(res.error || 'Failed to delete');
    }
  };

  const handleShiftOrder = async (index: number, direction: 'UP' | 'DOWN') => {
    const newItems = [...items];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    // Swap order values
    const tempOrder = newItems[index].order;
    newItems[index].order = newItems[targetIdx].order;
    newItems[targetIdx].order = tempOrder;

    // Persist
    await updatePortfolioItem(newItems[index].id, { order: newItems[index].order });
    await updatePortfolioItem(newItems[targetIdx].id, { order: newItems[targetIdx].order });
    await loadData();
  };

  // Filter
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      item.titleUz.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryEn.toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = categoryFilter === 'ALL' || item.categoryEn === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
            <FolderGit className="w-8 h-8 text-[var(--admin-accent)]" />
            <span>Portfolio Catalog</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
            Curate showcase case studies, upload dynamic cover media, rearrange sequence layout order, and manage page SEO nodes.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="h-11 px-5 rounded-2xl bg-white text-black font-semibold flex items-center gap-2 cursor-pointer hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 font-medium shrink-0 self-start sm:self-auto text-xs"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Publish Work</span>
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

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-white/5 backdrop-blur-md">
        <div className="relative flex items-center flex-1 max-w-md">
          <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search projects..."
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
          <option value="design">Creative Design</option>
          <option value="development">Web Dev</option>
          <option value="branding">Branding</option>
          <option value="threeD">3D Immersive</option>
        </select>
      </div>

      {/* PORTFOLIO GRID CATALOG */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <span className="text-xs text-neutral-500 font-light">Loading catalog database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              className="group p-5 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between gap-4 overflow-hidden relative"
            >
              {/* Cover cover image */}
              <div className="h-44 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-900 overflow-hidden relative border border-white/5 shadow-inner">
                {item.image ? (
                  <img src={item.image} alt={item.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500"><ImageIcon className="w-8 h-8" /></div>
                )}
                {item.featured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-black px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase">
                  {item.categoryEn}
                </span>
              </div>

              {/* Title descriptions */}
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base text-neutral-950 dark:text-white truncate">{item.titleEn}</h3>
                <p className="text-xs text-neutral-400 font-light line-clamp-2 h-8 leading-relaxed">{item.descriptionEn || 'No En description.'}</p>
              </div>

              {/* Sequencing index controller */}
              <div className="flex items-center justify-between border-t border-neutral-200 dark:border-white/5 pt-3 mt-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleShiftOrder(idx, 'UP')}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-400 hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShiftOrder(idx, 'DOWN')}
                    disabled={idx === items.length - 1}
                    className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-400 hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-2">Seq: {item.order}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/5 hover:border-neutral-950 dark:hover:border-white/20 bg-neutral-100 hover:bg-neutral-950 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.titleEn)}
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

      {/* DYNAMIC FORM ADD / EDIT MODAL BOX */}
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
                  {editingItem ? 'Edit Case Study details' : 'Publish New Case Study'}
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
                      <option value="design" className="bg-[#0b0f19]">Creative Design</option>
                      <option value="development" className="bg-[#0b0f19]">Web Dev</option>
                      <option value="branding" className="bg-[#0b0f19]">Branding</option>
                      <option value="threeD" className="bg-[#0b0f19]">3D Immersive</option>
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
                      placeholder="Aura Ecosystem"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Title (UZ)</label>
                    <input
                      type="text"
                      required
                      placeholder="Aura Ekotizimi"
                      value={titleUz}
                      onChange={(e) => setTitleUz(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Title (RU)</label>
                    <input
                      type="text"
                      required
                      placeholder="Экосистема Aura"
                      value={titleRu}
                      onChange={(e) => setTitleRu(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Categories Localized */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Label (UZ) - Optional</label>
                    <input
                      type="text"
                      placeholder="3D Modellashtirish"
                      value={categoryUz}
                      onChange={(e) => setCategoryUz(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Label (RU) - Optional</label>
                    <input
                      type="text"
                      placeholder="3D Моделирование"
                      value={categoryRu}
                      onChange={(e) => setCategoryRu(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image URL & Sorting Order */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Image Cover URL</label>
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Sort Order</label>
                    <input
                      type="number"
                      required
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Descriptions Uz/Ru/En */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Description (EN)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe this project in English..."
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Description (UZ)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Loyihani o‘zbek tilida tavsiflang..."
                    value={descriptionUz}
                    onChange={(e) => setDescriptionUz(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Description (RU)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Опишите этот проект на русском..."
                    value={descriptionRu}
                    onChange={(e) => setDescriptionRu(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>

                {/* Project External Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">External Live Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 mt-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg disabled:opacity-50 cursor-pointer text-xs"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{submitting ? 'Transmitting Data...' : editingItem ? 'Save Updates' : 'Publish Project'}</span>
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
