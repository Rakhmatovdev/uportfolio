'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Sliders, Globe, Save, Languages, Edit2, Check, AlertCircle, X, Search 
} from 'lucide-react';
import { getSettings, updateSettings, getTranslations, updateTranslation } from '@/actions/adminActions';

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'translations'>('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // General Settings States
  const [siteName, setSiteName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [heroTitleUz, setHeroTitleUz] = useState('');
  const [heroTitleRu, setHeroTitleRu] = useState('');
  const [heroTitleEn, setHeroTitleEn] = useState('');
  const [twitterLink, setTwitterLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');

  // Translations States
  const [translationsList, setTranslationsList] = useState<any[]>([]);
  const [searchTranslation, setSearchTranslation] = useState('');
  const [editingTranslation, setEditingTranslation] = useState<any>(null);
  const [transUz, setTransUz] = useState('');
  const [transRu, setTransRu] = useState('');
  const [transEn, setTransEn] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [settings, translations] = await Promise.all([
      getSettings(),
      getTranslations()
    ]);

    // Map general settings
    const findVal = (k: string) => settings.find((s: any) => s.key === k)?.value || '';
    setSiteName(findVal('site_name') || 'BEXA Studio');
    setContactEmail(findVal('contact_email') || 'hello@bexa.studio');
    setContactPhone(findVal('contact_phone') || '+998 71 202 22 44');
    setHeroTitleUz(findVal('hero_title_uz') || 'BIZ HASHAMATLI MINIMAL RAQAMLI TAJRIBALARNI SHAKLLANTIRAMIZ');
    setHeroTitleRu(findVal('hero_title_ru') || 'МЫ СОЗДАЕМ ЦИФРОВОЙ ОПЫТ МИНИМАЛЬНОГО ЛЮКСА');
    setHeroTitleEn(findVal('hero_title_en') || 'WE SHAPE MINIMAL LUXURY DIGITAL EXPERIENCES');
    setTwitterLink(findVal('twitter_link') || 'https://twitter.com');
    setGithubLink(findVal('github_link') || 'https://github.com');
    setLinkedinLink(findVal('linkedin_link') || 'https://linkedin.com');

    setTranslationsList(translations);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const map = {
      site_name: siteName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      hero_title_uz: heroTitleUz,
      hero_title_ru: heroTitleRu,
      hero_title_en: heroTitleEn,
      twitter_link: twitterLink,
      github_link: githubLink,
      linkedin_link: linkedinLink
    };

    const res = await updateSettings(map);
    if (res.success) {
      setSuccess('Site settings and configurations successfully modified.');
      await loadData();
    } else {
      setError(res.error || 'Failed to update settings');
    }
    setSubmitting(false);
  };

  const handleEditTranslation = (trans: any) => {
    setEditingTranslation(trans);
    setTransUz(trans.uz || '');
    setTransRu(trans.ru || '');
    setTransEn(trans.en || '');
  };

  const handleSaveTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTranslation) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    const res = await updateTranslation(editingTranslation.id, {
      uz: transUz,
      ru: transRu,
      en: transEn
    });

    if (res.success) {
      setSuccess(`Translation key "${editingTranslation.key}" modified successfully!`);
      setEditingTranslation(null);
      await loadData();
    } else {
      setError(res.error || 'Failed to save translation');
    }
    setSubmitting(false);
  };

  // Filter translations
  const filteredTranslations = translationsList.filter(t => {
    return t.key.toLowerCase().includes(searchTranslation.toLowerCase()) ||
           t.en.toLowerCase().includes(searchTranslation.toLowerCase()) ||
           t.uz.toLowerCase().includes(searchTranslation.toLowerCase()) ||
           t.ru.toLowerCase().includes(searchTranslation.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-[var(--admin-accent)]" />
          <span>Site Settings Console</span>
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
          Configure agency metadata, edit global Hero text nodes, adjust social handles links, and override client translations dictionary.
        </p>
      </div>

      {/* STATUS SYSTEM ALERTS */}
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

      {/* TABS CONTROLLERS */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/5 self-start text-xs font-bold uppercase tracking-wider select-none">
        <button
          onClick={() => { setActiveTab('general'); setError(''); setSuccess(''); }}
          className={`h-10 px-6 rounded-xl flex items-center gap-2 transition-colors cursor-pointer focus:outline-none ${
            activeTab === 'general' ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow' : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>General Variables</span>
        </button>
        <button
          onClick={() => { setActiveTab('translations'); setError(''); setSuccess(''); }}
          className={`h-10 px-6 rounded-xl flex items-center gap-2 transition-colors cursor-pointer focus:outline-none ${
            activeTab === 'translations' ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow' : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Localization Keys</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <span className="text-xs text-neutral-500 font-light">Loading configurations...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'general' ? (
            <motion.form
              key="generalForm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleGeneralSubmit}
              className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col gap-6"
            >
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[var(--admin-accent)]" /> General site variables
              </h3>

              {/* Site metadata & contacts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Site Name</label>
                  <input
                    type="text"
                    required
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Hero titles overrides */}
              <div className="flex flex-col gap-4 border-t border-neutral-200 dark:border-white/5 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Hero Section Main Titles</h4>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">English Title</label>
                  <input
                    type="text"
                    required
                    value={heroTitleEn}
                    onChange={(e) => setHeroTitleEn(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Uzbek Title</label>
                  <input
                    type="text"
                    required
                    value={heroTitleUz}
                    onChange={(e) => setHeroTitleUz(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Russian Title</label>
                  <input
                    type="text"
                    required
                    value={heroTitleRu}
                    onChange={(e) => setHeroTitleRu(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Social handles links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-neutral-200 dark:border-white/5 pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Twitter Link</label>
                  <input
                    type="text"
                    value={twitterLink}
                    onChange={(e) => setTwitterLink(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">GitHub Link</label>
                  <input
                    type="text"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">LinkedIn Link</label>
                  <input
                    type="text"
                    value={linkedinLink}
                    onChange={(e) => setLinkedinLink(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Save */}
              <button
                type="submit"
                disabled={submitting}
                className="h-11 px-6 rounded-2xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer self-start text-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4 shrink-0" />
                <span>{submitting ? 'Saving Variables...' : 'Save Settings'}</span>
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="translationsModule"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col gap-6"
            >
              {/* Filter search bar */}
              <div className="p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-neutral-200 dark:border-white/5 backdrop-blur-md">
                <div className="relative flex items-center max-w-md">
                  <Search className="absolute left-4 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search translation key or text value..."
                    value={searchTranslation}
                    onChange={(e) => setSearchTranslation(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-sm placeholder-neutral-500 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all font-light"
                  />
                </div>
              </div>

              {/* Dictionary items cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTranslations.map((trans) => (
                  <div
                    key={trans.id}
                    className="p-5 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/5 pb-2">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white truncate max-w-xs">{trans.key}</span>
                      <button
                        onClick={() => handleEditTranslation(trans)}
                        className="w-8 h-8 rounded-lg border border-neutral-200 dark:border-white/5 hover:border-neutral-950 dark:hover:border-white/20 bg-neutral-100 hover:bg-neutral-950 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer transition-all focus:outline-none"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 font-light text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-baseline gap-2 truncate"><span className="font-bold text-[9px] uppercase tracking-wider text-indigo-400 w-6">En:</span> {trans.en}</span>
                      <span className="flex items-baseline gap-2 truncate"><span className="font-bold text-[9px] uppercase tracking-wider text-emerald-400 w-6">Uz:</span> {trans.uz}</span>
                      <span className="flex items-baseline gap-2 truncate"><span className="font-bold text-[9px] uppercase tracking-wider text-rose-400 w-6">Ru:</span> {trans.ru}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* TRANSLATION EDITING DIALOG BOX */}
              <AnimatePresence>
                {editingTranslation && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
                    onClick={() => setEditingTranslation(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, y: 15 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 15 }}
                      className="w-full max-w-lg rounded-3xl bg-[#0b0f19] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Edit Dictionary Key</span>
                        <button onClick={() => setEditingTranslation(null)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white cursor-pointer focus:outline-none">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveTranslation} className="p-6 flex flex-col gap-5 text-white">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Dictionary Path Path</span>
                          <span className="font-mono text-xs font-bold text-white bg-white/5 p-3 rounded-xl border border-white/5">{editingTranslation.key}</span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">English Text (EN)</label>
                          <input
                            type="text"
                            required
                            value={transEn}
                            onChange={(e) => setTransEn(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Uzbek Text (UZ)</label>
                          <input
                            type="text"
                            required
                            value={transUz}
                            onChange={(e) => setTransUz(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Russian Text (RU)</label>
                          <input
                            type="text"
                            required
                            value={transRu}
                            onChange={(e) => setTransRu(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full h-11 mt-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg disabled:opacity-50 cursor-pointer text-xs"
                        >
                          <Check className="w-4 h-4 shrink-0" />
                          <span>{submitting ? 'Saving Translation...' : 'Save Translation'}</span>
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
