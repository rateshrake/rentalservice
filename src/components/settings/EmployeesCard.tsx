import React, { useState } from 'react';
import { Users2, Plus, MoreHorizontal, Edit, Trash2, Phone, Shield, AlertTriangle } from 'lucide-react';
import { EmployeeItem } from '../../types';

interface EmployeesCardProps {
  employees: EmployeeItem[];
  onAddEmployee: () => void;
  onEditEmployee: (emp: EmployeeItem) => void;
  onRemoveEmployee: (id: number) => void;
}

export const EmployeesCard: React.FC<EmployeesCardProps> = ({
  employees,
  onAddEmployee,
  onEditEmployee,
  onRemoveEmployee,
}) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [confirmDeleteEmp, setConfirmDeleteEmp] = useState<EmployeeItem | null>(null);

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Manager
          </span>
        );
      case 'technician':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Technician
          </span>
        );
      case 'accountant':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Accountant
          </span>
        );
      case 'staff':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            {role || 'Staff'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Users2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900">Employees</h2>
              <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                {employees.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Manage team members, contact numbers, and system roles</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddEmployee}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-[11px] font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Staff Login Info Banner */}
      <div className="mb-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="font-semibold text-slate-800">Staff Sign-In:</span>
          <span>Employees log in with their registered <strong>Name</strong>.</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>Default Password:</span>
          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono font-bold text-[10px]">
            camerahub
          </span>
        </div>
      </div>

      {/* Employees Table */}
      <div className="flex-1 overflow-auto">
        {employees.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Users2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">No employees registered yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Employee" above to add your first staff member.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="pb-2 font-bold">Name</th>
                <th className="pb-2 font-bold">Role</th>
                <th className="pb-2 font-bold">Phone Number</th>
                <th className="pb-2 font-bold">Status</th>
                <th className="pb-2 text-right font-bold pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-2.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <span>{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5">{getRoleBadge(emp.role)}</td>
                  <td className="py-2.5 text-slate-600 font-mono text-[11px]">
                    {emp.phone ? (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {emp.phone}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">No phone</span>
                    )}
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
                  <td className="py-2.5 text-right relative pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEditEmployee(emp)}
                        title="Edit employee details"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteEmp(emp)}
                        title="Remove employee"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div
            className="fixed inset-0 cursor-default"
            onClick={() => setConfirmDeleteEmp(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Remove Employee?
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Are you sure you want to remove <span className="font-bold text-slate-800">{confirmDeleteEmp.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteEmp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const idToRemove = confirmDeleteEmp.id;
                  setConfirmDeleteEmp(null);
                  onRemoveEmployee(idToRemove);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
