import React from 'react';
import { DailyTask, WeeklyGoal } from '../../types';
import { CheckCircle2, Circle, Clock, Target, Trash2 } from 'lucide-react';

export interface DailyTaskItemProps {
  task: DailyTask;
  linkedWeekly?: WeeklyGoal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DailyTaskItem: React.FC<DailyTaskItemProps> = ({
  task,
  linkedWeekly,
  onToggle,
  onDelete,
}) => {
  return (
    <div
      className={`group bg-white dark:bg-slate-900 rounded-xl p-3.5 border transition-all duration-200 flex items-start gap-3 shadow-xs hover:shadow-md ${
        task.isCompleted
          ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Checkbox Button */}
      <button
        onClick={() => onToggle(task.id)}
        className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
        aria-label={task.isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        {task.isCompleted ? (
          <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
        ) : (
          <Circle size={20} className="hover:scale-105 transition-transform" />
        )}
      </button>

      {/* Task Info */}
      <div className="flex-1 min-w-0" onClick={() => onToggle(task.id)}>
        <p
          className={`text-sm font-medium cursor-pointer transition-colors ${
            task.isCompleted
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          {task.title}
        </p>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
          {linkedWeekly && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium">
              <Target size={10} />
              <span>{linkedWeekly.title}</span>
            </span>
          )}

          {task.reminderTime && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-medium">
              <Clock size={10} />
              <span>{task.reminderTime}</span>
            </span>
          )}

          {task.priority === 'HIGH' && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-medium">
              Ưu tiên cao
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-opacity shrink-0"
        title="Xóa công việc"
        aria-label="Xóa công việc"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
};
