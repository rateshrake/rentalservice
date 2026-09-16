import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users2,
  Package,
  CreditCard,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  Camera
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  messageCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  messageCount = 3
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-rental', label: 'New Rental', icon: Calendar },
    { id: 'rentals', label: 'Rentals', icon: CalendarDays },
    { id: 'customers', label: 'Customers', icon: Users2 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messageCount },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#0B0F17] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800/80 relative overflow-hidden">
      {/* Top Branding */}
      <div>
        <div className="p-4 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-red-950/40">
            <Camera className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-base tracking-tight leading-tight">
              LensLedger
            </span>
            <span className="text-[11px] text-slate-400 font-normal leading-tight">
              Gear In. Stories Out.
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E11D48] text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Camera Backdrop & Tagline */}
      <div className="p-4 pt-12 relative mt-auto border-t border-slate-900/40">
        {/* Subtle camera lens graphic background */}
        <div className="absolute right-[-20px] bottom-6 opacity-15 pointer-events-none">
          <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="4" />
            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="3" />
            <circle cx="100" cy="100" r="20" fill="white" />
            <rect x="70" y="10" width="60" height="15" rx="4" fill="white" />
          </svg>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-semibold text-slate-200">Better Gear</p>
          <p className="text-xs text-slate-400">Brighter Stories</p>
          <div className="mt-4 text-[10px] text-slate-500 font-mono">v1.0.0</div>
        </div>
      </div>
    </aside>
  );
};
