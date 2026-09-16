import React from 'react';
import { FileText, Contact2, Receipt, FileCheck, Image } from 'lucide-react';

export type DocumentCategory = 'all' | 'identity' | 'receipts' | 'agreements' | 'damage';

interface DocumentCategoryCardsProps {
  activeCategory: DocumentCategory;
  onSelectCategory: (cat: DocumentCategory) => void;
  counts: {
    all: number;
    identity: number;
    receipts: number;
    agreements: number;
    damage: number;
  };
}

export const DocumentCategoryCards: React.FC<DocumentCategoryCardsProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const categories = [
    {
      id: 'all' as DocumentCategory,
      title: 'All Documents',
      count: `${counts.all} files`,
      icon: FileText,
      iconColor: 'text-[#E11D48]',
      iconBg: 'bg-rose-50',
    },
    {
      id: 'identity' as DocumentCategory,
      title: 'Identity Proofs',
      count: `${counts.identity} files`,
      icon: Contact2,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'receipts' as DocumentCategory,
      title: 'Receipts',
      count: `${counts.receipts} files`,
      icon: Receipt,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      id: 'agreements' as DocumentCategory,
      title: 'Agreements',
      count: `${counts.agreements} files`,
      icon: FileCheck,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      id: 'damage' as DocumentCategory,
      title: 'Damage Photos',
      count: `${counts.damage} files`,
      icon: Image,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {categories.map((cat) => {
        const isSelected = activeCategory === cat.id;
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer shadow-2xs ${
              isSelected
                ? 'border-[#E11D48] bg-rose-50/40 text-slate-900 shadow-xs ring-1 ring-[#E11D48]/30'
                : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-rose-100/70 text-[#E11D48]' : `${cat.iconBg} ${cat.iconColor}`
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div
                className={`text-xs font-bold truncate ${
                  isSelected ? 'text-[#E11D48]' : 'text-slate-900'
                }`}
              >
                {cat.title}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                {cat.count}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
