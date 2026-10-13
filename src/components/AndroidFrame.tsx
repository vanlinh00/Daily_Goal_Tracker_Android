import React, { useState } from 'react';
import {
  CalendarCheck2,
  FolderGit2,
  BarChart3,
  Settings,
  Wifi,
  Battery,
  ShieldCheck,
  Smartphone,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { DashboardScreen } from './dashboard';
import { HierarchyScreen } from './hierarchy';
import { StatisticsScreen } from './StatisticsScreen';
import { SettingsScreen } from './SettingsScreen';
import { InterstitialAdModal, PremiumModal } from './modals';
import { useGoal } from '../context/GoalContext';

type Tab = 'DASHBOARD' | 'HIERARCHY' | 'STATISTICS' | 'SETTINGS';

interface AndroidFrameProps {
  deviceMode: 'PHONE' | 'EXPANDED';
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ deviceMode }) => {
  const [currentTab, setCurrentTab] = useState<Tab>('DASHBOARD');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const { isPremium } = useGoal();

  // Current phone time
  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'DASHBOARD':
        return (
          <DashboardScreen
            onNavigateToHierarchy={() => setCurrentTab('HIERARCHY')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        );
      case 'HIERARCHY':
        return <HierarchyScreen />;
      case 'STATISTICS':
        return <StatisticsScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
    }
  };

  const navItems = [
    {
      tab: 'DASHBOARD' as Tab,
      label: 'Hôm nay',
      icon: CalendarCheck2,
    },
    {
      tab: 'HIERARCHY' as Tab,
      label: 'Cây mục tiêu',
      icon: FolderGit2,
    },
    {
      tab: 'STATISTICS' as Tab,
      label: 'Thống kê',
      icon: BarChart3,
    },
    {
      tab: 'SETTINGS' as Tab,
      label: 'Cài đặt',
      icon: Settings,
    },
  ];

  const content = (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 select-none overflow-hidden relative font-sans">
      {/* Android 14 Status Bar */}
      <div className="h-7 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 px-4 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
        <span className="font-mono">{currentTime}</span>

        {/* Center pill punch-hole camera simulation */}
        <div className="w-3.5 h-3.5 bg-black rounded-full" />

        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold px-1 rounded-xs">
            OFFLINE
          </span>
          <Wifi size={13} />
          <Battery size={14} className="fill-current" />
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 overflow-hidden relative">{renderActiveScreen()}</div>

      {/* Android Material 3 Navigation Bar */}
      <div className="h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 shrink-0 z-30">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          const Icon = item.icon;

          return (
            <button
              key={item.tab}
              onClick={() => setCurrentTab(item.tab)}
              className="flex flex-col items-center justify-center flex-1 py-1 transition-all group"
            >
              <div
                className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={19} className={isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'} />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-medium transition-colors ${
                  isActive
                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android Gesture Navigation Bar Pill */}
      <div className="h-3 bg-white dark:bg-slate-900 flex items-center justify-center pb-1 shrink-0">
        <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>

      {/* Modals & Overlays */}
      <InterstitialAdModal />
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );

  if (deviceMode === 'EXPANDED') {
    return (
      <div className="w-full h-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800">
        {content}
      </div>
    );
  }

  // Phone Shell (Pixel 9 Pro style)
  return (
    <div className="relative mx-auto my-auto w-[385px] h-[780px] max-h-[92vh] bg-slate-900 p-3 rounded-[46px] shadow-2xl ring-1 ring-slate-800 border-4 border-slate-700/80 flex flex-col">
      {/* Side buttons */}
      <div className="absolute -left-1.5 top-28 w-1 h-12 bg-slate-700 rounded-l-md" />
      <div className="absolute -left-1.5 top-44 w-1 h-12 bg-slate-700 rounded-l-md" />
      <div className="absolute -right-1.5 top-32 w-1 h-16 bg-slate-700 rounded-r-md" />

      {/* Inner Screen */}
      <div className="w-full h-full rounded-[38px] overflow-hidden flex flex-col bg-white dark:bg-slate-950 shadow-inner">
        {content}
      </div>
    </div>
  );
};
