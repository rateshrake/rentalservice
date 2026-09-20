import React, { useState } from 'react';
import { ArrowDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { PaymentItem } from '../../types';

interface PaymentsTableProps {
  payments: PaymentItem[];
  selectedPaymentId: number;
  onSelectPayment: (payment: PaymentItem) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPaymentsCount: number;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  selectedPaymentId,
  onSelectPayment,
  currentPage,
  onPageChange,
  totalPaymentsCount,
}) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(payments.length / itemsPerPage) || 1;
  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    if (status === 'Paid') {
      return { dot: 'bg-emerald-500', text: 'text-emerald-700' };
    }
    return { dot: 'bg-rose-500', text: 'text-rose-700' };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      {/* Table Container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-semibold text-slate-700 select-none">
              <th className="py-3 px-3.5 font-semibold">Transaction ID</th>
              <th className="py-3 px-3 font-semibold">Rental ID</th>
              <th className="py-3 px-3 font-semibold">Customer</th>
              <th className="py-3 px-3 font-semibold">Amount</th>
              <th className="py-3 px-3 font-semibold">Mode</th>
              <th className="py-3 px-3 font-semibold">Type</th>
              <th className="py-3 px-3 font-semibold">Collected By</th>
              <th className="py-3 px-3 font-semibold">
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 pr-4 pl-3 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedPayments.map((p) => {
              const isSelected = selectedPaymentId === p.id;
              const statusStyle = getStatusBadge(p.status);

              return (
                <tr
                  key={p.id}
                  onClick={() => onSelectPayment(p)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-red-50/40' : ''
                  }`}
                >
                  {/* Transaction ID */}
                  <td className="py-3 px-3.5 font-bold text-slate-900 tracking-tight">
                    {p.transaction_id}
                  </td>

                  {/* Rental ID */}
                  <td className="py-3 px-3 font-mono text-[11.5px] text-slate-500">
                    {p.rental_id}
                  </td>

                  {/* Customer */}
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {p.customer_name}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 font-bold text-slate-900 font-sans">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Mode */}
                  <td className="py-3 px-3 text-slate-600">
                    {p.mode}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3 text-slate-600">
                    {p.type}
                  </td>

                  {/* Collected By */}
                  <td className="py-3 px-3 text-slate-600">
                    {p.collected_by}
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 text-[11.5px]">
                        {p.date}
                      </span>
                      <span className="text-[10.5px] text-slate-400">
                        {p.time}
                      </span>
                    </div>
                  </td>

                  {/* Status & Chevron */}
                  <td className="py-3 pr-4 pl-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                        <span className={`font-semibold text-xs ${statusStyle.text}`}>
                          {p.status}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedPayments.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                  No payment transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/40">
        <span>
          Showing{' '}
          <strong className="text-slate-700">
            {payments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, payments.length)}
          </strong>{' '}
          of <strong className="text-slate-700">{payments.length}</strong> payments
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#E11D48] text-white shadow-2xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
