import React, { useState } from 'react';
import { ArrowUpDown, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { RentalItem } from '../../types';

interface RentalsTableProps {
  rentals: RentalItem[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onUpdateStatus?: (id: number, status: string, payment: string) => void;
}

export const RentalsTable: React.FC<RentalsTableProps> = ({
  rentals,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  sortField,
  sortDirection,
  onSort,
  onUpdateStatus,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const isAllSelected = rentals.length > 0 && selectedIds.length === rentals.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Due Today':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200">
            Due Today
          </span>
        );
      case 'Returned':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Returned
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
            Overdue
          </span>
        );
      case 'Active':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Active
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Reserved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case 'Unpaid':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-white text-[11px] font-semibold text-slate-700 select-none">
              {/* Checkbox Header */}
              <th className="py-3.5 pl-4 pr-2 w-8">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                />
              </th>

              {/* Rental ID */}
              <th
                onClick={() => onSort('rental_code')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Rental ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Customer */}
              <th
                onClick={() => onSort('customer_name')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Equipment */}
              <th
                onClick={() => onSort('equipment_name')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Equipment</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Pickup */}
              <th
                onClick={() => onSort('pickup_date')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Pickup</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Return */}
              <th
                onClick={() => onSort('return_time')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Return</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Amount */}
              <th
                onClick={() => onSort('amount')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Payment Status */}
              <th
                onClick={() => onSort('payment_status')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Payment Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Rental Status */}
              <th
                onClick={() => onSort('status')}
                className="py-3.5 px-3 cursor-pointer hover:text-red-600 font-semibold transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Rental Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Actions */}
              <th className="py-3.5 pr-4 pl-2 text-right font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {rentals.map((rental) => {
              const isSelected = selectedIds.includes(rental.id);

              return (
                <tr
                  key={rental.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? 'bg-red-50/20' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(rental.id)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5 cursor-pointer"
                    />
                  </td>

                  {/* Rental ID */}
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {rental.rental_code}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">
                      {rental.customer_name}
                    </div>
                    {rental.customer_phone && (
                      <div className="text-[11px] text-slate-500 font-normal">
                        {rental.customer_phone}
                      </div>
                    )}
                  </td>

                  {/* Equipment */}
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {rental.equipment_name}
                  </td>

                  {/* Pickup */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {rental.pickup_date || '25 May 2025 10:00 AM'}
                  </td>

                  {/* Return */}
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {rental.return_time}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ₹{rental.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getPaymentBadge(rental.payment_status)}
                  </td>

                  {/* Rental Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getStatusBadge(rental.status)}
                  </td>

                  {/* Actions Menu */}
                  <td className="py-3 pr-4 pl-2 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === rental.id ? null : rental.id)
                      }
                      className="p-1 hover:bg-slate-200/80 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Context menu */}
                    {activeMenuId === rental.id && (
                      <div className="absolute right-2 top-10 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 min-w-[140px] text-left text-xs">
                        <button
                          onClick={() => {
                            onUpdateStatus?.(rental.id, 'Returned', 'Paid');
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Returned
                        </button>
                        <button
                          onClick={() => {
                            onUpdateStatus?.(rental.id, rental.status, 'Paid');
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => setActiveMenuId(null)}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-500"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
