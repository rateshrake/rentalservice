import React, { useState } from 'react';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsKPI } from './AnalyticsKPI';
import { RevenueTrend30D } from './RevenueTrend30D';
import { EquipmentRevenueRanking } from './EquipmentRevenueRanking';
import { CategoryUtilizationCard } from './CategoryUtilizationCard';
import { TopCustomersCard } from './TopCustomersCard';
import { PaymentModeSplitCard } from './PaymentModeSplitCard';

import { AnalyticsData } from '../../types';

interface AnalyticsViewProps {
  data: AnalyticsData;
  onOpenSearch: () => void;
  onSelectCustomer?: (customerName: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  data,
  onOpenSearch,
  onSelectCustomer,
}) => {
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-hidden">
      {/* Analytics Header */}
      <AnalyticsHeader
        onOpenSearch={onOpenSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
        {/* Row 1: 6 KPI Metric Cards */}
        <AnalyticsKPI stats={data.kpis} />

        {/* Row 2: Revenue Trend (7 cols) + Equipment Revenue Ranking (5 cols) */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <RevenueTrend30D
              data={data.revenueTrend}
              summary={data.summary}
            />
          </div>
          <div className="col-span-5">
            <EquipmentRevenueRanking items={data.equipmentRanking} />
          </div>
        </div>

        {/* Row 3: Category Utilization (4 cols) + Top Customers (4 cols) + Payment Mode Split (4 cols) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <CategoryUtilizationCard items={data.categoryUtilization} />
          </div>
          <div>
            <TopCustomersCard
              customers={data.topCustomers}
              onSelectCustomer={onSelectCustomer}
            />
          </div>
          <div>
            <PaymentModeSplitCard
              items={data.paymentSplit}
              totalRevenue={data.summary.totalRevenue}
            />
          </div>
        </div>


      </div>
    </div>
  );
};
