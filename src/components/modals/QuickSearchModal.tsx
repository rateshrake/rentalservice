import React, { useState, useEffect } from 'react';
import { Search, X, Camera, User, FileText, ArrowRight } from 'lucide-react';
import { RentalItem, TopEquipmentItem } from '../../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentals: RentalItem[];
  equipment: TopEquipmentItem[];
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  rentals,
  equipment,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRentals = rentals.filter(
    (r) =>
      r.customer_name.toLowerCase().includes(query.toLowerCase()) ||
      r.rental_code.toLowerCase().includes(query.toLowerCase()) ||
      r.equipment_name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEquipment = equipment.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search customers, equipment, rentals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Rentals section */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Rentals & Bookings ({filteredRentals.length})
            </div>
            <div className="space-y-1">
              {filteredRentals.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                    <div>
                      <span className="font-semibold text-slate-900">
                        {r.rental_code}
                      </span>
                      <span className="text-slate-500 ml-2">
                        {r.customer_name} &bull; {r.equipment_name}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Equipment section */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Equipment Inventory ({filteredEquipment.length})
            </div>
            <div className="space-y-1">
              {filteredEquipment.slice(0, 4).map((eq) => (
                <div
                  key={eq.id}
                  onClick={onClose}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                    <span className="font-semibold text-slate-900">{eq.name}</span>
                  </div>
                  <span className="text-slate-500 font-medium">
                    ₹{eq.earnings.toLocaleString('en-IN')} earned
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press ESC to close</span>
          <span className="font-medium text-slate-700">CameraHub Global Quick Search</span>
        </div>
      </div>
    </div>
  );
};
