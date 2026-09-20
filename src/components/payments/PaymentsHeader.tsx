import React from 'react';
import { Search, Bell, Plus, ChevronDown } from 'lucide-react';

interface PaymentsHeaderProps {
  onOpenRecordPayment: () => void;
  onOpenSearch: () => void;
  notificationCount?: number;
}

export const PaymentsHeader: React.FC<PaymentsHeaderProps> = ({
  onOpenRecordPayment,
  onOpenSearch,
  notificationCount = 2,
}) => {
  return (
    <header className="px-8 pt-5 pb-4 bg-white border-b border-slate-200/80 shrink-0">

      {/* Payments Title & Action Row */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Payments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage all payments, deposits and refunds.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Finance Focus Date Box */}
          <div className="text-right hidden sm:block">
            <div className="text-xs font-extrabold text-slate-900">
              Tuesday, 27 May 2025
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Keep your finances in focus.
            </div>
          </div>

          {/* Record Payment Button */}
          <button
            onClick={onOpenRecordPayment}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] text-white font-semibold text-xs rounded-lg shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>
    </header>
  );
};
