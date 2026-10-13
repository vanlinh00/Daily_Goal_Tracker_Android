import React, { useState } from 'react';
import { useGoal } from '../../context/GoalContext';
import { Plus, Info } from 'lucide-react';
import { AddGoalModal, AddTaskModal, EditGoalModal } from '../modals';
import { YearlyGoalCard } from './YearlyGoalCard';
import { YearlyGoal } from '../../types';

export const HierarchyScreen: React.FC = () => {
  const {
    yearlyGoals,
    monthlyGoals,
    weeklyGoals,
    dailyTasks,
    deleteYearlyGoal,
    deleteMonthlyGoal,
    deleteWeeklyGoal,
    toggleDailyTask,
    deleteDailyTask,
  } = useGoal();

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [expandedYearIds, setExpandedYearIds] = useState<Record<string, boolean>>({
    'yg-1': true,
  });
  const [expandedMonthIds, setExpandedMonthIds] = useState<Record<string, boolean>>({
    'mg-1': true,
  });
  const [expandedWeekIds, setExpandedWeekIds] = useState<Record<string, boolean>>({
    'wg-1': true,
  });

  // Modal states
  const [addGoalModal, setAddGoalModal] = useState<{
    isOpen: boolean;
    type: 'YEARLY' | 'MONTHLY' | 'WEEKLY';
    parentId?: string;
    parentTitle?: string;
  }>({
    isOpen: false,
    type: 'YEARLY',
  });

  const [editGoalModal, setEditGoalModal] = useState<{
    isOpen: boolean;
    goalType: 'YEARLY' | 'MONTHLY' | 'WEEKLY';
    goalId: string;
    title: string;
    description?: string;
    progress: number;
  }>({
    isOpen: false,
    goalType: 'YEARLY',
    goalId: '',
    title: '',
    progress: 0,
  });

  const [addTaskModalWeeklyId, setAddTaskModalWeeklyId] = useState<string | null>(null);

  const toggleYear = (id: string) => {
    setExpandedYearIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMonth = (id: string) => {
    setExpandedMonthIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWeek = (id: string) => {
    setExpandedWeekIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredYearly = yearlyGoals.filter((y) => y.year === selectedYear);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
            <span>Top-Down Goal Setting</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Cây Mục Tiêu Phân Cấp
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100"
          >
            <option value={2025}>Năm 2025</option>
            <option value={2026}>Năm 2026</option>
            <option value={2027}>Năm 2027</option>
          </select>

          <button
            onClick={() =>
              setAddGoalModal({
                isOpen: true,
                type: 'YEARLY',
              })
            }
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Mục tiêu Năm</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Cascade Algorithm Explanation Card */}
        <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40 rounded-2xl flex items-start gap-3">
          <div className="p-1.5 bg-indigo-600 text-white rounded-lg shrink-0 mt-0.5">
            <Info size={15} />
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200">
              Cơ chế tự động tính % theo cấp bậc (Clean Roll-up Engine):
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Hoàn thành các <strong>Daily Tasks</strong> ➔ Cập nhật tiến độ <strong>Mục tiêu Tuần</strong> ➔ Tự động tính trung bình cho <strong>Mục tiêu Tháng</strong> ➔ Cập nhật % <strong>Mục tiêu Năm</strong> tương ứng.
            </p>
          </div>
        </div>

        {/* Tree List */}
        {filteredYearly.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-6">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Chưa có mục tiêu nào trong năm {selectedYear}
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Hãy đặt ra các mục tiêu lớn nhất trong năm để bắt đầu phân rã thành tháng &amp; tuần.
            </p>
            <button
              onClick={() =>
                setAddGoalModal({
                  isOpen: true,
                  type: 'YEARLY',
                })
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              + Tạo Mục Tiêu Năm Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            {filteredYearly.map((yearGoal) => (
              <YearlyGoalCard
                key={yearGoal.id}
                yearGoal={yearGoal}
                months={monthlyGoals.filter((m) => m.yearlyGoalId === yearGoal.id)}
                weeklyGoals={weeklyGoals}
                dailyTasks={dailyTasks}
                isYearExpanded={!!expandedYearIds[yearGoal.id]}
                expandedMonthIds={expandedMonthIds}
                expandedWeekIds={expandedWeekIds}
                onToggleYear={toggleYear}
                onToggleMonth={toggleMonth}
                onToggleWeek={toggleWeek}
                onAddMonth={(yId, yTitle) =>
                  setAddGoalModal({
                    isOpen: true,
                    type: 'MONTHLY',
                    parentId: yId,
                    parentTitle: yTitle,
                  })
                }
                onDeleteYear={deleteYearlyGoal}
                onAddWeek={(mId, mTitle) =>
                  setAddGoalModal({
                    isOpen: true,
                    type: 'WEEKLY',
                    parentId: mId,
                    parentTitle: mTitle,
                  })
                }
                onDeleteMonth={deleteMonthlyGoal}
                onAddTask={(wId) => setAddTaskModalWeeklyId(wId)}
                onDeleteWeek={deleteWeeklyGoal}
                onToggleTask={toggleDailyTask}
                onDeleteTask={deleteDailyTask}
                onEditYear={(goal: YearlyGoal) =>
                  setEditGoalModal({
                    isOpen: true,
                    goalType: 'YEARLY',
                    goalId: goal.id,
                    title: goal.title,
                    description: goal.description,
                    progress: goal.progress,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Goal Creation Modals */}
      <AddGoalModal
        isOpen={addGoalModal.isOpen}
        onClose={() => setAddGoalModal({ isOpen: false, type: 'YEARLY' })}
        type={addGoalModal.type}
        parentId={addGoalModal.parentId}
        parentTitle={addGoalModal.parentTitle}
      />

      {/* Goal Edit Modal */}
      <EditGoalModal
        isOpen={editGoalModal.isOpen}
        onClose={() => setEditGoalModal((prev) => ({ ...prev, isOpen: false }))}
        goalType={editGoalModal.goalType}
        goalId={editGoalModal.goalId}
        initialTitle={editGoalModal.title}
        initialDescription={editGoalModal.description}
        initialProgress={editGoalModal.progress}
      />

      {/* Add Task directly to Week */}
      <AddTaskModal
        isOpen={!!addTaskModalWeeklyId}
        onClose={() => setAddTaskModalWeeklyId(null)}
        defaultWeeklyGoalId={addTaskModalWeeklyId}
      />
    </div>
  );
};
