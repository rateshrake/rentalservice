import React from 'react';
import { Calendar, Clock, AlertTriangle, FileText } from 'lucide-react';
import { StatItem } from '../../types';

interface RentalsKPIProps {
  stats: StatItem[];
}

export const RentalsKPI: React.FC<RentalsKPIProps> = ({ stats }) => {
  const getCardIcon = (key: string) => {
    switch (key) {
      case 'active_rentals':
        return {
          icon: Calendar,
          iconColor: 'text-slate-700',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-200',
        };
      case 'due_today':
        return {
          icon: Clock,
          iconColor: 'text-rose-600',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100',
        };
      case 'overdue_rentals':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100',
        };
      case 'draft_rentals':
      default:
        return {
          icon: FileText,
          iconColor: 'text-slate-700',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-200',
        };
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const { icon: Icon, iconColor, bgColor, borderColor } = getCardIcon(stat.key);
        const isGreen = stat.badge_type === 'emerald';
        const isRed = stat.badge_type === 'rose';

        return (
          <div
            key={stat.id}
            className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            {/* Top row: Icon and Title */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg ${bgColor} ${borderColor} border flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <span className="text-xs font-semibold text-slate-700 tracking-tight">
                {stat.title}
              </span>
            </div>

            {/* Middle: Number */}
            <div className="mt-3 mb-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                {stat.value}
              </span>
            </div>

            {/* Bottom: Trend */}
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
