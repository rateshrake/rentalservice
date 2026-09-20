import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { InventoryItem } from '../../types';

interface EquipmentTableProps {
  equipment: InventoryItem[];
  selectedEquipmentId: number;
  onSelectEquipment: (item: InventoryItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  conditionFilter: string;
  onConditionFilterChange: (condition: string) => void;
  onEditEquipment?: (item: InventoryItem) => void;
  onDeleteEquipment?: (id: number) => void;
}

export const EquipmentTable: React.FC<EquipmentTableProps> = ({
  equipment,
  selectedEquipmentId,
  onSelectEquipment,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  conditionFilter,
  onConditionFilterChange,
  onEditEquipment,
  onDeleteEquipment,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const itemsPerPage = 8;

  React.useEffect(() => {
    const handleClick = () => setOpenDropdownId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Filter equipment
  const filteredItems = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCondition =
      conditionFilter === 'all' || item.condition.toLowerCase() === conditionFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCondition;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Rented Out':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Reserved':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Maintenance':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Damaged':
      default:
        return 'bg-red-50 text-red-700 border-red-200/80';
    }
  };

  const getConditionDot = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return { color: 'bg-emerald-500', label: 'Excellent' };
      case 'Good':
        return { color: 'bg-blue-500', label: 'Good' };
      case 'Needs Repair':
      default:
        return { color: 'bg-red-500', label: 'Needs Repair' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between h-full">
      {/* Table Toolbar: Search & Filters */}
      <div className="p-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              onStatusFilterChange(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer shadow-2xs"
          >
            <option value="all">Status: All</option>
            <option value="available">Available</option>
            <option value="rented out">Rented Out</option>
            <option value="maintenance">Maintenance</option>
            <option value="damaged">Damaged</option>
          </select>

          {/* Condition filter dropdown */}
          <select
            value={conditionFilter}
            onChange={(e) => {
              onConditionFilterChange(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer shadow-2xs"
          >
            <option value="all">Condition: All</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="needs repair">Needs Repair</option>
          </select>

          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-semibold text-slate-700 select-none">
              <th className="py-2.5 px-4 font-semibold">
                <div className="flex items-center gap-1">
                  <span>EQUIPMENT</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-2 font-semibold">SERIAL NO.</th>
              <th className="py-2.5 px-2 font-semibold">RATE / DAY</th>
              <th className="py-2.5 px-2 font-semibold">STATUS</th>
              <th className="py-2.5 px-2 font-semibold">ASSIGNED / DUE</th>
              <th className="py-2.5 px-2 font-semibold">CONDITION</th>
              <th className="py-2.5 pr-4 pl-2 font-semibold text-center w-8"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedItems.map((item) => {
              const isSelected = selectedEquipmentId === item.id;
              const isChecked = selectedIds.includes(item.id);
              const cond = getConditionDot(item.condition);

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectEquipment(item)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    isSelected ? 'bg-red-50/30' : ''
                  }`}
                >
                  {/* Equipment Info with Image Thumbnail */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 leading-snug truncate max-w-[150px]">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9.5px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {item.asset_id}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Serial Number */}
                  <td className="py-2.5 px-2 font-mono text-[11px] text-slate-600">
                    {item.serial_number}
                  </td>

                  {/* Rental Rate */}
                  <td className="py-2.5 px-2">
                    <span className="font-bold text-slate-900">
                      ₹{item.rental_rate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-0.5">/day</span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Assigned / Due */}
                  <td className="py-2.5 px-2">
                    {item.status === 'Rented Out' ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 text-xs">
                          {item.current_customer || 'Vikram Shah'}
                        </span>
                        <span className="text-[10.5px] text-slate-500">
                          Due {item.expected_return || '27 May 2025'}
                        </span>
                      </div>
                    ) : item.status === 'Reserved' ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-indigo-800 text-xs">
                          {item.current_customer || 'Reserved'}
                        </span>
                        <span className="text-[10.5px] text-slate-500">
                          From {item.expected_return || '29 May 2025'}
                        </span>
                      </div>
                    ) : item.status === 'Maintenance' ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-rose-700 text-xs">Service Bay</span>
                        <span className="text-[10.5px] text-rose-500">Scheduled Check</span>
                      </div>
                    ) : item.status === 'Damaged' ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-red-700 text-xs">Repair Center</span>
                        <span className="text-[10.5px] text-red-500">In Transit</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-medium text-emerald-700 text-xs">In Stock</span>
                        <span className="text-[10.5px] text-slate-400">Shelf A-02</span>
                      </div>
                    )}
                  </td>

                  {/* Condition Dot */}
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${cond.color}`} />
                      <span className="text-slate-700 text-xs font-medium">{cond.label}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 pr-4 pl-2 text-center relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                      }}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {openDropdownId === item.id && (
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(null);
                            onEditEquipment?.(item);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(null);
                            setItemToDelete(item);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                  No equipment found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/40">
        <span>
          Showing <strong className="text-slate-700">{filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
          <strong className="text-slate-700">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</strong> of{' '}
          <strong className="text-slate-700">{filteredItems.length}</strong> equipment
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#E11D48] text-white shadow-2xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal (In-App, No Electron window freeze) */}
      {itemToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setItemToDelete(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Equipment</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{itemToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = itemToDelete.id;
                  setItemToDelete(null);
                  onDeleteEquipment?.(id);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Delete Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
