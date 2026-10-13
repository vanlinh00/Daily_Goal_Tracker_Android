import React, { useState } from 'react';
import { useGoal } from '../../context/GoalContext';
import { Clock } from 'lucide-react';
import { ModalWrapper } from '../common/ModalWrapper';

export interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWeeklyGoalId?: string | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  defaultWeeklyGoalId = null,
}) => {
  const { addDailyTask, weeklyGoals } = useGoal();
  const [title, setTitle] = useState('');
  const [weeklyGoalId, setWeeklyGoalId] = useState<string | null>(defaultWeeklyGoalId);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [hasReminder, setHasReminder] = useState(true);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDailyTask(
      title.trim(),
      date,
      weeklyGoalId || null,
      hasReminder ? reminderTime : null,
      priority
    );
    setTitle('');
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm việc cần làm hôm nay (Daily Task)"
      icon={<span className="text-base">📝</span>}
      maxWidthClass="max-w-md"
    >
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Nội dung công việc *
          </label>
          <input
            type="text"
            required
            placeholder="VD: Viết 1 bài luận Writing Task 2, chạy 5km..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Gắn vào Mục tiêu Tuần (Top-Down Relation)
          </label>
          <select
            value={weeklyGoalId || ''}
            onChange={(e) => setWeeklyGoalId(e.target.value || null)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">(Không gắn - Việc cá nhân độc lập)</option>
            {weeklyGoals.map((wg) => (
              <option key={wg.id} value={wg.id}>
                Tuần {wg.weekNumber}: {wg.title}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            💡 Hoàn thành task này sẽ tự động tăng % hoàn thành của Mục tiêu Tuần!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Ngày thực hiện
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Độ ưu tiên
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="LOW">Thấp (Low)</option>
              <option value="MEDIUM">Vừa (Medium)</option>
              <option value="HIGH">Cao (High 🔥)</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-indigo-500" />
              Nhắc nhở thông báo (AlarmManager/WorkManager)
            </span>
            <input
              type="checkbox"
              checked={hasReminder}
              onChange={(e) => setHasReminder(e.target.checked)}
              className="rounded-sm text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
          </div>
          {hasReminder && (
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          )}
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
            Lưu công việc
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
