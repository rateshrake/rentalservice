import React from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';

export interface PaymentStatusTabItem {
  id: string;
  label: string;
  count: number;
  dotColor?: string;
}

interface PaymentStatusTabsProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  counts: {
    all: number;
    paid: number;
    pending: number;
    partial: number;
    deposit: number;
    refund: number;
  };
}

export const PaymentStatusTabs: React.FC<PaymentStatusTabsProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  counts,
}) => {
  const tabs: PaymentStatusTabItem[] = [
    { id: 'all', label: 'All Payments', count: counts.all },
    { id: 'paid', label: 'Paid', count: counts.paid, dotColor: 'bg-emerald-500' },
    { id: 'pending', label: 'Pending', count: counts.pending, dotColor: 'bg-orange-500' },
    { id: 'partial', label: 'Partial', count: counts.partial, dotColor: 'bg-amber-400' },
    { id: 'deposit', label: 'Deposit', count: counts.deposit, dotColor: 'bg-purple-500' },
    { id: 'refund', label: 'Refund', count: counts.refund, dotColor: 'bg-rose-500' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-50 text-[#E11D48] border border-red-200 shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
              }`}
            >
              {tab.dotColor && (
                <span className={`w-2 h-2 rounded-full ${tab.dotColor}`} />
              )}
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-normal ${
                  isActive ? 'text-red-500 font-semibold' : 'text-slate-400'
                }`}
              >
                ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Right controls: Search & Date Range */}
      <div className="flex items-center gap-2.5">
        {/* Search Input */}
        <div className="relative w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs transition-all"
          />
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
