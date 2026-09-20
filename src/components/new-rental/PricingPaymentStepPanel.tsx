import React from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  Building2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Info,
  Clock,
} from 'lucide-react';
import { NewRentalPricing } from '../../types';

interface PricingPaymentStepPanelProps {
  pricing: NewRentalPricing;
  onChangePricing: (updates: Partial<NewRentalPricing>) => void;
  isSubmitting?: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export const PricingPaymentStepPanel: React.FC<PricingPaymentStepPanelProps> = ({
  pricing,
  onChangePricing,
  isSubmitting,
  onBack,
  onConfirm,
}) => {
  const paymentModes = [
    { id: 'UPI', label: 'UPI (GPay/PhonePe)', icon: QrCode },
    { id: 'Cash', label: 'Cash at Store', icon: Banknote },
    { id: 'Card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'Bank Transfer', label: 'Bank Transfer (NEFT/IMPS)', icon: Building2 },
    { id: 'Pay Later', label: 'Pay Later (On Return)', icon: Clock },
  ];

  const handleDepositChange = (val: number) => {
    const newDep = Math.max(0, val);
    const rentAmt = pricing?.rentalAmount ?? 0;
    const advPaid = pricing?.advancePaid ?? 0;
    const newTotal = rentAmt + newDep;
    const newBal = Math.max(0, newTotal - advPaid);
    onChangePricing({
      securityDeposit: newDep,
      totalAmount: newTotal,
      balanceDue: newBal,
    });
  };

  const handleAdvanceChange = (val: number) => {
    const newAdv = Math.max(0, val);
    const tot = pricing?.totalAmount ?? 0;
    const newBal = Math.max(0, tot - newAdv);
    onChangePricing({
      advancePaid: newAdv,
      balanceDue: newBal,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-3xl mx-auto animate-in fade-in duration-150">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          5. Pricing & Payment
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review pricing breakdown, set security deposit, and record advance collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Cost Breakdown & Adjustments */}
        <div className="space-y-4">
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
            <h3 className="font-bold text-slate-900 text-xs mb-3">Rental Fee Calculation</h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Daily Equipment Rate</span>
                <span className="font-semibold text-slate-900">
                  ₹{(pricing?.subtotalPerDay ?? 0).toLocaleString('en-IN')} / day
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Rental Duration</span>
                <span className="font-semibold text-slate-900">
                  {pricing?.rentalDays ?? 1} Day{(pricing?.rentalDays ?? 1) > 1 ? 's' : ''}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-800 font-bold">
                <span>Rental Subtotal</span>
                <span>₹{(pricing?.rentalAmount ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Refundable Security Deposit */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <label className="text-xs font-bold text-slate-900">
                  Refundable Security Deposit
                </label>
              </div>
              <span className="text-[10px] text-slate-400">Refunded at return</span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">
                ₹
              </span>
              <input
                type="number"
                value={pricing?.securityDeposit ?? 0}
                onChange={(e) => handleDepositChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Standard store deposit rule: ₹10,000 for high-end gear.
            </p>
          </div>
        </div>

        {/* Advance Collection & Payment Method */}
        <div className="space-y-4">
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
            <h3 className="font-bold text-slate-900 text-xs mb-3">Advance Collection</h3>

            <div className="mb-3">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Advance Amount Paid Now
              </label>
              {pricing?.paymentMode === 'Pay Later' ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Deferred Payment:</span> ₹0 advance recorded now. Status is marked as <span className="font-bold text-rose-700">Unpaid</span> until collected.
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={pricing?.advancePaid ?? 0}
                    onChange={(e) => handleAdvanceChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-2">
                Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {paymentModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = pricing?.paymentMode === mode.id;
                  const isPayLater = mode.id === 'Pay Later';
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        if (isPayLater) {
                          onChangePricing({
                            paymentMode: 'Pay Later',
                            advancePaid: 0,
                            balanceDue: pricing?.totalAmount ?? 0,
                          });
                        } else {
                          onChangePricing({ paymentMode: mode.id });
                        }
                      }}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isPayLater ? 'col-span-2 ' : ''
                      }${
                        isSelected
                          ? isPayLater
                            ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-bold shadow-2xs'
                            : 'border-[#E11D48] bg-rose-50/50 text-[#E11D48] font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected && isPayLater ? 'text-amber-600' : ''}`} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs truncate">{mode.label}</span>
                        {isPayLater && (
                          <span className="text-[10px] text-amber-700/80 font-normal">
                            Customer will pay later (Due on return)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Balance Due Card */}
          <div className="bg-[#FFF5F6] border border-rose-100 rounded-xl p-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-600">Total Booking Value:</span>
              <span className="font-bold text-slate-900">
                ₹{(pricing?.totalAmount ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs mb-1.5 text-emerald-700">
              <span>Advance Collected:</span>
              <span className="font-bold">
                - ₹{(pricing?.advancePaid ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="border-t border-rose-200 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-xs">Balance Due at Return:</span>
              <span className="font-bold text-[#E11D48] text-base">
                ₹{(pricing?.balanceDue ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Review</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className={`px-6 py-2.5 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
            pricing?.paymentMode === 'Pay Later'
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-[#E11D48] hover:bg-rose-700'
          }`}
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : (
            <>
              {pricing?.paymentMode === 'Pay Later' ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Confirm Booking (Pay Later)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Collected & Confirm</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
