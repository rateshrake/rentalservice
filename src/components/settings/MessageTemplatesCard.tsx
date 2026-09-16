import React, { useState } from 'react';
import { MessageSquare, ChevronDown } from 'lucide-react';

interface MessageTemplatesCardProps {
  templates: Record<string, string>;
  onChangeTemplate: (templateKey: string, content: string) => void;
}

const TEMPLATE_TABS = ['Booking Confirmation', 'Payment Reminder', 'Overdue Notice'];
const VARIABLES = [
  '{customer_name}',
  '{rental_id}',
  '{equipment_list}',
  '{pickup_date}',
  '{pickup_time}',
  '{return_date}',
  '{return_time}',
  '{amount}',
];

export const MessageTemplatesCard: React.FC<MessageTemplatesCardProps> = ({
  templates,
  onChangeTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Booking Confirmation');
  const [showVariableMenu, setShowVariableMenu] = useState(false);

  const currentContent = templates[activeTab] || '';

  const insertVariable = (variable: string) => {
    onChangeTemplate(activeTab, currentContent + ' ' + variable);
    setShowVariableMenu(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-slate-900">Message Templates</h2>
          <p className="text-[11px] text-slate-500">Customize messages sent to customers</p>
        </div>
      </div>

      {/* Tabs Row & Insert Variable */}
      <div className="flex items-center justify-between border-b border-slate-200/80 mb-3 pb-1">
        <div className="flex items-center gap-3">
          {TEMPLATE_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] pb-1.5 transition-colors cursor-pointer relative font-bold ${
                  isActive
                    ? 'text-[#E11D48] border-b-2 border-[#E11D48]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Insert Variable Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowVariableMenu((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>Insert Variable</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showVariableMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-xs divide-y divide-slate-50">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insertVariable(v)}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 hover:text-[#E11D48] transition-colors font-mono text-[11px] cursor-pointer"
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 flex flex-col min-h-0 border border-slate-200 rounded-xl bg-slate-50/40 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 overflow-hidden">
        <textarea
          rows={5}
          value={currentContent}
          onChange={(e) => onChangeTemplate(activeTab, e.target.value)}
          className="w-full flex-1 p-3 text-xs text-slate-800 bg-transparent resize-none focus:outline-none leading-relaxed font-sans"
        />
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 text-right text-[10px] text-slate-400 font-semibold">
          {currentContent.length}/500
        </div>
      </div>
    </div>
  );
};
