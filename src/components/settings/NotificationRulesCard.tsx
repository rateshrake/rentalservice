import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { NotificationRuleSettingItem } from '../../types';

interface NotificationRulesCardProps {
  rules: NotificationRuleSettingItem[];
  onToggleRule: (id: string) => void;
  onChangeTiming: (id: string, timing: string) => void;
}

export const NotificationRulesCard: React.FC<NotificationRulesCardProps> = ({
  rules,
  onToggleRule,
  onChangeTiming,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">Notification Rules</h2>
          <p className="text-[11px] text-slate-500">Set when to send automatic notifications</p>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-2.5 flex-1 overflow-y-auto">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between gap-2 p-1 rounded-lg hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => onToggleRule(rule.id)}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  rule.is_enabled ? 'bg-[#E11D48]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                    rule.is_enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-slate-800 truncate">
                {rule.label}
              </span>
            </div>

            {/* Timing Dropdown */}
            <div className="relative shrink-0">
              <select
                value={rule.timing}
                onChange={(e) => onChangeTiming(rule.id, e.target.value)}
                className="appearance-none pl-2.5 pr-6 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value={rule.timing}>{rule.timing}</option>
                <option value="Immediately">Immediately</option>
                <option value="1 day before due">1 day before due</option>
                <option value="On due date">On due date</option>
                <option value="1 day before return">1 day before return</option>
                <option value="Weekly">Weekly</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
        Notifications are sent via WhatsApp and Email.
      </div>
    </div>
  );
};
