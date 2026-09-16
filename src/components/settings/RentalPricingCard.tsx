import React from 'react';
import { Tag, ChevronDown } from 'lucide-react';
import { RentalPricingSettings } from '../../types';

interface RentalPricingCardProps {
  pricing: RentalPricingSettings;
  onChange: (updated: Partial<RentalPricingSettings>) => void;
}

export const RentalPricingCard: React.FC<RentalPricingCardProps> = ({
  pricing,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
          <Tag className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">Rental Pricing</h2>
          <p className="text-[11px] text-slate-500">Default pricing and rental options</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3 flex-1 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Default Daily Rate (₹)
            </label>
            <input
              type="text"
              value={pricing.default_daily_rate?.toLocaleString('en-IN') || '1,000'}
              onChange={(e) =>
                onChange({
                  default_daily_rate: Number(e.target.value.replace(/[^0-9]/g, '')) || 0,
                })
              }
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Minimum Rental Period
            </label>
            <div className="relative">
              <select
                value={pricing.minimum_rental_period || '1 Day'}
                onChange={(e) => onChange({ minimum_rental_period: e.target.value })}
                className="w-full appearance-none px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-6"
              >
                <option value="1 Day">1 Day</option>
                <option value="2 Days">2 Days</option>
                <option value="3 Days">3 Days</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Security Deposit (₹)
            </label>
            <input
              type="text"
              value={pricing.security_deposit?.toLocaleString('en-IN') || '10,000'}
              onChange={(e) =>
                onChange({
                  security_deposit: Number(e.target.value.replace(/[^0-9]/g, '')) || 0,
                })
              }
              className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Discount for Long Rentals
            </label>
            <div className="relative">
              <select
                value={pricing.long_rental_discount || '10% (7+ days)'}
                onChange={(e) => onChange({ long_rental_discount: e.target.value })}
                className="w-full appearance-none px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-6"
              >
                <option value="10% (7+ days)">10% (7+ days)</option>
                <option value="15% (14+ days)">15% (14+ days)</option>
                <option value="20% (30+ days)">20% (30+ days)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Custom Pricing Toggle */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onChange({ allow_custom_pricing: !pricing.allow_custom_pricing })}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
              pricing.allow_custom_pricing ? 'bg-[#E11D48]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                pricing.allow_custom_pricing ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Allow custom pricing per customer
            </div>
            <div className="text-[11px] text-slate-500">
              Let managers set custom rates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
