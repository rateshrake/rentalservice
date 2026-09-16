import React, { useState } from 'react';
import { X, Plus, Calendar, DollarSign, Camera, User } from 'lucide-react';
import { RentalItem } from '../../types';

interface NewRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rental: Partial<RentalItem>) => void;
}

export const NewRentalModal: React.FC<NewRentalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [equipmentName, setEquipmentName] = useState('Sony A7 IV');
  const [returnTime, setReturnTime] = useState('Today, 8:00 PM');
  const [amount, setAmount] = useState('4500');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [status, setStatus] = useState<'Due Today' | 'On Time'>('Due Today');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !equipmentName) return;

    const rentalCode = `RNT-2025-${Math.floor(100 + Math.random() * 900)}`;
    onSubmit({
      rental_code: rentalCode,
      customer_name: customerName,
      equipment_name: equipmentName,
      return_time: returnTime,
      amount: parseFloat(amount) || 0,
      payment_status: paymentStatus,
      status: status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">New Rental Booking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Equipment</label>
            <div className="relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="Sony A7 IV">Sony A7 IV</option>
                <option value="Canon R6 Mark II + 24-70mm GM II">Canon R6 Mark II + 24-70mm GM II</option>
                <option value="DJI RS 4">DJI RS 4 Gimbal</option>
                <option value="Sony 24-70mm GM II">Sony 24-70mm GM II</option>
                <option value="Sigma 85mm F1.4">Sigma 85mm F1.4</option>
                <option value="Blackmagic Cinema 6K">Blackmagic Cinema 6K</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Return Time</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Today, 8:00 PM"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
              <div className="relative">
                <span className="text-slate-400 absolute left-3 top-2 font-semibold">₹</span>
                <input
                  type="number"
                  placeholder="4500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Pending')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Due Today' | 'On Time')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
              >
                <option value="Due Today">Due Today</option>
                <option value="On Time">On Time</option>
              </select>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Create Rental
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
