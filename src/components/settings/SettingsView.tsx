import React, { useState, useEffect } from 'react';
import { SettingsHeader } from './SettingsHeader';
import { EmployeesCard } from './EmployeesCard';
import { RolesPermissionsCard } from './RolesPermissionsCard';
import { LateFeeRulesCard } from './LateFeeRulesCard';
import { NotificationRulesCard } from './NotificationRulesCard';
import { BackupCard } from './BackupCard';
import { AuditLogTable } from './AuditLogTable';
import { AddEditEmployeeModal } from '../modals/AddEditEmployeeModal';
import {
  SettingsData,
  LateFeeRulesSettings,
  NotificationRuleSettingItem,
  BackupSettings,
  EmployeeItem,
} from '../../types';

interface SettingsViewProps {
  data: SettingsData;
  onSaveSettings: (updated: Partial<SettingsData>) => Promise<boolean>;
  onAddEmployee: (emp: Partial<EmployeeItem>) => Promise<EmployeeItem>;
  onUpdateEmployee: (id: number, data: { name: string; phone: string; role: string; status: 'Active' | 'Inactive' }) => Promise<boolean>;
  onRemoveEmployee: (id: number) => Promise<boolean>;
  onTriggerBackup: () => Promise<boolean>;
  onOpenSearch: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  data,
  onSaveSettings,
  onAddEmployee,
  onUpdateEmployee,
  onRemoveEmployee,
  onTriggerBackup,
  onOpenSearch,
}) => {
  const [lateFee, setLateFee] = useState<LateFeeRulesSettings>(data.lateFeeRules);
  const [notificationRules, setNotificationRules] = useState<NotificationRuleSettingItem[]>(
    data.notificationRules
  );
  const [backup, setBackup] = useState<BackupSettings>(data.backup);
  const [rolesPermissions, setRolesPermissions] = useState<Record<string, string[]>>(
    data.rolesPermissions
  );
  const [employees, setEmployees] = useState<EmployeeItem[]>(data.employees || []);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states for Employee management
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<EmployeeItem | null>(null);

  // Synchronize when data.employees updates from parent
  useEffect(() => {
    if (data.employees) {
      setEmployees(data.employees);
    }
  }, [data.employees]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleNotificationRule = (id: string) => {
    setNotificationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_enabled: !r.is_enabled } : r))
    );
  };

  const handleChangeNotificationTiming = (id: string, timing: string) => {
    setNotificationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, timing } : r))
    );
  };

  const handleBackupNow = async () => {
    try {
      await onTriggerBackup();
      const nowStr = 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setBackup((b) => ({ ...b, last_backup_time: nowStr }));
      showToast('Database backup snapshot created successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to trigger backup');
    }
  };

  const handleSaveAll = async () => {
    const payload: Partial<SettingsData> = {
      lateFeeRules: lateFee,
      notificationRules,
      backup,
      rolesPermissions,
    };

    try {
      await onSaveSettings(payload);
      showToast('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings');
    }
  };

  // Open modal for new employee
  const handleOpenAddEmployee = () => {
    setSelectedEmployeeForEdit(null);
    setIsEmployeeModalOpen(true);
  };

  // Open modal for editing employee
  const handleOpenEditEmployee = (emp: EmployeeItem) => {
    setSelectedEmployeeForEdit(emp);
    setIsEmployeeModalOpen(true);
  };

  // Handle employee modal submit (add or edit)
  const handleEmployeeSubmit = async (formData: {
    name: string;
    phone: string;
    role: string;
    status: 'Active' | 'Inactive';
  }) => {
    if (selectedEmployeeForEdit) {
      // Edit mode
      try {
        await onUpdateEmployee(selectedEmployeeForEdit.id, formData);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployeeForEdit.id ? { ...emp, ...formData } : emp
          )
        );
        showToast(`Employee ${formData.name} updated successfully!`);
      } catch (err) {
        console.error('Failed to update employee:', err);
        showToast('Failed to update employee');
      }
    } else {
      // Add mode
      try {
        const added = await onAddEmployee({
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@camerahub.in`,
        });
        setEmployees((prev) => [...prev, added]);
        showToast(`Employee ${formData.name} added successfully!`);
      } catch (err) {
        console.error('Failed to add employee:', err);
        showToast('Failed to add employee');
      }
    }
  };

  // Handle removing employee smoothly without page reload
  const handleRemoveEmployee = async (id: number) => {
    try {
      await onRemoveEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      showToast('Employee removed successfully!');
    } catch (err) {
      console.error('Failed to remove employee:', err);
      showToast('Failed to remove employee');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Settings Top Header */}
      <SettingsHeader
        onSaveChanges={handleSaveAll}
        onOpenSearch={onOpenSearch}
      />

      {/* Main Grid Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-5">
        {/* Section 1: Employees (Wide) & Roles & Permissions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="lg:col-span-2">
            <EmployeesCard
              employees={employees}
              onAddEmployee={handleOpenAddEmployee}
              onEditEmployee={handleOpenEditEmployee}
              onRemoveEmployee={handleRemoveEmployee}
            />
          </div>

          <div>
            <RolesPermissionsCard
              rolesPermissions={rolesPermissions}
              onChangePermissions={(role, perms) =>
                setRolesPermissions((prev) => ({ ...prev, [role]: perms }))
              }
              onManagePermissions={() => showToast('Manage Permissions modal')}
            />
          </div>
        </div>

        {/* Section 2: Late Fee Rules, Notification Rules, Database & Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <div>
            <LateFeeRulesCard
              lateFee={lateFee}
              onChange={(updated) => setLateFee((l) => ({ ...l, ...updated }))}
            />
          </div>

          <div>
            <NotificationRulesCard
              rules={notificationRules}
              onToggleRule={handleToggleNotificationRule}
              onChangeTiming={handleChangeNotificationTiming}
            />
          </div>

          <div>
            <BackupCard
              backup={backup}
              onChangeBackup={(updated) => setBackup((b) => ({ ...b, ...updated }))}
              onBackupNow={handleBackupNow}
            />
          </div>
        </div>

        {/* Section 3: Audit Log Table (Full Width) */}
        <div>
          <AuditLogTable
            logs={data.auditLogs}
            onViewAll={() => showToast('Viewing full audit log')}
          />
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      <AddEditEmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employeeToEdit={selectedEmployeeForEdit}
        onSubmit={handleEmployeeSubmit}
      />
    </div>
  );
};
