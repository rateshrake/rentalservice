import React from 'react';
import { Search, Bell, Plus, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOpenNewRental: () => void;
  onOpenSearch: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewRental,
  onOpenSearch,
  notificationCount = 2,
}) => {
  return (
    <header className="px-8 pt-5 pb-4 bg-white border-b border-slate-200/80 shrink-0">

      {/* Greeting & Date row */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, Ravi! <span>👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here's what's happening at your store today.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">Tuesday, 27 May 2025</p>
            <p className="text-[11px] text-slate-500">Make it a productive day!</p>
          </div>

          <button
            onClick={onOpenNewRental}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] text-white font-semibold text-xs rounded-lg shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Rental</span>
          </button>
        </div>
      </div>
    </header>
  );
};
