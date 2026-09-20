import React, { useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Sidebar } from './components/Sidebar';
import { SetupView } from './components/SetupView';
import { LoginView } from './components/LoginView';
import { StatsGrid } from './components/StatsGrid';
import { QuickActions } from './components/QuickActions';
import { NeedsAttention } from './components/NeedsAttention';
import { RevenueTrend } from './components/RevenueTrend';
import { TopEquipment } from './components/TopEquipment';
import { TodaysRentals } from './components/TodaysRentals';
import { StatusBar } from './components/StatusBar';

import { RentalsView } from './components/rentals/RentalsView';
import { CustomersView } from './components/customers/CustomersView';
import { InventoryView } from './components/inventory/InventoryView';
import { PaymentsView } from './components/payments/PaymentsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MessagesView } from './components/messages/MessagesView';
import { SettingsView } from './components/settings/SettingsView';
import { NewRentalView } from './components/new-rental/NewRentalView';

import { NewRentalModal } from './components/modals/NewRentalModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';
import { AddCustomerModal, CustomerFormData } from './components/modals/AddCustomerModal';
import { ReceiveReturnModal } from './components/modals/ReceiveReturnModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { AddEquipmentModal } from './components/modals/AddEquipmentModal';

import {
  initialDashboardData,
  allRentalsData,
  rentalsKpiData,
  allCustomersData,
  customersKpiData,
  allInventoryData,
  inventoryKpiData,
  paymentsKpiData,
  allPaymentsData,
  initialAnalyticsData,
  initialMessagesData,
  initialDocumentsData,
  initialSettingsData,
} from './data/mockData';
import {
  AnalyticsData,
  CustomerItem,
  DashboardData,
  InventoryItem,
  PaymentItem,
  RentalItem,
  MessagesData,
  MessageHistoryItem,
  DocumentItem,
  DocumentsData,
  SettingsData,
  EmployeeItem,
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-rental' | 'rentals' | 'customers' | 'inventory' | 'payments' | 'analytics' | 'messages' | 'settings' | string>('dashboard');
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [appConfig, setAppConfig] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(null);
  
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialDashboardData);
  const [rentals, setRentals] = useState<RentalItem[]>(allRentalsData);
  const [customers, setCustomers] = useState<CustomerItem[]>(allCustomersData);
  const [inventory, setInventory] = useState<InventoryItem[]>(allInventoryData);
  const [payments, setPayments] = useState<PaymentItem[]>(allPaymentsData);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(initialAnalyticsData);
  const [messagesData, setMessagesData] = useState<MessagesData>(initialMessagesData);
  const [documentsData, setDocumentsData] = useState<DocumentsData>(initialDocumentsData);
  const [settingsData, setSettingsData] = useState<SettingsData>(initialSettingsData);

  // Modals state
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerItem | Partial<CustomerItem> | undefined>(undefined);
  const [customerCreatedCallback, setCustomerCreatedCallback] = useState<((customer: CustomerItem) => void) | null>(null);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<InventoryItem | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load data from Electron SQLite
  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI?.getAppConfig) {
        try {
          const config = await window.electronAPI.getAppConfig();
          setAppConfig(config);
          const hasOwnerAccount = Boolean(config.owner_name && config.owner_password);
          setIsSetupComplete(hasOwnerAccount);
        } catch (err) {
          console.error('Error fetching app config:', err);
          setIsSetupComplete(false);
        }
      } else {
        const localOwnerName = localStorage.getItem('ll_owner_name');
        const localOwnerPass = localStorage.getItem('ll_owner_password');
        if (localOwnerName && localOwnerPass) {
          setAppConfig({ owner_name: localOwnerName, owner_password: localOwnerPass });
          setIsSetupComplete(true);
        } else {
          setIsSetupComplete(false);
        }
      }

      if (window.electronAPI?.getDashboardData) {
        try {
          const dbData = await window.electronAPI.getDashboardData();
          if (dbData) {
            setDashboardData(dbData);
          }
        } catch (err) {
          console.error('Error fetching SQLite dashboard data:', err);
        }
      }

      if (window.electronAPI?.getAllRentals) {
        try {
          const allRnts = await window.electronAPI.getAllRentals();
          setRentals(allRnts || []);
        } catch (err) {
          console.error('Error fetching all rentals from SQLite:', err);
        }
      }

      if (window.electronAPI?.getCustomers) {
        try {
          const allCusts = await window.electronAPI.getCustomers();
          setCustomers(allCusts || []);
        } catch (err) {
          console.error('Error fetching customers from SQLite:', err);
        }
      }

      if (window.electronAPI?.getInventory) {
        try {
          const allInv = await window.electronAPI.getInventory();
          setInventory(allInv || []);
        } catch (err) {
          console.error('Error fetching inventory from SQLite:', err);
        }
      }

      if (window.electronAPI?.getPayments) {
        try {
          const allPays = await window.electronAPI.getPayments();
          setPayments(allPays || []);
        } catch (err) {
          console.error('Error fetching payments from SQLite:', err);
        }
      }

      if (window.electronAPI?.getAnalyticsData) {
        try {
          const aData = await window.electronAPI.getAnalyticsData();
          if (aData) {
            setAnalyticsData(aData);
          }
        } catch (err) {
          console.error('Error fetching analytics from SQLite:', err);
        }
      }

      if (window.electronAPI?.getMessagesData) {
        try {
          const mData = await window.electronAPI.getMessagesData();
          if (mData) {
            setMessagesData(mData);
          }
        } catch (err) {
          console.error('Error fetching messages from SQLite:', err);
        }
      }

      if (window.electronAPI?.getDocumentsData) {
        try {
          const dData = await window.electronAPI.getDocumentsData();
          if (dData) {
            setDocumentsData(dData);
          }
        } catch (err) {
          console.error('Error fetching documents from SQLite:', err);
        }
      }

      if (window.electronAPI?.getSettingsData) {
        try {
          const sData = await window.electronAPI.getSettingsData();
          if (sData) {
            setSettingsData(sData);
          }
        } catch (err) {
          console.error('Error fetching settings from SQLite:', err);
        }
      }
    };

    loadData();
  }, []);

  // Keyboard shortcut for Ctrl+K (Quick Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Step 2: Subscribe to native menu actions (File, View, etc.) ─────────
  // The main process sends these via ipcRenderer after a menu item is clicked.
  useEffect(() => {
    if (!window.electronAPI?.onMenuAction) return;

    const unsub = window.electronAPI.onMenuAction((action: string, payload?: string) => {
      if (action === 'navigate' && payload) {
        setActiveTab(payload);
      } else if (action === 'search') {
        setIsSearchModalOpen(true);
      } else if (action === 'backup') {
        handleTriggerBackup().then(() => showToast('Backup completed successfully!'));
      } else if (action === 'export') {
        showToast('Export feature coming soon…');
      } else if (action === 'import') {
        showToast(`Import from: ${payload}`);
      }
    });

    return unsub; // clean up on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Handlers for quick actions
  const handleQuickAction = (action: 'rental' | 'customer' | 'return' | 'payment') => {
    if (action === 'rental') setActiveTab('new-rental');
    if (action === 'customer') setIsCustomerModalOpen(true);
    if (action === 'return') setIsReturnModalOpen(true);
    if (action === 'payment') setIsPaymentModalOpen(true);
  };

  // New rental creation
  const handleCreateRental = async (newRentalData: Partial<RentalItem>) => {
    try {
      if (window.electronAPI?.createRental) {
        const saved = await window.electronAPI.createRental(newRentalData);
        setRentals((prev) => [saved, ...prev]);
        setDashboardData((prev) => ({
          ...prev,
          rentals: [saved, ...prev.rentals.slice(0, 3)],
        }));
      } else {
        const newEntry: RentalItem = {
          id: Date.now(),
          rental_code: newRentalData.rental_code || `RNT-2025-${Math.floor(100 + Math.random() * 900)}`,
          customer_name: newRentalData.customer_name || 'Customer',
          customer_phone: newRentalData.customer_phone || '+91 98765 00000',
          equipment_name: newRentalData.equipment_name || 'Gear Item',
          pickup_date: newRentalData.pickup_date || '27 May 2025 10:00 AM',
          return_time: newRentalData.return_time || 'Today, 8:00 PM',
          amount: newRentalData.amount || 0,
          payment_status: newRentalData.payment_status || 'Paid',
          status: newRentalData.status || 'Active',
        };
        setRentals((prev) => [newEntry, ...prev]);
        setDashboardData((prev) => ({
          ...prev,
          rentals: [newEntry, ...prev.rentals.slice(0, 3)],
        }));
      }
      showToast(`Rental ${newRentalData.rental_code} created successfully!`);
    } catch (err) {
      console.error('Failed to create rental:', err);
      showToast('Error creating rental');
    }
  };

  // Update status (e.g. Return, Paid)
  const handleUpdateStatus = async (id: number, status: string, payment_status: string) => {
    if (window.electronAPI?.updateRentalStatus) {
      await window.electronAPI.updateRentalStatus(id, status, payment_status);
    }
    const matchedRental = rentals.find((r) => r.id === id);
    if (matchedRental && payment_status === 'Paid' && matchedRental.payment_status !== 'Paid') {
      const newPay: Partial<PaymentItem> = {
        transaction_id: `TXN-2025-${Math.floor(1000 + Math.random() * 9000)}`,
        rental_id: matchedRental.rental_code,
        customer_name: matchedRental.customer_name,
        type: 'Rental',
        mode: 'Cash',
        amount: matchedRental.amount,
        collected_by: 'Staff',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: 'Today',
        status: 'Paid',
        utr_reference: `REC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        notes: `Payment marked as paid for ${matchedRental.equipment_name}.`,
        equipment_name: matchedRental.equipment_name,
        rental_period: matchedRental.pickup_date || 'Current Rental',
      };
      if (window.electronAPI?.createPayment) {
        try {
          const saved = await window.electronAPI.createPayment(newPay);
          setPayments((prev) => [saved, ...prev]);
        } catch (e) {
          console.error(e);
        }
      } else {
        setPayments((prev) => [{ ...newPay, id: Date.now() } as PaymentItem, ...prev]);
      }
    }
    setRentals((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: status as any, payment_status: payment_status as any } : r
      )
    );
    setDashboardData((prev) => ({
      ...prev,
      rentals: prev.rentals.map((r) =>
        r.id === id ? { ...r, status: status as any, payment_status: payment_status as any } : r
      ),
    }));
    showToast(
      payment_status === 'Paid'
        ? `Rental ${matchedRental?.rental_code || ''} marked as Paid!`
        : 'Rental status updated'
    );
  };

  // Update customer notes
  const handleUpdateCustomerNotes = async (id: number, notes: string) => {
    if (window.electronAPI?.updateCustomerNotes) {
      await window.electronAPI.updateCustomerNotes(id, notes);
    }
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );
    showToast('Customer notes saved');
  };

  const handleUpdateCustomerVerification = async (id: number, status: string) => {
    if (window.electronAPI?.updateCustomerVerification) {
      await window.electronAPI.updateCustomerVerification(id, status);
    }
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verification: status as any } : c))
    );
    showToast(`Customer marked as ${status}`);
  };

  // Create new customer
  const handleCreateCustomer = async (data: CustomerFormData) => {
    try {
      if (window.electronAPI?.createCustomer) {
        const saved = await window.electronAPI.createCustomer(data);
        setCustomers((prev) => [saved, ...prev]);
        showToast(`Customer ${saved.name} registered successfully!`);
        if (customerCreatedCallback) {
          customerCreatedCallback(saved);
          setCustomerCreatedCallback(null);
        }
      } else {
        const initials = data.name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CU';
        const cleanAadhaar = data.aadhaar_number.replace(/\D/g, '');
        const maskedAadhaar = cleanAadhaar.length >= 4 ? `•••• •••• ${cleanAadhaar.slice(-4)}` : '•••• •••• ••••';
        const newCust: CustomerItem = {
          id: Date.now(),
          code: `CUST-0${customers.length + 1}`,
          name: data.name,
          primary_phone: data.primary_phone,
          alternate_phone: data.alternate_phone || '',
          location: data.address || '',
          address: data.address || '',
          aadhaar_number: data.aadhaar_number,
          verification: data.verification || 'Pending',
          total_rentals: 0,
          active_rentals: 0,
          outstanding_amount: 0,
          last_rental: 'New Customer',
          avatar_type: 'initials',
          avatar_text: initials,
          customer_since: 'Today',
          id_proof_type: 'Identity Proof (Aadhaar)',
          id_proof_masked: maskedAadhaar,
          notes: 'Newly registered customer.',
        };
        setCustomers((prev) => [newCust, ...prev]);
        showToast(`Customer ${data.name} registered successfully!`);
        if (customerCreatedCallback) {
          customerCreatedCallback(newCust);
          setCustomerCreatedCallback(null);
        }
      }
    } catch (err) {
      console.error('Failed to create customer:', err);
      showToast('Failed to register customer');
    }
  };

  // Update existing customer
  const handleUpdateCustomer = async (id: number, data: CustomerFormData) => {
    try {
      if (window.electronAPI?.updateCustomer) {
        const updated = await window.electronAPI.updateCustomer(id, data);
        setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
        showToast(`Customer ${updated.name} updated successfully!`);
      } else {
        const initials = data.name.trim().split(/\s+/).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'CU';
        const cleanAadhaar = data.aadhaar_number.replace(/\D/g, '');
        const maskedAadhaar = cleanAadhaar.length >= 4 ? `•••• •••• ${cleanAadhaar.slice(-4)}` : '•••• •••• ••••';
        setCustomers((prev) =>
          prev.map((c) => {
            if (c.id !== id) return c;
            return {
              ...c,
              name: data.name,
              primary_phone: data.primary_phone,
              alternate_phone: data.alternate_phone || '',
              location: data.address || '',
              address: data.address || '',
              aadhaar_number: data.aadhaar_number,
              verification: data.verification || c.verification,
              avatar_text: initials,
              id_proof_masked: maskedAadhaar,
            };
          })
        );
        showToast(`Customer ${data.name} updated successfully!`);
      }
    } catch (err) {
      console.error('Failed to update customer:', err);
      showToast('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    try {
      if (window.electronAPI?.deleteCustomer) {
        await window.electronAPI.deleteCustomer(id);
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showToast('Customer deleted successfully');
    } catch (err) {
      console.error('Failed to delete customer:', err);
      showToast('Failed to delete customer');
    }
  };

  const handleReturnProcessed = async (rentalId: number, condition: string, extraPenalty: number, paymentMode?: string) => {
    handleUpdateStatus(rentalId, 'Returned', 'Paid');
    
    if (extraPenalty > 0 && window.electronAPI?.createPayment) {
      const rental = rentals.find((r) => r.id === rentalId);
      if (rental) {
        const newPay: Partial<PaymentItem> = {
          transaction_id: `PEN-2025-0${543 + payments.length}`,
          rental_id: rental.rental_code,
          customer_name: rental.customer_name,
          amount: extraPenalty,
          mode: (paymentMode || 'UPI') as 'UPI' | 'Cash' | 'Card' | 'Bank Transfer',
          type: 'Late Fee',
          collected_by: 'Ravi Kumar',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: 'Paid',
          notes: `Late return penalty collected for ${rental.equipment_name}.`,
          equipment_name: rental.equipment_name,
          rental_period: rental.pickup_date || 'Current Rental',
        };
        try {
          const saved = await window.electronAPI.createPayment(newPay);
          setPayments((prev) => [saved, ...prev]);
          showToast(`Late penalty of ₹${extraPenalty} recorded successfully!`);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handlePaymentRecorded = async (rentalId: number) => {
    handleUpdateStatus(rentalId, 'Active', 'Paid');
    const matchedRental = rentals.find((r) => r.id === rentalId);
    if (matchedRental) {
      const newPay: Partial<PaymentItem> = {
        transaction_id: `PAY-2025-0${543 + payments.length}`,
        rental_id: matchedRental.rental_code,
        customer_name: matchedRental.customer_name,
        amount: matchedRental.amount,
        mode: 'UPI',
        type: 'Rental',
        collected_by: 'Ravi Kumar',
        date: '27 May 2025',
        time: 'Today',
        status: 'Paid',
        utr_reference: `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        notes: `Payment received for ${matchedRental.equipment_name}.`,
        equipment_name: matchedRental.equipment_name,
        rental_period: matchedRental.pickup_date || 'Current Rental',
      };
      if (window.electronAPI?.createPayment) {
        try {
          const saved = await window.electronAPI.createPayment(newPay);
          setPayments((prev) => [saved, ...prev]);
        } catch (e) {
          console.error(e);
        }
      } else {
        setPayments((prev) => [{ ...newPay, id: Date.now() } as PaymentItem, ...prev]);
      }
      showToast(`Payment of ₹${matchedRental.amount.toLocaleString('en-IN')} recorded successfully!`);
    }
  };

  const handleUpdatePaymentStatus = async (id: number, status: 'Paid' | 'Unpaid') => {
    try {
      if (window.electronAPI?.updatePaymentStatus) {
        await window.electronAPI.updatePaymentStatus(id, status);
      }
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      showToast(`Payment marked as ${status}`);
    } catch (e) {
      console.error('Failed to update payment status:', e);
      showToast('Failed to update payment status');
    }
  };

  const handleSendMessage = async (msg: Partial<MessageHistoryItem>) => {
    try {
      if (window.electronAPI?.sendMessage) {
        await window.electronAPI.sendMessage(msg);
      }
      return true;
    } catch (e) {
      console.error('Failed to send message:', e);
      return false;
    }
  };

  const handleUploadDocument = async (doc: Partial<DocumentItem>) => {
    try {
      if (window.electronAPI?.uploadDocument) {
        const saved = await window.electronAPI.uploadDocument(doc);
        setDocumentsData((prev) => ({
          ...prev,
          documents: [saved, ...prev.documents],
          counts: { ...prev.counts, all: prev.counts.all + 1 },
        }));
        showToast(`Document ${saved.document_name} uploaded successfully!`);
        return saved;
      }
    } catch (e) {
      console.error('Failed to upload document:', e);
    }
    const fallback: DocumentItem = {
      id: Date.now(),
      document_name: doc.document_name || 'New_Document.pdf',
      customer_name: doc.customer_name || 'Customer',
      rental_id: doc.rental_id || 'RNT-2025-001',
      type: doc.type || 'Identity Proof',
      file_type: doc.file_type || 'pdf',
      uploaded_on_date: '27 May 2025',
      uploaded_on_time: 'Just now',
      verified_by: 'Ravi Kumar',
      status: 'Verified',
      file_size: '1.0 MB',
      security: 'Encrypted • Access Logged',
    };
    setDocumentsData((prev) => ({
      ...prev,
      documents: [fallback, ...prev.documents],
      counts: { ...prev.counts, all: prev.counts.all + 1 },
    }));
    showToast(`Document ${fallback.document_name} uploaded!`);
    return fallback;
  };

  const handleSaveSettings = async (updated: Partial<SettingsData>) => {
    try {
      if (window.electronAPI?.saveSettingsData) {
        await window.electronAPI.saveSettingsData(updated);
      }
      setSettingsData((prev) => ({ ...prev, ...updated }));
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  };

  const handleAddEmployee = async (emp: Partial<EmployeeItem>): Promise<EmployeeItem> => {
    try {
      if (window.electronAPI?.addEmployee) {
        const added = await window.electronAPI.addEmployee(emp);
        setSettingsData((prev) => ({
          ...prev,
          employees: [...prev.employees, added],
        }));
        return added;
      }
    } catch (e) {
      console.error('Failed to add employee:', e);
    }
    const fallback: EmployeeItem = {
      id: Date.now(),
      name: emp.name || 'Staff',
      role: emp.role || 'Staff',
      email: emp.email || 'staff@camerahub.in',
      status: (emp.status as 'Active' | 'Inactive') || 'Active',
      phone: emp.phone || '',
    };
    setSettingsData((prev) => ({
      ...prev,
      employees: [...prev.employees, fallback],
    }));
    return fallback;
  };

  const handleUpdateEmployee = async (
    id: number,
    data: { name: string; phone: string; role: string; status: 'Active' | 'Inactive' }
  ): Promise<boolean> => {
    try {
      if (window.electronAPI?.updateEmployee) {
        await window.electronAPI.updateEmployee(
          id,
          data.name,
          data.role,
          `${data.name.toLowerCase().replace(/\s+/g, '.')}@camerahub.in`,
          data.status,
          data.phone
        );
      }
      setSettingsData((prev) => ({
        ...prev,
        employees: prev.employees.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      }));
      return true;
    } catch (e) {
      console.error('Failed to update employee:', e);
      return false;
    }
  };

  const handleRemoveEmployee = async (id: number): Promise<boolean> => {
    try {
      if (window.electronAPI?.removeEmployee) {
        await window.electronAPI.removeEmployee(id);
      }
      setSettingsData((prev) => ({
        ...prev,
        employees: prev.employees.filter((e) => e.id !== id),
      }));
      return true;
    } catch (e) {
      console.error('Failed to remove employee:', e);
      return false;
    }
  };

  const handleTriggerBackup = async () => {
    try {
      if (window.electronAPI?.triggerBackup) {
        return await window.electronAPI.triggerBackup();
      }
    } catch (e) {
      console.error('Failed to trigger backup:', e);
    }
    return true;
  };

  const handleSaveEquipment = async (data: Partial<InventoryItem>) => {
    if (equipmentToEdit) {
      if (window.electronAPI?.updateInventoryItem) {
        try {
          const updated = await window.electronAPI.updateInventoryItem(equipmentToEdit.id, data);
          setInventory((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
          showToast(`Equipment ${updated.name} updated successfully!`);
        } catch (e) {
          console.error(e);
        }
      } else {
        setInventory((prev) => prev.map((item) => (item.id === equipmentToEdit.id ? { ...item, ...data } as InventoryItem : item)));
        showToast(`Equipment updated successfully!`);
      }
    } else {
      if (window.electronAPI?.createInventoryItem) {
        try {
          const created = await window.electronAPI.createInventoryItem(data);
          setInventory((prev) => [...prev, created]);
          showToast(`Equipment ${created.name} added successfully!`);
        } catch (e) {
          console.error(e);
        }
      } else {
        const newItem = { ...data, id: Date.now() } as InventoryItem;
        setInventory((prev) => [...prev, newItem]);
        showToast(`Equipment added successfully!`);
      }
    }
  };

  const handleDeleteEquipment = async (id: number) => {
    if (window.electronAPI?.deleteInventoryItem) {
      try {
        await window.electronAPI.deleteInventoryItem(id);
        setInventory((prev) => prev.filter((item) => item.id !== id));
        showToast(`Equipment deleted successfully!`);
      } catch (e) {
        console.error(e);
      }
    } else {
      setInventory((prev) => prev.filter((item) => item.id !== id));
      showToast(`Equipment deleted successfully!`);
    }
  };

  const handleSetupComplete = async (username: string, password: string) => {
    if (window.electronAPI?.saveAppConfig) {
      await window.electronAPI.saveAppConfig({
        owner_name: username,
        owner_password: password
      });
    } else {
      localStorage.setItem('ll_owner_name', username);
      localStorage.setItem('ll_owner_password', password);
    }
    setAppConfig((prev) => ({ ...prev, owner_name: username, owner_password: password }));
    setIsSetupComplete(true);
    setCurrentUser({ name: username, role: 'Owner' });
    showToast(`Welcome, ${username}! Owner profile created.`);
  };

  if (isSetupComplete === null) {
    return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Custom Frameless Titlebar */}
      <Titlebar />

      {isSetupComplete === false ? (
        <SetupView
          initialUsername={appConfig.owner_name}
          onComplete={handleSetupComplete}
        />
      ) : !currentUser ? (
        <LoginView
          ownerName={appConfig.owner_name || ''}
          ownerPassword={appConfig.owner_password || ''}
          employees={settingsData.employees || []}
          onLogin={(user) => {
            setCurrentUser(user);
            showToast(`Welcome, ${user.name}! Signed in as ${user.role}.`);
          }}
        />
      ) : (
        <>
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              username={currentUser.name}
              role={currentUser.role}
              onLogout={() => {
                setCurrentUser(null);
                showToast('Logged out successfully.');
              }}
            />
            
            {activeTab === 'new-rental' ? (
              <NewRentalView
                customers={customers}
                inventory={inventory}
                onNavigateTab={setActiveTab}
                onCreateRentalBooking={handleCreateRental}
                onOpenSearch={() => setIsSearchModalOpen(true)}
                onOpenAddCustomer={(initialPhone, onCreated) => {
                  setCustomerToEdit({ primary_phone: initialPhone });
                  setCustomerCreatedCallback(() => onCreated);
                  setIsCustomerModalOpen(true);
                }}
              />
            ) : activeTab === 'settings' ? (
              <SettingsView
                data={settingsData}
                onSaveSettings={handleSaveSettings}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                onRemoveEmployee={handleRemoveEmployee}
                onTriggerBackup={handleTriggerBackup}
                onOpenSearch={() => setIsSearchModalOpen(true)}
              />
            ) : activeTab === 'messages' ? (
              <MessagesView
                data={messagesData}
                onSendMessage={handleSendMessage}
                onOpenSearch={() => setIsSearchModalOpen(true)}
              />
            ) : activeTab === 'analytics' ? (
              <AnalyticsView
                data={analyticsData}
                onOpenSearch={() => setIsSearchModalOpen(true)}
                onSelectCustomer={() => setActiveTab('customers')}
              />
            ) : activeTab === 'payments' ? (
              <PaymentsView
                payments={payments}
                kpiStats={paymentsKpiData}
                onOpenRecordPayment={() => setIsPaymentModalOpen(true)}
                onOpenSearch={() => setIsSearchModalOpen(true)}
                onViewRental={() => setActiveTab('rentals')}
                onViewCustomer={() => setActiveTab('customers')}
                onViewReceipt={(p) =>
                  showToast(`Receipt for ${p.transaction_id} (₹${p.amount.toLocaleString('en-IN')}) ready!`)
                }
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
              />
            ) : activeTab === 'inventory' ? (
              <InventoryView
                inventory={inventory}
                kpiStats={inventoryKpiData}
                onOpenAddEquipment={() => {
                  setEquipmentToEdit(null);
                  setIsEquipmentModalOpen(true);
                }}
                onEditEquipment={(item) => {
                  setEquipmentToEdit(item);
                  setIsEquipmentModalOpen(true);
                }}
                onDeleteEquipment={handleDeleteEquipment}
                onOpenSearch={() => setIsSearchModalOpen(true)}
                onViewRental={() => setActiveTab('rentals')}
              />
            ) : activeTab === 'customers' ? (
              <CustomersView
                customers={customers}
                kpiStats={customersKpiData}
                onOpenAddCustomer={() => {
                  setCustomerToEdit(undefined);
                  setIsCustomerModalOpen(true);
                }}
                onOpenSearch={() => setIsSearchModalOpen(true)}
                onViewAllRentals={() => setActiveTab('rentals')}
                onUpdateNotes={handleUpdateCustomerNotes}
                onUpdateVerification={handleUpdateCustomerVerification}
                onEditCustomer={(c) => {
                  setCustomerToEdit(c);
                  setIsCustomerModalOpen(true);
                }}
                onDeleteCustomer={handleDeleteCustomer}
              />
            ) : activeTab === 'rentals' ? (
              <RentalsView
                rentals={rentals}
                kpiStats={rentalsKpiData}
                onOpenNewRental={() => setActiveTab('new-rental')}
                onOpenSearch={() => setIsSearchModalOpen(true)}
                onUpdateStatus={handleUpdateStatus}
                onOpenReceiveReturn={() => setIsReturnModalOpen(true)}
              />
            ) : (
              <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
                <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
                  <StatsGrid stats={dashboardData.stats} />
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-7">
                      <QuickActions onActionClick={handleQuickAction} />
                    </div>
                    <div className="col-span-5">
                      <NeedsAttention
                        items={dashboardData.attention}
                        onViewAll={() => setActiveTab('rentals')}
                      />
                    </div>
                  </div>

                  <div>
                    <TodaysRentals
                      rentals={dashboardData.rentals}
                      onViewAll={() => setActiveTab('rentals')}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  </div>
                </div>
                <StatusBar />
              </main>
            )}
          </div>

          <NewRentalModal
            isOpen={isRentalModalOpen}
            onClose={() => setIsRentalModalOpen(false)}
            onSubmit={handleCreateRental}
          />
          <QuickSearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            rentals={rentals}
            equipment={dashboardData.topEquipment}
          />
          <AddCustomerModal
            isOpen={isCustomerModalOpen}
            onClose={() => {
              setIsCustomerModalOpen(false);
              setCustomerToEdit(undefined);
              setCustomerCreatedCallback(null);
            }}
            onSuccess={(data) => {
              if (customerToEdit && 'id' in customerToEdit && customerToEdit.id) {
                handleUpdateCustomer(customerToEdit.id as number, data);
              } else {
                handleCreateCustomer(data);
              }
              setIsCustomerModalOpen(false);
              setCustomerToEdit(undefined);
            }}
            initialData={customerToEdit}
          />
          <ReceiveReturnModal
            isOpen={isReturnModalOpen}
            onClose={() => setIsReturnModalOpen(false)}
            rentals={rentals}
            settings={settingsData.lateFeeRules}
            onReturnProcessed={handleReturnProcessed}
          />
          <RecordPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            rentals={rentals}
            onPaymentRecorded={handlePaymentRecorded}
          />
          <AddEquipmentModal
            isOpen={isEquipmentModalOpen}
            onClose={() => setIsEquipmentModalOpen(false)}
            onSave={handleSaveEquipment}
            itemToEdit={equipmentToEdit}
          />
        </>
      )}

      {toastMessage && (
        <div className="fixed bottom-12 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-50">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
};
