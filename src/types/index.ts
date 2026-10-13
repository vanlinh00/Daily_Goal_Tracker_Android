export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface YearlyGoal {
  id: string;
  title: string;
  description: string;
  year: number;
  status: GoalStatus;
  progress: number; // 0 to 100
  createdAt: string;
}

export interface MonthlyGoal {
  id: string;
  yearlyGoalId: string;
  title: string;
  month: number; // 1 to 12
  year: number;
  status: GoalStatus;
  progress: number; // 0 to 100
  createdAt: string;
}

export interface WeeklyGoal {
  id: string;
  monthlyGoalId: string;
  title: string;
  weekNumber: number; // 1 to 52
  year: number;
  status: GoalStatus;
  progress: number; // 0 to 100
  createdAt: string;
}

export interface DailyTask {
  id: string;
  weeklyGoalId: string | null; // Nullable as per requirement
  title: string;
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
  reminderTime: string | null; // e.g. "08:30"
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface GoalifyBackupData {
  version: number;
  exportedAt: string;
  yearlyGoals: YearlyGoal[];
  monthlyGoals: MonthlyGoal[];
  weeklyGoals: WeeklyGoal[];
  dailyTasks: DailyTask[];
}

export interface PremiumState {
  isPremium: boolean;
  purchaseToken?: string;
  sku?: string;
  purchaseDate?: string;
}
