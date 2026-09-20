import React from 'react';
import { Search, Bell, ChevronDown, Calendar } from 'lucide-react';

interface AnalyticsHeaderProps {
  onOpenSearch: () => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  notificationCount?: number;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onOpenSearch,
  dateRange,
  onDateRangeChange,
  notificationCount = 2,
}) => {
  return (
    <header className="px-8 pt-5 pb-4 bg-white border-b border-slate-200/80 shrink-0">

      {/* Analytics Title & Date Range Dropdown */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Insights to help you grow your rental business.
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
        </div>
      </div>
    </header>
  );
};
