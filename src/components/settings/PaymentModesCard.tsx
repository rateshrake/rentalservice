import React from 'react';
import { CreditCard } from 'lucide-react';
import { PaymentModeSettingItem } from '../../types';

interface PaymentModesCardProps {
  modes: PaymentModeSettingItem[];
  onToggleMode: (id: string) => void;
}

export const PaymentModesCard: React.FC<PaymentModesCardProps> = ({
  modes,
  onToggleMode,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">Payment Modes</h2>
          <p className="text-[11px] text-slate-500">Accept payments through multiple modes</p>
        </div>
      </div>

      {/* Modes list */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {modes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => onToggleMode(mode.id)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50/80 transition-colors cursor-pointer"
          >
            <button
              type="button"
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                mode.is_enabled ? 'bg-[#E11D48]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                  mode.is_enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {mode.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {mode.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
