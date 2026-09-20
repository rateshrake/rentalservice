import React, { useState } from 'react';
import { Search, Plus, Minus, Check } from 'lucide-react';
import { InventoryItem } from '../../types';

export interface EquipmentListItem {
  id: number;
  name: string;
  category: string;
  categoryKey: string;
  availableCount: number;
  dailyRate: number;
  imageUrl: string;
}

interface EquipmentSelectionPanelProps {
  inventory: InventoryItem[];
  selectedItems: Record<number, number>; // id -> quantity
  onToggleSelect: (item: EquipmentListItem) => void;
  onUpdateQuantity: (itemId: number, delta: number) => void;
  onViewInventory?: () => void;
  onNext?: () => void;
}


export const EquipmentSelectionPanel: React.FC<EquipmentSelectionPanelProps> = ({
  inventory,
  selectedItems,
  onToggleSelect,
  onUpdateQuantity,
  onViewInventory,
  onNext,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'cameras', label: 'Cameras' },
    { id: 'lenses', label: 'Lenses' },
    { id: 'stabilizers', label: 'Stabilizers' },
    { id: 'audio', label: 'Audio' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'accessories', label: 'Accessories' },
  ];

  // Map inventory to EquipmentListItem
  const equipmentList: EquipmentListItem[] = (inventory || []).map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    categoryKey: item.category.toLowerCase(), // Maps 'Cameras' to 'cameras'
    availableCount: item.status === 'Available' ? 1 : 0, // Since inventory might represent individual assets, just use 1 if available
    dailyRate: item.rental_rate,
    imageUrl: item.image_url,
  }));

  // Filter equipment
  const filteredList = equipmentList.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.categoryKey === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full min-h-0">
      {/* Header & View Inventory Button */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            2. Equipment
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Select equipment for this rental from your inventory.
          </p>
        </div>
        <button
          onClick={onViewInventory}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          View Inventory
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search equipment by name, category or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#E11D48] text-white font-semibold shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Equipment List */}
      <div className="space-y-2.5 overflow-y-auto flex-1 min-h-0 pr-1 scrollbar-thin">
        {filteredList.map((item) => {
          const isSelected = !!selectedItems[item.id];
          const quantity = selectedItems[item.id] || 0;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-rose-200/80 bg-[#FFF5F6]/20'
                  : 'border-slate-200/70 bg-white hover:border-slate-300'
              }`}
            >
              {/* Left: Checkbox + Image + Info */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Styled Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleSelect(item)}
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#E11D48] border-[#E11D48] text-white'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                {/* Equipment Thumbnail */}
                <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">{item.category}</p>
                </div>
              </div>

              {/* Middle: Available stock badge */}
              <div className="text-center px-2 shrink-0">
                <span className="text-[11px] font-medium text-emerald-600">
                  {item.availableCount} available
                </span>
              </div>

              {/* Right: Price & Counter / Add Button */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-xs">
                    ₹{item.dailyRate.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400">per day</div>
                </div>

                {isSelected ? (
                  /* Quantity Counter */
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  /* Red Add Button */
                  <button
                    type="button"
                    onClick={() => onToggleSelect(item)}
                    className="w-7 h-7 rounded-md bg-[#E11D48] hover:bg-rose-700 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    title="Add to rental"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      {onNext && (
        <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Continue to Schedule</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};
