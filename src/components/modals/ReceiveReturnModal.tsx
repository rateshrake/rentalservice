import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, RotateCcw, CheckCircle2, Clock, IndianRupee, Settings, Search } from 'lucide-react';
import { RentalItem, LateFeeRulesSettings } from '../../types';

interface ReceiveReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentals: RentalItem[];
  settings?: LateFeeRulesSettings;
  onReturnProcessed: (rentalId: number, condition: string, extraPenalty: number, paymentMode?: string) => void;
}

export const parseRentalReturnTime = (returnTimeStr?: string): Date | null => {
  if (!returnTimeStr) return null;
  const trimmed = returnTimeStr.trim();

  // If format is "Today, 8:00 PM"
  if (trimmed.toLowerCase().startsWith('today,')) {
    const timePart = trimmed.replace(/today,/i, '').trim();
    const todayStr = new Date().toISOString().split('T')[0];
    return parseDateWithAmPm(`${todayStr} ${timePart}`);
  }

  return parseDateWithAmPm(trimmed);
};

const parseDateWithAmPm = (str: string): Date | null => {
  // Regex for YYYY-MM-DD HH:MM AM/PM
  const isoAmPmMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (isoAmPmMatch) {
    const [_, y, m, d, h, min, ap] = isoAmPmMatch;
    let hour = parseInt(h, 10);
    if (ap) {
      if (ap.toUpperCase() === 'PM' && hour < 12) hour += 12;
      if (ap.toUpperCase() === 'AM' && hour === 12) hour = 0;
    }
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), hour, parseInt(min, 10));
  }

  // Standard JS Date parse (e.g. 27 May 2025 8:00 PM or ISO)
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d;
  }

  return null;
};

export const ReceiveReturnModal: React.FC<ReceiveReturnModalProps> = ({
  isOpen,
  onClose,
  rentals,
  settings,
  onReturnProcessed,
}) => {
  const activeRentals = rentals.filter((r) => r.status !== 'Returned');
  const [selectedId, setSelectedId] = useState<number>(0);
  const [condition, setCondition] = useState('Good');
  const [paymentMode, setPaymentMode] = useState('UPI');

  // Penalty Calculation State
  const [delayMins, setDelayMins] = useState(0);
  const [penaltyAmount, setPenaltyAmount] = useState(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRentals = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return activeRentals.filter((r) => 
      r.customer_name.toLowerCase().includes(q) ||
      (r.customer_phone || '').toLowerCase().includes(q) ||
      r.equipment_name.toLowerCase().includes(q) ||
      r.rental_code.toLowerCase().includes(q)
    );
  }, [activeRentals, searchQuery]);

  useEffect(() => {
    if (activeRentals.length > 0 && selectedId === 0) {
      setSelectedId(activeRentals[0].id);
    }
  }, [activeRentals, selectedId]);

  const selectedRental = useMemo(() => activeRentals.find((r) => r.id === selectedId), [activeRentals, selectedId]);

  useEffect(() => {
    if (selectedRental && isOpen) {
      const dueTime = parseRentalReturnTime(selectedRental.return_time);
      const grace = settings?.grace_period_mins ?? 20;
      const rate = settings?.hourly_penalty_amount ?? 500;

      if (dueTime) {
        const now = new Date();
        const diffMs = now.getTime() - dueTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins > grace) {
          setDelayMins(diffMins);
          const hoursLate = Math.ceil(diffMins / 60);
          setPenaltyAmount(hoursLate * rate);
        } else if (diffMins > 0) {
          // In grace period
          setDelayMins(diffMins);
          setPenaltyAmount(0);
        } else {
          // On time or returned before due
          setDelayMins(0);
          setPenaltyAmount(0);
        }
      } else {
        setDelayMins(0);
        setPenaltyAmount(0);
      }
    }
  }, [selectedRental, settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId) {
      onReturnProcessed(selectedId, condition, penaltyAmount, paymentMode);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Receive Return</h3>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">Process incoming equipment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Active Rental Selection */}
          <div ref={dropdownRef} className="relative">
            <label className="block font-semibold text-slate-700 mb-1">Select Active Rental</label>
            <div
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-semibold cursor-pointer flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="truncate">
                {selectedRental
                  ? `${selectedRental.rental_code} - ${selectedRental.customer_name} (${selectedRental.equipment_name})`
                  : 'Select a rental...'}
              </span>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-60">
                <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, phone, equipment..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-red-300"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="overflow-y-auto">
                  {filteredRentals.length === 0 ? (
                    <div className="p-3 text-center text-slate-500 text-xs">No rentals found</div>
                  ) : (
                    filteredRentals.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedId(r.id);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`px-3 py-2 cursor-pointer text-xs hover:bg-slate-50 border-b border-slate-50 last:border-0 ${selectedId === r.id ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-700'}`}
                      >
                        <div className="font-semibold">{r.rental_code} - {r.customer_name}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">{r.equipment_name}</div>
                        {r.customer_phone && <div className="text-[10px] text-slate-400">{r.customer_phone}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {selectedRental && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200/70">
                <span>Scheduled Due: <strong className="text-slate-800 font-semibold">{selectedRental.return_time}</strong></span>
                {selectedRental.pickup_date && (
                  <span className="text-[10px] text-slate-400">Picked up: {selectedRental.pickup_date}</span>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Condition */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipment Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-red-300"
              >
                <option value="Good">Good (Ready)</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
            {/* Time Status */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Time Status</span>
                <span title="Configured in Settings">
                  <Settings className="w-3 h-3 text-slate-400 cursor-pointer" />
                </span>
              </label>
              <div className={`w-full px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${delayMins > (settings?.grace_period_mins || 20) ? 'bg-rose-50 text-rose-700 border-rose-200' : delayMins > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                <Clock className="w-3.5 h-3.5" />
                {delayMins > (settings?.grace_period_mins || 20)
                  ? `Late by ${delayMins} mins`
                  : delayMins > 0
                  ? `Late by ${delayMins} mins (Within Grace)`
                  : 'On Time'}
              </div>
            </div>
          </div>

          {/* Penalty & Payment Section */}
          {(selectedRental?.payment_status === 'Unpaid' || penaltyAmount > 0) && (() => {
            const isUnpaid = selectedRental?.payment_status === 'Unpaid';
            const pendingBaseAmount = isUnpaid ? (selectedRental?.amount || 0) : 0;
            const totalToCollect = pendingBaseAmount + penaltyAmount;

            return (
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-3">
                {isUnpaid && (
                  <div className="flex items-center justify-between text-slate-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <IndianRupee className="w-4 h-4" />
                      <span>Pending Rental Amount</span>
                    </div>
                    <div className="text-sm font-bold">₹{pendingBaseAmount.toLocaleString('en-IN')}</div>
                  </div>
                )}

                {penaltyAmount > 0 && (
                  <>
                    <div className="flex items-center justify-between text-red-700">
                      <div className="flex items-center gap-1.5 font-bold">
                        <IndianRupee className="w-4 h-4" />
                        <span>Late Return Penalty</span>
                      </div>
                      <div className="text-sm font-extrabold">₹{penaltyAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-[10px] text-red-600/80 font-medium leading-tight mb-2">
                      Exceeded {settings?.grace_period_mins || 20} mins grace period. Charged at ₹{settings?.hourly_penalty_amount || 500}/hour.
                    </div>
                  </>
                )}

                {isUnpaid && penaltyAmount > 0 && (
                  <div className="flex items-center justify-between text-slate-900 border-t border-red-200/50 pt-2 mt-2">
                    <span className="font-bold">Total to Collect</span>
                    <span className="text-sm font-extrabold">₹{totalToCollect.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div>
                  <label className="block text-[11px] font-bold text-red-900 mb-1">Collect via</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['UPI', 'Cash', 'Card'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        className={`py-1.5 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                          paymentMode === mode
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : 'bg-white text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
              <CheckCircle2 className="w-4 h-4" />
              {(selectedRental?.payment_status === 'Unpaid' || penaltyAmount > 0) ? 'Collect & Confirm' : 'Confirm Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
