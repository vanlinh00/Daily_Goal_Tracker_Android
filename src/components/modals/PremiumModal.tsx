import React from 'react';
import { useGoal } from '../../context/GoalContext';
import { CheckCircle2, Sparkles, ShieldCheck, X } from 'lucide-react';
import { ModalWrapper } from '../common/ModalWrapper';

export interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const { isPremium, upgradeToPremium } = useGoal();

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-sm">
      <div className="flex justify-end -mt-2 -mr-2">
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>
      </div>

      <div className="text-center -mt-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
          <Sparkles size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Goalify Premium
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Google Play Billing v6+ In-App Purchase
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-700 dark:text-slate-300">
            <strong>Tắt 100% quảng cáo</strong> (Banner và Interstitial Ads)
          </span>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-700 dark:text-slate-300">
            <strong>Không giới hạn mục tiêu</strong> (Mở khóa tạo vô hạn Năm, Tháng, Tuần)
          </span>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-700 dark:text-slate-300">
            <strong>Tự động sao lưu &amp; Phục hồi JSON</strong> an toàn trong bộ nhớ máy
          </span>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-xs text-slate-700 dark:text-slate-300">
            <strong>Biểu đồ thống kê nâng cao</strong> &amp; Huy hiệu năng suất
          </span>
        </div>
      </div>

      <div className="mt-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Gói trọn đời (Lifetime Access)
        </span>
        <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
          149.000 ₫ <span className="text-xs font-normal text-slate-400">/ một lần duy nhất</span>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
          Tiết kiệm 50% so với mua hàng năm
        </span>
      </div>

      <div className="mt-5 space-y-2">
        {isPremium ? (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck size={16} /> Bạn đã sở hữu tài khoản Premium!
          </div>
        ) : (
          <button
            onClick={() => {
              upgradeToPremium();
              onClose();
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={15} />
            Mở khóa ngay qua Google Play
          </button>
        )}

        <p className="text-[10px] text-center text-slate-400">
          Thanh toán an toàn qua Google Play Billing Client. Có thể khôi phục mua hàng bất cứ lúc nào.
        </p>
      </div>
    </ModalWrapper>
  );
};
