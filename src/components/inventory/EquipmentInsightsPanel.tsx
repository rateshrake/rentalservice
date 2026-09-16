import React, { useState } from 'react';
import {
  MoreHorizontal,
  X,
  IndianRupee,
  Activity,
  Repeat,
  Calendar,
  ShieldCheck,
  Tag,
  Hash,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Printer,
  Clock,
  UserCheck
} from 'lucide-react';
import { InventoryItem } from '../../types';

interface EquipmentInsightsPanelProps {
  item: InventoryItem;
  onClose?: () => void;
  onViewRental?: (rentalCode: string) => void;
}

export const EquipmentInsightsPanel: React.FC<EquipmentInsightsPanelProps> = ({
  item,
  onClose,
  onViewRental,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'maintenance' | 'history'>('overview');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Rented Out':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Available':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Reserved':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'Maintenance':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Damaged':
      default:
        return 'bg-red-50 text-red-700 border-red-200/80';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full overflow-y-auto">
      <div>
        {/* Top bar controls */}
        <div className="flex items-center justify-end gap-1 mb-2">
          <button className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Equipment Header */}
        <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate">
                {item.name}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold border shrink-0 ${getStatusBadge(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-mono">
                {item.asset_id}
              </span>
              <span className="text-xs text-slate-500 font-medium truncate">
                {item.subtitle || item.category}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-tabs: Overview, Maintenance, Rental History */}
        <div className="flex items-center border-b border-slate-200 mt-4 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'overview'
                ? 'border-[#E11D48] text-[#E11D48]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('maintenance')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'maintenance'
                ? 'border-[#E11D48] text-[#E11D48]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Maintenance
            {item.maintenance_history && item.maintenance_history.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-slate-100 rounded-full text-[10px] text-slate-600 font-normal">
                {item.maintenance_history.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'history'
                ? 'border-[#E11D48] text-[#E11D48]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Rental History
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeSubTab === 'overview' && (
          <div className="space-y-4">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10.5px] font-semibold text-slate-600">Lifetime Revenue</span>
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="mt-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{item.lifetime_revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10.5px] font-semibold text-slate-600">Utilization</span>
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="mt-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    {item.utilization_rate}%
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10.5px] font-semibold text-slate-600">Total Rentals</span>
                  <Repeat className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="mt-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    {item.lifetime_rentals}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Rental Info (if Rented Out) */}
            {item.status === 'Rented Out' && (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-bold text-amber-800 uppercase tracking-wider">
                      Currently Rented Out
                    </span>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      {item.current_customer || 'Vikram Shah'}
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                      <span>Due: <strong>{item.expected_return || '27 May 2025'}</strong></span>
                      <span>·</span>
                      <span className="font-mono text-slate-500">RNT-2025-021</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewRental?.('RNT-2025-021')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="bg-slate-50/60 rounded-xl p-3.5 border border-slate-200/70 space-y-2.5 text-xs">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                Specifications & Details
              </h4>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Rental Rate
                </span>
                <span className="font-bold text-slate-900">
                  ₹{item.rental_rate.toLocaleString('en-IN')} / day
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Serial Number
                </span>
                <span className="font-mono text-slate-800 font-medium">
                  {item.serial_number}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Purchase Date
                </span>
                <span className="text-slate-800 font-medium">
                  {item.purchase_date}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Warranty
                </span>
                <span className="text-emerald-700 font-medium">
                  {item.warranty}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  Condition
                </span>
                <span className="font-semibold text-slate-900">
                  {item.condition}
                </span>
              </div>
            </div>

            {/* Maintenance History */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Maintenance History
                </h4>
                <button
                  onClick={() => setActiveSubTab('maintenance')}
                  className="text-[11px] text-[#E11D48] hover:underline font-semibold cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {item.maintenance_history && item.maintenance_history.length > 0 ? (
                  item.maintenance_history.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50/80 transition-colors text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/60">
                        {m.icon_type === 'wrench' ? (
                          <Wrench className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 truncate">
                            {m.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {m.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-400 text-xs">
                    No maintenance records logged yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Maintenance */}
        {activeSubTab === 'maintenance' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-900">Service Logs</span>
              <button className="px-2.5 py-1 bg-red-50 text-[#E11D48] hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                + Log Service
              </button>
            </div>

            {item.maintenance_history && item.maintenance_history.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl border border-slate-200/80 bg-white hover:shadow-2xs transition-shadow space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{m.title}</span>
                  <span className="text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Completed
                  </span>
                </div>
                <p className="text-xs text-slate-600">{m.description}</p>
                <div className="flex items-center gap-3 text-[10.5px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {m.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    Authorized Service Center
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Rental History */}
        {activeSubTab === 'history' && (
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-900 pb-1">
              Past Rentals ({item.lifetime_rentals})
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Vikram Shah</span>
                <span className="font-semibold text-amber-600">Active</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>24 May 2025 – 27 May 2025</span>
                <span className="font-bold text-slate-800">₹4,000</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Karan Films</span>
                <span className="font-semibold text-emerald-600">Returned</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>18 May 2025 – 21 May 2025</span>
                <span className="font-bold text-slate-800">₹8,000</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Sneha Kapoor</span>
                <span className="font-semibold text-emerald-600">Returned</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>10 May 2025 – 14 May 2025</span>
                <span className="font-bold text-slate-800">₹10,500</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
        <button className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Gear</span>
        </button>
        <button className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer">
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Label</span>
        </button>
      </div>
    </div>
  );
};
