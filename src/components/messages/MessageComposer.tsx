import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  MessageCircle,
  MessageSquare,
  Smile,
  Clock,
  Send,
  CheckCheck,
} from 'lucide-react';
import { MessageTemplateItem } from '../../types';

interface CustomerOption {
  id: number;
  name: string;
  phone: string;
  rental_code: string;
  equipment: string;
  return_time: string;
  amount: string;
}

const SAMPLE_CUSTOMERS: CustomerOption[] = [
  {
    id: 1,
    name: 'Vikram Shah',
    phone: '+91 98765 43210',
    rental_code: 'RNT-2025-021',
    equipment: 'Sony A7 IV',
    return_time: '6:00 PM',
    amount: '₹4,000',
  },
  {
    id: 2,
    name: 'Aditi Rao',
    phone: '+91 98123 45678',
    rental_code: 'RNT-2025-022',
    equipment: 'Canon R6 Mark II + 24-70mm GM II',
    return_time: '8:00 PM',
    amount: '₹6,500',
  },
  {
    id: 3,
    name: 'Karan Films',
    phone: '+91 98200 11223',
    rental_code: 'RNT-2025-023',
    equipment: 'DJI RS 4',
    return_time: '9:00 PM',
    amount: '₹2,800',
  },
  {
    id: 4,
    name: 'Neha Singh',
    phone: '+91 98987 65432',
    rental_code: 'RNT-2025-024',
    equipment: 'Sigma 85mm F1.4',
    return_time: '7:00 PM',
    amount: '₹2,500',
  },
];

interface MessageComposerProps {
  selectedTemplate: MessageTemplateItem | null;
  templates: MessageTemplateItem[];
  onSelectTemplate: (template: MessageTemplateItem) => void;
  onSendMessage: (msg: {
    customer_name: string;
    initials: string;
    subject: string;
    channel: 'whatsapp';
    text: string;
  }) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  selectedTemplate,
  templates,
  onSelectTemplate,
  onSendMessage,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp'>('whatsapp');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption>(SAMPLE_CUSTOMERS[0]);
  const [messageText, setMessageText] = useState<string>('');

  // When selectedTemplate changes, interpolate variables with selectedCustomer
  useEffect(() => {
    if (selectedTemplate) {
      let interpolated = selectedTemplate.body
        .replace(/{customer_name}/g, selectedCustomer.name)
        .replace(/{equipment_name}/g, selectedCustomer.equipment)
        .replace(/{pickup_date}/g, '27 May 2025')
        .replace(/{return_time}/g, selectedCustomer.return_time)
        .replace(/{amount}/g, selectedCustomer.amount)
        .replace(/{rental_code}/g, selectedCustomer.rental_code)
        .replace(/{link}/g, `https://pay.camerahub.in/${selectedCustomer.rental_code}`);
      setMessageText(interpolated);
    } else {
      setMessageText(
        `Hi ${selectedCustomer.name}, this is a friendly reminder that your rental for ${selectedCustomer.equipment} is due today by ${selectedCustomer.return_time}. Please ensure the equipment is returned in good condition. Thank you!`
      );
    }
  }, [selectedTemplate, selectedCustomer]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const initials = selectedCustomer.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    onSendMessage({
      customer_name: selectedCustomer.name,
      initials,
      subject: selectedTemplate ? selectedTemplate.title : 'Notification',
      channel: selectedChannel,
      text: messageText,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Compose Message</h2>
          <p className="text-[11px] text-slate-500">Customize and send notifications to customers</p>
        </div>
      </div>

      {/* Main Composer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Row 1: Template selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Template
          </label>
          <div className="relative">
            <select
              value={selectedTemplate?.id || ''}
              onChange={(e) => {
                const found = templates.find((t) => t.id === Number(e.target.value));
                if (found) onSelectTemplate(found);
              }}
              className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  Template: {tpl.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Customer Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Customer
          </label>
          <div className="relative">
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const found = SAMPLE_CUSTOMERS.find((c) => c.id === Number(e.target.value));
                if (found) setSelectedCustomer(found);
              }}
              className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer"
            >
              {SAMPLE_CUSTOMERS.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  Customer: {cust.name} ({cust.phone}) — {cust.rental_code}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Row 4: Message Content Textarea */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Message
          </label>
          <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 bg-slate-50/40">
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3.5 text-xs text-slate-800 bg-transparent resize-none focus:outline-none leading-relaxed"
              placeholder="Type your message here..."
            />
            <div className="flex items-center justify-between px-3.5 py-2 bg-white border-t border-slate-100 text-[11px] text-slate-400">
              <span>{messageText.length} characters</span>
              <button
                type="button"
                className="p-1 hover:text-slate-600 rounded transition-colors cursor-pointer"
                title="Insert emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 5: Preview */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Preview
          </label>
          <div
            className={`p-4 rounded-xl border ${
              selectedChannel === 'whatsapp'
                ? 'bg-[#EFEAE2]/50 border-emerald-100'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Simulated Chat Bubble */}
            <div
              className={`max-w-[95%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs relative ${
                selectedChannel === 'whatsapp'
                  ? 'bg-white text-slate-900 rounded-tl-xs'
                  : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{messageText}</p>
              <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-slate-400">
                <span>10:30 AM</span>
                {selectedChannel === 'whatsapp' && (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 border-t border-slate-200/80 bg-white flex items-center justify-end gap-3 shrink-0">
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Schedule Message</span>
        </button>

        <button
          type="button"
          onClick={handleSend}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#E11D48] hover:bg-[#BE123C] active:bg-[#9F1239] rounded-lg transition-all transform hover:translate-y-[-1px] shadow-sm cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Message</span>
        </button>
      </div>
    </div>
  );
};
