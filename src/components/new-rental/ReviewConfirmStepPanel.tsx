import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  User,
  ArrowLeft,
  Check,
  Camera,
  FileCheck,
} from 'lucide-react';
import { CustomerItem, NewRentalPricing, NewRentalSchedule } from '../../types';
import { EquipmentListItem } from './EquipmentSelectionPanel';

interface ReviewConfirmStepPanelProps {
  customer: CustomerItem;
  selectedGear: Array<{ item: EquipmentListItem; quantity: number }>;
  schedule: NewRentalSchedule;
  pricing: NewRentalPricing;
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export const ReviewConfirmStepPanel: React.FC<ReviewConfirmStepPanelProps> = ({
  customer,
  selectedGear,
  schedule,
  pricing,
  isSubmitting,
  onBack,
  onConfirm,
}) => {
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [inspectionChecked, setInspectionChecked] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-3xl mx-auto animate-in fade-in duration-150">
      <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            5. Review & Confirm Booking
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please verify the rental contract details before finalizing.
          </p>
        </div>
        <span className="px-3 py-1 bg-rose-50 text-[#E11D48] text-xs font-bold rounded-full border border-rose-200">
          Ready to Create
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {/* Customer & Schedule Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Customer Details
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                Verified KYC
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                {customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{customer.name}</h4>
                <p className="text-[11px] text-slate-500">{customer.primary_phone}</p>
                <p className="text-[10px] text-slate-400">
                  Aadhaar: {customer.id_proof_masked || '•••• •••• 1234'}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Rental Period
              </span>
              <span className="text-[11px] font-bold text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded-md">
                {schedule.durationDays} Day{schedule.durationDays > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Pickup:</span>
                <span className="font-medium">
                  {schedule.pickupDate} &bull; {schedule.pickupTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Return:</span>
                <span className="font-medium">
                  {schedule.returnDate} &bull; {schedule.returnTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Equipment Table */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Reserved Equipment ({selectedGear.length} Items)
            </span>
            <span className="text-xs font-bold text-slate-700">
              ₹{pricing.subtotalPerDay.toLocaleString('en-IN')} / day
            </span>
          </div>

          <div className="divide-y divide-slate-200/60">
            {selectedGear.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-white border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-slate-400 text-[11px] ml-2">
                      ({item.category})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-600 font-medium">
                    Qty: {quantity} &bull; ₹{item.dailyRate} × {schedule.durationDays}d =
                  </span>{' '}
                  <span className="font-bold text-slate-900">
                    ₹{(item.dailyRate * quantity * schedule.durationDays).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-[#FFF5F6] border border-rose-100 rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/90 p-2.5 rounded-lg border border-rose-100">
              <span className="text-[10px] text-slate-500 block">Rental Charges</span>
              <span className="font-bold text-slate-900 text-xs">
                ₹{pricing.rentalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded-lg border border-rose-100">
              <span className="text-[10px] text-slate-500 block">Refundable Deposit</span>
              <span className="font-bold text-slate-900 text-xs">
                ₹{pricing.securityDeposit.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block font-medium">
                Advance ({pricing.paymentMode})
              </span>
              <span className="font-bold text-emerald-700 text-xs">
                ₹{pricing.advancePaid.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded-lg border border-rose-300">
              <span className="text-[10px] text-rose-600 block font-bold">
                Due at Return
              </span>
              <span className="font-bold text-[#E11D48] text-sm">
                ₹{pricing.balanceDue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Checkbox verification */}
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="rounded-sm border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <span>
              Customer has signed rental terms and agreed to damage liability policy.
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inspectionChecked}
              onChange={(e) => setInspectionChecked(e.target.checked)}
              className="rounded-sm border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <span>
              All equipment accessories, serial numbers, and condition verified.
            </span>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Pricing</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting || !agreementChecked || !inspectionChecked}
          className="px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <span>Creating Booking...</span>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm & Create Rental Booking</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
