'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Calendar, Globe, MousePointerClick, RefreshCw, 
  Smartphone, Monitor, Tablet, ArrowUpRight, ArrowDownRight, Compass
} from 'lucide-react';

export default function AnalyticsAdminPage() {
  const [timeframe, setTimeframe] = useState('7D');
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const metrics = [
    { label: 'Unique Visitors', value: '4,821', change: '+24.8%', up: true },
    { label: 'Page Actions', value: '18,490', change: '+12.3%', up: true },
    { label: 'Bounce Rate', value: '28.4%', change: '-4.2%', up: false },
    { label: 'Session Duration', value: '4m 32s', change: '+8.1%', up: true },
  ];

  return (
    <div className="flex flex-col gap-8 text-left select-none">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[var(--admin-accent)]" />
            <span>Advanced Analytics</span>
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">
            Monitor digital traffic pipelines, explore click-rates retention curves, and analyze origin devices ratios.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="h-10 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 border border-neutral-200 dark:border-white/5 flex items-center gap-2 cursor-pointer transition-colors shadow-lg disabled:opacity-50 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Logs'}</span>
        </button>
      </div>

      {/* METRICS MINI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="p-5 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between h-32"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{m.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">{m.value}</span>
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {m.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {m.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS GRAPH CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BIG VISITATION VECTOR CHART */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col gap-6 relative">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-neutral-950 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--admin-accent)]" /> Traffic Frequency Curves
            </h3>
            
            {/* Time filters */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-200 dark:bg-white/5 border border-white/5 text-[9px] font-bold">
              {['24H', '7D', '30D', '12M'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2 py-1 rounded-md cursor-pointer focus:outline-none ${
                    timeframe === t ? 'bg-neutral-900 dark:bg-white text-white dark:text-black' : 'text-neutral-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG plots */}
          <div className="h-60 w-full relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--admin-accent)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--admin-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,160 L 75,130 L 150,145 L 225,90 L 300,110 L 375,50 L 450,70 L 525,40 L 600,60 L 600,200 L 0,200 Z" fill="url(#mainGrad)" />
              <path d="M 0,160 L 75,130 L 150,145 L 225,90 L 300,110 L 375,50 L 450,70 L 525,40 L 600,60" fill="none" stroke="var(--admin-accent)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-neutral-500 px-2 border-t border-neutral-200 dark:border-white/5 pt-4">
            <span>Monday</span>
            <span>Wednesday</span>
            <span>Friday</span>
            <span>Sunday</span>
          </div>
        </div>

        {/* DEVICE RATIOS PIE CHART MOCK */}
        <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col justify-between gap-6 relative">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Device Analytics</span>
            <h3 className="font-bold text-base text-neutral-950 dark:text-white">Active Device Breakdown</h3>
          </div>

          <div className="flex-1 flex items-center justify-center py-4">
            {/* SVG circle donut represent device ratios */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r="54" fill="transparent" stroke="var(--admin-accent)" strokeWidth="12" strokeDasharray="339" strokeDashoffset="100" />
              <circle cx="72" cy="72" r="54" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="339" strokeDashoffset="260" />
              <circle cx="72" cy="72" r="54" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="339" strokeDashoffset="310" />
            </svg>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { name: 'Desktop (Next.js Node)', rate: '60%', color: 'bg-[var(--admin-accent)]', icon: Monitor },
              { name: 'Mobile (Safari/Chrome)', rate: '30%', color: 'bg-purple-500', icon: Smartphone },
              { name: 'Tablet Interfaces', rate: '10%', color: 'bg-amber-500', icon: Tablet },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-light text-neutral-500 dark:text-neutral-400">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  {item.name}
                </span>
                <span className="font-bold text-neutral-950 dark:text-white">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* METRICS INSIGHT GRID */}
      <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md flex flex-col gap-4 relative">
        <h3 className="font-bold text-base text-neutral-950 dark:text-white">Active Conversions Tracker</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
          The BEXA Studio site analytics tracking indicates page views interactions are resolving at an average load speed latency of <strong>82ms</strong> with dynamic rendering.
        </p>
      </div>

    </div>
  );
}
