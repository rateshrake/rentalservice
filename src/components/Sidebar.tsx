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
  Settings,
  LogOut
} from 'lucide-react';
import cameraHubLogo from '../assets/camerahublogo.png';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  messageCount?: number;
  username: string;
  role?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  messageCount = 3,
  username,
  role = 'Owner',
  onLogout
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
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#0B0F17] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800/80 relative overflow-hidden">
      {/* Top Branding */}
      <div>
        <div className="p-4 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img src={cameraHubLogo} alt="CameraHub Logo" className="w-full h-full object-contain rounded-md" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-base tracking-tight leading-tight">
              CameraHub
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

      {/* Bottom User Profile */}
      <div className="p-3.5 mt-auto border-t border-slate-800/60 bg-slate-900/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200 shrink-0">
            {username ? username.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate leading-tight">{username || 'User'}</span>
            <span className="text-[10px] text-slate-400 font-medium truncate leading-tight">{role || 'Owner'}</span>
          </div>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
};
