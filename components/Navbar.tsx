'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { useTheme } from 'next-themes';
import { getCurrentUserAction, logoutAction } from '@/actions/adminActions';
import { Locale, locales } from '@/lib/i18n';
import { Menu, X, ArrowRight, User, Settings, LayoutDashboard, LogOut, Sun, Moon, Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { locale, t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Auth User state
  const [user, setUser] = useState<{ id: string; username: string; email: string; role: string; name?: string; avatar?: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch session on mount & when pathname changes (e.g. after login/register)
  useEffect(() => {
    async function loadUser() {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
      setUserLoading(false);
    }
    loadUser();
  }, [pathname]);

  // Skip rendering on auth or admin CMS routes
  const isAdminPath = pathname.includes('/admin') || 
                      pathname.includes('/login') || 
                      pathname.includes('/register') || 
                      pathname.includes('/forgot-password') || 
                      pathname.includes('/verify');

  // Monitor scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when path changes
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  if (isAdminPath) return null;

  const navItems = [
    { name: t('nav.home'), path: `/${locale}` },
    { name: t('nav.about'), path: `/${locale}/about` },
    { name: t('nav.whatWeDo'), path: `/${locale}/what-we-do` },
    { name: t('nav.portfolio'), path: `/${locale}/portfolio` },
    { name: t('nav.team'), path: `/${locale}/team` },
    { name: t('nav.news'), path: `/${locale}/news` },
    { name: t('nav.contact'), path: `/${locale}/contact` },
    { name: t('nav.faq'), path: `/${locale}/faq` },
  ];

  const handleLogout = async () => {
    setDropdownOpen(false);
    const res = await logoutAction();
    if (res.success) {
      setUser(null);
      router.push(`/${locale}`);
      router.refresh();
    }
  };

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  const isLinkActive = (path: string) => {
    if (path === `/${locale}`) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Get initials for Avatar
  const getInitials = () => {
    if (!user) return 'U';
    if (user.name) {
      const parts = user.name.split(' ');
      return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const languageNames: Record<Locale, string> = {
    en: 'EN',
    ru: 'RU',
    uz: 'UZ',
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-sm'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="relative flex items-center gap-2 group focus:outline-none">
            <span className="text-xl font-black tracking-tight text-neutral-950 dark:text-white transition-colors duration-500">
              BEXA <span className="text-indigo-500 dark:text-indigo-400 font-light">Studio</span>
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const active = isLinkActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative text-xs font-semibold tracking-widest uppercase transition-colors py-1 cursor-pointer focus:outline-none ${
                    active
                      ? 'text-neutral-950 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  {item.name}
                  {active && (
                    <motion.span
                      layoutId="activeNavBorder"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Direct Inline Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism hover:bg-black/5 dark:hover:bg-white/5 transition-all focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Direct Inline Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="h-10 px-3 rounded-full flex items-center gap-1.5 cursor-pointer glassmorphism hover:bg-black/5 dark:hover:bg-white/5 transition-all focus:outline-none text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl border border-black/5 dark:border-white/5 glassmorphism bg-white/95 dark:bg-neutral-950/95 p-1.5 shadow-xl z-50 overflow-hidden"
                  >
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          handleLanguageChange(loc);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                          loc === locale
                            ? 'bg-neutral-500/10 dark:bg-white/10 text-neutral-900 dark:text-white font-bold'
                            : 'text-neutral-500 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{languageNames[loc] === 'EN' ? 'English' : languageNames[loc] === 'RU' ? 'Русский' : 'O‘zbekcha'}</span>
                        {loc === locale && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {userLoading ? (
                // Pulse placeholder while loading session
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              ) : user ? (
                // Authenticated Dropdown Portal
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px] hover:scale-105 transition-all shadow-md focus:outline-none active:scale-95"
                    aria-label="User profile options"
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#070e1e] flex items-center justify-center text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials()
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-3 w-64 rounded-2xl border border-black/5 dark:border-white/5 glassmorphism shadow-2xl bg-white/95 dark:bg-[#070e1e]/95 p-2 z-50 overflow-hidden"
                      >
                        {/* Profile Header */}
                        <div className="p-3 border-b border-black/5 dark:border-white/5 flex flex-col gap-0.5">
                          <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            {user.role}
                          </div>
                          <div className="text-sm font-extrabold text-neutral-900 dark:text-white truncate">
                            {user.name || user.username}
                          </div>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                            {user.email}
                          </div>
                        </div>

                        {/* Navigation sector */}
                        <div className="p-1 flex flex-col gap-0.5 border-b border-black/5 dark:border-white/5">
                          {user.role !== 'user' && (
                            <Link
                              href={`/${locale}/admin`}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-500/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                            >
                              <LayoutDashboard className="w-4 h-4 text-indigo-500 shrink-0" />
                              <span>{t('admin.dashboard', 'Admin Sector')}</span>
                            </Link>
                          )}
                          <Link
                            href={`/${locale}/profile`}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-500/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                          >
                            <User className="w-4 h-4 text-purple-500 shrink-0" />
                            <span>{t('profile.page', 'Profile Center')}</span>
                          </Link>
                        </div>

                        {/* Interactive theme / i18n Row Toggles */}
                        <div className="p-2 border-b border-black/5 dark:border-white/5 flex flex-col gap-1.5 text-xs font-semibold text-neutral-500">
                          {/* Theme switch in dropdown */}
                          <div className="flex items-center justify-between px-2">
                            <span>Theme</span>
                            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-full">
                              <button
                                onClick={() => setTheme('light')}
                                className={`p-1.5 rounded-full cursor-pointer transition-all ${
                                  theme === 'light'
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-neutral-400 hover:text-white'
                                }`}
                                aria-label="Light mode"
                              >
                                <Sun className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setTheme('dark')}
                                className={`p-1.5 rounded-full cursor-pointer transition-all ${
                                  theme === 'dark'
                                    ? 'bg-[#070e1e] text-white shadow-sm'
                                    : 'text-neutral-400 hover:text-black'
                                }`}
                                aria-label="Dark mode"
                              >
                                <Moon className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Language Switch in dropdown */}
                          <div className="flex items-center justify-between px-2">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span>Language</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              {locales.map((loc) => (
                                <button
                                  key={loc}
                                  onClick={() => handleLanguageChange(loc)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold cursor-pointer transition-all ${
                                    loc === locale
                                      ? 'bg-indigo-500 text-white'
                                      : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                                  }`}
                                >
                                  {languageNames[loc]}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Sign Out */}
                        <div className="p-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer text-left focus:outline-none"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span>{t('auth.logout', 'Sign Out')}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Unauthenticated Gateway
                <Link
                  href={`/${locale}/login`}
                  className="h-10 px-5 rounded-full flex items-center gap-1.5 cursor-pointer bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold text-xs transition-all duration-300 hover:shadow-lg dark:hover:shadow-white/10 hover:scale-[1.02] focus:outline-none group active:scale-95 uppercase tracking-wider"
                >
                  <span>{t('auth.signin', 'Sign In')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </Link>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer glassmorphism text-neutral-800 dark:text-neutral-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white dark:bg-[#020617] z-30 lg:hidden flex flex-col pt-24 px-8 pb-8 overflow-y-auto"
          >
            {/* Background floating glow aura */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

            <div className="flex-1 flex flex-col gap-6 relative z-10 max-w-md mx-auto w-full justify-center">
              {/* If authenticated, show user card in mobile menu */}
              {user && (
                <div className="p-4 rounded-2xl glassmorphism border border-black/5 dark:border-white/5 flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#070e1e] flex items-center justify-center font-bold text-neutral-800 dark:text-white">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials()
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 max-w-[180px]">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      {user.role}
                    </div>
                    <div className="text-sm font-extrabold truncate text-neutral-900 dark:text-white">
                      {user.name || user.username}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col gap-4">
                {navItems.map((item, index) => {
                  const active = isLinkActive(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={item.path}
                        className={`text-2xl font-bold tracking-tight block py-1 cursor-pointer focus:outline-none ${
                          active
                            ? 'text-neutral-950 dark:text-white font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent'
                            : 'text-neutral-400 hover:text-neutral-950 dark:text-neutral-600 dark:hover:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action buttons inside drawer */}
              <div className="mt-4 pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col gap-4">
                {/* Theme & Language row in drawer */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#070e1e] cursor-pointer text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => handleLanguageChange(loc)}
                        className={`px-3 py-1.5 rounded-xl uppercase font-extrabold text-xs cursor-pointer border ${
                          loc === locale
                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                            : 'text-neutral-400 bg-white dark:bg-[#070e1e] border-neutral-200 dark:border-neutral-800 hover:text-white'
                        }`}
                      >
                        {languageNames[loc]}
                      </button>
                    ))}
                  </div>
                </div>

                {user ? (
                  <>
                    {user.role !== 'user' && (
                      <Link
                        href={`/${locale}/admin`}
                        className="w-full h-12 rounded-2xl glassmorphism border border-indigo-500/10 font-bold flex items-center justify-center gap-2 text-indigo-500 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0" />
                        <span>{t('admin.dashboard', 'Admin Sector')}</span>
                      </Link>
                    )}
                    <Link
                      href={`/${locale}/profile`}
                      className="w-full h-12 rounded-2xl glassmorphism border border-purple-500/10 font-bold flex items-center justify-center gap-2 text-purple-500 cursor-pointer"
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <span>{t('profile.page', 'Profile Center')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full h-12 rounded-2xl bg-red-500/10 border border-red-500/20 font-bold flex items-center justify-center gap-2 text-red-500 cursor-pointer focus:outline-none"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>{t('auth.logout', 'Sign Out')}</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/login`}
                    className="w-full h-12 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 cursor-pointer uppercase tracking-wider text-xs"
                  >
                    <span>{t('auth.signin', 'Sign In')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-auto pt-8">
              &copy; {new Date().getFullYear()} BEXA Studio. {t('footer.rights')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
