import React, { useRef, useState } from 'react';
import { useGoal } from '../context/GoalContext';
import {
  Download,
  Upload,
  Sparkles,
  Bell,
  RefreshCw,
  Shield,
  Smartphone,
  Eye,
  CheckCircle,
  AlertTriangle,
  Play,
  Volume2,
} from 'lucide-react';
import { PremiumModal } from './modals';

export const SettingsScreen: React.FC = () => {
  const {
    isPremium,
    togglePremiumMock,
    exportData,
    importData,
    resetData,
    triggerManualInterstitial,
    notificationEnabled,
    setNotificationEnabled,
  } = useGoal();

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [importMessage, setImportMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );
  const [testNotificationFired, setTestNotificationFired] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportMessage({ text: 'Phục hồi dữ liệu JSON thành công!', type: 'success' });
      } else {
        setImportMessage({ text: 'Tệp JSON không hợp lệ hoặc sai định dạng.', type: 'error' });
      }
      setTimeout(() => setImportMessage(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFireTestNotification = () => {
    setTestNotificationFired(true);
    setTimeout(() => setTestNotificationFired(false), 5000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
          <span>Hệ Thống &amp; Cài Đặt</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Cấu Hình &amp; Sao Lưu (Offline)
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-14">
        {/* Test Notification Banner (Simulation of WorkManager notification) */}
        {testNotificationFired && (
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bell size={16} />
              </div>
              <div className="text-xs">
                <p className="font-bold">🎯 Thông báo nhắc nhở Goalify (WorkManager)</p>
                <p className="text-indigo-100 text-[11px]">
                  Bạn còn 2 Daily Tasks cần hoàn thành hôm nay để giữ chuỗi kỷ luật!
                </p>
              </div>
            </div>
            <button
              onClick={() => setTestNotificationFired(false)}
              className="text-xs bg-white text-indigo-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-indigo-50"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Section 1: Monetization & Premium */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gói Goalify Premium (In-App Billing)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Google Play Billing v6+ (SKU: goalify_premium_lifetime)
                </p>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isPremium
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {isPremium ? 'Đã kích hoạt' : 'Bản miễn phí'}
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            {!isPremium ? (
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles size={14} /> Mở khóa Premium (149.000 ₫)
              </button>
            ) : (
              <button
                onClick={() => togglePremiumMock(false)}
                className="flex-1 py-2 px-3 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Hạ cấp về bản Free (để test AdMob)
              </button>
            )}

            <button
              onClick={triggerManualInterstitial}
              className="py-2 px-3 border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold hover:bg-indigo-100 flex items-center justify-center gap-1.5"
            >
              <Eye size={14} /> Test QC Interstitial Ad
            </button>
          </div>
        </div>

        {/* Section 2: Backup & Restore */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
              <Download size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sao Lưu &amp; Phục Hồi Dữ Liệu (100% Offline)
              </h3>
              <p className="text-[11px] text-slate-500">
                Xuất/Nhập định dạng JSON qua Storage Access Framework / Bộ nhớ máy
              </p>
            </div>
          </div>

          {importMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                importMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {importMessage.type === 'success' ? (
                <CheckCircle size={15} />
              ) : (
                <AlertTriangle size={15} />
              )}
              {importMessage.text}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={exportData}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Download size={15} className="text-indigo-600" />
              <span>Xuất file JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Upload size={15} className="text-emerald-600" />
              <span>Nhập file JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Section 3: Offline Notifications & Alarms */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Thông Báo Nhắc Nhở Hàng Ngày
                </h3>
                <p className="text-[11px] text-slate-500">
                  Android WorkManager + Exact AlarmManager
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
              className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-1">
            <button
              onClick={handleFireTestNotification}
              className="w-full py-2 px-3 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center justify-center gap-1.5"
            >
              <Play size={13} /> Gửi thông báo thử nghiệm (Simulate Worker Trigger)
            </button>
          </div>
        </div>

        {/* Section 4: Reset & Sample Data */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg">
              <RefreshCw size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Khôi phục Dữ liệu Mẫu (Sample Goals)
              </h3>
              <p className="text-[11px] text-slate-500">
                Đặt lại danh sách mục tiêu mẫu IELTS 7.5, Tiết kiệm 200tr, Chạy bộ 500km
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn đặt lại dữ liệu mẫu ban đầu?')) {
                resetData();
              }
            }}
            className="w-full py-2 px-3 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            Khôi phục dữ liệu mẫu
          </button>
        </div>

        {/* Architecture Spec Badge */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 text-center space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Goalify v1.0.0 (Build 2026.10)
          </p>
          <p>Kotlin • Jetpack Compose • Room DB • Hilt • WorkManager • Clean Architecture</p>
        </div>
      </div>

      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
};
