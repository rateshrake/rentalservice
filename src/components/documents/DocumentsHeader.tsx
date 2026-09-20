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
