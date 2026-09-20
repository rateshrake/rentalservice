import React, { useState } from 'react';
import { MoreHorizontal, CheckCircle2, Clock, CreditCard, RotateCcw, Check } from 'lucide-react';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Returned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Returned
          </span>
        );
      case 'Active':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-200">
            Active
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
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        Unpaid
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
