import React from 'react';
import { Lightbulb, Camera, TrendingUp, Users, CreditCard, BarChart3 } from 'lucide-react';
import { InsightObservationItem } from '../../types';

interface InsightsObservationsProps {
  insights: InsightObservationItem[];
}

export const InsightsObservations: React.FC<InsightsObservationsProps> = ({ insights }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'camera':
        return <Camera className="w-4 h-4 text-rose-600" />;
      case 'growth':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'users':
        return <Users className="w-4 h-4 text-rose-600" />;
      case 'credit_card':
        return <CreditCard className="w-4 h-4 text-rose-600" />;
      case 'bar_chart':
      default:
        return <BarChart3 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Section Title */}
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
        <h3 className="font-bold text-slate-900 text-sm">Insights & Observations</h3>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-5 gap-3.5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3"
          >
            <div
              className={`w-8 h-8 rounded-lg ${item.bg_color} border border-slate-100 flex items-center justify-center shrink-0 mt-0.5`}
            >
              {getIcon(item.icon_type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-xs leading-tight">
                {item.title}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
