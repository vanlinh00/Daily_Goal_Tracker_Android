import React from 'react';
import { GoalStatus } from '../../types';

export interface GoalStatusBadgeProps {
  status: GoalStatus;
  progress: number;
}

export const GoalStatusBadge: React.FC<GoalStatusBadgeProps> = ({ status, progress }) => {
  if (progress >= 100 || status === 'COMPLETED') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
        Hoàn thành
      </span>
    );
  }
  if (progress > 0 || status === 'IN_PROGRESS') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
        Đang thực hiện ({progress}%)
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      Chưa bắt đầu
    </span>
  );
};
