import React from 'react';
import { AlertTriangle, CreditCard, ChevronRight } from 'lucide-react';
import { AttentionItem } from '../types';

interface NeedsAttentionProps {
  items: AttentionItem[];
  onItemClick?: (item: AttentionItem) => void;
  onViewAll?: () => void;
}

export const NeedsAttention: React.FC<NeedsAttentionProps> = ({
  items,
  onItemClick,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-slate-900">Needs Attention</h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* List items */}
      <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
        {items.map((item) => {
          const isOverdue = item.type === 'overdue';
          return (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="py-2.5 flex items-center justify-between hover:bg-slate-50/80 px-1 rounded-lg transition-colors cursor-pointer group"
            >
              {/* Left icon & text */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  {isOverdue ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 fill-red-50 stroke-[2.2]" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-red-600 stroke-[2.2]" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">
                    {isOverdue ? 'Overdue Rental' : 'Unpaid Payment'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.code} &bull; {item.party_name} &bull; {item.detail}
                  </span>
                </div>
              </div>

              {/* Right status badge with arrow */}
              <div className="flex items-center gap-0.5 text-red-600 text-[11px] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>{item.badge_text}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
