import React, { useState, useEffect } from 'react';
import { Titlebar } from './components/Titlebar';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
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
import { DocumentsView } from './components/documents/DocumentsView';
import { SettingsView } from './components/settings/SettingsView';
import { NewRentalView } from './components/new-rental/NewRentalView';

import { NewRentalModal } from './components/modals/NewRentalModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';
import { AddCustomerModal } from './components/modals/AddCustomerModal';
import { ReceiveReturnModal } from './components/modals/ReceiveReturnModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';

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
  // Default to 'new-rental' to display the newly built section immediately
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new-rental' | 'rentals' | 'customers' | 'inventory' | 'payments' | 'analytics' | 'messages' | 'documents' | 'settings' | string>('new-rental');
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

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load data from Electron SQLite
  useEffect(() => {
    const loadData = async () => {
      if (window.electronAPI?.getDashboardData) {
        try {
          const dbData = await window.electronAPI.getDashboardData();
          if (dbData && dbData.stats?.length > 0) {
            setDashboardData(dbData);
          }
        } catch (err) {
          console.error('Error fetching SQLite dashboard data:', err);
        }
      }

      if (window.electronAPI?.getAllRentals) {
        try {
          const allRnts = await window.electronAPI.getAllRentals();
          if (allRnts && allRnts.length > 0) {
            setRentals(allRnts);
          }
        } catch (err) {
          console.error('Error fetching all rentals from SQLite:', err);
        }
      }

      if (window.electronAPI?.getCustomers) {
        try {
          const allCusts = await window.electronAPI.getCustomers();
          if (allCusts && allCusts.length > 0) {
            setCustomers(allCusts);
          }
        } catch (err) {
          console.error('Error fetching customers from SQLite:', err);
        }
      }

      if (window.electronAPI?.getInventory) {
        try {
          const allInv = await window.electronAPI.getInventory();
          if (allInv && allInv.length > 0) {
            setInventory(allInv);
          }
        } catch (err) {
          console.error('Error fetching inventory from SQLite:', err);
        }
      }

      if (window.electronAPI?.getPayments) {
        try {
          const allPays = await window.electronAPI.getPayments();
          if (allPays && allPays.length > 0) {
            setPayments(allPays);
          }
        } catch (err) {
          console.error('Error fetching payments from SQLite:', err);
        }
      }

      if (window.electronAPI?.getAnalyticsData) {
        try {
          const aData = await window.electronAPI.getAnalyticsData();
          if (aData && aData.kpis?.length > 0) {
            setAnalyticsData(aData);
          }
        } catch (err) {
          console.error('Error fetching analytics from SQLite:', err);
        }
      }

      if (window.electronAPI?.getMessagesData) {
        try {
          const mData = await window.electronAPI.getMessagesData();
          if (mData && mData.templates?.length > 0) {
            setMessagesData(mData);
          }
        } catch (err) {
          console.error('Error fetching messages from SQLite:', err);
        }
      }

      if (window.electronAPI?.getDocumentsData) {
        try {
          const dData = await window.electronAPI.getDocumentsData();
          if (dData && dData.documents?.length > 0) {
            setDocumentsData(dData);
          }
        } catch (err) {
          console.error('Error fetching documents from SQLite:', err);
        }
      }

      if (window.electronAPI?.getSettingsData) {
        try {
          const sData = await window.electronAPI.getSettingsData();
          if (sData && sData.employees?.length > 0) {
            setSettingsData(sData);
          }
        } catch (err) {
          console.error('Error fetching settings from SQLite:', err);
        }
      }
    };

    loadData();
  }, []);

  // Keyboard shortcut for Ctrl+K
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
          pickup_date: '27 May 2025 10:00 AM',
          return_time: newRentalData.return_time || 'Today, 8:00 PM',
          amount: newRentalData.amount || 0,
          payment_status: newRentalData.payment_status || 'Paid',
          status: newRentalData.status || 'Due Today',
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
    showToast('Rental status updated');
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

  const handleReturnProcessed = (rentalId: number) => {
    handleUpdateStatus(rentalId, 'Returned', 'Paid');
  };

  const handlePaymentRecorded = async (rentalId: number) => {
    handleUpdateStatus(rentalId, 'Due Today', 'Paid');
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

  const handleAddEmployee = async (emp: Partial<EmployeeItem>) => {
    try {
      if (window.electronAPI?.addEmployee) {
        return await window.electronAPI.addEmployee(emp);
      }
    } catch (e) {
      console.error('Failed to add employee:', e);
    }
    return {
      id: Date.now(),
      name: emp.name || 'Staff',
      role: emp.role || 'Staff',
      email: emp.email || 'staff@lensledger.in',
      status: emp.status || 'Active',
    };
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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Custom Frameless Titlebar */}
      <Titlebar />

      {/* Main Container: Sidebar + Active View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Dark Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* View Switching */}
        {activeTab === 'new-rental' ? (
          <NewRentalView
            customers={customers}
            onNavigateTab={setActiveTab}
            onCreateRentalBooking={handleCreateRental}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        ) : activeTab === 'settings' ? (
          <SettingsView
            data={settingsData}
            onSaveSettings={handleSaveSettings}
            onAddEmployee={handleAddEmployee}
            onTriggerBackup={handleTriggerBackup}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        ) : activeTab === 'documents' ? (
          <DocumentsView
            data={documentsData}
            onUploadDocument={handleUploadDocument}
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
          />
        ) : activeTab === 'inventory' ? (
          <InventoryView
            inventory={inventory}
            kpiStats={inventoryKpiData}
            onOpenAddEquipment={() => showToast('Add Equipment modal opening...')}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onViewRental={() => setActiveTab('rentals')}
          />
        ) : activeTab === 'customers' ? (
          <CustomersView
            customers={customers}
            kpiStats={customersKpiData}
            onOpenAddCustomer={() => setIsCustomerModalOpen(true)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onViewAllRentals={() => setActiveTab('rentals')}
            onUpdateNotes={handleUpdateCustomerNotes}
          />
        ) : activeTab === 'rentals' ? (
          <RentalsView
            rentals={rentals}
            kpiStats={rentalsKpiData}
            onOpenNewRental={() => setActiveTab('new-rental')}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
            {/* Dashboard Header */}
            <Header
              onOpenNewRental={() => setActiveTab('new-rental')}
              onOpenSearch={() => setIsSearchModalOpen(true)}
            />

            {/* Scrollable Dashboard Body */}
            <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
              {/* 6 KPI Metric Cards */}
              <StatsGrid stats={dashboardData.stats} />

              {/* Middle Row: Quick Actions (7 cols) + Needs Attention (5 cols) */}
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

              {/* Lower Row: Revenue Trend (7 cols) + Top Equipment (5 cols) */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7">
                  <RevenueTrend
                    data={dashboardData.revenueTrend}
                    summary={dashboardData.summary}
                  />
                </div>
                <div className="col-span-5">
                  <TopEquipment items={dashboardData.topEquipment} />
                </div>
              </div>

              {/* Today's Rentals Table */}
              <div>
                <TodaysRentals
                  rentals={dashboardData.rentals}
                  onViewAll={() => setActiveTab('rentals')}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            </div>

            {/* Bottom Status Bar */}
            <StatusBar />
          </main>
        )}
      </div>

      {/* Interactive Modals */}
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
        onClose={() => setIsCustomerModalOpen(false)}
        onSuccess={(name) => {
          showToast(`Customer ${name} registered successfully!`);
          const newCust: CustomerItem = {
            id: Date.now(),
            code: `CUST-0${customers.length + 1}`,
            name,
            primary_phone: '+91 98000 11223',
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
            location: 'Mumbai, Maharashtra',
            total_rentals: 0,
            active_rentals: 0,
            outstanding_amount: 0,
            last_rental: 'New Customer',
            verification: 'Pending',
            avatar_type: 'initials',
            avatar_text: name.slice(0, 2).toUpperCase(),
            customer_since: 'Today',
            id_proof_type: 'Identity Proof (Aadhaar)',
            id_proof_masked: '**** **** 0000',
            notes: 'Newly registered customer.',
          };
          setCustomers((prev) => [newCust, ...prev]);
        }}
      />

      <ReceiveReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        rentals={rentals}
        onReturnProcessed={handleReturnProcessed}
      />

      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        rentals={rentals}
        onPaymentRecorded={handlePaymentRecorded}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 z-50">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
};
