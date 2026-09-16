import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PaymentModeSplitItem } from '../../types';

interface PaymentModeSplitCardProps {
  items: PaymentModeSplitItem[];
  totalRevenue: string;
}

export const PaymentModeSplitCard: React.FC<PaymentModeSplitCardProps> = ({
  items,
  totalRevenue,
}) => {
  // SVG Donut calculation
  // Radius = 56, Circumference = 2 * PI * 56 = 351.858
  const circumference = 2 * Math.PI * 56;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Payment Mode Split</h3>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs">
          <span>Last 30 Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="flex items-center gap-4 pt-3">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="18"
            />

            {/* Segments */}
            {items.map((item) => {
              const strokeLength = (item.percentage / 100) * circumference;
              const strokeOffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percentage;

              return (
                <circle
                  key={item.id}
                  cx="70"
                  cy="70"
                  r="54"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="18"
                  strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs font-extrabold text-slate-900 font-sans leading-tight">
              {totalRevenue}
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              Total Revenue
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 text-xs">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[80px]">
                  {item.mode}
                </span>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="text-slate-400 text-[11px]">{item.percentage}%</span>
                <span className="font-bold text-slate-900 text-xs">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
