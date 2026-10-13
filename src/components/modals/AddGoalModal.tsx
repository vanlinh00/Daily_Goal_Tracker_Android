import React, { useState } from 'react';
import { useGoal } from '../../context/GoalContext';
import { ModalWrapper } from '../common/ModalWrapper';

export interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'YEARLY' | 'MONTHLY' | 'WEEKLY';
  parentId?: string;
  parentTitle?: string;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  type,
  parentId,
  parentTitle,
}) => {
  const { addYearlyGoal, addMonthlyGoal, addWeeklyGoal } = useGoal();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [weekNumber, setWeekNumber] = useState(41);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === 'YEARLY') {
      addYearlyGoal(title.trim(), description.trim(), Number(year));
    } else if (type === 'MONTHLY' && parentId) {
      addMonthlyGoal(parentId, title.trim(), Number(month), Number(year));
    } else if (type === 'WEEKLY' && parentId) {
      addWeeklyGoal(parentId, title.trim(), Number(weekNumber), Number(year));
    }

    setTitle('');
    setDescription('');
    onClose();
  };

  const getTitleLabel = () => {
    switch (type) {
      case 'YEARLY':
        return 'Tạo Mục Tiêu Năm (Yearly Goal)';
      case 'MONTHLY':
        return `Tạo Mục Tiêu Tháng (cho: ${parentTitle || 'Năm'})`;
      case 'WEEKLY':
        return `Tạo Mục Tiêu Tuần (cho: ${parentTitle || 'Tháng'})`;
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={getTitleLabel()}
      icon={<span className="text-base">🎯</span>}
      maxWidthClass="max-w-md"
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Tiêu đề mục tiêu *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Đạt IELTS 7.5, Tiết kiệm 200tr, Chạy bộ 500km..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        </div>

        {type === 'YEARLY' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Mô tả &amp; Định hướng
              </label>
              <textarea
                rows={2}
                placeholder="Lý do tại sao mục tiêu này quan trọng và kết quả mong đợi..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Năm thực hiện
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </>
        )}

        {type === 'MONTHLY' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Tháng (1 - 12)
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Năm
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}

        {type === 'WEEKLY' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Tuần số (1 - 52)
              </label>
              <input
                type="number"
                min={1}
                max={52}
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Năm
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        )}

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
            Tạo mục tiêu
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
