import React, { useState } from 'react';
import { SettingsHeader } from './SettingsHeader';
import { BusinessProfileCard } from './BusinessProfileCard';
import { EmployeesCard } from './EmployeesCard';
import { RolesPermissionsCard } from './RolesPermissionsCard';
import { RentalPricingCard } from './RentalPricingCard';
import { LateFeeRulesCard } from './LateFeeRulesCard';
import { PaymentModesCard } from './PaymentModesCard';
import { MessageTemplatesCard } from './MessageTemplatesCard';
import { NotificationRulesCard } from './NotificationRulesCard';
import { DocumentSecurityBackupCard } from './DocumentSecurityBackupCard';
import { AuditLogTable } from './AuditLogTable';
import {
  SettingsData,
  BusinessProfile,
  RentalPricingSettings,
  LateFeeRulesSettings,
  PaymentModeSettingItem,
  NotificationRuleSettingItem,
  DocumentSecuritySettings,
  BackupSettings,
  EmployeeItem,
} from '../../types';

interface SettingsViewProps {
  data: SettingsData;
  onSaveSettings: (updated: Partial<SettingsData>) => Promise<boolean>;
  onAddEmployee: (emp: Partial<EmployeeItem>) => Promise<EmployeeItem>;
  onTriggerBackup: () => Promise<boolean>;
  onOpenSearch: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  data,
  onSaveSettings,
  onAddEmployee,
  onTriggerBackup,
  onOpenSearch,
}) => {
  const [profile, setProfile] = useState<BusinessProfile>(data.businessProfile);
  const [pricing, setPricing] = useState<RentalPricingSettings>(data.rentalPricing);
  const [lateFee, setLateFee] = useState<LateFeeRulesSettings>(data.lateFeeRules);
  const [paymentModes, setPaymentModes] = useState<PaymentModeSettingItem[]>(data.paymentModes);
  const [messageTemplates, setMessageTemplates] = useState<Record<string, string>>(
    data.messageTemplates
  );
  const [notificationRules, setNotificationRules] = useState<NotificationRuleSettingItem[]>(
    data.notificationRules
  );
  const [security, setSecurity] = useState<DocumentSecuritySettings>(data.documentSecurity);
  const [backup, setBackup] = useState<BackupSettings>(data.backup);
  const [rolesPermissions, setRolesPermissions] = useState<Record<string, string[]>>(
    data.rolesPermissions
  );
  const [employees, setEmployees] = useState<EmployeeItem[]>(data.employees);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTogglePaymentMode = (id: string) => {
    setPaymentModes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_enabled: !m.is_enabled } : m))
    );
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

  const handleChangeMessageTemplate = (key: string, content: string) => {
    setMessageTemplates((prev) => ({ ...prev, [key]: content }));
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
      businessProfile: profile,
      rentalPricing: pricing,
      lateFeeRules: lateFee,
      paymentModes,
      messageTemplates,
      notificationRules,
      documentSecurity: security,
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

  const handleAddEmployeeModal = async () => {
    const names = ['Kavita Rao', 'Pooja Hegde', 'Sameer Verma', 'Ankit Jain'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newEmp: Partial<EmployeeItem> = {
      name: randomName,
      role: 'Staff',
      email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@lensledger.in`,
      status: 'Active',
    };
    try {
      const added = await onAddEmployee(newEmp);
      setEmployees((prev) => [...prev, added]);
      showToast(`Employee ${added.name} added successfully!`);
    } catch (err) {
      console.error(err);
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
        {/* Row 1: Business Profile | Employees | Roles & Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <div>
            <BusinessProfileCard
              profile={profile}
              onChange={(updated) => setProfile((p) => ({ ...p, ...updated }))}
              onChangeLogo={() => showToast('Logo updated!')}
            />
          </div>

          <div>
            <EmployeesCard
              employees={employees}
              onAddEmployee={handleAddEmployeeModal}
              onActionClick={(emp) => showToast(`Options for ${emp.name}`)}
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

        {/* Row 2: Rental Pricing | Late Fee Rules | Payment Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <div>
            <RentalPricingCard
              pricing={pricing}
              onChange={(updated) => setPricing((p) => ({ ...p, ...updated }))}
            />
          </div>

          <div>
            <LateFeeRulesCard
              lateFee={lateFee}
              onChange={(updated) => setLateFee((l) => ({ ...l, ...updated }))}
            />
          </div>

          <div>
            <PaymentModesCard
              modes={paymentModes}
              onToggleMode={handleTogglePaymentMode}
            />
          </div>
        </div>

        {/* Row 3: Message Templates | Notification Rules | Document Security & Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <div>
            <MessageTemplatesCard
              templates={messageTemplates}
              onChangeTemplate={handleChangeMessageTemplate}
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
            <DocumentSecurityBackupCard
              security={security}
              backup={backup}
              onChangeSecurity={(updated) => setSecurity((s) => ({ ...s, ...updated }))}
              onChangeBackup={(updated) => setBackup((b) => ({ ...b, ...updated }))}
              onBackupNow={handleBackupNow}
            />
          </div>
        </div>

        {/* Row 4: Audit Log Table (Full Width) */}
        <div>
          <AuditLogTable
            logs={data.auditLogs}
            onViewAll={() => showToast('Viewing full audit log')}
          />
        </div>
      </div>
    </div>
  );
};
