import React, { useState, useMemo } from 'react';
import { CustomersHeader } from './CustomersHeader';
import { CustomersKPI } from './CustomersKPI';
import { CustomerDirectoryTable } from './CustomerDirectoryTable';
import { CustomerDetailPanel } from './CustomerDetailPanel';
import { CustomerItem, StatItem } from '../../types';

interface CustomersViewProps {
  customers: CustomerItem[];
  kpiStats: StatItem[];
  onOpenAddCustomer: () => void;
  onOpenSearch: () => void;
  onViewAllRentals?: () => void;
  onUpdateNotes?: (id: number, notes: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  kpiStats,
  onOpenAddCustomer,
  onOpenSearch,
  onViewAllRentals,
  onUpdateNotes,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(customers[0]?.id || 1);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.primary_phone.includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
      {/* Header */}
      <CustomersHeader
        onOpenAddCustomer={onOpenAddCustomer}
        onOpenSearch={onOpenSearch}
      />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* KPI Cards (4 Cards) */}
        <CustomersKPI stats={kpiStats} />

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-12 gap-4 items-start min-h-[580px]">
          {/* Left: Customer Directory Table (8 cols / ~65%) */}
          <div className="col-span-8 h-full">
            <CustomerDirectoryTable
              customers={filteredCustomers}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={(c) => setSelectedCustomerId(c.id)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Right: Customer Detail Panel (4 cols / ~35%) */}
          <div className="col-span-4 h-full">
            {selectedCustomer && (
              <CustomerDetailPanel
                customer={selectedCustomer}
                onClose={() => {}}
                onUpdateNotes={onUpdateNotes}
                onViewAllRentals={onViewAllRentals}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
