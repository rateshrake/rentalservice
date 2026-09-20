import React from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { LateFeeRulesSettings } from '../../types';

interface LateFeeRulesCardProps {
  lateFee: LateFeeRulesSettings;
  onChange: (updated: Partial<LateFeeRulesSettings>) => void;
}

export const LateFeeRulesCard: React.FC<LateFeeRulesCardProps> = ({
  lateFee,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">Late Fee Rules</h2>
          <p className="text-[11px] text-slate-500">Configure overdue charges</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-3.5 flex-1 text-xs">
        <div className="grid grid-cols-12 gap-2.5 items-end">
          <div className="col-span-6">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Late Fee Type
            </label>
            <div className="relative">
              <select
                value={lateFee.fee_type || 'Percentage of daily rate'}
                onChange={(e) => onChange({ fee_type: e.target.value })}
                className="w-full appearance-none px-2.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-5 truncate"
              >
                <option value="Percentage of daily rate">Percentage of daily rate</option>
                <option value="Fixed Daily Amount">Fixed Daily Amount</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="col-span-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Late Fee Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                value={lateFee.fee_percentage || 25}
                onChange={(e) => onChange({ fee_percentage: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none pr-5"
              />
              <span className="absolute right-2 top-2 text-slate-400 font-bold">%</span>
            </div>
          </div>

          <div className="col-span-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Grace (Days)
            </label>
            <div className="relative">
              <input
                type="number"
                value={lateFee.grace_period_days || 1}
                onChange={(e) => onChange({ grace_period_days: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-3">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Grace (Mins)
            </label>
            <div className="relative">
              <input
                type="number"
                value={lateFee.grace_period_mins || 20}
                onChange={(e) => onChange({ grace_period_mins: Number(e.target.value) || 0 })}
                className="w-full px-2.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none pr-9"
              />
              <span className="absolute right-1.5 top-2 text-[10px] text-slate-400 font-semibold">
                mins
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-2.5 items-end mt-2">
          <div className="col-span-6">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Hourly Penalty Amount
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={lateFee.hourly_penalty_amount || 500}
                onChange={(e) => onChange({ hourly_penalty_amount: Number(e.target.value) || 0 })}
                className="w-full pl-6 px-2.5 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2.5 pt-1">
          {/* Toggle 1 */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ apply_automatically: !lateFee.apply_automatically })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                lateFee.apply_automatically ? 'bg-[#E11D48]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                  lateFee.apply_automatically ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Apply late fees automatically
              </div>
              <div className="text-[11px] text-slate-500">
                Calculate and add fees for overdue rentals
              </div>
            </div>
          </div>

          {/* Toggle 2 */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ send_overdue_reminders: !lateFee.send_overdue_reminders })}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                lateFee.send_overdue_reminders ? 'bg-[#E11D48]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                  lateFee.send_overdue_reminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Send overdue reminders
              </div>
              <div className="text-[11px] text-slate-500">
                Notify customers about overdue items
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
