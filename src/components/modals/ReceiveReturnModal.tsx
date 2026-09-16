import React, { useState } from 'react';
import { X, RotateCcw, CheckCircle2 } from 'lucide-react';
import { RentalItem } from '../../types';

interface ReceiveReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentals: RentalItem[];
  onReturnProcessed: (rentalId: number) => void;
}

export const ReceiveReturnModal: React.FC<ReceiveReturnModalProps> = ({
  isOpen,
  onClose,
  rentals,
  onReturnProcessed,
}) => {
  const activeRentals = rentals.filter((r) => r.status !== 'Returned');
  const [selectedId, setSelectedId] = useState<number>(activeRentals[0]?.id || 0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId) {
      onReturnProcessed(selectedId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Receive Equipment Return</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Active Rental</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none"
            >
              {activeRentals.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.rental_code} - {r.customer_name} ({r.equipment_name})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-xs space-y-1">
            <div className="font-semibold text-slate-800">Return Checklist:</div>
            <div>✓ Check gear for physical damages / scratches</div>
            <div>✓ Inspect lens front/rear elements</div>
            <div>✓ Verify battery count and memory cards returned</div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
