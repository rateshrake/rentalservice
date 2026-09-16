import React, { useState } from 'react';
import { ChevronDown, ArrowUp } from 'lucide-react';
import { RevenueTrendItem } from '../types';

interface RevenueTrendProps {
  data: RevenueTrendItem[];
  summary: {
    totalRevenue: string;
    revenueChange: string;
    averageDaily: string;
    dailyChange: string;
  };
}

export const RevenueTrend: React.FC<RevenueTrendProps> = ({ data, summary }) => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  // Chart dimensions & scaling
  const maxRevenue = 40000;
  const yTicks = [
    { label: '₹40K', val: 40000 },
    { label: '₹30K', val: 30000 },
    { label: '₹20K', val: 20000 },
    { label: '₹10K', val: 10000 },
    { label: '₹0', val: 0 },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">Revenue Trend</h2>
        
        {/* Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Main content: Chart + Summary */}
      <div className="flex items-center gap-6">
        {/* Left: Bar Chart */}
        <div className="flex-1 flex flex-col justify-end pt-2">
          <div className="relative h-44 flex">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[10px] text-slate-400 pr-2 select-none h-36">
              {yTicks.map((tick) => (
                <span key={tick.label} className="leading-none text-right w-7">
                  {tick.label}
                </span>
              ))}
            </div>

            {/* Grid & Bars Container */}
            <div className="flex-1 relative flex flex-col justify-between">
              {/* Horizontal grid lines */}
              <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full border-b border-slate-100" />
                ))}
              </div>

              {/* Bars and X Labels */}
              <div className="h-36 flex items-end justify-between px-2 relative z-10">
                {data.map((item) => {
                  const barHeightPercent = Math.min(100, Math.max(8, (item.revenue / maxRevenue) * 100));
                  const isCurrent = item.is_current === 1;

                  return (
                    <div key={item.id} className="flex flex-col items-center group relative h-full justify-end w-8">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-md z-20">
                        ₹{item.revenue.toLocaleString('en-IN')}
                      </div>

                      {/* Bar */}
                      <div
                        style={{ height: `${barHeightPercent}%` }}
                        className={`w-6 rounded-t-sm transition-all duration-300 ${
                          isCurrent
                            ? 'bg-[#E11D48] hover:bg-[#BE123C]'
                            : 'bg-rose-300/80 hover:bg-rose-400/90'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="h-6 flex items-center justify-between px-2 pt-1.5 border-t border-slate-200 text-[10px] text-slate-500 font-medium">
                {data.map((item) => (
                  <span key={item.id} className="w-8 text-center">
                    {item.date_label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Summary Metrics */}
        <div className="w-40 border-l border-slate-100 pl-5 flex flex-col justify-center gap-4 shrink-0">
          <div>
            <span className="text-[11px] font-medium text-slate-500">Total Revenue</span>
            <div className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {summary.totalRevenue}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>{summary.revenueChange}</span>
              <span className="text-slate-500 font-normal">vs. previous week</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500">Average Daily</span>
            <div className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {summary.averageDaily}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>{summary.dailyChange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
