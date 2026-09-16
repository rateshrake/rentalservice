import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { RevenueTrendItem } from '../../types';

interface RevenueTrend30DProps {
  data: RevenueTrendItem[];
  summary: {
    totalRevenue: string;
    revenueChange: string;
  };
}

export const RevenueTrend30D: React.FC<RevenueTrend30DProps> = ({
  data,
  summary,
}) => {
  const [hoveredItem, setHoveredItem] = useState<RevenueTrendItem | null>(null);
  const maxRevenue = 45000; // Y-axis ceiling ~60K

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header with Title and Dropdown */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/60">
        <h3 className="font-bold text-slate-900 text-sm">Revenue Trend</h3>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs">
          <span>Last 30 Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Top Right Summary Indicator */}
      <div className="flex justify-end pt-2 pb-1">
        <div className="text-right">
          <div className="text-[11px] font-medium text-slate-500">Total Revenue</div>
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">
              {summary.totalRevenue}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              {summary.revenueChange}
            </span>
          </div>
          <div className="text-[10px] text-slate-400">vs. previous 30 days</div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-3 pb-1">
        {/* Horizontal Grid lines */}
        <div className="absolute inset-x-8 top-3 bottom-8 flex flex-col justify-between pointer-events-none">
          <div className="border-b border-slate-100 w-full" />
          <div className="border-b border-slate-100 w-full" />
          <div className="border-b border-slate-100 w-full" />
          <div className="border-b border-slate-100 w-full" />
          <div className="border-b border-slate-200 w-full" />
        </div>

        {/* Chart Layout: Y-Axis + Bars Area */}
        <div className="flex items-end gap-2 h-44">
          {/* Y-Axis labels */}
          <div className="flex flex-col justify-between h-36 text-[10px] text-slate-400 text-right pr-1 select-none w-8">
            <span>₹60K</span>
            <span>₹45K</span>
            <span>₹30K</span>
            <span>₹15K</span>
            <span>₹0</span>
          </div>

          {/* 30 Bars */}
          <div className="flex-1 flex items-end justify-between gap-1 h-36 px-1 relative">
            {data.map((item) => {
              const heightPercent = Math.min(100, Math.max(12, (item.revenue / maxRevenue) * 100));
              const isToday = item.is_current === 1;

              return (
                <div
                  key={item.id}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Floating tooltip */}
                  {hoveredItem?.id === item.id && (
                    <div className="absolute bottom-full mb-1.5 z-20 px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold whitespace-nowrap shadow-lg animate-in fade-in zoom-in-95">
                      <div>{item.date_label}</div>
                      <div className="text-rose-300 font-mono">₹{item.revenue.toLocaleString('en-IN')}</div>
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xs transition-all duration-200 ${
                      isToday
                        ? 'bg-[#E11D48] hover:bg-[#BE123C]'
                        : 'bg-rose-300/80 hover:bg-rose-400'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-Axis Selected Labels */}
        <div className="flex justify-between pl-10 pr-2 pt-2 text-[9.5px] text-slate-400 select-none">
          <span>28 Apr</span>
          <span>1 May</span>
          <span>4 May</span>
          <span>7 May</span>
          <span>10 May</span>
          <span>13 May</span>
          <span>16 May</span>
          <span>19 May</span>
          <span>22 May</span>
          <span>25 May</span>
          <span className="font-bold text-slate-700">27 May</span>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="pt-2 flex items-center gap-2 text-xs text-slate-600">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
        <span className="font-medium text-[11px]">Daily Revenue</span>
      </div>
    </div>
  );
};
