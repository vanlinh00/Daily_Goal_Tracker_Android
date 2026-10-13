import React from 'react';
import { MonthlyGoal, WeeklyGoal, DailyTask } from '../../types';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { GoalStatusBadge } from './GoalStatusBadge';
import { WeeklyGoalCard } from './WeeklyGoalCard';

export interface MonthlyGoalCardProps {
  monthGoal: MonthlyGoal;
  weeks: WeeklyGoal[];
  dailyTasks: DailyTask[];
  isMonthExpanded: boolean;
  expandedWeekIds: Record<string, boolean>;
  onToggleMonth: (id: string) => void;
  onToggleWeek: (id: string) => void;
  onAddWeek: (monthId: string, monthTitle: string) => void;
  onDeleteMonth: (id: string) => void;
  onAddTask: (weeklyGoalId: string) => void;
  onDeleteWeek: (id: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const MonthlyGoalCard: React.FC<MonthlyGoalCardProps> = ({
  monthGoal,
  weeks,
  dailyTasks,
  isMonthExpanded,
  expandedWeekIds,
  onToggleMonth,
  onToggleWeek,
  onAddWeek,
  onDeleteMonth,
  onAddTask,
  onDeleteWeek,
  onToggleTask,
  onDeleteTask,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-xs">
      <div
        onClick={() => onToggleMonth(monthGoal.id)}
        className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-0.5 text-violet-600 dark:text-violet-400">
              {isMonthExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-[10px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded-sm">
                  Tháng {monthGoal.month}
                </span>
                <GoalStatusBadge status={monthGoal.status} progress={monthGoal.progress} />
              </div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {monthGoal.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onAddWeek(monthGoal.id, monthGoal.title)}
              className="px-2 py-0.5 text-[10px] font-medium bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 hover:bg-violet-100 rounded-md flex items-center gap-0.5 transition-colors"
              title="Thêm mục tiêu tuần"
            >
              <Plus size={11} />
              <span>Tuần</span>
            </button>
            <button
              onClick={() => onDeleteMonth(monthGoal.id)}
              className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
              title="Xóa mục tiêu tháng"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Monthly Progress Bar */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${monthGoal.progress}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 shrink-0">
            {monthGoal.progress}%
          </span>
        </div>
      </div>

      {/* LEVEL 3: WEEKLY GOALS */}
      {isMonthExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-900/60 p-2.5 space-y-2.5 pl-5 border-l-4 border-l-violet-500/80">
          {weeks.length === 0 ? (
            <div className="text-center py-2 text-[11px] text-slate-500">
              Chưa có mục tiêu tuần nào.{' '}
              <button
                onClick={() => onAddWeek(monthGoal.id, monthGoal.title)}
                className="text-violet-600 dark:text-violet-400 font-semibold hover:underline"
              >
                + Thêm tuần
              </button>
            </div>
          ) : (
            weeks.map((weekGoal) => (
              <WeeklyGoalCard
                key={weekGoal.id}
                weekGoal={weekGoal}
                tasks={dailyTasks.filter((t) => t.weeklyGoalId === weekGoal.id)}
                isExpanded={!!expandedWeekIds[weekGoal.id]}
                onToggleExpand={onToggleWeek}
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
