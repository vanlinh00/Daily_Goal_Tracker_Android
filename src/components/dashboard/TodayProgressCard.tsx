import React from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export interface TodayProgressCardProps {
  todayProgress: number;
  completedToday: number;
  totalToday: number;
  monthProgress: number;
  weeklyGoalsCount: number;
  onNavigateToHierarchy: () => void;
}

export const TodayProgressCard: React.FC<TodayProgressCardProps> = ({
  todayProgress,
  completedToday,
  totalToday,
  monthProgress,
  weeklyGoalsCount,
  onNavigateToHierarchy,
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-indigo-200 font-medium">Tiến độ công việc hôm nay</span>
          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
            {completedToday}/{totalToday} hoàn thành
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold">{todayProgress}%</span>
          <span className="text-xs text-indigo-200">
            {todayProgress === 100
              ? 'Tuyệt đỉnh! Đã hoàn tất ngày hôm nay'
              : todayProgress >= 50
              ? 'Rất tốt! Bạn đã đi được nửa chặng đường'
              : 'Hãy bắt đầu với công việc quan trọng nhất'}
          </span>
        </div>

        <ProgressBar
          progress={todayProgress}
          heightClass="h-2.5"
          colorClass="bg-emerald-400"
          bgClass="bg-black/25"
        />

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/15 text-xs">
          <div
            onClick={onNavigateToHierarchy}
            className="cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="text-indigo-200 flex items-center gap-1">
              <TrendingUp size={12} /> Tiến độ tháng:
            </span>
            <span className="font-bold">{monthProgress}%</span>
          </div>
          <div
            onClick={onNavigateToHierarchy}
            className="cursor-pointer hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="text-indigo-200 flex items-center gap-1">
              <Target size={12} /> Mục tiêu tuần:
            </span>
            <span className="font-bold">{weeklyGoalsCount} mục tiêu</span>
          </div>
        </div>
      </div>
    </div>
  );
};
