import React, { useState } from 'react';
import {
  X,
  Check,
  Clock,
  RotateCcw,
  Copy,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  FileText,
  CreditCard,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PaymentItem } from '../../types';

interface PaymentDetailsPanelProps {
  payment: PaymentItem;
  onClose?: () => void;
  onViewRental?: (rentalId: string) => void;
  onViewCustomer?: (customerName: string) => void;
  onViewReceipt?: (payment: PaymentItem) => void;
  onUpdateStatus?: (paymentId: number, status: 'Paid' | 'Unpaid') => void;
}

export const PaymentDetailsPanel: React.FC<PaymentDetailsPanelProps> = ({
  payment,
  onClose,
  onViewRental,
  onViewCustomer,
  onViewReceipt,
  onUpdateStatus,
}) => {
  const [copiedUtr, setCopiedUtr] = useState(false);

  const handleCopyUtr = (utr?: string) => {
    if (!utr) return;
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Paid') {
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
        <Clock className="w-5 h-5 stroke-[2.5]" />
      </div>
    );
  };

  const getStatusPill = (status: string) => {
    if (status === 'Paid') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const statuses: ('Paid' | 'Unpaid')[] = ['Paid', 'Unpaid'];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full overflow-y-auto relative">
      <div>
        {/* Top bar header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Payment Details</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hero Card */}
        <div className="py-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {getStatusIcon(payment.status)}

              <div>
                <div className="font-extrabold text-slate-900 text-sm leading-tight">
                  {payment.transaction_id}
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                  {payment.type === 'Rental' ? 'Rental Payment' : payment.type}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Collected on {payment.date}, {payment.time}
                </div>
              </div>
            </div>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${getStatusPill(
                payment.status
              )}`}
            >
              {payment.status}
            </span>
          </div>
        </div>

        {/* Key-Value Details */}
        <div className="py-3 space-y-2.5 text-xs border-b border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Amount</span>
            <span className="font-extrabold text-slate-900 text-sm">
              ₹{payment.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Mode</span>
            <span className="font-semibold text-slate-800">{payment.mode}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Type</span>
            <span className="font-semibold text-slate-800">
              {payment.type === 'Rental' ? 'Rental Payment' : payment.type}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Rental ID</span>
            <button
              onClick={() => onViewRental?.(payment.rental_id)}
              className="font-bold text-[#E11D48] hover:underline cursor-pointer"
            >
              {payment.rental_id}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Customer</span>
            <button
              onClick={() => onViewCustomer?.(payment.customer_name)}
              className="font-bold text-[#E11D48] hover:underline cursor-pointer"
            >
              {payment.customer_name}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Collected By</span>
            <span className="font-medium text-slate-800">{payment.collected_by}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">UTR / Reference</span>
            <div className="flex items-center gap-1 font-mono text-slate-700">
              <span>{payment.utr_reference || 'UPI2874963201'}</span>
              <button
                onClick={() => handleCopyUtr(payment.utr_reference || 'UPI2874963201')}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Copy UTR"
              >
                {copiedUtr ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Payment Date</span>
            <span className="font-medium text-slate-800">
              {payment.date}, {payment.time}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Status</span>
            <div className="flex items-center gap-1.5 font-semibold">
              <span
                className={`w-2 h-2 rounded-full ${
                  payment.status === 'Paid' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <span className={payment.status === 'Paid' ? 'text-emerald-700' : 'text-rose-700'}>
                {payment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="py-3 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 mb-1">Notes</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {payment.notes || 'Payment received for rental order.'}
          </p>
        </div>

        {/* Related Rental Card */}
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">Related Rental</h4>
            <button
              onClick={() => onViewRental?.(payment.rental_id)}
              className="text-[11px] font-bold text-[#E11D48] hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>View Rental</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-slate-900 truncate">
                {payment.rental_id}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {payment.equipment_name || 'Sony A7 IV'} · {payment.rental_period || '21 May – 24 May 2025'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 relative">
        <button 
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer relative"
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>More Actions</span>
        </button>
        
        {showStatusMenu && (
          <div className="absolute bottom-12 left-0 w-40 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              Update Status
            </div>
            {statuses.map(status => (
              <button
                key={status}
                onClick={async () => {
                  setShowStatusMenu(false);
                  if (onUpdateStatus) {
                    onUpdateStatus(payment.id, status);
                  } else if (window.electronAPI?.updatePaymentStatus) {
                    await window.electronAPI.updatePaymentStatus(payment.id, status);
                    window.location.reload();
                  }
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 font-medium ${
                  payment.status === status
                    ? status === 'Paid'
                      ? 'text-emerald-600 bg-emerald-50/50'
                      : 'text-rose-600 bg-rose-50/50'
                    : 'text-slate-700'
                }`}
              >
                Mark as {status}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => onViewReceipt?.(payment)}
          className="flex-1 py-2 bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>View Receipt</span>
        </button>
      </div>
    </div>
  );
};
