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
  selectedItems: Record<number, number>; // id -> quantity
  onToggleSelect: (item: EquipmentListItem) => void;
  onUpdateQuantity: (itemId: number, delta: number) => void;
  onViewInventory?: () => void;
}

export const referenceEquipmentList: EquipmentListItem[] = [
  {
    id: 1,
    name: 'Sony A7 IV',
    category: 'Camera',
    categoryKey: 'cameras',
    availableCount: 8,
    dailyRate: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Canon R6 Mark II',
    category: 'Camera',
    categoryKey: 'cameras',
    availableCount: 5,
    dailyRate: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'DJI RS 4',
    category: 'Gimbal',
    categoryKey: 'stabilizers',
    availableCount: 6,
    dailyRate: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Sony 24-70mm GM II',
    category: 'Lens',
    categoryKey: 'lenses',
    availableCount: 4,
    dailyRate: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Sigma 85mm F1.4',
    category: 'Lens',
    categoryKey: 'lenses',
    availableCount: 6,
    dailyRate: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Rode Wireless GO II',
    category: 'Microphone',
    categoryKey: 'audio',
    availableCount: 10,
    dailyRate: 500,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Godox SL60W',
    category: 'Lighting',
    categoryKey: 'lighting',
    availableCount: 6,
    dailyRate: 800,
    imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=150&auto=format&fit=crop&q=80',
  },
];

export const EquipmentSelectionPanel: React.FC<EquipmentSelectionPanelProps> = ({
  selectedItems,
  onToggleSelect,
  onUpdateQuantity,
  onViewInventory,
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

  // Filter equipment
  const filteredList = referenceEquipmentList.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.categoryKey === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
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
      <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
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
    </div>
  );
};
