import React, { useState } from 'react';
import { Shield, ChevronDown, CheckSquare, Square } from 'lucide-react';

interface RolesPermissionsCardProps {
  rolesPermissions: Record<string, string[]>;
  onChangePermissions?: (role: string, permissions: string[]) => void;
  onManagePermissions?: () => void;
}

const ALL_MODULES = [
  { id: 'Dashboard', desc: 'View dashboard and reports' },
  { id: 'Rentals', desc: 'Create, edit and manage rentals' },
  { id: 'Customers', desc: 'Manage customer data' },
  { id: 'Inventory', desc: 'View and manage equipment' },
  { id: 'Payments', desc: 'Record and view payments' },
  { id: 'Settings', desc: 'Access system settings' },
  { id: 'Reports', desc: 'View and export reports' },
];

export const RolesPermissionsCard: React.FC<RolesPermissionsCardProps> = ({
  rolesPermissions,
  onChangePermissions,
  onManagePermissions,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('Manager');

  const currentPerms = rolesPermissions[selectedRole] || [
    'Dashboard',
    'Rentals',
    'Customers',
    'Inventory',
    'Payments',
    'Reports',
  ];

  const togglePermission = (modId: string) => {
    let updated: string[];
    if (currentPerms.includes(modId)) {
      updated = currentPerms.filter((p) => p !== modId);
    } else {
      updated = [...currentPerms, modId];
    }
    onChangePermissions?.(selectedRole, updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">Roles & Permissions</h2>
          <p className="text-[11px] text-slate-500">Control what employees can access</p>
        </div>
      </div>

      {/* Role Selector & Manage Button */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Select Role</span>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none pl-2.5 pr-6 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
              <option value="Owner">Owner</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
          </div>
        </div>

        <button
          type="button"
          onClick={onManagePermissions}
          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          Manage Permissions
        </button>
      </div>

      {/* Permissions List */}
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {ALL_MODULES.map((item) => {
          const isChecked = currentPerms.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => togglePermission(item.id)}
              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50/80 transition-colors cursor-pointer text-xs"
            >
              <span className="font-bold text-slate-900 w-24">{item.id}</span>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-[#E11D48] fill-[#E11D48]/10 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className="text-[11px] text-slate-500 truncate">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
