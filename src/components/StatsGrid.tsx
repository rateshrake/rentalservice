import React from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Package,
  CreditCard,
  BarChart2
} from 'lucide-react';
import { StatItem } from '../types';

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const getIconConfig = (key: string) => {
    switch (key) {
      case 'active_rentals':
        return {
          icon: Calendar,
          iconColor: 'text-slate-700',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-200'
        };
      case 'due_today':
        return {
          icon: Clock,
          iconColor: 'text-rose-600',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100'
        };
      case 'overdue_rentals':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100'
        };
      case 'available_equipment':
        return {
          icon: Package,
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100'
        };
      case 'pending_payments':
        return {
          icon: CreditCard,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100'
        };
      case 'revenue_today':
        return {
          icon: BarChart2,
          iconColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100'
        };
      default:
        return {
          icon: Calendar,
          iconColor: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  return (
    <div className="grid grid-cols-6 gap-3.5">
      {stats.map((stat) => {
        const { icon: Icon, iconColor, bgColor, borderColor } = getIconConfig(stat.key);
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
              <span className="text-[12px] font-semibold text-slate-700 tracking-tight line-clamp-1">
                {stat.title}
              </span>
            </div>

            {/* Middle: Big Metric Number */}
            <div className="mt-2.5 mb-1.5">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                {stat.value}
              </span>
            </div>

            {/* Bottom: Trend & comparison label */}
            <div className="flex items-center gap-1.5 text-[11px]">
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
              <span className="text-slate-500">{stat.trend_label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
