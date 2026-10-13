import React from 'react';
import { Layers, Database, ArrowRight, Shield, Zap, Sparkles, Code2, Cpu } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-100 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Layers size={14} /> Clean Architecture &amp; Room Database Design
        </div>
        <h1 className="text-xl font-bold text-white mt-1">
          Kiến Trúc Kỹ Thuật Ứng Dụng "Goalify" (Android Native)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Thiết kế chuẩn Clean Architecture + MVVM + UDF + Room Database + Hilt DI + Offline First
        </p>
      </div>

      {/* 3-Tier Clean Architecture Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Cpu size={16} /> 1. Presentation Layer
          </div>
          <p className="text-xs text-slate-300">
            Jetpack Compose Material 3 UI không lưu giữ trạng thái riêng.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong>DashboardScreen</strong>, <strong>HierarchyScreen</strong></li>
            <li><strong>DashboardViewModel</strong> (@HiltViewModel)</li>
            <li><strong>StateFlow&lt;DashboardUiState&gt;</strong> (UDF)</li>
            <li><strong>DashboardUiEvent</strong> (User Intents)</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Zap size={16} /> 2. Domain Layer (Pure Kotlin)
          </div>
          <p className="text-xs text-slate-300">
            Chứa Business Rules độc lập hoàn toàn với Android framework.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong>GoalRepository</strong> (Interface)</li>
            <li><strong>CalculateGoalProgressUseCase</strong></li>
            <li><strong>GetTodayDashboardDataUseCase</strong></li>
            <li>Pure Domain Models (không phụ thuộc Room/UI)</li>
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Database size={16} /> 3. Data Layer (Offline Room)
          </div>
          <p className="text-xs text-slate-300">
            Lưu trữ offline trong SQLite thông qua Room ORM.
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong>GoalDao</strong> (Reactive Kotlin Flow queries)</li>
            <li><strong>AppDatabase</strong> (@Database, TypeConverters)</li>
            <li><strong>GoalRepositoryImpl</strong></li>
            <li>Cascade Rollup Trigger / Transaction</li>
          </ul>
        </div>
      </div>

      {/* Room Database Schema Diagram */}
      <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database size={16} className="text-indigo-400" />
          Sơ đồ Thực thể Quan hệ Room Database (1-N Relations)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Yearly */}
          <div className="p-3 bg-slate-900 rounded-xl border border-indigo-500/40">
            <div className="font-bold text-indigo-400 text-sm mb-1">YearlyGoalEntity</div>
            <div className="text-[11px] font-mono text-slate-400 space-y-1">
              <p>• <strong>id</strong>: Long (PK)</p>
              <p>• title: String</p>
              <p>• year: Int</p>
              <p>• status: GoalStatus</p>
              <p>• progress: Float (0..100)</p>
            </div>
          </div>

          {/* Monthly */}
          <div className="p-3 bg-slate-900 rounded-xl border border-violet-500/40">
            <div className="font-bold text-violet-400 text-sm mb-1">MonthlyGoalEntity</div>
            <div className="text-[11px] font-mono text-slate-400 space-y-1">
              <p>• <strong>id</strong>: Long (PK)</p>
              <p>• <strong>yearlyGoalId</strong>: Long (FK)</p>
              <p>• month: Int (1..12)</p>
              <p>• progress: Float</p>
              <p className="text-amber-400 text-[10px]">CASCADE ON DELETE</p>
            </div>
          </div>

          {/* Weekly */}
          <div className="p-3 bg-slate-900 rounded-xl border border-blue-500/40">
            <div className="font-bold text-blue-400 text-sm mb-1">WeeklyGoalEntity</div>
            <div className="text-[11px] font-mono text-slate-400 space-y-1">
              <p>• <strong>id</strong>: Long (PK)</p>
              <p>• <strong>monthlyGoalId</strong>: Long (FK)</p>
              <p>• weekNumber: Int (1..52)</p>
              <p>• progress: Float</p>
              <p className="text-amber-400 text-[10px]">CASCADE ON DELETE</p>
            </div>
          </div>

          {/* Daily Task */}
          <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/40">
            <div className="font-bold text-emerald-400 text-sm mb-1">DailyTaskEntity</div>
            <div className="text-[11px] font-mono text-slate-400 space-y-1">
              <p>• <strong>id</strong>: Long (PK)</p>
              <p>• <strong>weeklyGoalId</strong>: Long? (FK)</p>
              <p>• date: String (YYYY-MM-DD)</p>
              <p>• isCompleted: Boolean</p>
              <p>• reminderTime: String?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monetization & Background Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AdMob & Billing */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Sparkles size={16} /> Monetization (AdMob + Play Billing)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kiến trúc phân tách sạch:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong>AdMobManager</strong>: Preload và show Interstitial Ads khi người dùng đạt mốc hoàn thành mục tiêu lớn (Yearly/Monthly). Hiển thị Adaptive Banner Ad ở chân Dashboard.</li>
            <li><strong>BillingManager</strong>: Tích hợp Google Play Billing Client v6+. Khi phát hiện mua gói Lifetime Premium, tự động chuyển cờ <code>isPremium = true</code>, tắt bỏ toàn bộ AdMob SDK calls và mở khóa tính năng nâng cao.</li>
          </ul>
        </div>

        {/* Offline Worker */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Shield size={16} /> Offline Workers &amp; Notifications
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hoạt động 100% không cần mạng (No Backend Required):
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong>DailyReminderWorker</strong>: Được lập lịch bởi <code>PeriodicWorkRequestBuilder</code> định kỳ mỗi ngày để nhắc nhở người dùng thực hiện Daily Tasks.</li>
            <li><strong>AlarmManager</strong>: Gửi thông báo chính xác theo giờ cụ thể mà người dùng đặt cho từng task (ví dụ 08:30).</li>
            <li><strong>BootCompletedReceiver</strong>: Tự động đăng ký lại các báo thức sau khi khởi động lại máy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
