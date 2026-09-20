import React from 'react';
import { Search, Bell, ChevronDown, Save } from 'lucide-react';

interface SettingsHeaderProps {
  onSaveChanges: () => void;
  onOpenSearch: () => void;
  notificationCount?: number;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onSaveChanges,
  onOpenSearch,
  notificationCount = 2,
}) => {
  return (
    <header className="px-8 pt-5 pb-4 bg-white border-b border-slate-200/80 shrink-0">

      {/* Settings Title & Save Changes Action */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your business preferences, users, pricing, and more.
          </p>
        </div>

        <div>
          <button
            onClick={onSaveChanges}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] text-white font-bold text-xs rounded-lg shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4 stroke-[2.2]" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </header>
  );
};
