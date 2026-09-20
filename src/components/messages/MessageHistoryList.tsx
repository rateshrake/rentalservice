import React, { useState } from 'react';
import {
  ChevronDown,
  MessageCircle,
  MessageSquare,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { MessageHistoryItem } from '../../types';

interface MessageHistoryListProps {
  history: MessageHistoryItem[];
  onSelectHistoryItem?: (item: MessageHistoryItem) => void;
}

export const MessageHistoryList: React.FC<MessageHistoryListProps> = ({
  history,
  onSelectHistoryItem,
}) => {
  const [filter, setFilter] = useState<'all' | 'whatsapp'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.channel === filter;
  });

  const getAvatarBg = (initials: string) => {
    const map: Record<string, string> = {
      VS: 'bg-blue-100 text-blue-700',
      AR: 'bg-purple-100 text-purple-700',
      KF: 'bg-emerald-100 text-emerald-700',
      NS: 'bg-orange-100 text-orange-700',
      RT: 'bg-amber-100 text-amber-700',
      AP: 'bg-rose-100 text-rose-700',
      SP: 'bg-teal-100 text-teal-700',
      PK: 'bg-pink-100 text-pink-700',
      DM: 'bg-indigo-100 text-indigo-700',
      RS: 'bg-cyan-100 text-cyan-700',
    };
    return map[initials] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Message History</h2>
          <p className="text-[11px] text-slate-500">Recent customer interactions</p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="appearance-none pl-3 pr-7 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 focus:outline-none transition-all cursor-pointer shadow-2xs"
          >
            <option value="all">All Messages</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredHistory.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem?.(item)}
              className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              {/* Left: Avatar + Details */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarBg(
                    item.initials
                  )}`}
                >
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate group-hover:text-[#E11D48] transition-colors">
                    {item.customer_name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.subject}
                  </div>
                </div>
              </div>

              {/* Right: Channel & Delivery Status */}
              <div className="flex flex-col items-end shrink-0 gap-1.5">
                <div className="flex items-center gap-2">
                  {/* Channel Tag */}
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                    <span>WhatsApp</span>
                  </span>

                  {/* Time */}
                  <span className="text-[11px] font-medium text-slate-400">
                    {item.time}
                  </span>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-1 text-[10px]">
                  {item.status === 'Read' ? (
                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </span>
                  ) : item.status === 'Delivered' ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">{item.status}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-slate-200/80 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <span className="text-[11px]">Showing 1-10 of 124 messages</span>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentPage(1)}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors cursor-pointer ${
              currentPage === 1
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            1
          </button>

          <button
            onClick={() => setCurrentPage(2)}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors cursor-pointer ${
              currentPage === 2
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            2
          </button>

          <button
            onClick={() => setCurrentPage(3)}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors cursor-pointer ${
              currentPage === 3
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            3
          </button>

          <span className="px-1 text-slate-400">...</span>

          <button
            onClick={() => setCurrentPage(12)}
            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors cursor-pointer ${
              currentPage === 12
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            12
          </button>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
