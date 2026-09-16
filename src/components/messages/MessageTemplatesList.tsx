import React from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CreditCard,
  Megaphone,
  Plus,
} from 'lucide-react';
import { MessageTemplateItem } from '../../types';

interface MessageTemplatesListProps {
  templates: MessageTemplateItem[];
  selectedTemplateId: number;
  onSelectTemplate: (template: MessageTemplateItem) => void;
  onNewTemplate?: () => void;
}

export const MessageTemplatesList: React.FC<MessageTemplatesListProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onNewTemplate,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'calendar':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'clock':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'credit_card':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'megaphone':
        return <Megaphone className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'calendar':
        return 'bg-blue-50 border-blue-100';
      case 'clock':
        return 'bg-amber-50 border-amber-100';
      case 'alert':
        return 'bg-rose-50 border-rose-100';
      case 'credit_card':
        return 'bg-emerald-50 border-emerald-100';
      case 'megaphone':
        return 'bg-purple-50 border-purple-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Booking':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Reminder':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Payment':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Marketing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Message Templates</h2>
          <p className="text-[11px] text-slate-500">{templates.length} reusable templates</p>
        </div>
        <button
          onClick={onNewTemplate}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {templates.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'border-l-4 border-l-[#E11D48] border-rose-200 bg-rose-50/40 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${getIconBg(
                      tpl.icon_type
                    )}`}
                  >
                    {getIcon(tpl.icon_type)}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {tpl.title}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBadgeStyle(
                    tpl.badge
                  )}`}
                >
                  {tpl.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pl-9">
                {tpl.snippet}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
