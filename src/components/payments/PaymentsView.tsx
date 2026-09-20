import React, { useState, useMemo } from 'react';
import { PaymentsHeader } from './PaymentsHeader';
import { PaymentsKPI } from './PaymentsKPI';
import { PaymentStatusTabs } from './PaymentStatusTabs';
import { PaymentsTable } from './PaymentsTable';
import { PaymentDetailsPanel } from './PaymentDetailsPanel';
import { PaymentItem, StatItem } from '../../types';

interface PaymentsViewProps {
  payments: PaymentItem[];
  kpiStats: StatItem[];
  onOpenRecordPayment: () => void;
  onOpenSearch: () => void;
  onViewRental?: (rentalId: string) => void;
  onViewCustomer?: (customerName: string) => void;
  onViewReceipt?: (payment: PaymentItem) => void;
  onUpdatePaymentStatus?: (id: number, status: 'Paid' | 'Unpaid') => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  kpiStats,
  onOpenRecordPayment,
  onOpenSearch,
  onViewRental,
  onViewCustomer,
  onViewReceipt,
  onUpdatePaymentStatus,
}) => {
  const [selectedPaymentId, setSelectedPaymentId] = useState<number>(
    payments[0]?.id || 1
  );
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selected payment item
  const selectedPayment = useMemo(() => {
    return (
      payments.find((p) => p.id === selectedPaymentId) ||
      payments[0]
    );
  }, [payments, selectedPaymentId]);

  // Status counts
  const counts = useMemo(() => {
    return {
      all: payments.length,
      paid: payments.filter((p) => p.status === 'Paid').length,
      unpaid: payments.filter((p) => p.status === 'Unpaid').length,
    };
  }, [payments]);

  // Filtered payments list
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesTab =
        activeStatusTab === 'all' ||
        p.status.toLowerCase() === activeStatusTab.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.transaction_id.toLowerCase().includes(q) ||
        p.rental_id.toLowerCase().includes(q) ||
        p.customer_name.toLowerCase().includes(q) ||
        p.mode.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.collected_by.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [payments, activeStatusTab, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
      {/* Top Header */}
      <PaymentsHeader
        onOpenRecordPayment={onOpenRecordPayment}
        onOpenSearch={onOpenSearch}
      />

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* 6 KPI Metric Cards */}
        <PaymentsKPI stats={kpiStats} />

        {/* Status Filter Tabs & Controls */}
        <PaymentStatusTabs
          activeTab={activeStatusTab}
          onSelectTab={(tab) => {
            setActiveStatusTab(tab);
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          counts={counts}
        />

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-12 gap-4 items-start min-h-[560px]">
          {/* Left Table: 8 columns (~68%) */}
          <div className="col-span-8 h-full">
            <PaymentsTable
              payments={filteredPayments}
              selectedPaymentId={selectedPaymentId}
              onSelectPayment={(p) => setSelectedPaymentId(p.id)}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPaymentsCount={payments.length}
            />
          </div>

          {/* Right Inspector Detail Panel: 4 columns (~32%) */}
          <div className="col-span-4 h-full">
            {selectedPayment && (
              <PaymentDetailsPanel
                payment={selectedPayment}
                onClose={() => {}}
                onViewRental={onViewRental}
                onViewCustomer={onViewCustomer}
                onViewReceipt={onViewReceipt}
                onUpdateStatus={onUpdatePaymentStatus}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
