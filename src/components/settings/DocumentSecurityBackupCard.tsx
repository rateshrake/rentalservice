import React from 'react';
import { ShieldAlert, Database, ChevronDown, CloudUpload } from 'lucide-react';
import { DocumentSecuritySettings, BackupSettings } from '../../types';

interface DocumentSecurityBackupCardProps {
  security: DocumentSecuritySettings;
  backup: BackupSettings;
  onChangeSecurity: (updated: Partial<DocumentSecuritySettings>) => void;
  onChangeBackup: (updated: Partial<BackupSettings>) => void;
  onBackupNow: () => void;
}

export const DocumentSecurityBackupCard: React.FC<DocumentSecurityBackupCardProps> = ({
  security,
  backup,
  onChangeSecurity,
  onChangeBackup,
  onBackupNow,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between h-full space-y-4">
      {/* Top Part: Document Security */}
      <div>
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Document Security</h2>
            <p className="text-[11px] text-slate-500">Protect your documents and customer data</p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Toggle 1 */}
          <div
            onClick={() => onChangeSecurity({ restrict_access: !security.restrict_access })}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <button
              type="button"
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                security.restrict_access ? 'bg-[#E11D48]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                  security.restrict_access ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Restrict document access
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Only authorized users can view documents
              </div>
            </div>
          </div>

          {/* Toggle 2 */}
          <div
            onClick={() => onChangeSecurity({ watermark_documents: !security.watermark_documents })}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <button
              type="button"
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                security.watermark_documents ? 'bg-[#E11D48]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                  security.watermark_documents ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Watermark documents
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Add watermark to invoices and agreements
              </div>
            </div>
          </div>

          {/* Toggle 3 */}
          <div
            onClick={() => onChangeSecurity({ allow_customer_upload: !security.allow_customer_upload })}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <button
              type="button"
              className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                security.allow_customer_upload ? 'bg-[#E11D48]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                  security.allow_customer_upload ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Allow customer document upload
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Let customers upload ID proofs and agreements
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Part: Backup */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-[#E11D48]" />
          <div>
            <h3 className="text-xs font-bold text-slate-900">Backup</h3>
            <p className="text-[10px] text-slate-400">Keep your data safe</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">Auto Backup</span>
            <div className="relative">
              <select
                value={backup.auto_backup_frequency || 'Daily'}
                onChange={(e) => onChangeBackup({ auto_backup_frequency: e.target.value })}
                className="appearance-none pl-2.5 pr-6 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
            <span className="text-[10px] text-slate-400 hidden xl:inline">
              Last backup: {backup.last_backup_time}
            </span>
          </div>

          <button
            type="button"
            onClick={onBackupNow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <CloudUpload className="w-3.5 h-3.5 text-slate-500" />
            <span>Backup Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
