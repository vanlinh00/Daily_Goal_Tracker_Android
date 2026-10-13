import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export interface DashboardHeaderProps {
  streakDays: number;
  isPremium: boolean;
  onOpenPremium: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  streakDays,
  isPremium,
  onOpenPremium,
}) => {
  const formattedDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="px-5 pt-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
          <span>Goalify</span>
          <span>•</span>
          <span>Hôm nay</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
          {formattedDate}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-full text-xs font-semibold">
          <Flame size={14} className="fill-amber-500 text-amber-500" />
          <span>{streakDays} ngày</span>
        </div>

        {!isPremium && (
          <button
            onClick={onOpenPremium}
            className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity"
          >
            <Sparkles size={12} />
            <span>Pro</span>
          </button>
        )}
      </div>
    </div>
  );
};
