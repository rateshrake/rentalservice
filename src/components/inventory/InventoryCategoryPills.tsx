import React from 'react';

export interface CategoryPillItem {
  id: string;
  label: string;
  count: number;
}

interface InventoryCategoryPillsProps {
  categories: CategoryPillItem[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const InventoryCategoryPills: React.FC<InventoryCategoryPillsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#E11D48] text-white shadow-xs hover:bg-[#BE123C]'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`ml-1.5 text-[11px] font-normal ${
                isActive ? 'text-rose-100' : 'text-slate-400'
              }`}
            >
              ({cat.count})
            </span>
          </button>
        );
      })}
    </div>
  );
};
