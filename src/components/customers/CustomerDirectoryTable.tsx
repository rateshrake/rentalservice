import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { CustomerItem } from '../../types';

interface CustomerDirectoryTableProps {
  customers: CustomerItem[];
  selectedCustomerId: number;
  onSelectCustomer: (customer: CustomerItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CustomerDirectoryTable: React.FC<CustomerDirectoryTableProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      {/* Directory Table Header with Title & Search */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold text-slate-900 shrink-0">
          Customer Directory ({customers.length})
        </h2>

        <div className="flex items-center gap-2 flex-1 justify-end max-w-sm">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-semibold text-slate-700 select-none">
              <th className="py-3 pl-4 pr-1 w-7">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                />
              </th>
              <th className="py-3 px-2 font-semibold">
                <div className="flex items-center gap-1">
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-2 font-semibold">Primary Phone</th>
              <th className="py-3 px-2 font-semibold">Alternate Phone</th>
              <th className="py-3 px-2 font-semibold text-center">Total Rentals</th>
              <th className="py-3 px-2 font-semibold text-center">Active Rentals</th>
              <th className="py-3 px-2 font-semibold">Outstanding Amount</th>
              <th className="py-3 px-2 font-semibold">Last Rental</th>
              <th className="py-3 pr-4 pl-2 font-semibold">Verification</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {customers.map((c) => {
              const isSelected = selectedCustomerId === c.id;

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-red-50/30' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-2.5 pl-4 pr-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectCustomer(c)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                    />
                  </td>

                  {/* Customer Avatar & Name */}
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2.5">
                      {c.avatar_type === 'photo' && c.avatar_img ? (
                        <img
                          src={c.avatar_img}
                          alt={c.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">
                          {c.avatar_text || c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {c.code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Primary Phone */}
                  <td className="py-2.5 px-2 text-slate-700 font-medium whitespace-nowrap text-[11px]">
                    {c.primary_phone}
                  </td>

                  {/* Alternate Phone */}
                  <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap text-[11px]">
                    {c.alternate_phone || '-'}
                  </td>

                  {/* Total Rentals */}
                  <td className="py-2.5 px-2 text-center text-slate-800 font-medium">
                    {c.total_rentals}
                  </td>

                  {/* Active Rentals */}
                  <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                    {c.active_rentals}
                  </td>

                  {/* Outstanding Amount */}
                  <td className="py-2.5 px-2 font-bold text-slate-900 whitespace-nowrap">
                    ₹{c.outstanding_amount.toLocaleString('en-IN')}
                  </td>

                  {/* Last Rental */}
                  <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap text-[11px]">
                    {c.last_rental}
                  </td>

                  {/* Verification */}
                  <td className="py-2.5 pr-4 pl-2 whitespace-nowrap">
                    {c.verification === 'Verified' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs select-none">
        <div className="text-slate-500 text-[11px]">
          Showing <span className="font-semibold text-slate-700">1–10</span> of{' '}
          <span className="font-semibold text-slate-700">248</span> customers
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md bg-[#E11D48] text-white text-xs font-bold">
              1
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 text-xs">
              2
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 text-xs">
              3
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 text-xs">
              4
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 text-xs">
              5
            </button>
            <span className="px-1 text-slate-400 text-xs">...</span>
            <button className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 text-xs">
              25
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs">
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Rows per page</span>
            <select className="appearance-none bg-white border border-slate-200 rounded-md pl-2 pr-5 py-1 text-xs font-medium text-slate-700 cursor-pointer">
              <option>10</option>
              <option>20</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
