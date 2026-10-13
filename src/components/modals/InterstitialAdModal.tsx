import React, { useState, useEffect } from 'react';
import { useGoal } from '../../context/GoalContext';
import { X, Sparkles } from 'lucide-react';
import { ModalWrapper } from '../common/ModalWrapper';

export const InterstitialAdModal: React.FC = () => {
  const { showInterstitial, dismissInterstitial, activeInterstitialReason, upgradeToPremium } = useGoal();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!showInterstitial) {
      setCountdown(3);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showInterstitial]);

  if (!showInterstitial) return null;

  return (
    <ModalWrapper isOpen={showInterstitial} onClose={dismissInterstitial} maxWidthClass="max-w-sm">
      {/* Ad Header */}
      <div className="-mx-5 -mt-5 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="bg-amber-500 text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold">
            AdMob
          </span>
          <span>Interstitial Ad (Quảng cáo xen kẽ)</span>
        </div>
        {countdown === 0 ? (
          <button
            onClick={dismissInterstitial}
            className="text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        ) : (
          <span className="text-slate-400 font-mono text-[11px]">Đóng sau {countdown}s</span>
        )}
      </div>

      {/* Ad Body */}
      <div className="pt-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
          🎉
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Tuyệt vời! Bạn vừa đạt mốc mới!
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 px-2">
          {activeInterstitialReason || 'Hoàn thành mục tiêu quan trọng trong Goalify!'}
        </p>

        {/* Sponsor Card */}
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800/50 mb-4 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              Google Pixel 9 Pro
            </span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-1 rounded-sm">
              Tài trợ
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            Trải nghiệm AI đỉnh cao cùng Gemini Nano tích hợp sẵn ngay trên thiết bị Android.
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              dismissInterstitial();
              upgradeToPremium();
            }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles size={14} />
            Nâng cấp Premium (Tắt vĩnh viễn quảng cáo)
          </button>

          {countdown === 0 && (
            <button
              onClick={dismissInterstitial}
              className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Tiếp tục xem mục tiêu
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};
