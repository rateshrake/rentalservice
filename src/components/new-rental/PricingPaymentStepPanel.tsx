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
} from 'lucide-react';
import { NewRentalPricing } from '../../types';

interface PricingPaymentStepPanelProps {
  pricing: NewRentalPricing;
  onChangePricing: (updates: Partial<NewRentalPricing>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const PricingPaymentStepPanel: React.FC<PricingPaymentStepPanelProps> = ({
  pricing,
  onChangePricing,
  onBack,
  onNext,
}) => {
  const paymentModes = [
    { id: 'UPI', label: 'UPI (GPay/PhonePe)', icon: QrCode },
    { id: 'Cash', label: 'Cash at Store', icon: Banknote },
    { id: 'Card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'Bank Transfer', label: 'Bank Transfer (NEFT/IMPS)', icon: Building2 },
  ];

  const handleDepositChange = (val: number) => {
    const newDep = Math.max(0, val);
    const newTotal = pricing.rentalAmount + newDep;
    const newBal = Math.max(0, newTotal - pricing.advancePaid);
    onChangePricing({
      securityDeposit: newDep,
      totalAmount: newTotal,
      balanceDue: newBal,
    });
  };

  const handleAdvanceChange = (val: number) => {
    const newAdv = Math.max(0, val);
    const newBal = Math.max(0, pricing.totalAmount - newAdv);
    onChangePricing({
      advancePaid: newAdv,
      balanceDue: newBal,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-3xl mx-auto animate-in fade-in duration-150">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          4. Pricing & Payment
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
                  ₹{pricing.subtotalPerDay.toLocaleString('en-IN')} / day
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Rental Duration</span>
                <span className="font-semibold text-slate-900">
                  {pricing.rentalDays} Day{pricing.rentalDays > 1 ? 's' : ''}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-800 font-bold">
                <span>Rental Subtotal</span>
                <span>₹{pricing.rentalAmount.toLocaleString('en-IN')}</span>
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
                value={pricing.securityDeposit}
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
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  value={pricing.advancePaid}
                  onChange={(e) => handleAdvanceChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-2">
                Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {paymentModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = pricing.paymentMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => onChangePricing({ paymentMode: mode.id })}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#E11D48] bg-rose-50/50 text-[#E11D48] font-bold shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs truncate">{mode.id}</span>
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
                ₹{pricing.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs mb-1.5 text-emerald-700">
              <span>Advance Collected:</span>
              <span className="font-bold">
                - ₹{pricing.advancePaid.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="border-t border-rose-200 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-xs">Balance Due at Return:</span>
              <span className="font-bold text-[#E11D48] text-base">
                ₹{pricing.balanceDue.toLocaleString('en-IN')}
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
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Schedule</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
