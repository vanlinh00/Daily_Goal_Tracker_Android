import React from 'react';
import { WeeklyGoal, DailyTask } from '../../types';
import { ChevronDown, ChevronRight, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export interface WeeklyGoalCardProps {
  weekGoal: WeeklyGoal;
  tasks: DailyTask[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onAddTask: (weeklyGoalId: string) => void;
  onDeleteWeek: (id: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const WeeklyGoalCard: React.FC<WeeklyGoalCardProps> = ({
  weekGoal,
  tasks,
  isExpanded,
  onToggleExpand,
  onAddTask,
  onDeleteWeek,
  onToggleTask,
  onDeleteTask,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-2.5 shadow-xs">
      <div
        onClick={() => onToggleExpand(weekGoal.id)}
        className="cursor-pointer flex items-start justify-between gap-2"
      >
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <div className="mt-0.5 text-blue-500">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1 py-0.2 rounded-xs">
                Tuần {weekGoal.weekNumber}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                {weekGoal.progress}%
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {weekGoal.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onAddTask(weekGoal.id)}
            className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-md flex items-center gap-0.5 transition-colors"
            title="Thêm Daily Task cho tuần này"
          >
            <Plus size={10} />
            <span>Task</span>
          </button>
          <button
            onClick={() => onDeleteWeek(weekGoal.id)}
            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
            title="Xóa mục tiêu tuần"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* LEVEL 4: DAILY TASKS */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 pl-3 space-y-1.5 border-l-2 border-l-blue-400">
          {tasks.length === 0 ? (
            <p className="text-[10px] text-slate-400">
              Chưa có Daily Task nào gắn với tuần này.
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2 text-xs py-1 px-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/40"
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center gap-2 text-left flex-1 min-w-0"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={14} className="text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`truncate text-[11px] ${
                      task.isCompleted
                        ? 'line-through text-slate-400'
                        : 'text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    {task.title}
                  </span>
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
