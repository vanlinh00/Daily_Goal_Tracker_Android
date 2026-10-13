import React from 'react';
import { YearlyGoal, MonthlyGoal, WeeklyGoal, DailyTask } from '../../types';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { GoalStatusBadge } from './GoalStatusBadge';
import { MonthlyGoalCard } from './MonthlyGoalCard';

export interface YearlyGoalCardProps {
  yearGoal: YearlyGoal;
  months: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
  isYearExpanded: boolean;
  expandedMonthIds: Record<string, boolean>;
  expandedWeekIds: Record<string, boolean>;
  onToggleYear: (id: string) => void;
  onToggleMonth: (id: string) => void;
  onToggleWeek: (id: string) => void;
  onAddMonth: (yearlyId: string, yearlyTitle: string) => void;
  onDeleteYear: (id: string) => void;
  onAddWeek: (monthId: string, monthTitle: string) => void;
  onDeleteMonth: (id: string) => void;
  onAddTask: (weeklyGoalId: string) => void;
  onDeleteWeek: (id: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditYear?: (goal: YearlyGoal) => void;
}

export const YearlyGoalCard: React.FC<YearlyGoalCardProps> = ({
  yearGoal,
  months,
  weeklyGoals,
  dailyTasks,
  isYearExpanded,
  expandedMonthIds,
  expandedWeekIds,
  onToggleYear,
  onToggleMonth,
  onToggleWeek,
  onAddMonth,
  onDeleteYear,
  onAddWeek,
  onDeleteMonth,
  onAddTask,
  onDeleteWeek,
  onToggleTask,
  onDeleteTask,
  onEditYear,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all">
      {/* LEVEL 1: YEARLY GOAL HEADER */}
      <div
        onClick={() => onToggleYear(yearGoal.id)}
        className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="mt-0.5 text-indigo-600 dark:text-indigo-400">
              {isYearExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md">
                  Mục tiêu Năm {yearGoal.year}
                </span>
                <GoalStatusBadge status={yearGoal.status} progress={yearGoal.progress} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {yearGoal.title}
              </h3>
              {yearGoal.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {yearGoal.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {onEditYear && (
              <button
                onClick={() => onEditYear(yearGoal)}
                className="text-slate-400 hover:text-indigo-500 p-1.5 rounded-lg transition-colors"
                title="Chỉnh sửa mục tiêu năm"
              >
                <Edit2 size={13} />
              </button>
            )}
            <button
              onClick={() => onAddMonth(yearGoal.id, yearGoal.title)}
              className="px-2 py-1 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg flex items-center gap-1 transition-colors"
              title="Thêm mục tiêu tháng"
            >
              <Plus size={12} />
              <span>Tháng</span>
            </button>
            <button
              onClick={() => onDeleteYear(yearGoal.id)}
              className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
              title="Xóa mục tiêu năm"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Yearly Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 text-[11px]">
              Tiến độ tổng quát ({months.length} mục tiêu tháng)
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
              {yearGoal.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${yearGoal.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* LEVEL 2: MONTHLY GOALS */}
      {isYearExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 p-3 space-y-3 pl-6 border-l-4 border-l-indigo-500/80">
          {months.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500">
              Chưa có mục tiêu tháng nào.{' '}
              <button
                onClick={() => onAddMonth(yearGoal.id, yearGoal.title)}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                + Thêm mục tiêu tháng
              </button>
            </div>
          ) : (
            months.map((monthGoal) => (
              <MonthlyGoalCard
                key={monthGoal.id}
                monthGoal={monthGoal}
                weeks={weeklyGoals.filter((w) => w.monthlyGoalId === monthGoal.id)}
                dailyTasks={dailyTasks}
                isMonthExpanded={!!expandedMonthIds[monthGoal.id]}
                expandedWeekIds={expandedWeekIds}
                onToggleMonth={onToggleMonth}
                onToggleWeek={onToggleWeek}
                onAddWeek={onAddWeek}
                onDeleteMonth={onDeleteMonth}
                onAddTask={onAddTask}
                onDeleteWeek={onDeleteWeek}
                onToggleTask={onToggleTask}
                onDeleteTask={onDeleteTask}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
