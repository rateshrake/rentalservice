import React, { useState } from 'react';
import { MoreHorizontal, CheckCircle2, Clock } from 'lucide-react';
import { RentalItem } from '../types';

interface TodaysRentalsProps {
  rentals: RentalItem[];
  onViewAll?: () => void;
  onUpdateStatus?: (id: number, status: string, payment: string) => void;
}

export const TodaysRentals: React.FC<TodaysRentalsProps> = ({
  rentals,
  onViewAll,
  onUpdateStatus,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Due Today':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200">
            Due Today
          </span>
        );
      case 'On Time':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            On Time
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
            Overdue
          </span>
        );
      case 'Returned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Returned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    if (status === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">
          Today's Rentals ({rentals.length})
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
              <th className="pb-2.5 font-medium">Rental ID</th>
              <th className="pb-2.5 font-medium">Customer</th>
              <th className="pb-2.5 font-medium">Equipment</th>
              <th className="pb-2.5 font-medium">Return Time</th>
              <th className="pb-2.5 font-medium">Amount</th>
              <th className="pb-2.5 font-medium">Payment</th>
              <th className="pb-2.5 font-medium">Status</th>
              <th className="pb-2.5 font-medium text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {rentals.map((rental) => (
              <tr
                key={rental.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Rental ID */}
                <td className="py-3 font-bold text-slate-900">
                  {rental.rental_code}
                </td>

                {/* Customer */}
                <td className="py-3 font-semibold text-slate-800">
                  {rental.customer_name}
                </td>

                {/* Equipment */}
                <td className="py-3 text-slate-600 font-medium">
                  {rental.equipment_name}
                </td>

                {/* Return Time */}
                <td className="py-3 text-slate-500">
                  {rental.return_time}
                </td>

                {/* Amount */}
                <td className="py-3 font-bold text-slate-900">
                  ₹{rental.amount.toLocaleString('en-IN')}
                </td>

                {/* Payment */}
                <td className="py-3">
                  {getPaymentBadge(rental.payment_status)}
                </td>

                {/* Status */}
                <td className="py-3">
                  {getStatusBadge(rental.status)}
                </td>

                {/* Action */}
                <td className="py-3 text-right pr-2 relative">
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === rental.id ? null : rental.id)
                    }
                    className="p-1 hover:bg-slate-200/80 rounded-md text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* Context dropdown menu */}
                  {activeMenuId === rental.id && (
                    <div className="absolute right-2 top-10 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 min-w-[140px] text-left text-xs">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
