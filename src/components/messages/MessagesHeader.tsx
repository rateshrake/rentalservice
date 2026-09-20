import React from 'react';
import { Search, Bell, ChevronDown, Calendar, MessageSquarePlus } from 'lucide-react';

interface MessagesHeaderProps {
  onNewMessage: () => void;
  onOpenSearch: () => void;
  notificationCount?: number;
}

export const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  onNewMessage,
  onOpenSearch,
  notificationCount = 2,
}) => {
  return (
    <header className="px-8 pt-5 pb-4 bg-white border-b border-slate-200/80 shrink-0">

      {/* Messages Title & Action Row */}
      <div className="flex items-end justify-between pt-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Messages & Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Templates, automated reminders, and customer communications
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Focus Date Selector */}
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>27 May 2025</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* New Message Button */}
          <button
            onClick={onNewMessage}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] text-white font-semibold text-xs rounded-lg shadow-sm transition-all transform hover:translate-y-[-1px] cursor-pointer shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4 stroke-[2.2]" />
            <span>New Message</span>
          </button>
        </div>
      </div>
    </header>
  );
};
