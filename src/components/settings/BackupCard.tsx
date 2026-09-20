import React from 'react';
import { Database, ChevronDown, CloudUpload } from 'lucide-react';
import { BackupSettings } from '../../types';

interface BackupCardProps {
  backup: BackupSettings;
  onChangeBackup: (updated: Partial<BackupSettings>) => void;
  onBackupNow: () => void;
}

export const BackupCard: React.FC<BackupCardProps> = ({
  backup,
  onChangeBackup,
  onBackupNow,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Database & Backup</h2>
            <p className="text-[11px] text-slate-500">Safeguard your rental records and customer data</p>
          </div>
        </div>

        <div className="space-y-3 py-1">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <div>
              <div className="text-xs font-bold text-slate-800">Automatic Backup Schedule</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Automatically snapshot SQLite database locally
              </div>
            </div>
            <div className="relative">
              <select
                value={backup.auto_backup_frequency || 'Daily'}
                onChange={(e) => onChangeBackup({ auto_backup_frequency: e.target.value })}
                className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer shadow-2xs"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>Last successful snapshot:</span>
            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {backup.last_backup_time || 'Never'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Manual instant snapshot</span>
        <button
          type="button"
          onClick={onBackupNow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
        >
          <CloudUpload className="w-3.5 h-3.5 text-[#E11D48]" />
          <span>Backup Database Now</span>
        </button>
      </div>
    </div>
  );
};
