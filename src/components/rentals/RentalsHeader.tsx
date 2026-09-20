import React from 'react';
import { Search, Bell, Plus, ChevronDown, RotateCcw } from 'lucide-react';

interface RentalsHeaderProps {
  onOpenNewRental: () => void;
  onOpenSearch: () => void;
  onOpenReceiveReturn?: () => void;
  notificationCount?: number;
}

export const RentalsHeader: React.FC<RentalsHeaderProps> = ({
  onOpenNewRental,
  onOpenSearch,
  onOpenReceiveReturn,
  notificationCount = 2,
}) => {
  return (
    <header className="px-8 pt-5 pb-4 bg-white border-b border-slate-200/80 shrink-0">

      {/* Rentals Title & Date row */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Rentals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage all your rental bookings, track returns and payments.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900">Tuesday, 27 May 2025</p>
            <p className="text-[11px] text-slate-500">Make it a productive day!</p>
          </div>

          <button
            onClick={onOpenReceiveReturn}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>Receive Return</span>
          </button>
          
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
