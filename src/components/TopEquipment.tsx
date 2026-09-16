import React, { useState } from 'react';
import { ChevronDown, Camera, Aperture, Disc3 } from 'lucide-react';
import { TopEquipmentItem } from '../types';

interface TopEquipmentProps {
  items: TopEquipmentItem[];
}

export const TopEquipment: React.FC<TopEquipmentProps> = ({ items }) => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'camera':
        return <Camera className="w-4 h-4 text-slate-600" />;
      case 'gimbal':
        return <Disc3 className="w-4 h-4 text-slate-600" />;
      case 'lens':
      default:
        return <Aperture className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-slate-900">Top Earning Equipment</h2>
        <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
          <span>{timeRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
        {items.map((item) => (
          <div
            key={item.id}
            className="py-2 flex items-center justify-between hover:bg-slate-50/70 px-1 rounded-lg transition-colors"
          >
            {/* Left: Rank, Thumbnail, Name */}
            <div className="flex items-center gap-3">
              <span className="w-4 text-xs font-semibold text-slate-400 text-center">
                {item.rank}
              </span>

              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                {getCategoryIcon(item.category)}
              </div>

              <span className="text-xs font-bold text-slate-900">
                {item.name}
              </span>
            </div>

            {/* Right: Rental count & Earnings */}
            <div className="flex items-center gap-6">
              <span className="text-[11px] text-slate-500 font-medium">
                {item.rentals_count} rentals
              </span>
              <span className="text-xs font-bold text-slate-900 w-16 text-right">
                ₹{item.earnings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
