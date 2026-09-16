import React from 'react';
import { BarChart3, CreditCard, PieChart, Wallet, RotateCcw, FileText } from 'lucide-react';
import { StatItem } from '../../types';

interface PaymentsKPIProps {
  stats: StatItem[];
}

export const PaymentsKPI: React.FC<PaymentsKPIProps> = ({ stats }) => {
  const getCardIcon = (key: string) => {
    switch (key) {
      case 'collected_today':
        return {
          icon: BarChart3,
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100',
        };
      case 'pending_payments':
        return {
          icon: CreditCard,
          iconColor: 'text-rose-600',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100',
        };
      case 'partial_payments':
        return {
          icon: PieChart,
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100',
        };
      case 'deposits_held':
        return {
          icon: Wallet,
          iconColor: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-100',
        };
      case 'refunds':
        return {
          icon: RotateCcw,
          iconColor: 'text-rose-600',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100',
        };
      case 'outstanding_balance':
      default:
        return {
          icon: FileText,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100',
        };
    }
  };

  return (
    <div className="grid grid-cols-6 gap-3.5">
      {stats.map((stat) => {
        const { icon: Icon, iconColor, bgColor, borderColor } = getCardIcon(stat.key);
        const isGreen = stat.badge_type === 'emerald';
        const isRed = stat.badge_type === 'rose';

        return (
          <div
            key={stat.id}
            className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            {/* Top row: Icon and Title */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg ${bgColor} ${borderColor} border flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 tracking-tight leading-tight truncate">
                {stat.title}
              </span>
            </div>

            {/* Middle: Value */}
            <div className="mt-3 mb-1.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                {stat.value}
              </span>
            </div>

            {/* Bottom: Trend */}
            <div className="flex items-center gap-1 text-[10.5px]">
              <span
                className={`font-semibold flex items-center ${
                  isGreen
                    ? 'text-emerald-600'
                    : isRed
                    ? 'text-red-600'
                    : 'text-slate-500'
                }`}
              >
                {stat.trend_val}
              </span>
              <span className="text-slate-500 truncate">{stat.trend_label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
