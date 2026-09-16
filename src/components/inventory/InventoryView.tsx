import React, { useState, useMemo } from 'react';
import { InventoryHeader } from './InventoryHeader';
import { InventoryKPI } from './InventoryKPI';
import { InventoryCategoryPills, CategoryPillItem } from './InventoryCategoryPills';
import { EquipmentTable } from './EquipmentTable';
import { EquipmentInsightsPanel } from './EquipmentInsightsPanel';
import { InventoryItem, StatItem } from '../../types';

interface InventoryViewProps {
  inventory: InventoryItem[];
  kpiStats: StatItem[];
  onOpenAddEquipment?: () => void;
  onOpenSearch: () => void;
  onViewRental?: (rentalCode: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  kpiStats,
  onOpenAddEquipment,
  onOpenSearch,
  onViewRental,
}) => {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number>(
    inventory[0]?.id || 1
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');

  const selectedEquipment = useMemo(() => {
    return inventory.find((item) => item.id === selectedEquipmentId) || inventory[0];
  }, [inventory, selectedEquipmentId]);

  // Categories list matching screenshot
  const categories: CategoryPillItem[] = useMemo(() => {
    return [
      { id: 'all', label: 'All Equipment', count: 134 },
      { id: 'cameras', label: 'Cameras', count: 42 },
      { id: 'lenses', label: 'Lenses', count: 38 },
      { id: 'audio', label: 'Audio', count: 12 },
      { id: 'lighting', label: 'Lighting', count: 18 },
      { id: 'gimbals', label: 'Gimbals', count: 8 },
      { id: 'tripods', label: 'Tripods', count: 10 },
      { id: 'accessories', label: 'Accessories', count: 6 },
    ];
  }, []);

  // Filter inventory by category
  const filteredByCategory = useMemo(() => {
    if (activeCategory === 'all') return inventory;
    return inventory.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [inventory, activeCategory]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
      {/* Header */}
      <InventoryHeader
        onOpenAddEquipment={onOpenAddEquipment}
        onOpenSearch={onOpenSearch}
      />

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* KPI Cards (6 Grid) */}
        <InventoryKPI stats={kpiStats} />

        {/* Category Filter Pills */}
        <InventoryCategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-12 gap-4 items-start min-h-[580px]">
          {/* Left Table: 8 columns (~65%) */}
          <div className="col-span-8 h-full">
            <EquipmentTable
              equipment={filteredByCategory}
              selectedEquipmentId={selectedEquipmentId}
              onSelectEquipment={(item) => setSelectedEquipmentId(item.id)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              conditionFilter={conditionFilter}
              onConditionFilterChange={setConditionFilter}
            />
          </div>

          {/* Right Insights Detail Panel: 4 columns (~35%) */}
          <div className="col-span-4 h-full">
            {selectedEquipment && (
              <EquipmentInsightsPanel
                item={selectedEquipment}
                onClose={() => {}}
                onViewRental={onViewRental}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
