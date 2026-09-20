import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  CreditCard,
  User,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { CustomerItem, NewRentalPricing, NewRentalSchedule } from '../../types';
import { EquipmentListItem } from './EquipmentSelectionPanel';

interface ReviewConfirmStepPanelProps {
  customer: CustomerItem | null;
  selectedGear: Array<{ item: EquipmentListItem; quantity: number }>;
  schedule: NewRentalSchedule;
  pricing: NewRentalPricing;
  onBack: () => void;
  onNext: () => void;
}

export const ReviewConfirmStepPanel: React.FC<ReviewConfirmStepPanelProps> = ({
  customer,
  selectedGear = [],
  schedule,
  pricing,
  onBack,
  onNext,
}) => {
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [inspectionChecked, setInspectionChecked] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const durationDays = schedule?.durationDays && schedule.durationDays > 0 ? schedule.durationDays : 1;
  const isReadyToProceed = Boolean(customer && selectedGear.length > 0 && agreementChecked && inspectionChecked);

  const handleContinue = () => {
    if (!customer) {
      setValidationError('Please select a customer from the left panel before continuing to payment.');
      return;
    }
    if (selectedGear.length === 0) {
      setValidationError('Please select at least one piece of equipment for this rental.');
      return;
    }
    setValidationError(null);
    onNext();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-3xl mx-auto animate-in fade-in duration-150">
      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center justify-between">
          <span>{validationError}</span>
          <button 
            type="button" 
            onClick={() => setValidationError(null)} 
            className="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
      <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            4. Review Items & Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Please verify the rental contract details before finalizing.
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
          customer && selectedGear.length > 0
            ? 'bg-rose-50 text-[#E11D48] border-rose-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {customer && selectedGear.length > 0 ? 'Ready to Review' : 'Details Incomplete'}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {/* Customer & Schedule Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          {customer ? (
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Customer Details
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    customer.verification === 'Verified'
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                      : 'text-amber-600 bg-amber-50 border-amber-200'
                  }`}>
                    {customer.verification === 'Verified' && <ShieldCheck className="w-3 h-3" />}
                    {customer.verification === 'Verified' ? 'Verified KYC' : 'Pending Verification'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {customer.name || 'Customer'}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {customer.primary_phone || 'No contact provided'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ID: {customer.id_proof_masked || '•••• •••• 1234'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                    Customer Details
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    Selection Needed
                  </span>
                </div>
                <div className="flex items-center gap-3 my-1">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-xs">No Customer Selected</h4>
                    <p className="text-[11px] text-amber-700">
                      Select or create a customer from the left panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Card */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Rental Period
              </span>
              <span className="text-[11px] font-bold text-[#E11D48] bg-rose-50 px-2 py-0.5 rounded-md">
                {durationDays} Day{durationDays > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Pickup:</span>
                <span className="font-medium">
                  {schedule?.pickupDate || 'Today'} &bull; {schedule?.pickupTime || '10:00 AM'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Return:</span>
                <span className="font-medium">
                  {schedule?.returnDate || 'Tomorrow'} &bull; {schedule?.returnTime || '08:00 PM'}
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
              ₹{(pricing?.subtotalPerDay ?? 0).toLocaleString('en-IN')} / day
            </span>
          </div>

          {selectedGear.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 bg-white rounded-lg border border-dashed border-slate-200 mt-2">
              No equipment selected for this rental yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200/60">
              {selectedGear.map(({ item, quantity }) => (
                <div
                  key={item?.id ?? Math.random()}
                  className="py-2 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded bg-white border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={item?.imageUrl}
                        alt={item?.name || 'Equipment'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 truncate block">
                        {item?.name || 'Equipment Item'}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        ({item?.category || 'General'})
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-slate-600 font-medium">
                      Qty: {quantity} &bull; ₹{item?.dailyRate ?? 0} × {durationDays}d =
                    </span>{' '}
                    <span className="font-bold text-slate-900">
                      ₹{(((item?.dailyRate ?? 0) * quantity * durationDays)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-[#FFF5F6] border border-rose-100 rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/90 p-2.5 rounded-lg border border-rose-100">
              <span className="text-[10px] text-slate-500 block">Rental Charges</span>
              <span className="font-bold text-slate-900 text-xs">
                ₹{(pricing?.rentalAmount ?? 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded-lg border border-rose-100">
              <span className="text-[10px] text-slate-500 block">Refundable Deposit</span>
              <span className="font-bold text-slate-900 text-xs">
                ₹{(pricing?.securityDeposit ?? 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-200">
              <span className="text-[10px] text-emerald-700 block font-medium">
                Advance ({pricing?.paymentMode || 'UPI'})
              </span>
              <span className="font-bold text-emerald-700 text-xs">
                ₹{(pricing?.advancePaid ?? 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded-lg border border-rose-300">
              <span className="text-[10px] text-rose-600 block font-bold">
                Due at Return
              </span>
              <span className="font-bold text-[#E11D48] text-sm">
                ₹{(pricing?.balanceDue ?? 0).toLocaleString('en-IN')}
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
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Schedule</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!isReadyToProceed}
          className="px-6 py-2.5 bg-[#E11D48] hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Pricing & Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
