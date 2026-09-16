import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CustomerRevenueRankingItem } from '../../types';

interface TopCustomersCardProps {
  customers: CustomerRevenueRankingItem[];
  onSelectCustomer?: (customerName: string) => void;
}

export const TopCustomersCard: React.FC<TopCustomersCardProps> = ({
  customers,
  onSelectCustomer,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-sm">Top Customers by Revenue</h3>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs">
          <span>Last 30 Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto pt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-semibold text-slate-500 border-b border-slate-100/80">
              <th className="py-2 pl-2 w-8 font-semibold">#</th>
              <th className="py-2 px-2 font-semibold">Customer</th>
              <th className="py-2 px-2 font-semibold text-center">Rentals</th>
              <th className="py-2 pr-2 font-semibold text-right">Revenue</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectCustomer?.(c.name)}
                className="hover:bg-slate-50/60 transition-colors cursor-pointer"
              >
                {/* Rank # */}
                <td className="py-2.5 pl-2 font-bold text-slate-500 w-8">
                  {c.rank}
                </td>

                {/* Avatar Initials + Name */}
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10.5px] shrink-0 ${c.avatar_bg}`}
                    >
                      {c.initials}
                    </div>
                    <span className="font-bold text-slate-900 truncate max-w-[120px] hover:text-[#E11D48] transition-colors">
                      {c.name}
                    </span>
                  </div>
                </td>

                {/* Rentals Count */}
                <td className="py-2.5 px-2 text-center text-slate-600 font-medium">
                  {c.rentals_count}
                </td>

                {/* Revenue */}
                <td className="py-2.5 pr-2 text-right font-extrabold text-slate-900 font-sans">
                  ₹{c.revenue.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
