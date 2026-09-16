import React from 'react';
import { ChevronDown } from 'lucide-react';
import { TopEquipmentItem } from '../../types';

interface EquipmentRevenueRankingProps {
  items: TopEquipmentItem[];
}

export const EquipmentRevenueRanking: React.FC<EquipmentRevenueRankingProps> = ({ items }) => {
  const getEquipmentImage = (name: string) => {
    if (name.includes('Sony A7 IV')) {
      return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80';
    }
    if (name.includes('Canon R6')) {
      return 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&auto=format&fit=crop&q=80';
    }
    if (name.includes('DJI RS 4') || name.includes('Gimbal')) {
      return 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=100&auto=format&fit=crop&q=80';
    }
    if (name.includes('24-70mm')) {
      return 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=100&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=100&auto=format&fit=crop&q=80';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Equipment Revenue Ranking</h3>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs">
          <span>Last 30 Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Ranking Table */}
      <div className="flex-1 overflow-x-auto pt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-500 border-b border-slate-100/80">
              <th className="py-2 pl-2 w-8 font-semibold">#</th>
              <th className="py-2 px-2 font-semibold">Equipment</th>
              <th className="py-2 px-2 font-semibold text-center">Rentals</th>
              <th className="py-2 pr-2 font-semibold text-right">Revenue</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Rank # */}
                <td className="py-2.5 pl-2 font-bold text-slate-500 w-8">
                  {item.rank}
                </td>

                {/* Equipment Thumbnail + Name */}
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={getEquipmentImage(item.name)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold text-slate-900 truncate max-w-[150px]">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Rentals Count */}
                <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                  {item.rentals_count}
                </td>

                {/* Revenue */}
                <td className="py-2.5 pr-2 text-right font-extrabold text-slate-900 font-sans">
                  ₹{item.earnings.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
