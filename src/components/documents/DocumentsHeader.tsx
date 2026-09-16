import React from 'react';
import { Search, Bell, ChevronDown, Plus } from 'lucide-react';

interface DocumentsHeaderProps {
  onUploadDocument: () => void;
  onOpenSearch: () => void;
  notificationCount?: number;
}

export const DocumentsHeader: React.FC<DocumentsHeaderProps> = ({
  onUploadDocument,
  onOpenSearch,
  notificationCount = 2,
}) => {
  return (
    <header className="px-8 pt-5 pb-4 bg-white border-b border-slate-200/80 shrink-0">
      {/* Top utility row: Search bar, Notifications, Profile */}
      <div className="flex items-center justify-between gap-4 pb-4">
        {/* Search input with Ctrl+K badge */}
        <div
          onClick={onOpenSearch}
          className="flex items-center justify-between w-full max-w-md px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-xs cursor-pointer hover:border-slate-300 hover:bg-slate-100/70 transition-all shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 font-normal">Search documents, customers, rentals...</span>
          </div>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded text-slate-500 shadow-2xs">
            Ctrl + K
          </span>
        </div>

        {/* Right side utilities: Notification Bell & Profile */}
        <div className="flex items-center gap-5">
          <button
            onClick={onOpenSearch}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#E11D48] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-slate-700 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              RK
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight group-hover:text-red-600 transition-colors">
                Ravi Kumar
              </span>
              <span className="text-[11px] text-slate-500 leading-tight">
                Owner
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
          </div>
        </div>
      </div>

      {/* Documents Title & Action Row */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Documents
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer documents, receipts, agreements and more.
          </p>
        </div>

        <div>
          <button
            onClick={onUploadDocument}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] text-white font-semibold text-xs rounded-lg shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>
    </header>
  );
};
