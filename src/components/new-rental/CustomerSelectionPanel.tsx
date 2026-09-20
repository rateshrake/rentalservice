import React, { useState, useEffect } from 'react';
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
  UserPlus,
} from 'lucide-react';
import { CustomerItem } from '../../types';

interface CustomerSelectionPanelProps {
  selectedCustomer: CustomerItem | null;
  allCustomers: CustomerItem[];
  onSelectCustomer: (customer: CustomerItem) => void;
  onEditCustomer?: (customer: CustomerItem) => void;
  onViewAllRentals?: () => void;
  onAddNewCustomer?: (searchQuery: string) => void;
}

export const CustomerSelectionPanel: React.FC<CustomerSelectionPanelProps> = ({
  selectedCustomer,
  allCustomers,
  onSelectCustomer,
  onEditCustomer,
  onViewAllRentals,
  onAddNewCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customerRentals, setCustomerRentals] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCustomer && window.electronAPI?.getAllRentals) {
      window.electronAPI.getAllRentals().then(all => {
        const filtered = all.filter((r: any) => r.customer_name === selectedCustomer.name).sort((a: any, b: any) => b.id - a.id);
        setCustomerRentals(filtered);
      }).catch(console.error);
    } else {
      setCustomerRentals([]);
    }
  }, [selectedCustomer]);

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
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${
                      cust.verification === 'Verified'
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-amber-600 bg-amber-50'
                    }`}>
                      {cust.verification}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-center flex flex-col items-center gap-2">
                  <span className="text-slate-500">No matching customer found</span>
                  <button
                    onClick={() => {
                      onAddNewCustomer?.(searchQuery);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-1.5 bg-[#E11D48] hover:bg-rose-700 text-white font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Customer</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Customer Card */}
        {selectedCustomer ? (
          <div className="bg-[#FFF5F6]/40 border border-rose-100/90 rounded-xl p-4 mb-4 relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedCustomer.name}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    selectedCustomer.verification === 'Verified' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                      : 'bg-amber-50 text-amber-700 border-amber-200/80'
                  }`}>
                    {selectedCustomer.verification === 'Verified' ? 'Verified KYC' : 'Pending Verification'}
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
              <span>{selectedCustomer.address || selectedCustomer.location || 'Mumbai, Maharashtra'}</span>
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
        ) : (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 mb-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <UserCheck className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 font-medium">No customer selected</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
              Search above to select an existing customer or create a new one.
            </p>
          </div>
        )}
      </div>

      {/* Customer Rental History Card */}
      {selectedCustomer && (
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
                {customerRentals.length}
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
                {customerRentals.filter(r => r.status === 'Completed' || r.status === 'Returned').length}
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
                {customerRentals.filter(r => r.status === 'Active' || r.status === 'Ongoing').length}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Ongoing
              </div>
            </div>
          </div>
        </div>

        {/* Last Rental */}
        {customerRentals.length > 0 ? (
          <div className="bg-slate-50/60 border border-slate-200/60 rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Last Rental</span>
              <span className="font-semibold text-slate-800 text-[11px]">
                {customerRentals[0].rental_code} • {customerRentals[0].equipment_name}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {customerRentals[0].pickup_date}
            </span>
          </div>
        ) : (
          <div className="bg-slate-50/60 border border-slate-200/60 rounded-lg p-2.5 text-center text-xs text-slate-500">
            No rentals yet
          </div>
        )}
      </div>
      )}
    </div>
  );
};
