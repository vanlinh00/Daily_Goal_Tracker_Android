import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { DailyTask, GoalifyBackupData, MonthlyGoal, WeeklyGoal, YearlyGoal } from '../types';
import {
  INITIAL_DAILY_TASKS,
  INITIAL_MONTHLY_GOALS,
  INITIAL_WEEKLY_GOALS,
  INITIAL_YEARLY_GOALS,
} from '../data/initialData';

interface GoalContextType {
  yearlyGoals: YearlyGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
  isPremium: boolean;
  showInterstitial: boolean;
  notificationEnabled: boolean;
  activeInterstitialReason: string;

  // CRUD & Actions
  addYearlyGoal: (title: string, description: string, year: number) => void;
  updateYearlyGoal: (id: string, updates: Partial<YearlyGoal>) => void;
  deleteYearlyGoal: (id: string) => void;

  addMonthlyGoal: (yearlyGoalId: string, title: string, month: number, year: number) => void;
  updateMonthlyGoal: (id: string, updates: Partial<MonthlyGoal>) => void;
  deleteMonthlyGoal: (id: string) => void;

  addWeeklyGoal: (monthlyGoalId: string, title: string, weekNumber: number, year: number) => void;
  updateWeeklyGoal: (id: string, updates: Partial<WeeklyGoal>) => void;
  deleteWeeklyGoal: (id: string) => void;

  addDailyTask: (title: string, date: string, weeklyGoalId?: string | null, reminderTime?: string | null, priority?: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  toggleDailyTask: (id: string) => void;
  deleteDailyTask: (id: string) => void;

  // Monetization & Ads
  dismissInterstitial: () => void;
  upgradeToPremium: () => void;
  togglePremiumMock: (value: boolean) => void;
  triggerManualInterstitial: () => void;

  // Backup & Reset
  exportData: () => void;
  importData: (jsonData: string) => boolean;
  resetData: () => void;
  setNotificationEnabled: (val: boolean) => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

const STORAGE_KEY_YEARLY = 'goalify_yearly_goals';
const STORAGE_KEY_MONTHLY = 'goalify_monthly_goals';
const STORAGE_KEY_WEEKLY = 'goalify_weekly_goals';
const STORAGE_KEY_TASKS = 'goalify_daily_tasks';
const STORAGE_KEY_PREMIUM = 'goalify_premium_status';
const STORAGE_KEY_NOTIFS = 'goalify_notifications';

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [yearlyGoals, setYearlyGoals] = useState<YearlyGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_YEARLY);
    return saved ? JSON.parse(saved) : INITIAL_YEARLY_GOALS;
  });

  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MONTHLY);
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_GOALS;
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WEEKLY);
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_GOALS;
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_TASKS;
  });

  const [isPremium, setIsPremium] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREMIUM);
    return saved === 'true';
  });

  const [notificationEnabled, setNotificationEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return saved !== 'false';
  });

  const [showInterstitial, setShowInterstitial] = useState(false);
  const [activeInterstitialReason, setActiveInterstitialReason] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_YEARLY, JSON.stringify(yearlyGoals));
  }, [yearlyGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MONTHLY, JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WEEKLY, JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREMIUM, String(isPremium));
  }, [isPremium]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, String(notificationEnabled));
  }, [notificationEnabled]);

  // Trigger celebration & optional AdMob Interstitial
  const celebrateMilestone = (reason: string) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (!isPremium) {
      setTimeout(() => {
        setActiveInterstitialReason(reason);
        setShowInterstitial(true);
      }, 700);
    }
  };

  /**
   * RECALCULATE PROGRESS CASCADE:
   * Tasks -> Weekly Goal -> Monthly Goal -> Yearly Goal
   */
  const recalculateFromTasks = (
    updatedTasks: DailyTask[],
    currentWeekly: WeeklyGoal[],
    currentMonthly: MonthlyGoal[],
    currentYearly: YearlyGoal[]
  ) => {
    // 1. Recalculate each weekly goal
    const nextWeekly = currentWeekly.map((wg) => {
      const linkedTasks = updatedTasks.filter((t) => t.weeklyGoalId === wg.id);
      if (linkedTasks.length === 0) return wg;
      const completedCount = linkedTasks.filter((t) => t.isCompleted).length;
      const newProgress = Math.round((completedCount / linkedTasks.length) * 100);
      const newStatus =
        newProgress >= 100 ? 'COMPLETED' : newProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      return {
        ...wg,
        progress: newProgress,
        status: newStatus as any,
      };
    });

    // 2. Recalculate each monthly goal based on its weekly goals
    const nextMonthly = currentMonthly.map((mg) => {
      const linkedWeeks = nextWeekly.filter((w) => w.monthlyGoalId === mg.id);
      if (linkedWeeks.length === 0) return mg;
      const totalProgress = linkedWeeks.reduce((acc, w) => acc + w.progress, 0);
      const newProgress = Math.round(totalProgress / linkedWeeks.length);
      const newStatus =
        newProgress >= 100 ? 'COMPLETED' : newProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      return {
        ...mg,
        progress: newProgress,
        status: newStatus as any,
      };
    });

    // 3. Recalculate each yearly goal based on its monthly goals
    const nextYearly = currentYearly.map((yg) => {
      const linkedMonths = nextMonthly.filter((m) => m.yearlyGoalId === yg.id);
      if (linkedMonths.length === 0) return yg;
      const totalProgress = linkedMonths.reduce((acc, m) => acc + m.progress, 0);
      const newProgress = Math.round(totalProgress / linkedMonths.length);
      const newStatus =
        newProgress >= 100 ? 'COMPLETED' : newProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
      return {
        ...yg,
        progress: newProgress,
        status: newStatus as any,
      };
    });

    return { nextWeekly, nextMonthly, nextYearly };
  };

  // Daily Tasks actions
  const addDailyTask = (
    title: string,
    date: string,
    weeklyGoalId: string | null = null,
    reminderTime: string | null = null,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM'
  ) => {
    const newTask: DailyTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      weeklyGoalId,
      title,
      date,
      isCompleted: false,
      reminderTime,
      priority,
      createdAt: new Date().toISOString(),
    };

    const nextTasks = [newTask, ...dailyTasks];
    setDailyTasks(nextTasks);

    if (weeklyGoalId) {
      const { nextWeekly, nextMonthly, nextYearly } = recalculateFromTasks(
        nextTasks,
        weeklyGoals,
        monthlyGoals,
        yearlyGoals
      );
      setWeeklyGoals(nextWeekly);
      setMonthlyGoals(nextMonthly);
      setYearlyGoals(nextYearly);
    }
  };

  const toggleDailyTask = (id: string) => {
    const taskToToggle = dailyTasks.find((t) => t.id === id);
    if (!taskToToggle) return;

    const nextCompleted = !taskToToggle.isCompleted;
    const nextTasks = dailyTasks.map((t) => (t.id === id ? { ...t, isCompleted: nextCompleted } : t));
    setDailyTasks(nextTasks);

    if (taskToToggle.weeklyGoalId) {
      const { nextWeekly, nextMonthly, nextYearly } = recalculateFromTasks(
        nextTasks,
        weeklyGoals,
        monthlyGoals,
        yearlyGoals
      );

      // Check if weekly or monthly or yearly became completed
      const targetWeekly = nextWeekly.find((w) => w.id === taskToToggle.weeklyGoalId);
      if (targetWeekly && targetWeekly.progress === 100 && nextCompleted) {
        celebrateMilestone(`Hoàn thành Mục tiêu Tuần: "${targetWeekly.title}"!`);
      }

      setWeeklyGoals(nextWeekly);
      setMonthlyGoals(nextMonthly);
      setYearlyGoals(nextYearly);
    }
  };

  const deleteDailyTask = (id: string) => {
    const taskToDelete = dailyTasks.find((t) => t.id === id);
    const nextTasks = dailyTasks.filter((t) => t.id !== id);
    setDailyTasks(nextTasks);

    if (taskToDelete?.weeklyGoalId) {
      const { nextWeekly, nextMonthly, nextYearly } = recalculateFromTasks(
        nextTasks,
        weeklyGoals,
        monthlyGoals,
        yearlyGoals
      );
      setWeeklyGoals(nextWeekly);
      setMonthlyGoals(nextMonthly);
      setYearlyGoals(nextYearly);
    }
  };

  // Yearly Goals actions
  const addYearlyGoal = (title: string, description: string, year: number) => {
    const newGoal: YearlyGoal = {
      id: `yg_${Date.now()}`,
      title,
      description,
      year,
      status: 'NOT_STARTED',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    setYearlyGoals([newGoal, ...yearlyGoals]);
  };

  const updateYearlyGoal = (id: string, updates: Partial<YearlyGoal>) => {
    setYearlyGoals(
      yearlyGoals.map((g) => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates };
        if (updated.progress === 100 && g.progress < 100) {
          celebrateMilestone(`Tuyệt vời! Bạn đã hoàn thành Mục tiêu Năm: "${updated.title}"!`);
        }
        return updated;
      })
    );
  };

  const deleteYearlyGoal = (id: string) => {
    setYearlyGoals(yearlyGoals.filter((g) => g.id !== id));
    // Cascade delete monthly goals
    const monthsToDelete = monthlyGoals.filter((m) => m.yearlyGoalId === id).map((m) => m.id);
    setMonthlyGoals(monthlyGoals.filter((m) => m.yearlyGoalId !== id));

    const weeksToDelete = weeklyGoals
      .filter((w) => monthsToDelete.includes(w.monthlyGoalId))
      .map((w) => w.id);
    setWeeklyGoals(weeklyGoals.filter((w) => !monthsToDelete.includes(w.monthlyGoalId)));

    // Unlink daily tasks
    setDailyTasks(
      dailyTasks.map((t) => (t.weeklyGoalId && weeksToDelete.includes(t.weeklyGoalId) ? { ...t, weeklyGoalId: null } : t))
    );
  };

  // Monthly Goals actions
  const addMonthlyGoal = (yearlyGoalId: string, title: string, month: number, year: number) => {
    const newGoal: MonthlyGoal = {
      id: `mg_${Date.now()}`,
      yearlyGoalId,
      title,
      month,
      year,
      status: 'NOT_STARTED',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    const nextMonthly = [...monthlyGoals, newGoal];
    setMonthlyGoals(nextMonthly);

    // Recalculate parent yearly goal
    const linkedMonths = nextMonthly.filter((m) => m.yearlyGoalId === yearlyGoalId);
    const avg = Math.round(linkedMonths.reduce((a, b) => a + b.progress, 0) / linkedMonths.length);
    setYearlyGoals(
      yearlyGoals.map((y) => (y.id === yearlyGoalId ? { ...y, progress: avg, status: avg > 0 ? 'IN_PROGRESS' : 'NOT_STARTED' } : y))
    );
  };

  const updateMonthlyGoal = (id: string, updates: Partial<MonthlyGoal>) => {
    const target = monthlyGoals.find((m) => m.id === id);
    if (!target) return;

    const nextMonthly = monthlyGoals.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setMonthlyGoals(nextMonthly);

    if (updates.progress === 100 && target.progress < 100) {
      celebrateMilestone(`Chúc mừng! Hoàn thành Mục tiêu Tháng: "${target.title}"!`);
    }

    // Roll up to yearly
    const linkedMonths = nextMonthly.filter((m) => m.yearlyGoalId === target.yearlyGoalId);
    const avg = Math.round(linkedMonths.reduce((a, b) => a + b.progress, 0) / linkedMonths.length);
    setYearlyGoals(
      yearlyGoals.map((y) =>
        y.id === target.yearlyGoalId
          ? {
              ...y,
              progress: avg,
              status: avg >= 100 ? 'COMPLETED' : avg > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
            }
          : y
      )
    );
  };

  const deleteMonthlyGoal = (id: string) => {
    const target = monthlyGoals.find((m) => m.id === id);
    const nextMonthly = monthlyGoals.filter((m) => m.id !== id);
    setMonthlyGoals(nextMonthly);

    const weeksToDelete = weeklyGoals.filter((w) => w.monthlyGoalId === id).map((w) => w.id);
    setWeeklyGoals(weeklyGoals.filter((w) => w.monthlyGoalId !== id));
    setDailyTasks(
      dailyTasks.map((t) => (t.weeklyGoalId && weeksToDelete.includes(t.weeklyGoalId) ? { ...t, weeklyGoalId: null } : t))
    );

    if (target) {
      const remaining = nextMonthly.filter((m) => m.yearlyGoalId === target.yearlyGoalId);
      const avg = remaining.length > 0 ? Math.round(remaining.reduce((a, b) => a + b.progress, 0) / remaining.length) : 0;
      setYearlyGoals(
        yearlyGoals.map((y) => (y.id === target.yearlyGoalId ? { ...y, progress: avg } : y))
      );
    }
  };

  // Weekly Goals actions
  const addWeeklyGoal = (monthlyGoalId: string, title: string, weekNumber: number, year: number) => {
    const newGoal: WeeklyGoal = {
      id: `wg_${Date.now()}`,
      monthlyGoalId,
      title,
      weekNumber,
      year,
      status: 'NOT_STARTED',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    const nextWeekly = [...weeklyGoals, newGoal];
    setWeeklyGoals(nextWeekly);

    // Roll up to monthly
    const targetMonth = monthlyGoals.find((m) => m.id === monthlyGoalId);
    if (targetMonth) {
      const linkedWeeks = nextWeekly.filter((w) => w.monthlyGoalId === monthlyGoalId);
      const avg = Math.round(linkedWeeks.reduce((a, b) => a + b.progress, 0) / linkedWeeks.length);
      updateMonthlyGoal(monthlyGoalId, { progress: avg });
    }
  };

  const updateWeeklyGoal = (id: string, updates: Partial<WeeklyGoal>) => {
    const target = weeklyGoals.find((w) => w.id === id);
    if (!target) return;

    const nextWeekly = weeklyGoals.map((w) => (w.id === id ? { ...w, ...updates } : w));
    setWeeklyGoals(nextWeekly);

    if (updates.progress === 100 && target.progress < 100) {
      celebrateMilestone(`Hoàn thành Mục tiêu Tuần: "${target.title}"!`);
    }

    // Roll up to monthly
    const linkedWeeks = nextWeekly.filter((w) => w.monthlyGoalId === target.monthlyGoalId);
    const avg = Math.round(linkedWeeks.reduce((a, b) => a + b.progress, 0) / linkedWeeks.length);
    updateMonthlyGoal(target.monthlyGoalId, { progress: avg });
  };

  const deleteWeeklyGoal = (id: string) => {
    const target = weeklyGoals.find((w) => w.id === id);
    const nextWeekly = weeklyGoals.filter((w) => w.id !== id);
    setWeeklyGoals(nextWeekly);
    setDailyTasks(dailyTasks.map((t) => (t.weeklyGoalId === id ? { ...t, weeklyGoalId: null } : t)));

    if (target) {
      const remaining = nextWeekly.filter((w) => w.monthlyGoalId === target.monthlyGoalId);
      const avg = remaining.length > 0 ? Math.round(remaining.reduce((a, b) => a + b.progress, 0) / remaining.length) : 0;
      updateMonthlyGoal(target.monthlyGoalId, { progress: avg });
    }
  };

  // Monetization & Ads
  const dismissInterstitial = () => {
    setShowInterstitial(false);
    setActiveInterstitialReason('');
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const togglePremiumMock = (val: boolean) => {
    setIsPremium(val);
  };

  const triggerManualInterstitial = () => {
    setActiveInterstitialReason('Mô phỏng hiển thị AdMob Interstitial Ad (Khi hoàn thành mục tiêu lớn)');
    setShowInterstitial(true);
  };

  // Backup & Import
  const exportData = () => {
    const payload: GoalifyBackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      yearlyGoals,
      monthlyGoals,
      weeklyGoals,
      dailyTasks,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goalify_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData) as GoalifyBackupData;
      if (parsed.yearlyGoals && parsed.monthlyGoals && parsed.weeklyGoals && parsed.dailyTasks) {
        setYearlyGoals(parsed.yearlyGoals);
        setMonthlyGoals(parsed.monthlyGoals);
        setWeeklyGoals(parsed.weeklyGoals);
        setDailyTasks(parsed.dailyTasks);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetData = () => {
    setYearlyGoals(INITIAL_YEARLY_GOALS);
    setMonthlyGoals(INITIAL_MONTHLY_GOALS);
    setWeeklyGoals(INITIAL_WEEKLY_GOALS);
    setDailyTasks(INITIAL_DAILY_TASKS);
    setIsPremium(false);
  };

  const setNotificationEnabled = (val: boolean) => {
    setNotificationEnabledState(val);
  };

  return (
    <GoalContext.Provider
      value={{
        yearlyGoals,
        monthlyGoals,
        weeklyGoals,
        dailyTasks,
        isPremium,
        showInterstitial,
        notificationEnabled,
        activeInterstitialReason,
        addYearlyGoal,
        updateYearlyGoal,
        deleteYearlyGoal,
        addMonthlyGoal,
        updateMonthlyGoal,
        deleteMonthlyGoal,
        addWeeklyGoal,
        updateWeeklyGoal,
        deleteWeeklyGoal,
        addDailyTask,
        toggleDailyTask,
        deleteDailyTask,
        dismissInterstitial,
        upgradeToPremium,
        togglePremiumMock,
        triggerManualInterstitial,
        exportData,
        importData,
        resetData,
        setNotificationEnabled,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (!context) throw new Error('useGoal must be used within GoalProvider');
  return context;
};
