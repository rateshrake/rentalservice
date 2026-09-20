import React from 'react';
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { NewRentalSchedule } from '../../types';
import { TimePickerInput } from './TimePickerInput';

interface ScheduleStepPanelProps {
  schedule: NewRentalSchedule;
  onChangeSchedule: (updates: Partial<NewRentalSchedule>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const ScheduleStepPanel: React.FC<ScheduleStepPanelProps> = ({
  schedule,
  onChangeSchedule,
  onBack,
  onNext,
}) => {
  const presets = [
    { label: '1 Day (24 hrs)', days: 1 },
    { label: '2 Days (48 hrs)', days: 2 },
    { label: '3 Days (Shoot)', days: 3 },
    { label: 'Weekend (Sat-Sun)', days: 2 },
    { label: '1 Week (7 Days)', days: 7 },
  ];

  const handleApplyPreset = (days: number) => {
    try {
      const baseDate = schedule.pickupDate ? new Date(schedule.pickupDate) : new Date();
      const targetDate = new Date(baseDate);
      targetDate.setDate(targetDate.getDate() + days);
      const returnDateStr = targetDate.toISOString().split('T')[0];
      onChangeSchedule({ durationDays: days, returnDate: returnDateStr });
    } catch {
      onChangeSchedule({ durationDays: days });
    }
  };

  const handlePickupDateChange = (newDate: string) => {
    let days = schedule.durationDays || 1;
    if (newDate && schedule.returnDate) {
      const p = new Date(newDate).getTime();
      const r = new Date(schedule.returnDate).getTime();
      if (!isNaN(p) && !isNaN(r) && r >= p) {
        days = Math.max(1, Math.round((r - p) / (1000 * 60 * 60 * 24)));
      }
    }
    onChangeSchedule({ pickupDate: newDate, durationDays: days });
  };

  const handleReturnDateChange = (newDate: string) => {
    let days = schedule.durationDays || 1;
    if (schedule.pickupDate && newDate) {
      const p = new Date(schedule.pickupDate).getTime();
      const r = new Date(newDate).getTime();
      if (!isNaN(p) && !isNaN(r) && r >= p) {
        days = Math.max(1, Math.round((r - p) / (1000 * 60 * 60 * 24)));
      }
    }
    onChangeSchedule({ returnDate: newDate, durationDays: days });
  };

  const durationDays = schedule?.durationDays && schedule.durationDays > 0 ? schedule.durationDays : 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs max-w-3xl mx-auto animate-in fade-in duration-150">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          3. Schedule & Timing
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pick pickup and return dates, select timing, and choose quick presets.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Quick Duration Presets</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset) => {
            const isSelected = durationDays === preset.days;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPreset(preset.days)}
                className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date & Time Pickers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pickup Details */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-red-100/70 text-[#E11D48] flex items-center justify-center font-bold text-xs">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs">Pickup Details</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                value={schedule?.pickupDate || ''}
                onChange={(e) => handlePickupDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <TimePickerInput
              label="Pickup Time"
              value={schedule?.pickupTime || '10:00 AM'}
              onChange={(newVal) => onChangeSchedule({ pickupTime: newVal })}
            />
          </div>
        </div>

        {/* Return Details */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-slate-900 text-xs">Return Details</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Return Date
              </label>
              <input
                type="date"
                value={schedule?.returnDate || ''}
                onChange={(e) => handleReturnDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <TimePickerInput
              label="Return Time"
              value={schedule?.returnTime || '08:00 PM'}
              onChange={(newVal) => onChangeSchedule({ returnTime: newVal })}
            />
          </div>
        </div>
      </div>



      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Equipment</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
