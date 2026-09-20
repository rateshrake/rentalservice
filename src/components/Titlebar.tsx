import React, { useEffect, useState, useCallback } from 'react';
import { Minus, X } from 'lucide-react';

// ─── Pixel-perfect Windows-style maximize / restore icons ────────────────────
// Using raw SVG instead of Lucide to match the exact Windows 11 iconography.
const MaximizeIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
    <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" />
  </svg>
);

const RestoreIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
    {/* Front window */}
    <path d="M3 0v1H1v7h7V6h1V0H3zm5 7H2V2h6v5z" />
    {/* Back window offset */}
    <path d="M3 1h5v1H3V1z" opacity="0" />
  </svg>
);

export const Titlebar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // ── On mount: query current maximize state ──────────────────────────────
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized);
    }
  }, []);

  // ── Step 1: Subscribe to real-time maximize state pushed from main ────────
  // This covers: Aero Snap, Win+Up/Down arrows, double-clicking title bar.
  useEffect(() => {
    if (!window.electronAPI?.onMaximizeChange) return;
    const unsub = window.electronAPI.onMaximizeChange((maximized: boolean) => {
      setIsMaximized(maximized);
    });
    return unsub; // clean up listener on unmount
  }, []);

  // Track window focus to dim controls when unfocused (like native Windows apps)
  useEffect(() => {
    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const handleMinimize = useCallback(() => window.electronAPI?.minimize(), []);

  const handleMaximize = useCallback(() => {
    window.electronAPI?.maximize();
    // Optimistic toggle — will be corrected by the onMaximizeChange push
    setIsMaximized((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => window.electronAPI?.close(), []);

  return (
    <div
      // The entire bar is draggable
      className="app-drag-region h-9 shrink-0 flex items-center justify-between select-none z-50
                 bg-[#0B0F17] border-b border-slate-800/80"
      style={{ opacity: isFocused ? 1 : 0.75 }}
    >
      {/* Left draggable region (no logo or text) */}
      <div className="flex-1 h-full" />

      {/* ── Window Control Buttons ────────────────────────────────────────
           IMPORTANT: app-no-drag so clicks register, not drag events.
           The buttons are pixel-matched to Windows 11 style:
           46px wide × 36px tall for minimize/maximize, 46px for close.
      ────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center app-no-drag h-full ml-auto">

        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className="w-[46px] h-full flex items-center justify-center
                     text-slate-400 hover:text-white hover:bg-white/10
                     transition-colors duration-100 focus:outline-none"
          title="Minimize"
          tabIndex={-1}
        >
          <Minus className="w-[10px] h-[10px]" />
        </button>

        {/* Maximize / Restore */}
        <button
          onClick={handleMaximize}
          className="w-[46px] h-full flex items-center justify-center
                     text-slate-400 hover:text-white hover:bg-white/10
                     transition-colors duration-100 focus:outline-none"
          title={isMaximized ? 'Restore Down' : 'Maximize'}
          tabIndex={-1}
        >
          {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
        </button>

        {/* Close — red on hover, matching Windows 11 */}
        <button
          onClick={handleClose}
          className="w-[46px] h-full flex items-center justify-center
                     text-slate-400 hover:text-white hover:bg-red-600
                     transition-colors duration-100 focus:outline-none"
          title="Close"
          tabIndex={-1}
        >
          <X className="w-[10px] h-[10px]" />
        </button>
      </div>
    </div>
  );
};
