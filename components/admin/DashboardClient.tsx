'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FolderGit, Newspaper, HelpCircle, ArrowUpRight, 
  ArrowDownRight, ShieldCheck, Activity, Globe, MousePointerClick 
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface DashboardClientProps {
  stats: {
    users: number;
    portfolio: number;
    news: number;
    faqs: number;
  };
  initialLogs: any[];
}

export default function DashboardClient({ stats, initialLogs }: DashboardClientProps) {
  const { activityLogs, addNotification } = useAdminStore();
  const [activeLogs, setActiveLogs] = useState<any[]>([]);
  const [logFilter, setLogFilter] = useState('ALL');

  // Load and merge logs from server and Zustand local storage
  useEffect(() => {
    const combined = [...activityLogs];
    initialLogs.forEach(sLog => {
      if (!combined.some(c => c.id === sLog.id)) {
        combined.push({
          id: sLog.id,
          user: sLog.user?.username || 'System',
          action: sLog.action,
          details: sLog.details,
          ip: sLog.ipAddress || '127.0.0.1',
          time: new Date(sLog.createdAt).toLocaleString()
        });
      }
    });
    // Sort by time descending
    combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setActiveLogs(combined);
  }, [activityLogs, initialLogs]);

  // Handle a simulated Pusher websocket notification event for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: 'Active Visitor Spotted',
        message: 'A user from Tashkent, Uzbekistan opened the Aura 3D Case Study page.',
        type: 'info'
      });
    }, 8000);
    return () => clearTimeout(timer);
  }, [addNotification]);

  // Statistics cards data
  const cards = [
    { name: 'Total Users', value: stats.users, change: '+12%', up: true, icon: Users, color: 'from-blue-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { name: 'Case Studies', value: stats.portfolio, change: '+4%', up: true, icon: FolderGit, color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Yangiliklar (News)', value: stats.news, change: '+18%', up: true, icon: Newspaper, color: 'from-violet-500/20 to-purple-500/10 text-purple-400 border-purple-500/20' },
    { name: 'Accordion FAQs', value: stats.faqs, change: '0%', up: null, icon: HelpCircle, color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20' },
  ];

  // Filter logs list
  const filteredLogs = activeLogs.filter(log => {
    if (logFilter === 'ALL') return true;
    return log.action.includes(logFilter);
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white">CMS Administration</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">Real-time metrics, system settings configuration and media updates catalog.</p>
      </div>

      {/* STATS COUNT GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className={`p-6 rounded-3xl border bg-white/40 dark:bg-black/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-40 ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">{card.name}</span>
              <div className="w-9 h-9 rounded-xl bg-neutral-200/50 dark:bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                <card.icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-4xl font-extrabold text-neutral-950 dark:text-white tracking-tight">{card.value}</span>
              {card.up !== null && (
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${card.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {card.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {card.change}
                </span>
              )}
            </div>

            {/* Ambient backing glow */}
            <div className="absolute right-0 bottom-0 w-24 h-24 rounded-full bg-[var(--admin-accent)]/5 blur-[40px] pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BIG VISITS GRAPHIC (Custom styled SVG) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between gap-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Analytics Insights</span>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Visitor Traffic Trends</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-neutral-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Page Views</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Conversions</span>
            </div>
          </div>

          {/* SVG Vector Plot Area */}
          <div className="h-60 w-full relative mt-4 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#888888" strokeOpacity="0.05" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#888888" strokeOpacity="0.05" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#888888" strokeOpacity="0.05" strokeDasharray="5,5" />

              {/* Area Views */}
              <path d="M 0,150 L 100,120 L 200,160 L 300,90 L 400,110 L 500,60 L 600,80 L 600,200 L 0,200 Z" fill="url(#viewsGrad)" />
              {/* Line Views */}
              <path d="M 0,150 L 100,120 L 200,160 L 300,90 L 400,110 L 500,60 L 600,80" fill="none" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />

              {/* Area Conversions */}
              <path d="M 0,180 L 100,160 L 200,175 L 300,130 L 400,150 L 500,110 L 600,120 L 600,200 L 0,200 Z" fill="url(#clicksGrad)" />
              {/* Line Conversions */}
              <path d="M 0,180 L 100,160 L 200,175 L 300,130 L 400,150 L 500,110 L 600,120" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-neutral-500 px-2 select-none border-t border-neutral-200 dark:border-white/5 pt-4">
            <span>May 18</span>
            <span>May 19</span>
            <span>May 20</span>
            <span>May 21</span>
            <span>May 22</span>
            <span>May 23 (Today)</span>
          </div>
        </div>

        {/* MOCK GEO GRAPHICS */}
        <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between gap-6 relative">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Demographic Logs</span>
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Active Traffic Sources</h3>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {[
              { region: 'Tashkent, UZ', count: 1842, rate: '64%', icon: Globe },
              { region: 'Moscow, RU', count: 681, rate: '22%', icon: Globe },
              { region: 'London, UK', count: 240, rate: '8%', icon: Globe },
              { region: 'New York, US', count: 189, rate: '6%', icon: Globe },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-200/20 dark:bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-neutral-950 dark:text-white">{item.region}</span>
                    <span className="text-[10px] text-neutral-500 font-light">{item.count} sessions</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[var(--admin-accent)]">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECURITY LOGS AUDITS */}
      <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col gap-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Security audits ledger</span>
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Recent System Modifications</h3>
          </div>

          {/* Activity filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/5 text-[10px] font-bold uppercase">
            {['ALL', 'LOGIN', 'UPDATE', 'CREATE', 'DELETE'].map(f => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus:outline-none ${
                  logFilter === f ? 'bg-neutral-900 dark:bg-white text-white dark:text-black' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Logs directory listing table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-white/5 text-[10px] uppercase font-bold text-neutral-500 h-10">
                <th className="px-4">Administrator</th>
                <th className="px-4">Security Action</th>
                <th className="px-4">Operational Details</th>
                <th className="px-4">Origin IP</th>
                <th className="px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500 font-light">No audited activity matching criteria</td>
                </tr>
              ) : (
                filteredLogs.slice(0, 8).map((log, idx) => (
                  <tr key={log.id || idx} className="border-b border-neutral-200 dark:border-white/5 h-12 hover:bg-neutral-200/30 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 font-bold text-neutral-950 dark:text-white">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[var(--admin-accent)]/10 text-[9px] text-[var(--admin-accent)] font-extrabold flex items-center justify-center uppercase shrink-0">
                          {log.user.slice(0, 2)}
                        </span>
                        {log.user}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className={`px-2 py-0.5 rounded-lg border font-bold text-[9px] uppercase tracking-wider ${
                        log.action.includes('LOGIN') ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        log.action.includes('DELETE') ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        log.action.includes('CREATE') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 text-neutral-500 dark:text-neutral-400 font-light truncate max-w-xs">{log.details}</td>
                    <td className="px-4 font-mono text-neutral-500">{log.ip}</td>
                    <td className="px-4 text-right text-neutral-500 font-mono">{log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
