import React, { useState } from 'react';
import { MessagesHeader } from './MessagesHeader';
import { MessageTabs, MessageTabKey } from './MessageTabs';
import { MessageTemplatesList } from './MessageTemplatesList';
import { MessageComposer } from './MessageComposer';
import { MessageHistoryList } from './MessageHistoryList';
import { MessagesData, MessageTemplateItem, MessageHistoryItem } from '../../types';

interface MessagesViewProps {
  data: MessagesData;
  onSendMessage: (msg: Partial<MessageHistoryItem>) => Promise<boolean>;
  onOpenSearch: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  data,
  onSendMessage,
  onOpenSearch,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<MessageTabKey>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplateItem>(
    data.templates.find((t) => t.title === 'Due Reminder') || data.templates[0]
  );
  const [historyList, setHistoryList] = useState<MessageHistoryItem[]>(data.history);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSendMessage = async (msg: {
    customer_name: string;
    initials: string;
    subject: string;
    channel: 'whatsapp' | 'sms';
    text: string;
  }) => {
    const newHistoryItem: MessageHistoryItem = {
      id: Date.now(),
      customer_name: msg.customer_name,
      initials: msg.initials,
      subject: msg.subject,
      channel: msg.channel,
      status: 'Delivered',
      time: 'Just now',
    };

    // Optimistic UI update
    setHistoryList((prev) => [newHistoryItem, ...prev]);
    showToast(`Message sent to ${msg.customer_name} via ${msg.channel.toUpperCase()}!`);

    try {
      await onSendMessage(newHistoryItem);
    } catch (err) {
      console.error('Failed to save message to SQLite:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <MessagesHeader
        onNewMessage={() => {
          setSelectedTemplate(data.templates[0]);
          showToast('Ready to compose a new message');
        }}
        onOpenSearch={onOpenSearch}
      />

      {/* Sub Tabs */}
      <MessageTabs
        activeTab={activeSubTab}
        onSelectTab={(tab) => setActiveSubTab(tab)}
        counts={{
          templates: data.templates.length,
          scheduled: 0,
          sent: 124,
          history: historyList.length,
        }}
      />

      {/* 3-Column Work Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Message Templates */}
        <div className="w-[330px] shrink-0 h-full overflow-hidden">
          <MessageTemplatesList
            templates={data.templates}
            selectedTemplateId={selectedTemplate?.id}
            onSelectTemplate={(tpl) => setSelectedTemplate(tpl)}
            onNewTemplate={() => showToast('Create Template feature modal')}
          />
        </div>

        {/* Center Column: Message Composer */}
        <div className="flex-1 h-full overflow-hidden">
          <MessageComposer
            selectedTemplate={selectedTemplate}
            templates={data.templates}
            onSelectTemplate={(tpl) => setSelectedTemplate(tpl)}
            onSendMessage={handleSendMessage}
          />
        </div>

        {/* Right Column: Message History */}
        <div className="w-[370px] shrink-0 h-full overflow-hidden border-l border-slate-200/80">
          <MessageHistoryList history={historyList} />
        </div>
      </div>
    </div>
  );
};
