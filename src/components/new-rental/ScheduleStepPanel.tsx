import React from 'react';
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { NewRentalSchedule } from '../../types';

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
    onChangeSchedule({ durationDays: days });
  };

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
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Quick Duration Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => {
            const isSelected = schedule.durationDays === p.days;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p.days)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E11D48] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {p.label}
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
                value={schedule.pickupDate}
                onChange={(e) => onChangeSchedule({ pickupDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Pickup Time
              </label>
              <select
                value={schedule.pickupTime}
                onChange={(e) => onChangeSchedule({ pickupTime: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="09:00 AM">09:00 AM (Store Opening)</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
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
                value={schedule.returnDate}
                onChange={(e) => onChangeSchedule({ returnDate: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Return Time
              </label>
              <select
                value={schedule.returnTime}
                onChange={(e) => onChangeSchedule({ returnTime: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="06:00 PM">06:00 PM</option>
                <option value="07:30 PM">07:30 PM</option>
                <option value="08:00 PM">08:00 PM (Closing Time)</option>
                <option value="10:00 PM">10:00 PM (Night Drop)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-[#FFF5F6] border border-rose-100 rounded-xl p-4 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#E11D48]" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              Selected Duration: {schedule.durationDays} Day{schedule.durationDays > 1 ? 's' : ''}
            </div>
            <div className="text-[11px] text-slate-500">
              From {schedule.pickupDate} ({schedule.pickupTime}) to {schedule.returnDate} ({schedule.returnTime})
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-[#E11D48] bg-white px-2.5 py-1 rounded-md border border-rose-200 shadow-2xs">
            Standard 24h Blocks
          </span>
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
          <span>Continue to Pricing & Payment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
