import React, { useState } from 'react';
import { ListFilter, ChevronDown } from 'lucide-react';
import { AuditLogItem } from '../../types';

interface AuditLogTableProps {
  logs: AuditLogItem[];
  onViewAll?: () => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, onViewAll }) => {
  const [dateFilter, setDateFilter] = useState<string>('Last 30 Days');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <ListFilter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Audit Log</h2>
            <p className="text-[11px] text-slate-500">Track important system activity</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Today">Today</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-[#E11D48] hover:text-[#BE123C] hover:underline transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-2 font-bold">Date & Time</th>
              <th className="pb-2 font-bold">User</th>
              <th className="pb-2 font-bold">Action</th>
              <th className="pb-2 font-bold">Details</th>
              <th className="pb-2 font-bold text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 font-medium text-slate-700 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-2.5 font-bold text-slate-900 whitespace-nowrap">
                  {log.user}
                </td>
                <td className="py-2.5 text-slate-700 whitespace-nowrap">
                  <span className="font-semibold text-slate-800">{log.action}</span>
                </td>
                <td className="py-2.5 text-slate-600 truncate max-w-[320px]">
                  {log.details}
                </td>
                <td className="py-2.5 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {log.ip_address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
