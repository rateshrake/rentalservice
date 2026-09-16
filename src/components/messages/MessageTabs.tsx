import React from 'react';
import { LayoutTemplate, Clock, Send, History } from 'lucide-react';

export type MessageTabKey = 'templates' | 'scheduled' | 'sent' | 'history';

interface MessageTabsProps {
  activeTab: MessageTabKey;
  onSelectTab: (tab: MessageTabKey) => void;
  counts?: {
    templates?: number;
    scheduled?: number;
    sent?: number;
    history?: number;
  };
}

export const MessageTabs: React.FC<MessageTabsProps> = ({
  activeTab,
  onSelectTab,
  counts = { templates: 5, scheduled: 0, sent: 124, history: 10 },
}) => {
  const tabs = [
    { id: 'templates' as MessageTabKey, label: 'Templates', icon: LayoutTemplate, count: counts.templates },
    { id: 'scheduled' as MessageTabKey, label: 'Scheduled', icon: Clock, count: counts.scheduled },
    { id: 'sent' as MessageTabKey, label: 'Sent', icon: Send, count: counts.sent },
    { id: 'history' as MessageTabKey, label: 'Customer History', icon: History, count: counts.history },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-200/80 px-8 py-2.5 bg-white shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-rose-50 text-[#E11D48] border border-rose-200/80 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E11D48]' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#E11D48] text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
