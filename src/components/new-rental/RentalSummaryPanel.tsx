import React from 'react';
import { Calendar, Info, ArrowRight } from 'lucide-react';
import { CustomerItem } from '../../types';
import { EquipmentListItem } from './EquipmentSelectionPanel';

interface SelectedGearSummaryItem {
  item: EquipmentListItem;
  quantity: number;
}

interface RentalSummaryPanelProps {
  customer: CustomerItem;
  selectedGear: SelectedGearSummaryItem[];
  rentalDays: number | null;
  durationLabel: string;
  depositAmount: number;
  advancePaidAmount: number;
  onChangeCustomer: () => void;
  onSetDates: () => void;
  onEditEquipment: () => void;
  onContinue: () => void;
}

export const RentalSummaryPanel: React.FC<RentalSummaryPanelProps> = ({
  customer,
  selectedGear,
  rentalDays,
  durationLabel,
  depositAmount,
  advancePaidAmount,
  onChangeCustomer,
  onSetDates,
  onEditEquipment,
  onContinue,
}) => {
  // Calculate daily subtotal
  const subtotalPerDay = selectedGear.reduce(
    (acc, curr) => acc + curr.item.dailyRate * curr.quantity,
    0
  );

  // Calculate rental amount (if days selected)
  const rentalAmount = rentalDays ? subtotalPerDay * rentalDays : 0;
  const totalAmount = rentalDays ? rentalAmount + depositAmount : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Title */}
        <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
          Rental Summary
        </h2>

        {/* Customer Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-900">Customer</span>
            <button
              onClick={onChangeCustomer}
              className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs">
                {customer.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {customer.primary_phone}
              </div>
            </div>
          </div>
        </div>

        {/* Rental Period Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-900">Rental Period</span>
            <button
              onClick={onSetDates}
              className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
            >
              Set Dates
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{durationLabel || 'Not selected yet'}</span>
          </div>
        </div>

        {/* Selected Equipment Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">
              Selected Equipment ({selectedGear.length})
            </span>
            <button
              onClick={onEditEquipment}
              className="text-xs font-semibold text-[#E11D48] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {selectedGear.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-2">
                No equipment selected
              </div>
            ) : (
              selectedGear.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-8 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ₹{item.dailyRate.toLocaleString('en-IN')} × {quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900">
                      ₹{(item.dailyRate * quantity).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400">per day</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calculations Breakdown */}
        <div className="border-t border-slate-200/80 pt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Duration</span>
            </div>
            <span className="font-medium text-slate-800">
              {rentalDays ? `${rentalDays} Days` : '-'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal (per day)</span>
            <span className="font-bold text-slate-900">
              ₹{subtotalPerDay.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Rental Days</span>
            <span className="font-medium text-slate-800">
              {rentalDays ? rentalDays : '-'}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-slate-600">
              <span>Rental Amount</span>
              <span className="font-semibold text-slate-900">
                ₹{rentalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-1">
                <span>Security Deposit (Refundable)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <span className="font-semibold text-slate-900">
                ₹{depositAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Advance Paid</span>
              <span className="font-semibold text-slate-900">
                ₹{advancePaidAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Total Amount Box */}
        <div className="mt-4 bg-[#FFF5F6] border border-rose-100 rounded-xl p-3.5 flex items-center justify-between">
          <span className="font-bold text-slate-900 text-sm">Total Amount</span>
          <span className="font-bold text-[#E11D48] text-lg">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-4 pt-2">
        <button
          onClick={onContinue}
          className="w-full py-3 px-4 bg-[#E11D48] hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
