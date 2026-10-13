import React from 'react';
import { useGoal } from '../context/GoalContext';
import { TrendingUp, Award, CheckCircle, Clock, Zap, Calendar, Target } from 'lucide-react';

export const StatisticsScreen: React.FC = () => {
  const { yearlyGoals, monthlyGoals, weeklyGoals, dailyTasks } = useGoal();

  // Metrics
  const totalTasks = dailyTasks.length;
  const completedTasks = dailyTasks.filter((t) => t.isCompleted).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalYearly = yearlyGoals.length;
  const avgYearlyProgress =
    totalYearly > 0
      ? Math.round(yearlyGoals.reduce((acc, g) => acc + g.progress, 0) / totalYearly)
      : 0;

  const totalWeekly = weeklyGoals.length;
  const completedWeekly = weeklyGoals.filter((w) => w.progress >= 100).length;

  // Day of week activity simulation
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const dayValues = [85, 90, 75, 100, 60, 80, 70]; // Mock activity %

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
            <span>Báo cáo &amp; Phân tích</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Thống Kê Hiệu Suất (Visual Charts)
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12">
        {/* Top 4 KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Target size={16} />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Tiến độ Năm trung bình
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {avgYearlyProgress}%
            </div>
            <div className="mt-1.5 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${avgYearlyProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckCircle size={16} />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Tỷ lệ xong Daily Task
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {taskCompletionRate}%
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400">
              {completedTasks}/{totalTasks} công việc đã xong
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <Zap size={16} />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Mục tiêu Tuần đã xong
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {completedWeekly}/{totalWeekly}
            </div>
            <div className="mt-1.5 text-[10px] text-slate-400">
              Chỉ số kỷ luật hàng tuần
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
              <Award size={16} />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Huy hiệu Kỷ luật
              </span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
              🔥 Master Planner
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Duy trì chuỗi 5 ngày liên tục
            </div>
          </div>
        </div>

        {/* Visual Chart 1: Tiến độ từng Mục tiêu Năm (SVG Horizontal Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-indigo-600" />
            Biểu đồ Tiến Độ Mục Tiêu Năm (Yearly Breakdown)
          </h3>

          <div className="space-y-3">
            {yearlyGoals.map((yg, idx) => {
              const colors = ['bg-indigo-600', 'bg-emerald-500', 'bg-violet-600', 'bg-amber-500'];
              const colorClass = colors[idx % colors.length];

              return (
                <div key={yg.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
                      {yg.title}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white ml-2">
                      {yg.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                      style={{ width: `${yg.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Chart 2: Tần suất hoàn thành theo ngày trong tuần (Column Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-600" />
              Năng suất hoàn thành trong tuần (Velocity)
            </h3>
            <span className="text-[11px] text-slate-500">7 ngày qua</span>
          </div>

          <div className="flex items-end justify-between h-32 pt-4 px-2 border-b border-slate-200 dark:border-slate-800">
            {days.map((day, i) => {
              const val = dayValues[i];
              const isToday = i === 1; // Tuesday
              return (
                <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {val}%
                  </span>
                  <div className="w-7 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-24 flex items-end p-0.5 overflow-hidden">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      isToday
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2.5">
            💡 Bạn có hiệu suất cao nhất vào Thứ Ba và Thứ Năm!
          </p>
        </div>
      </div>
    </div>
  );
};
