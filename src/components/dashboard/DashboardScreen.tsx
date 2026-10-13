import React, { useState } from 'react';
import { useGoal } from '../../context/GoalContext';
import { Plus, CheckCircle2 } from 'lucide-react';
import { AddTaskModal } from '../modals';
import { DashboardHeader } from './DashboardHeader';
import { TodayProgressCard } from './TodayProgressCard';
import { DailyTaskItem } from './DailyTaskItem';

export interface DashboardScreenProps {
  onNavigateToHierarchy: () => void;
  onOpenPremium: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToHierarchy,
  onOpenPremium,
}) => {
  const { dailyTasks, toggleDailyTask, deleteDailyTask, isPremium, monthlyGoals, weeklyGoals } =
    useGoal();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = dailyTasks.filter((t) => t.date === todayStr);

  const completedToday = todayTasks.filter((t) => t.isCompleted).length;
  const totalToday = todayTasks.length;
  const todayProgress = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Active month average progress
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthGoals = monthlyGoals.filter((m) => m.month === currentMonth);
  const monthProgress =
    currentMonthGoals.length > 0
      ? Math.round(currentMonthGoals.reduce((a, b) => a + b.progress, 0) / currentMonthGoals.length)
      : 55;

  // Filtered tasks
  const filteredTasks = todayTasks.filter((t) => {
    if (filter === 'PENDING') return !t.isCompleted;
    if (filter === 'COMPLETED') return t.isCompleted;
    return true;
  });

  const streakDays = completedToday > 0 ? 5 : 4;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* 1. Header Subcomponent */}
      <DashboardHeader
        streakDays={streakDays}
        isPremium={isPremium}
        onOpenPremium={onOpenPremium}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* 2. Today Progress Card Subcomponent */}
        <TodayProgressCard
          todayProgress={todayProgress}
          completedToday={completedToday}
          totalToday={totalToday}
          monthProgress={monthProgress}
          weeklyGoalsCount={weeklyGoals.length}
          onNavigateToHierarchy={onNavigateToHierarchy}
        />

        {/* Task Filters */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Việc cần làm hôm nay
            </h2>
            <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-medium">
              {todayTasks.length}
            </span>
          </div>

          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-xl text-[11px]">
            {(['ALL', 'PENDING', 'COMPLETED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  filter === mode
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {mode === 'ALL' ? 'Tất cả' : mode === 'PENDING' ? 'Chưa làm' : 'Đã xong'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Task List with DailyTaskItem Subcomponents */}
        <div className="space-y-2.5 pb-16">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {filter === 'ALL'
                  ? 'Chưa có việc nào hôm nay'
                  : filter === 'PENDING'
                  ? 'Bạn đã hoàn tất tất cả việc hôm nay! 🎉'
                  : 'Chưa có việc nào được hoàn thành'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Bấm nút (+) bên dưới để thêm việc mới liên kết với Mục tiêu Tuần.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <DailyTaskItem
                key={task.id}
                task={task}
                linkedWeekly={weeklyGoals.find((w) => w.id === task.weeklyGoalId)}
                onToggle={toggleDailyTask}
                onDelete={deleteDailyTask}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="absolute right-5 bottom-20 z-20 w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-all"
        title="Thêm việc hôm nay"
      >
        <Plus size={24} />
      </button>

      {/* AdMob Bottom Banner (Free Tier) */}
      {!isPremium && (
        <div className="bg-slate-200 dark:bg-slate-800/90 border-t border-slate-300 dark:border-slate-700 px-3 py-1.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-mono text-[9px] font-bold px-1 py-0.2 rounded-xs">
              AdMob
            </span>
            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-[220px]">
              Ứng dụng học ngoại ngữ số 1 cho người bận rộn
            </span>
          </div>
          <button
            onClick={onOpenPremium}
            className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline shrink-0"
          >
            Tắt QC
          </button>
        </div>
      )}

      {/* Modal */}
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
