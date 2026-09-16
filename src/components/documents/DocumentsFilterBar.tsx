import React from 'react';
import { FileText, User, Receipt, Calendar, ChevronDown, RotateCcw, Search } from 'lucide-react';

interface DocumentsFilterBarProps {
  documentType: string;
  onDocumentTypeChange: (type: string) => void;
  customer: string;
  onCustomerChange: (cust: string) => void;
  rentalId: string;
  onRentalIdChange: (rentalId: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onReset: () => void;
  onSearch: () => void;
}

export const DocumentsFilterBar: React.FC<DocumentsFilterBarProps> = ({
  documentType,
  onDocumentTypeChange,
  customer,
  onCustomerChange,
  rentalId,
  onRentalIdChange,
  dateRange,
  onDateRangeChange,
  onReset,
  onSearch,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs">
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Filter 1: Document Type */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                Document Type
              </div>
              <div className="relative mt-0.5">
                <select
                  value={documentType}
                  onChange={(e) => onDocumentTypeChange(e.target.value)}
                  className="w-full appearance-none bg-transparent text-xs font-semibold text-slate-800 pr-5 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All Types">All Types</option>
                  <option value="Identity Proof">Identity Proof</option>
                  <option value="Receipt">Receipt</option>
                  <option value="Agreement">Agreement</option>
                  <option value="Damage Photo">Damage Photo</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-0.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter 2: Customer */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                Customer
              </div>
              <div className="relative mt-0.5">
                <select
                  value={customer}
                  onChange={(e) => onCustomerChange(e.target.value)}
                  className="w-full appearance-none bg-transparent text-xs font-semibold text-slate-800 pr-5 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All Customers">All Customers</option>
                  <option value="Vikram Shah">Vikram Shah</option>
                  <option value="Aditi Rao">Aditi Rao</option>
                  <option value="Karan Films">Karan Films</option>
                  <option value="Neha Singh">Neha Singh</option>
                  <option value="Rohit Verma">Rohit Verma</option>
                  <option value="Sneha Kapoor">Sneha Kapoor</option>
                  <option value="Arjun Mehta">Arjun Mehta</option>
                  <option value="Priya Nair">Priya Nair</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-0.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter 3: Rental ID */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
            <Receipt className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                Rental ID
              </div>
              <div className="relative mt-0.5">
                <select
                  value={rentalId}
                  onChange={(e) => onRentalIdChange(e.target.value)}
                  className="w-full appearance-none bg-transparent text-xs font-semibold text-slate-800 pr-5 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All Rentals">All Rentals</option>
                  <option value="RNT-2025-021">RNT-2025-021</option>
                  <option value="RNT-2025-022">RNT-2025-022</option>
                  <option value="RNT-2025-023">RNT-2025-023</option>
                  <option value="RNT-2025-024">RNT-2025-024</option>
                  <option value="RNT-2025-025">RNT-2025-025</option>
                  <option value="RNT-2025-017">RNT-2025-017</option>
                  <option value="RNT-2025-014">RNT-2025-014</option>
                  <option value="RNT-2025-018">RNT-2025-018</option>
                  <option value="RNT-2025-019">RNT-2025-019</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-0.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter 4: Date Range */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                Date Range
              </div>
              <div className="relative mt-0.5">
                <select
                  value={dateRange}
                  onChange={(e) => onDateRangeChange(e.target.value)}
                  className="w-full appearance-none bg-transparent text-xs font-semibold text-slate-800 pr-5 focus:outline-none cursor-pointer truncate"
                >
                  <option value="01 May 2025 - 27 May 2025">01 May 2025 - 27 May 2025</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="This Month">This Month</option>
                  <option value="All Time">All Time</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-0.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions: Reset & Search */}
        <div className="col-span-12 md:col-span-12 lg:col-span-2 flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onSearch}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] text-white font-semibold text-xs rounded-lg shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer shrink-0"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};
