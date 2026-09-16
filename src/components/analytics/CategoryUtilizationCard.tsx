import React from 'react';
import { Camera, Disc, Activity, Zap, Mic, Briefcase, ChevronDown } from 'lucide-react';
import { CategoryUtilizationItem } from '../../types';

interface CategoryUtilizationCardProps {
  items: CategoryUtilizationItem[];
}

export const CategoryUtilizationCard: React.FC<CategoryUtilizationCardProps> = ({ items }) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera':
        return <Camera className="w-4 h-4 text-slate-700" />;
      case 'lens':
        return <Disc className="w-4 h-4 text-slate-700" />;
      case 'gimbal':
        return <Activity className="w-4 h-4 text-slate-700" />;
      case 'lighting':
        return <Zap className="w-4 h-4 text-slate-700" />;
      case 'audio':
        return <Mic className="w-4 h-4 text-slate-700" />;
      case 'accessories':
      default:
        return <Briefcase className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Equipment Utilization by Category</h3>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs">
          <span>Last 30 Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Utilization Bars List */}
      <div className="space-y-3.5 pt-3">
        {items.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3">
            {/* Icon + Label */}
            <div className="flex items-center gap-2.5 w-28 shrink-0">
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                {getCategoryIcon(cat.icon_name)}
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate">
                {cat.category}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                style={{ width: `${cat.utilization_rate}%` }}
                className="bg-[#E11D48] h-full rounded-full transition-all duration-300"
              />
            </div>

            {/* Percentage */}
            <span className="w-10 text-right text-xs font-bold text-slate-800 font-sans">
              {cat.utilization_rate}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
