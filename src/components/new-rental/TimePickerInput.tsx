import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpDown } from 'lucide-react';

interface TimePickerInputProps {
  label: string;
  value: string; // e.g. "10:00 AM" or "09:00 PM"
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

export const parseTimeParts = (val: string): { time: string; period: 'AM' | 'PM' } => {
  if (!val) return { time: '10:00', period: 'AM' };
  const str = val.trim();
  const isPM = /pm/i.test(str);
  const isAM = /am/i.test(str);
  const period: 'AM' | 'PM' = isPM ? 'PM' : (isAM ? 'AM' : 'AM');
  const cleanTime = str.replace(/am|pm/gi, '').trim() || '10:00';
  return { time: cleanTime, period };
};

export const normalizeTimeFormatted = (time: string, period: 'AM' | 'PM'): string => {
  let clean = time.replace(/[^0-9:]/g, '').trim();
  if (!clean) return `10:00 ${period}`;
  
  if (!clean.includes(':')) {
    let num = parseInt(clean, 10);
    if (isNaN(num) || num < 1 || num > 12) num = 10;
    return `${String(num).padStart(2, '0')}:00 ${period}`;
  }
  
  const parts = clean.split(':');
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (isNaN(h) || h < 1 || h > 12) h = 10;
  if (isNaN(m) || m < 0 || m > 59) m = 0;
  
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  label,
  value,
  onChange,
  className = '',
}) => {
  const { time: initialTime, period: initialPeriod } = parseTimeParts(value);
  const [timeText, setTimeText] = useState<string>(initialTime);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialPeriod);

  // Synchronize when value changes externally
  useEffect(() => {
    const parsed = parseTimeParts(value);
    setTimeText(parsed.time);
    setPeriod(parsed.period);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    
    // Check if user typed or pasted "AM" or "PM" into the text field
    let detectedPeriod = period;
    if (/pm/i.test(raw)) {
      detectedPeriod = 'PM';
    } else if (/am/i.test(raw)) {
      detectedPeriod = 'AM';
    }

    // Strip am/pm from text field so only time digits and colon remain
    const cleaned = raw.replace(/[^\d:]/g, '');
    setTimeText(cleaned);
    setPeriod(detectedPeriod);

    onChange(`${cleaned || '10:00'} ${detectedPeriod}`);
  };

  const handleBlur = () => {
    const formatted = normalizeTimeFormatted(timeText, period);
    const parsed = parseTimeParts(formatted);
    setTimeText(parsed.time);
    setPeriod(parsed.period);
    onChange(formatted);
  };

  const handleFlipPeriod = () => {
    const nextPeriod: 'AM' | 'PM' = period === 'AM' ? 'PM' : 'AM';
    setPeriod(nextPeriod);
    const formatted = normalizeTimeFormatted(timeText, nextPeriod);
    onChange(formatted);
  };

  return (
    <div className={className}>
      <label className="block text-[11px] font-medium text-slate-600 mb-1">
        {label}
      </label>

      <div className="flex items-center bg-white border border-slate-200 rounded-lg focus-within:ring-1 focus-within:ring-rose-500 focus-within:border-rose-500 overflow-hidden shadow-2xs transition-all">
        {/* Clock Icon */}
        <div className="pl-2.5 text-slate-400 select-none">
          <Clock className="w-3.5 h-3.5" />
        </div>

        {/* Time Text Input */}
        <input
          type="text"
          value={timeText}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="10:00"
          className="w-full px-2.5 py-2 text-xs font-semibold text-slate-800 bg-transparent focus:outline-none tracking-wide"
        />

        {/* AM / PM Flip Button */}
        <div className="pr-1.5 py-1 shrink-0">
          <button
            type="button"
            onClick={handleFlipPeriod}
            title={`Currently ${period}. Click to flip to ${period === 'AM' ? 'PM' : 'AM'}`}
            className={`px-3 py-1 text-xs font-extrabold rounded-md border transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs ${
              period === 'AM'
                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 hover:border-amber-400'
                : 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-400'
            }`}
          >
            <span>{period}</span>
            <ArrowUpDown className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-transform" />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
        <span>e.g. 09:00</span>
        <button
          type="button"
          onClick={handleFlipPeriod}
          className="hover:underline text-[10px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          Click <strong className="text-slate-700">{period}</strong> to flip
        </button>
      </p>
    </div>
  );
};
