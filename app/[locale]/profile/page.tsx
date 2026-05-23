'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/components/I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUserAction, updateUserProfileAction, changeUserPasswordAction, getActivityLogs, getPortfolio } from '@/actions/adminActions';
import { User, Shield, Key, Bookmark, Activity, Bell, Share2, Mail, Phone, Upload, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, RefreshCw, Eye, EyeOff, Globe } from 'lucide-react';
import Link from 'next/link';

// Pre-defined premium cyber illustrations/avatars for quick avatar updates
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634973357973-f2ed255753e1?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
];

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { locale, t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'saved' | 'activity' | 'notifications'>('profile');
  
  // User profile state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Editable Profile fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Connected providers simulator state
  const [providers, setProviders] = useState({
    google: true,
    github: false,
    figma: false
  });

  // Activity logs & Saved items state
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);

  // Notifications toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    securityAlerts: true,
    marketingAlerts: false,
    smsAlerts: false
  });

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      const userRes = await getCurrentUserAction();
      
      if (userRes.success && userRes.user) {
        setUser(userRes.user);
        setUsername(userRes.user.username);
        setEmail(userRes.user.email);
        setPhone(userRes.user.phone || '');
        setFullName(userRes.user.name || '');
        setAvatar(userRes.user.avatar || '');
        
        if (userRes.user.notificationSettings) {
          try {
            const parsed = typeof userRes.user.notificationSettings === 'string'
              ? JSON.parse(userRes.user.notificationSettings)
              : userRes.user.notificationSettings;
            setNotifications(prev => ({ ...prev, ...parsed }));
          } catch(e) {}
        }
      } else {
        // Redirect to login if unauthenticated
        router.push(`/${locale}/login`);
        return;
      }

      // Fetch logs
      const logs = await getActivityLogs();
      setActivityLogs(logs.slice(0, 10)); // Top 10 logs

      // Fetch portfolio items to display as "Saved Projects" simulation
      const portfolio = await getPortfolio();
      setPortfolioItems(portfolio);
      // Simulate that item 1 and item 3 are bookmarked/saved by default
      setSavedItems(portfolio.filter((item: any) => item.id === '1' || item.id === '3'));

      setLoading(false);
    }
    
    loadInitialData();
  }, [locale]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');

    const res = await updateUserProfileAction({
      username,
      email,
      phone,
      name: fullName,
      avatar,
      notificationSettings: notifications
    });

    if (res.success && res.user) {
      setUser(res.user);
      setProfileSuccess('Profile credentials successfully updated!');
      router.refresh();
    } else {
      setProfileError(res.error || 'Failed to update credentials.');
    }
    setProfileSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long');
      return;
    }

    setPassLoading(true);
    const res = await changeUserPasswordAction({ currentPassword, newPassword });

    if (res.success) {
      setPassSuccess('Security credentials successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassError(res.error || 'Failed to update password.');
    }
    setPassLoading(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Save notification settings to profile
      if (user) {
        updateUserProfileAction({
          username,
          email,
          phone,
          name: fullName,
          avatar,
          notificationSettings: updated
        });
      }
      return updated;
    });
  };

  const toggleProvider = (key: keyof typeof providers) => {
    setProviders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAvatarSelect = (url: string) => {
    setAvatar(url);
  };

  const handleCustomAvatarUpload = () => {
    // Generate random avatar from unsplash or preset
    const randomPreset = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
    setAvatar(randomPreset);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-background text-foreground transition-colors duration-500 select-none">
        {/* Glow auroras */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400">Loading profile secure shell...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 pt-28 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 border-b border-black/5 dark:border-white/5 pb-8">
          <div className="flex flex-col gap-2">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1 bg-gradient-to-r from-neutral-900 via-neutral-600 to-indigo-500 dark:from-white dark:via-neutral-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Account Hub
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Secure Shell Active</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-2 p-2 rounded-2xl glassmorphism border border-black/5 dark:border-white/5">
            {[
              { id: 'profile', label: 'Personal Information', icon: User },
              { id: 'security', label: 'Security & Access', icon: Shield },
              { id: 'saved', label: 'Saved Projects', icon: Bookmark },
              { id: 'activity', label: 'Activity Logs', icon: Activity },
              { id: 'notifications', label: 'Notification Settings', icon: Bell },
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setProfileError('');
                    setProfileSuccess('');
                    setPassError('');
                    setPassSuccess('');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer text-left focus:outline-none relative overflow-hidden ${
                    active
                      ? 'text-white dark:text-black bg-neutral-950 dark:bg-white shadow-md'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? '' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Tab Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25 }}
                className="p-8 rounded-3xl glassmorphism border border-black/5 dark:border-white/5 shadow-2xl relative"
              >
                {/* 1. PERSONAL INFORMATION */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate} className="flex flex-col gap-8">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight">Personal Information</h2>
                      <p className="text-xs text-neutral-400 mt-1">Manage your identity credentials, avatars, and linked phone routes.</p>
                    </div>

                    {profileError && (
                      <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{profileError}</span>
                      </div>
                    )}

                    {profileSuccess && (
                      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{profileSuccess}</span>
                      </div>
                    )}

                    {/* Avatar Selector UI */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                      <div className="relative group shrink-0">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-lg">
                          <div className="w-full h-full rounded-full bg-white dark:bg-[#070e1e] overflow-hidden flex items-center justify-center font-black text-2xl">
                            {avatar ? (
                              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              fullName.slice(0, 2).toUpperCase() || username.slice(0, 2).toUpperCase()
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCustomAvatarUpload}
                          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer border border-black/5 dark:border-white/5 focus:outline-none"
                          aria-label="Upload custom avatar"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Choose Preset Illustration</label>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {PRESET_AVATARS.map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAvatarSelect(url)}
                              className={`w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                                avatar === url
                                  ? 'border-indigo-500 scale-110 shadow-lg'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={url} alt="avatar preset" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Elena Romanova"
                          className="h-12 px-4 rounded-xl border border-black/5 dark:border-white/5 bg-white/5 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold"
                        />
                      </div>

                      {/* Username */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Username</label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="elena"
                          className="h-12 px-4 rounded-xl border border-black/5 dark:border-white/5 bg-white/5 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold"
                        />
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-4 w-4 h-4 text-neutral-500 shrink-0" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="architect@bexa.studio"
                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-black/5 dark:border-white/5 bg-white/5 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phone Connection</label>
                        <div className="relative flex items-center">
                          <Phone className="absolute left-4 w-4 h-4 text-neutral-500 shrink-0" />
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998901234567"
                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-black/5 dark:border-white/5 bg-white/5 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="btn-primary h-12 w-48 mt-4 font-bold text-xs tracking-wider uppercase transition-all"
                    >
                      {profileSaving ? 'Saving changes...' : 'Save credentials'}
                    </button>
                  </form>
                )}

                {/* 2. SECURITY & ACCESS */}
                {activeTab === 'security' && (
                  <div className="flex flex-col gap-10">
                    {/* Password change form */}
                    <form onSubmit={handlePasswordChange} className="flex flex-col gap-6 border-b border-black/5 dark:border-white/5 pb-10">
                      <div>
                        <h2 className="text-xl font-extrabold tracking-tight">Access Credentials</h2>
                        <p className="text-xs text-neutral-400 mt-1">Re-hash or change your secure login shell password.</p>
                      </div>

                      {passError && (
                        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{passError}</span>
                        </div>
                      )}

                      {passSuccess && (
                        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{passSuccess}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Current Password */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Current Password</label>
                          <div className="relative flex items-center">
                            <input
                              type={showCurrentPass ? 'text' : 'password'}
                              required
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full h-12 px-4 pr-10 rounded-xl border border-black/5 dark:border-white/5 bg-white/5 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPass(!showCurrentPass)}
                              className="absolute right-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer focus:outline-none"
                            >
                              {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">New Password</label>
                          <div className="relative flex items-center">
                            <input
                              type={showNewPass ? 'text' : 'password'}
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full h-12 px-4 pr-10 rounded-xl border border-black/5 dark:border-white/5 bg-white/5 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer focus:outline-none"
                            >
                              {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Confirm Password</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="h-12 px-4 rounded-xl border border-black/5 dark:border-white/5 bg-white/5 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={passLoading}
                        className="btn-primary h-12 w-48 mt-2 font-bold text-xs tracking-wider uppercase transition-all"
                      >
                        {passLoading ? 'Verifying...' : 'Change credentials'}
                      </button>
                    </form>

                    {/* Linked OAuth accounts portal */}
                    <div className="flex flex-col gap-6">
                      <div>
                        <h2 className="text-xl font-extrabold tracking-tight">Connected Accounts</h2>
                        <p className="text-xs text-neutral-400 mt-1">Bind social sign-in directories to your account shell for faster access.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { id: 'google', label: 'Google Identity', icon: Globe, desc: 'Login via Gmail OAuth flow' },
                          { id: 'github', label: 'GitHub Code', icon: Share2, desc: 'Fast dev authorization bound' },
                          { id: 'figma', label: 'Figma Design', icon: Bookmark, desc: 'Sync spatial canvas assets' },
                        ].map((provider) => {
                          const active = (providers as any)[provider.id];
                          return (
                            <div
                              key={provider.id}
                              className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex flex-col gap-4 items-start"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                                  <provider.icon className="w-5 h-5 shrink-0" />
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleProvider(provider.id as any)}
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer focus:outline-none ${
                                    active
                                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                                      : 'bg-black/10 dark:bg-white/10 text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  {active ? 'Bound' : 'Bind'}
                                </button>
                              </div>
                              <div>
                                <div className="text-xs font-bold">{provider.label}</div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">{provider.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SAVED PROJECTS */}
                {activeTab === 'saved' && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight">Saved Projects</h2>
                      <p className="text-xs text-neutral-400 mt-1">Quick-access bookmarks to BEXA Studio dynamic portfolios.</p>
                    </div>

                    {savedItems.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-black/10 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <Bookmark className="w-8 h-8 text-neutral-500 stroke-1" />
                        <span className="text-xs font-semibold text-neutral-500">No saved items found. Browse our gallery to save some.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedItems.map((item) => (
                          <div
                            key={item.id}
                            className="group p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex gap-4 items-center glow-card"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-neutral-200 dark:bg-neutral-800">
                              <img src={item.image} alt={item.titleEn} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">{item.categoryEn}</span>
                              <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">{item.titleEn}</div>
                              <p className="text-[10px] text-neutral-400 line-clamp-1 leading-relaxed">{item.descriptionEn}</p>
                              <Link
                                href={`/${locale}/portfolio`}
                                className="text-[10px] text-indigo-500 hover:text-indigo-400 font-bold tracking-wider uppercase mt-1 flex items-center gap-1"
                              >
                                <span>Browse project</span>
                                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. ACTIVITY LOGS */}
                {activeTab === 'activity' && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight">Audit Timeline</h2>
                      <p className="text-xs text-neutral-400 mt-1">Complete diagnostic history of sessions and secure actions.</p>
                    </div>

                    {activityLogs.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-black/10 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <Activity className="w-8 h-8 text-neutral-500 stroke-1" />
                        <span className="text-xs font-semibold text-neutral-500">No activity logs found.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-black/10 dark:before:bg-white/10">
                        {activityLogs.map((log) => (
                          <div key={log.id} className="relative pl-8 py-1.5 flex flex-col gap-1">
                            {/* Bullet indicator */}
                            <div className="absolute left-[9px] top-[11px] w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-[#070e1e]" />
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                {log.action}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {new Date(log.createdAt).toLocaleString(locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US')}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                              {log.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. NOTIFICATION SETTINGS */}
                {activeTab === 'notifications' && (
                  <div className="flex flex-col gap-8">
                    <div>
                      <h2 className="text-xl font-extrabold tracking-tight">Notification Channels</h2>
                      <p className="text-xs text-neutral-400 mt-1">Configure diagnostic push notifications, marketing alerts, and SMS bounds.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {[
                        { id: 'emailAlerts', label: 'Email Notifications', desc: 'Receive security digests, session updates, and audit receipts' },
                        { id: 'securityAlerts', label: 'SMS Security Alerts', desc: 'Urgent push indicators for new device logins or password re-hashes' },
                        { id: 'smsAlerts', label: 'Weekly Newsletters', desc: 'Direct luxury BEXA design reviews and edge computing releases' },
                        { id: 'marketingAlerts', label: 'Marketing Insights', desc: 'Receive discount coupons for custom branding visual packages' },
                      ].map((item) => {
                        const active = (notifications as any)[item.id];
                        return (
                          <div
                            key={item.id}
                            className="p-5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-between gap-6"
                          >
                            <div className="flex flex-col gap-1 min-w-0">
                              <span className="text-xs font-bold text-neutral-900 dark:text-white">{item.label}</span>
                              <p className="text-[10px] text-neutral-400 leading-relaxed">{item.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleNotification(item.id as any)}
                              className={`w-11 h-6 rounded-full cursor-pointer transition-colors focus:outline-none flex items-center p-0.5 ${
                                active ? 'bg-indigo-500 justify-end' : 'bg-neutral-200 dark:bg-neutral-800 justify-start'
                              }`}
                              aria-label="Toggle notification"
                            >
                              <motion.span layout className="w-5 h-5 rounded-full bg-white dark:bg-neutral-900 shadow-md block" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
