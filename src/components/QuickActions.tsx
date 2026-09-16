import React from 'react';
import { CalendarPlus, UserPlus, RotateCcw, CreditCard } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: 'rental' | 'customer' | 'return' | 'payment') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      id: 'rental' as const,
      title: 'New Rental',
      description: 'Create a new rental booking',
      icon: CalendarPlus,
    },
    {
      id: 'customer' as const,
      title: 'Add Customer',
      description: 'Register a new customer',
      icon: UserPlus,
    },
    {
      id: 'return' as const,
      title: 'Receive Return',
      description: 'Process equipment returns',
      icon: RotateCcw,
    },
    {
      id: 'payment' as const,
      title: 'Record Payment',
      description: 'Mark a payment as received',
      icon: CreditCard,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
      <h2 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id)}
              className="group flex flex-col items-center justify-center text-center p-4 rounded-xl bg-rose-50/40 hover:bg-rose-50 border border-rose-100/60 hover:border-rose-200 transition-all duration-150 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-red-600 mb-2 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                {action.title}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 leading-snug">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
