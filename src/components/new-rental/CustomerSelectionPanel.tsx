import React, { useState } from 'react';
import {
  Search,
  X,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Pencil,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { CustomerItem } from '../../types';

interface CustomerSelectionPanelProps {
  selectedCustomer: CustomerItem;
  allCustomers: CustomerItem[];
  onSelectCustomer: (customer: CustomerItem) => void;
  onEditCustomer?: (customer: CustomerItem) => void;
  onViewAllRentals?: () => void;
}

export const CustomerSelectionPanel: React.FC<CustomerSelectionPanelProps> = ({
  selectedCustomer,
  allCustomers,
  onSelectCustomer,
  onEditCustomer,
  onViewAllRentals,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter customers based on search query
  const filteredCustomers = allCustomers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.primary_phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Panel Header */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            1. Customer
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Search for an existing customer or add a new one.
          </p>
        </div>

        {/* Search Bar with Autocomplete */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, mobile number or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-8 pr-8 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Customer Search Dropdown */}
          {isDropdownOpen && searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      onSelectCustomer(cust);
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-rose-50/60 flex items-center justify-between border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{cust.name}</span>
                      <span className="text-slate-400 text-[11px] ml-2">
                        {cust.primary_phone}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                      {cust.verification}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-slate-400">
                  No matching customer found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Customer Card */}
        <div className="bg-[#FFF5F6]/40 border border-rose-100/90 rounded-xl p-4 mb-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Initials Avatar */}
              <div className="w-11 h-11 rounded-full bg-slate-200/90 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                {selectedCustomer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedCustomer.name}
                  </h3>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200/80">
                    Existing Customer
                  </span>
                </div>

                {/* Phone row */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{selectedCustomer.primary_phone}</span>
                  {selectedCustomer.alternate_phone && (
                    <>
                      <span className="text-slate-300">|</span>
                      <span>{selectedCustomer.alternate_phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detail list */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-600">
            {selectedCustomer.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{selectedCustomer.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{selectedCustomer.location || 'Mumbai, Maharashtra'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="tracking-wide">
                Aadhaar: {selectedCustomer.id_proof_masked || '•••• •••• 1234'}
              </span>
            </div>
          </div>

          {/* Edit button */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onEditCustomer?.(selectedCustomer)}
              className="px-3 py-1 bg-white border border-rose-200 text-[#E11D48] text-xs font-semibold rounded-md hover:bg-rose-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Rental History Card */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900">
            Customer Rental History
          </span>
          <button
            onClick={onViewAllRentals}
            className="text-[11px] font-semibold text-[#E11D48] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Total Rentals */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight">
                {selectedCustomer.total_rentals || 8}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Total Rentals
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight">
                {Math.max((selectedCustomer.total_rentals || 8) - (selectedCustomer.active_rentals || 1), 7)}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Completed
              </div>
            </div>
          </div>

          {/* Ongoing */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-rose-50 border border-rose-200/80 flex items-center justify-center text-[#E11D48] shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight">
                {selectedCustomer.active_rentals || 1}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Ongoing
              </div>
            </div>
          </div>
        </div>

        {/* Last Rental */}
        <div className="bg-slate-50/60 border border-slate-200/60 rounded-lg p-2.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Last Rental</span>
            <span className="font-semibold text-slate-800 text-[11px]">
              RNT-2025-018 • Sony A7 IV + 24-70mm GM II
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            12 May 2025
          </span>
        </div>
      </div>
    </div>
  );
};
