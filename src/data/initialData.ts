import { DailyTask, MonthlyGoal, WeeklyGoal, YearlyGoal } from '../types';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_YEARLY_GOALS: YearlyGoal[] = [
  {
    id: 'yg-1',
    title: 'Chinh phục chứng chỉ IELTS 7.5 & Giao tiếp thành thạo',
    description: 'Nâng cao khả năng ngôn ngữ để mở rộng cơ hội nghề nghiệp quốc tế',
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 60,
    createdAt: `${currentYear}-01-01T00:00:00.000Z`,
  },
  {
    id: 'yg-2',
    title: 'Xây dựng quỹ tiết kiệm & đầu tư 200 Triệu VNĐ',
    description: 'Kỷ luật tài chính cá nhân, đầu tư quỹ ETF định kỳ hàng tháng',
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 45,
    createdAt: `${currentYear}-01-05T00:00:00.000Z`,
  },
  {
    id: 'yg-3',
    title: 'Sức khỏe dẻo dai - Chạy bộ 500km & Thể hình 70kg',
    description: 'Rèn luyện thể lực bền bỉ, duy trì chạy 3 buổi/tuần và ăn uống khoa học',
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 72,
    createdAt: `${currentYear}-01-10T00:00:00.000Z`,
  },
];

export const INITIAL_MONTHLY_GOALS: MonthlyGoal[] = [
  // For yg-1
  {
    id: 'mg-1',
    yearlyGoalId: 'yg-1',
    title: 'Hoàn thành 30 đề Writing Task 2 & Học 200 Collocations',
    month: currentMonth,
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 66,
    createdAt: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01T00:00:00.000Z`,
  },
  {
    id: 'mg-2',
    yearlyGoalId: 'yg-1',
    title: 'Luyện đề Listening Cam 18-19 đạt band 8.0',
    month: currentMonth === 12 ? 1 : currentMonth + 1,
    year: currentYear,
    status: 'NOT_STARTED',
    progress: 0,
    createdAt: `${currentYear}-02-01T00:00:00.000Z`,
  },
  // For yg-2
  {
    id: 'mg-3',
    yearlyGoalId: 'yg-2',
    title: 'Tiết kiệm 15 triệu VNĐ & Kiểm soát chi tiêu dưới 12 triệu',
    month: currentMonth,
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 50,
    createdAt: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01T00:00:00.000Z`,
  },
  // For yg-3
  {
    id: 'mg-4',
    yearlyGoalId: 'yg-3',
    title: 'Hoàn thành cự ly 45km chạy bộ trong tháng này',
    month: currentMonth,
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 80,
    createdAt: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01T00:00:00.000Z`,
  },
];

export const INITIAL_WEEKLY_GOALS: WeeklyGoal[] = [
  // For mg-1
  {
    id: 'wg-1',
    monthlyGoalId: 'mg-1',
    title: 'Viết 4 bài Writing Task 2 chủ đề Education & Environment',
    weekNumber: 41,
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 75,
    createdAt: `${currentYear}-10-01T00:00:00.000Z`,
  },
  {
    id: 'wg-2',
    monthlyGoalId: 'mg-1',
    title: 'Học 50 từ vựng nâng cao qua Anki Flashcards',
    weekNumber: 42,
    year: currentYear,
    status: 'NOT_STARTED',
    progress: 0,
    createdAt: `${currentYear}-10-08T00:00:00.000Z`,
  },
  // For mg-3
  {
    id: 'wg-3',
    monthlyGoalId: 'mg-3',
    title: 'Ghi chép thu chi 100% các bữa ăn & Chuyển 3.5tr vào quỹ tiết kiệm',
    weekNumber: 41,
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 50,
    createdAt: `${currentYear}-10-01T00:00:00.000Z`,
  },
  // For mg-4
  {
    id: 'wg-4',
    monthlyGoalId: 'mg-4',
    title: 'Chạy bộ 3 buổi (5km + 5km + 8km)',
    weekNumber: 41,
    year: currentYear,
    status: 'IN_PROGRESS',
    progress: 66,
    createdAt: `${currentYear}-10-01T00:00:00.000Z`,
  },
];

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'dt-1',
    weeklyGoalId: 'wg-1',
    title: 'Viết bài luận Writing Task 2: "Impact of AI on Education"',
    date: todayStr,
    isCompleted: true,
    reminderTime: '08:00',
    priority: 'HIGH',
    createdAt: `${todayStr}T08:00:00.000Z`,
  },
  {
    id: 'dt-2',
    weeklyGoalId: 'wg-1',
    title: 'Review và sửa lỗi ngữ pháp bài luận cùng từ điển Oxford',
    date: todayStr,
    isCompleted: false,
    reminderTime: '14:30',
    priority: 'MEDIUM',
    createdAt: `${todayStr}T09:00:00.000Z`,
  },
  {
    id: 'dt-3',
    weeklyGoalId: 'wg-4',
    title: 'Chạy bộ buổi chiều 5km công viên (pace 6:30)',
    date: todayStr,
    isCompleted: true,
    reminderTime: '17:30',
    priority: 'HIGH',
    createdAt: `${todayStr}T07:00:00.000Z`,
  },
  {
    id: 'dt-4',
    weeklyGoalId: 'wg-3',
    title: 'Cập nhật sổ thu chi hôm nay và chuyển tiền tiết kiệm',
    date: todayStr,
    isCompleted: false,
    reminderTime: '21:00',
    priority: 'LOW',
    createdAt: `${todayStr}T10:00:00.000Z`,
  },
  {
    id: 'dt-5',
    weeklyGoalId: null, // standalone task
    title: 'Đọc 15 trang sách "Atomic Habits - Thay đổi tí hon"',
    date: todayStr,
    isCompleted: false,
    reminderTime: '22:00',
    priority: 'MEDIUM',
    createdAt: `${todayStr}T11:00:00.000Z`,
  },
];
