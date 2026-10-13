import React, { useState, useEffect } from 'react';
import { useGoal } from '../../context/GoalContext';
import { ModalWrapper } from '../common/ModalWrapper';
import { GoalStatus } from '../../types';

export interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalType: 'YEARLY' | 'MONTHLY' | 'WEEKLY';
  goalId: string;
  initialTitle: string;
  initialDescription?: string;
  initialProgress: number;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({
  isOpen,
  onClose,
  goalType,
  goalId,
  initialTitle,
  initialDescription = '',
  initialProgress,
}) => {
  const { updateYearlyGoal, updateMonthlyGoal, updateWeeklyGoal } = useGoal();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription || '');
      setProgress(initialProgress);
    }
  }, [isOpen, initialTitle, initialDescription, initialProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const status: GoalStatus =
      progress >= 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';

    if (goalType === 'YEARLY') {
      updateYearlyGoal(goalId, {
        title: title.trim(),
        description: description.trim(),
        progress,
        status,
      });
    } else if (goalType === 'MONTHLY') {
      updateMonthlyGoal(goalId, {
        title: title.trim(),
        progress,
        status,
      });
    } else if (goalType === 'WEEKLY') {
      updateWeeklyGoal(goalId, {
        title: title.trim(),
        progress,
        status,
      });
    }

    onClose();
  };

  const getTypeName = () => {
    switch (goalType) {
      case 'YEARLY':
        return 'Mục Tiêu Năm';
      case 'MONTHLY':
        return 'Mục Tiêu Tháng';
      case 'WEEKLY':
        return 'Mục Tiêu Tuần';
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Chỉnh sửa ${getTypeName()}`}
      icon={<span className="text-base">✏️</span>}
      maxWidthClass="max-w-md"
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Tiêu đề *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {goalType === 'YEARLY' && (
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Mô tả &amp; Định hướng
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            <span>Tiến độ hoàn thành:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
