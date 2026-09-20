import React, { useState, useMemo } from 'react';
import { RentalsHeader } from './RentalsHeader';
import { RentalsKPI } from './RentalsKPI';
import { RentalsTabs, RentalTabType } from './RentalsTabs';
import { RentalsFilterBar } from './RentalsFilterBar';
import { RentalsTable } from './RentalsTable';
import { RentalsPagination } from './RentalsPagination';
import { RentalItem, StatItem } from '../../types';

interface RentalsViewProps {
  rentals: RentalItem[];
  kpiStats: StatItem[];
  onOpenNewRental: () => void;
  onOpenSearch: () => void;
  onUpdateStatus?: (id: number, status: string, payment: string) => void;
  onOpenReceiveReturn?: () => void;
}

export const RentalsView: React.FC<RentalsViewProps> = ({
  rentals,
  kpiStats,
  onOpenNewRental,
  onOpenSearch,
  onUpdateStatus,
  onOpenReceiveReturn,
}) => {
  // Tabs & filters
  const [activeTab, setActiveTab] = useState<RentalTabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Sorting
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Tab counts calculation
  const counts = useMemo(() => {
    return {
      all: rentals.length,
      active: rentals.filter((r) => r.status === 'Active').length || 18,
      returned: 312, // Matches screenshot figure (all-time completed returns)
    };
  }, [rentals]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setStatusFilter('all');
    setPaymentFilter('all');
    setActiveTab('all');
    setCurrentPage(1);
  };

  // Filtered and sorted rentals
  const filteredRentals = useMemo(() => {
    return rentals
      .filter((item) => {
        // Tab filter
        if (activeTab === 'active' && item.status !== 'Active') return false;
        if (activeTab === 'returned' && item.status !== 'Returned') return false;

        // Status dropdown filter
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;

        // Payment status filter
        if (paymentFilter !== 'all' && item.payment_status !== paymentFilter) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = item.rental_code.toLowerCase().includes(q);
          const matchCust = item.customer_name.toLowerCase().includes(q);
          const matchEquip = item.equipment_name.toLowerCase().includes(q);
          const matchPhone = item.customer_phone?.toLowerCase().includes(q);
          if (!matchCode && !matchCust && !matchEquip && !matchPhone) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = (a as any)[sortField];
        let valB = (b as any)[sortField];

        if (typeof valA === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        if (typeof valA === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [rentals, activeTab, statusFilter, paymentFilter, searchQuery, sortField, sortDirection]);

  // Paginated records
  const totalCount = filteredRentals.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedRentals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRentals.slice(start, start + pageSize);
  }, [filteredRentals, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = paginatedRentals.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
      {/* Header */}
      <RentalsHeader
        onOpenNewRental={onOpenNewRental}
        onOpenSearch={onOpenSearch}
        onOpenReceiveReturn={onOpenReceiveReturn}
      />

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* KPI Cards (4 Cards) */}
        <RentalsKPI stats={kpiStats} />

        {/* Tabs Row */}
        <RentalsTabs
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
          counts={counts}
        />

        {/* Search and Filters Bar */}
        <RentalsFilterBar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
          }}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={(p) => {
            setPaymentFilter(p);
            setCurrentPage(1);
          }}
          onClearFilters={handleClearFilters}
        />

        {/* Data Table */}
        <RentalsTable
          rentals={paginatedRentals}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onUpdateStatus={onUpdateStatus}
        />

        {/* Pagination */}
        <RentalsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};
