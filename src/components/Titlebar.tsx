import React, { useEffect, useState } from 'react';
import { Camera, Minus, Square, X, Copy } from 'lucide-react';

export const Titlebar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized);
    }
  }, []);

  const handleMinimize = () => {
    window.electronAPI?.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximize();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    window.electronAPI?.close();
  };

  return (
    <div className="h-9 bg-[#0B0F17] text-slate-400 text-xs flex items-center justify-between px-3 border-b border-slate-800/80 select-none app-drag-region z-50 shrink-0">
      {/* App Title & Icon */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white shadow-sm">
          <Camera className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-slate-200 tracking-wide text-[11px]">
          LensLedger <span className="text-slate-500 font-normal">– Camera Rental Management</span>
        </span>
      </div>

      {/* Window Controls */}
      <div className="flex items-center app-no-drag">
        <button
          onClick={handleMinimize}
          className="w-10 h-9 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-10 h-9 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
        </button>
        <button
          onClick={handleClose}
          className="w-11 h-9 flex items-center justify-center hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
