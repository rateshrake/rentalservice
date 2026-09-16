import React from 'react';
import { Users2, Plus, MoreHorizontal } from 'lucide-react';
import { EmployeeItem } from '../../types';

interface EmployeesCardProps {
  employees: EmployeeItem[];
  onAddEmployee: () => void;
  onActionClick?: (emp: EmployeeItem) => void;
}

export const EmployeesCard: React.FC<EmployeesCardProps> = ({
  employees,
  onAddEmployee,
  onActionClick,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">Employees</h2>
            <p className="text-[11px] text-slate-500">Manage team members and access</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddEmployee}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-[11px] font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Employees Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-2 font-bold">Name</th>
              <th className="pb-2 font-bold">Role</th>
              <th className="pb-2 font-bold">Email</th>
              <th className="pb-2 font-bold">Status</th>
              <th className="pb-2 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 font-bold text-slate-900">{emp.name}</td>
                <td className="py-2.5 text-slate-600">{emp.role}</td>
                <td className="py-2.5 text-slate-500 font-mono text-[11px] truncate max-w-[130px]">
                  {emp.email}
                </td>
                <td className="py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        emp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-semibold ${
                        emp.status === 'Active' ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-right">
                  <button
                    type="button"
                    onClick={() => onActionClick?.(emp)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
