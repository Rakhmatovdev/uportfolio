'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Search, Plus, Trash2, Edit2, AlertCircle, X, Check, 
  ArrowUp, ArrowDown, HelpCircle as FaqIcon
} from 'lucide-react';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/actions/adminActions';

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [questionUz, setQuestionUz] = useState('');
  const [questionRu, setQuestionRu] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [answerUz, setAnswerUz] = useState('');
  const [answerRu, setAnswerRu] = useState('');
  const [answerEn, setAnswerEn] = useState('');
  const [categoryUz, setCategoryUz] = useState('');
  const [categoryRu, setCategoryRu] = useState('');
  const [categoryEn, setCategoryEn] = useState('general');
  const [order, setOrder] = useState(0);

  const loadData = async () => {
    setLoading(true);
    const data = await getFAQs();
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setQuestionUz('');
    setQuestionRu('');
    setQuestionEn('What is your typical project timeline?');
    setAnswerUz('');
    setAnswerRu('');
    setAnswerEn('We focus on high-fidelity designs requiring 8 to 14 weeks.');
    setCategoryUz('');
    setCategoryRu('');
    setCategoryEn('general');
    setOrder(faqs.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (faq: any) => {
    setEditingFaq(faq);
    setQuestionUz(faq.questionUz || '');
    setQuestionRu(faq.questionRu || '');
    setQuestionEn(faq.questionEn || '');
    setAnswerUz(faq.answerUz || '');
    setAnswerRu(faq.answerRu || '');
    setAnswerEn(faq.answerEn || '');
    setCategoryUz(faq.categoryUz || '');
    setCategoryRu(faq.categoryRu || '');
    setCategoryEn(faq.categoryEn || 'general');
    setOrder(faq.order || 0);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      questionUz,
      questionRu,
      questionEn,
      answerUz,
      answerRu,
      answerEn,
      categoryUz: categoryUz || (categoryEn === 'general' ? 'Umumiy' : categoryEn === 'process' ? 'Jarayon' : 'Texnik'),
      categoryRu: categoryRu || (categoryEn === 'general' ? 'Общие' : categoryEn === 'process' ? 'Процесс' : 'Технические'),
      categoryEn,
      order: Number(order)
    };

    let res;
    if (editingFaq) {
      res = await updateFAQ(editingFaq.id, payload);
    } else {
      res = await createFAQ(payload);
    }

    if (res.success) {
      setSuccess(editingFaq ? 'FAQ question modified!' : 'FAQ question published!');
      setModalOpen(false);
      await loadData();
    } else {
      setError(res.error || 'Operation failed');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete FAQ "${question}"?`)) return;
    setError('');
    setSuccess('');

    const res = await deleteFAQ(id);
    if (res.success) {
      setSuccess(`FAQ "${question}" removed from catalog.`);
      await loadData();
    } else {
      setError(res.error || 'Failed to delete');
    }
  };

  const handleShiftOrder = async (index: number, direction: 'UP' | 'DOWN') => {
    const newFaqs = [...faqs];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= faqs.length) return;

    const tempOrder = newFaqs[index].order;
    newFaqs[index].order = newFaqs[targetIdx].order;
    newFaqs[targetIdx].order = tempOrder;

    await updateFAQ(newFaqs[index].id, { order: newFaqs[index].order });
    await updateFAQ(newFaqs[targetIdx].id, { order: newFaqs[targetIdx].order });
    await loadData();
  };

  // Filter
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.questionEn.toLowerCase().includes(search.toLowerCase()) ||
      faq.answerEn.toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = categoryFilter === 'ALL' || faq.categoryEn === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-[var(--admin-accent)]" />
            <span>FAQs Accordion</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
            Edit frequent operational questions, write localized answers, configure segments categories, and sort items sequence.
          </p>
        </div>
        
        <button
          onClick={openAddModal}
          className="h-11 px-5 rounded-2xl bg-white text-black font-semibold flex items-center gap-2 cursor-pointer hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 font-medium shrink-0 self-start sm:self-auto text-xs"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Publish FAQ</span>
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

      {/* FILTER SEARCH PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-white/5 backdrop-blur-md">
        <div className="relative flex items-center flex-1 max-w-md">
          <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search FAQs..."
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
          <option value="general">General</option>
          <option value="process">Workflow</option>
          <option value="tech">Technology</option>
          <option value="pricing">Engagement</option>
        </select>
      </div>

      {/* FAQS DISPLAY LIST */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <span className="text-xs text-neutral-500 font-light">Loading FAQ catalog...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredFaqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              layoutId={`faq-${faq.id}`}
              className="p-5 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col sm:flex-row items-start justify-between gap-6"
            >
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] border border-[var(--admin-accent)]/20 flex items-center justify-center shrink-0">
                    <FaqIcon className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="font-bold text-sm text-neutral-950 dark:text-white leading-relaxed">{faq.questionEn}</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed pl-8">{faq.answerEn}</p>
                <div className="flex items-center gap-3 pl-8 mt-1">
                  <span className="px-2 py-0.5 rounded-lg border border-white/5 bg-white/5 text-[9px] uppercase tracking-wider font-bold text-neutral-400">{faq.categoryEn}</span>
                </div>
              </div>

              {/* Sorting and operational buttons */}
              <div className="flex sm:flex-col items-center gap-2 self-end sm:self-center shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleShiftOrder(idx, 'UP')}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShiftOrder(idx, 'DOWN')}
                    disabled={idx === faqs.length - 1}
                    className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/5 hover:border-neutral-950 dark:hover:border-white/20 bg-neutral-100 hover:bg-neutral-950 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id, faq.questionEn)}
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

      {/* FORM DIALOG BOX */}
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
              className="w-full max-w-lg rounded-3xl bg-[#0b0f19] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  {editingFaq ? 'Edit FAQ details' : 'Publish New FAQ'}
                </span>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white cursor-pointer focus:outline-none">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form fields */}
              <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5 text-white">
                
                {/* Category & order */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Tag</label>
                    <select
                      value={categoryEn}
                      onChange={(e) => setCategoryEn(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold focus:outline-none cursor-pointer text-white"
                    >
                      <option value="general" className="bg-[#0b0f19]">General</option>
                      <option value="process" className="bg-[#0b0f19]">Workflow</option>
                      <option value="tech" className="bg-[#0b0f19]">Technology</option>
                      <option value="pricing" className="bg-[#0b0f19]">Engagement</option>
                    </select>
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

                {/* Categories Localized */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Label (UZ)</label>
                    <input
                      type="text"
                      placeholder="Umumiy"
                      value={categoryUz}
                      onChange={(e) => setCategoryUz(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Category Label (RU)</label>
                    <input
                      type="text"
                      placeholder="Общие"
                      value={categoryRu}
                      onChange={(e) => setCategoryRu(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Localized questions */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Question (EN)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter English question..."
                    value={questionEn}
                    onChange={(e) => setQuestionEn(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Question (UZ)</label>
                  <input
                    type="text"
                    required
                    placeholder="Savolni o‘zbek tilida kiriting..."
                    value={questionUz}
                    onChange={(e) => setQuestionUz(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Question (RU)</label>
                  <input
                    type="text"
                    required
                    placeholder="Введите вопрос на русском..."
                    value={questionRu}
                    onChange={(e) => setQuestionRu(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none"
                  />
                </div>

                {/* Localized answers */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Answer (EN)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter answer in English..."
                    value={answerEn}
                    onChange={(e) => setAnswerEn(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Answer (UZ)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Javobni o‘zbek tilida yozing..."
                    value={answerUz}
                    onChange={(e) => setAnswerUz(e.target.value)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500 font-light resize-none leading-relaxed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Answer (RU)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Напишите ответ на русском..."
                    value={answerRu}
                    onChange={(e) => setAnswerRu(e.target.value)}
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
                  <span>{submitting ? 'Transmitting Data...' : editingFaq ? 'Save Updates' : 'Publish FAQ'}</span>
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
