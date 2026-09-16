import React from 'react';

export const StatusBar: React.FC = () => {
  return (
    <footer className="h-8 bg-white border-t border-slate-200/90 px-6 flex items-center justify-between text-[11px] text-slate-500 select-none shrink-0">
      {/* Left system status & sync time */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">System Online</span>
        </div>

        <span className="text-slate-300">|</span>

        <span className="text-slate-500">
          Last synced: Today, 10:24 AM
        </span>
      </div>

      {/* Right tagline */}
      <div className="text-slate-400 font-medium">
        LensLedger &ndash; Trusted by Creators. Powered by You.
      </div>
    </footer>
  );
};
