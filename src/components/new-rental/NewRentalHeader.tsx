import React from 'react';
import { ArrowLeft, Search, Bell, ChevronDown } from 'lucide-react';

interface NewRentalHeaderProps {
  onBack: () => void;
  onOpenSearch?: () => void;
  notificationCount?: number;
}

export const NewRentalHeader: React.FC<NewRentalHeaderProps> = ({
  onBack,
  onOpenSearch,
  notificationCount = 2,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-8 pt-4 pb-4 shrink-0">

      {/* Page Title & Back Arrow */}
      <div className="pt-4 flex items-center gap-3.5">
        <button
          onClick={onBack}
          title="Go back"
          className="text-slate-700 hover:text-slate-900 transition-colors cursor-pointer p-1 -ml-1 rounded-md hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
            New Rental
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create a new rental booking in a few simple steps.
          </p>
        </div>
      </div>
    </header>
  );
};
