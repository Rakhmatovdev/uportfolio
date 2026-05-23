'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Shield, FolderGit, Newspaper, UserCheck, 
  HelpCircle, Settings, BarChart3, Menu, Bell, Search, Command,
  LogOut, ChevronLeft, ChevronRight, Check, Palette, Languages, AlertTriangle, ShieldCheck, X
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { logoutAction } from '@/actions/adminActions';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ROLE_METADATA } from '@/lib/permissions';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', path: '', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'editor', 'moderator'] },
  { name: 'Users', path: '/users', icon: Users, roles: ['super_admin'] },
  { name: 'Roles', path: '/roles', icon: Shield, roles: ['super_admin'] },
  { name: 'Portfolio', path: '/portfolio', icon: FolderGit, roles: ['super_admin', 'admin', 'editor'] },
  { name: 'News Journal', path: '/news', icon: Newspaper, roles: ['super_admin', 'admin', 'editor', 'moderator'] },
  { name: 'Team Collective', path: '/team', icon: UserCheck, roles: ['super_admin', 'admin', 'editor'] },
  { name: 'FAQs Accordion', path: '/faq', icon: HelpCircle, roles: ['super_admin', 'admin', 'editor', 'moderator'] },
  { name: 'Site Settings', path: '/settings', icon: Settings, roles: ['super_admin', 'admin'] },
  { name: 'Analytics Data', path: '/analytics', icon: BarChart3, roles: ['super_admin', 'admin'] },
];

const ACCENTS = [
  { id: 'indigo', color: 'bg-indigo-600', text: 'text-indigo-400' },
  { id: 'emerald', color: 'bg-emerald-600', text: 'text-emerald-400' },
  { id: 'violet', color: 'bg-violet-600', text: 'text-violet-400' },
  { id: 'amber', color: 'bg-amber-600', text: 'text-amber-400' },
  { id: 'rose', color: 'bg-rose-600', text: 'text-rose-400' },
  { id: 'blue', color: 'bg-blue-600', text: 'text-blue-400' },
] as const;

export default function AdminLayoutClient({ children, session }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const { 
    sidebarOpen, toggleSidebar, 
    themeAccent, setThemeAccent,
    notifications, markAllNotificationsRead, clearNotifications,
    pusherConnected
  } = useAdminStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);

  // Filter sidebar items based on role (RBAC)
  const allowedItems = SIDEBAR_ITEMS.filter(item => item.roles.includes(session.role));

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    if (confirm('Verify system log out request?')) {
      const res = await logoutAction();
      if (res.success) {
        router.push(`/${locale}/admin/login`);
        router.refresh();
      }
    }
  };

  // Listen for keyboard command trigger (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandMenu(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync color accent variable with document body
  useEffect(() => {
    const accentColors: Record<string, string> = {
      indigo: '#6366f1',
      emerald: '#10b981',
      violet: '#8b5cf6',
      amber: '#f59e0b',
      rose: '#f43f5e',
      blue: '#3b82f6',
    };
    document.documentElement.style.setProperty('--admin-accent', accentColors[themeAccent]);
  }, [themeAccent]);

  // Build breadcrumbs
  const getBreadcrumbs = () => {
    const relativePath = pathname.replace(`/${locale}/admin`, '');
    if (!relativePath) return [{ name: 'Dashboard', active: true }];
    const parts = relativePath.split('/').filter(Boolean);
    return [
      { name: 'Admin', active: false },
      ...parts.map((p, idx) => ({
        name: p.charAt(0).toUpperCase() + p.slice(1),
        active: idx === parts.length - 1
      }))
    ];
  };

  // Accent Text class helper
  const accentTextClass = () => {
    const item = ACCENTS.find(a => a.id === themeAccent);
    return item ? item.text : 'text-indigo-400';
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-[#030712] text-neutral-900 dark:text-white transition-colors duration-500 overflow-hidden font-sans select-none">
      
      {/* GLOWING ORBS */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-[var(--admin-accent)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* SIDEBAR CONTAINER */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col shrink-0 border-r border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-2xl relative z-30"
      >
        {/* Brand logo header */}
        <div className="h-20 px-6 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between overflow-hidden">
          <Link href={`/${locale}/admin`} className="flex items-center gap-2 group focus:outline-none">
            <span className="text-lg font-black tracking-tight text-neutral-950 dark:text-white block">
              BEXA <span className={`font-light ${accentTextClass()}`}>CMS</span>
            </span>
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-white focus:outline-none"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav menu list */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          {allowedItems.map((item) => {
            const fullPath = `/${locale}/admin${item.path}`;
            const active = pathname === fullPath || (item.path !== '' && pathname.startsWith(fullPath));
            
            return (
              <Link
                key={item.path}
                href={fullPath}
                className={`relative h-11 px-4 rounded-xl flex items-center gap-3.5 transition-all cursor-pointer overflow-hidden ${
                  active 
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold' 
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile section in sidebar bottom */}
        <div className="p-4 border-t border-neutral-200 dark:border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)]/10 border border-[var(--admin-accent)]/20 flex items-center justify-center font-bold text-sm text-[var(--admin-accent)] uppercase shrink-0">
              {session.username.slice(0, 2)}
            </div>
            {sidebarOpen && (
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="text-sm font-bold text-neutral-950 dark:text-white truncate">{session.username}</span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest truncate">{session.role.replace('_', ' ')}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full h-10 px-4 rounded-xl border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 flex items-center gap-3 transition-colors cursor-pointer text-xs font-semibold overflow-hidden"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>System Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* HEADER BAR */}
        <header className="h-20 border-b border-neutral-200 dark:border-white/5 px-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#030712]/40 backdrop-blur-2xl z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="md:hidden w-10 h-10 rounded-xl border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-white focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* BREADCRUMBS DISPLAY */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {getBreadcrumbs().map((b, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={b.active ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-400'}>
                    {b.name}
                  </span>
                  {idx < arr.length - 1 && <span className="text-neutral-600">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Quick Command shortcut hint */}
            <button 
              onClick={() => setShowCommandMenu(true)}
              className="hidden lg:flex items-center gap-2 text-xs font-semibold bg-neutral-200/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Command</span>
              <kbd className="bg-neutral-300 dark:bg-black/60 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 border border-white/5 font-mono">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            {/* Accent Theme Color Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowAccentPicker(!showAccentPicker)}
                className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-colors focus:outline-none"
                title="CMS Primary Theme Accent"
              >
                <Palette className="w-4 h-4 text-[var(--admin-accent)]" />
              </button>
              <AnimatePresence>
                {showAccentPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 p-3 rounded-2xl bg-white dark:bg-[#0b0f19] border border-neutral-200 dark:border-white/10 shadow-xl backdrop-blur-3xl z-40 w-48 flex flex-col gap-2"
                  >
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1 block">Accent Color</span>
                    <div className="grid grid-cols-3 gap-2">
                      {ACCENTS.map((accent) => (
                        <button
                          key={accent.id}
                          onClick={() => {
                            setThemeAccent(accent.id);
                            setShowAccentPicker(false);
                          }}
                          className={`w-full h-8 rounded-xl ${accent.color} flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
                        >
                          {themeAccent === accent.id && <Check className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Realtime Pusher Connection Status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-neutral-400">
              <span className={`w-1.5 h-1.5 rounded-full ${pusherConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="uppercase tracking-widest hidden sm:inline">{pusherConnected ? 'Pusher Live' : 'Offline'}</span>
            </div>

            {/* Theme & Language Switchers */}
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-colors focus:outline-none relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0b0f19] border border-neutral-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl z-40 overflow-hidden flex flex-col"
                  >
                    <div className="p-4 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">System Logs ({unreadCount})</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { markAllNotificationsRead(); setShowNotifications(false); }} 
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold focus:outline-none cursor-pointer"
                        >
                          Mark all read
                        </button>
                        <span className="text-neutral-700">|</span>
                        <button 
                          onClick={() => { clearNotifications(); setShowNotifications(false); }} 
                          className="text-[10px] text-red-400 hover:text-red-300 font-bold focus:outline-none cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto flex flex-col">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-neutral-500 font-light">No active alerts logs</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-4 border-b border-neutral-200 dark:border-white/5 flex flex-col gap-1 text-left transition-colors ${
                              notif.read ? 'opacity-60 bg-transparent' : 'bg-indigo-500/5'
                            }`}
                          >
                            <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                              {notif.type === 'success' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                              {notif.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                              {notif.title}
                            </span>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">{notif.message}</p>
                            <span className="text-[9px] text-neutral-600 dark:text-neutral-500 mt-1">{notif.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* WORKSPACE PAGES CONTENT */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] h-full flex flex-col bg-white/95 dark:bg-[#070e1e]/95 backdrop-blur-2xl border-r border-neutral-200 dark:border-white/5 p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-white/5 mb-6">
                <span className="text-lg font-black tracking-tight text-neutral-950 dark:text-white">
                  BEXA <span className={`font-light ${accentTextClass()}`}>CMS</span>
                </span>
                <button
                  onClick={toggleSidebar}
                  className="w-8 h-8 rounded-xl border border-neutral-200 dark:border-white/5 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-grow flex flex-col gap-2 overflow-y-auto pr-1">
                {allowedItems.map((item) => {
                  const fullPath = `/${locale}/admin${item.path}`;
                  const active = pathname === fullPath || (item.path !== '' && pathname.startsWith(fullPath));

                  return (
                    <Link
                      key={item.path}
                      href={fullPath}
                      onClick={toggleSidebar}
                      className={`h-11 px-4 rounded-xl flex items-center gap-3.5 transition-all cursor-pointer ${
                        active
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold'
                          : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom user profile & Logout */}
              <div className="pt-6 border-t border-neutral-200 dark:border-white/5 flex flex-col gap-4 mt-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-xl bg-[var(--admin-accent)]/10 border border-[var(--admin-accent)]/20 flex items-center justify-center font-bold text-sm text-[var(--admin-accent)] uppercase shrink-0">
                    {session.username.slice(0, 2)}
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-sm font-bold text-neutral-950 dark:text-white truncate">{session.username}</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest truncate">{session.role.replace('_', ' ')}</span>
                  </div>
                </div>
                <button
                  onClick={() => { toggleSidebar(); handleLogout(); }}
                  className="w-full h-11 px-4 rounded-xl border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 flex items-center justify-center gap-3 transition-colors cursor-pointer text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>System Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK COMMAND SEARCH OVERLAY BOX */}
      <AnimatePresence>
        {showCommandMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setShowCommandMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl bg-[#0b0f19] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search className="w-5 h-5 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Jump to CMS page... (e.g. portfolio, users, settings)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-neutral-500 border-none outline-none text-sm"
                  autoFocus
                />
                <kbd className="text-[10px] text-neutral-500 font-mono border border-white/5 px-1.5 py-0.5 rounded uppercase">ESC</kbd>
              </div>

              <div className="p-3 max-h-80 overflow-y-auto flex flex-col gap-1">
                {allowedItems
                  .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(`/${locale}/admin${item.path}`);
                        setShowCommandMenu(false);
                        setSearchQuery('');
                      }}
                      className="w-full h-11 px-4 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white flex items-center gap-3 transition-colors cursor-pointer text-left text-xs font-semibold"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </button>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
