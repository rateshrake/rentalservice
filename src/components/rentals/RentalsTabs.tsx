import React from 'react';

export type RentalTabType = 'all' | 'active' | 'returned';

interface RentalsTabsProps {
  activeTab: RentalTabType;
  onSelectTab: (tab: RentalTabType) => void;
  counts: {
    all: number;
    active: number;
    returned: number;
  };
}

export const RentalsTabs: React.FC<RentalsTabsProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  const tabs: { id: RentalTabType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'returned', label: 'Returned', count: counts.returned },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-slate-200/80 pt-2 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`pb-3 text-xs font-semibold relative transition-colors cursor-pointer ${
              isActive
                ? 'text-red-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className="ml-1 text-slate-400 font-medium">({tab.count})</span>

            {/* Bottom active indicator line */}
            {isActive && (
              <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-red-600 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
