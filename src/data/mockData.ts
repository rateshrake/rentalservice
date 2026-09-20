import {
  AnalyticsData,
  CustomerItem,
  DashboardData,
  DocumentItem,
  DocumentsData,
  InventoryItem,
  MessagesData,
  PaymentItem,
  RentalItem,
  SettingsData,
  StatItem,
} from '../types';

export const initialAnalyticsData: AnalyticsData = {
  kpis: [],
  revenueTrend: [],
  equipmentRanking: [],
  categoryUtilization: [],
  topCustomers: [],
  paymentSplit: [],
  insights: [],
  summary: { totalRevenue: '₹0', revenueChange: '0%' }
};

export const paymentsKpiData: StatItem[] = [];
export const allPaymentsData: PaymentItem[] = [];

export const inventoryKpiData: StatItem[] = [];
export const allInventoryData: InventoryItem[] = [];

export const customersKpiData: StatItem[] = [];
export const allCustomersData: CustomerItem[] = [];

export const rentalsKpiData: StatItem[] = [];
export const allRentalsData: RentalItem[] = [];

export const initialDashboardData: DashboardData = {
  stats: [],
  rentals: [],
  attention: [],
  topEquipment: [],
  revenueTrend: [],
  summary: { totalRevenue: '₹0', revenueChange: '0%', averageDaily: '₹0', dailyChange: '0%' }
};

export const initialMessagesData: MessagesData = {
  templates: [],
  history: []
};

export const initialDocumentsData: DocumentsData = {
  documents: [],
  counts: { all: 0, identity: 0, receipts: 0, agreements: 0, damage: 0 }
};

export const initialSettingsData: SettingsData = {
  businessProfile: { business_name: '', tagline: '', email: '', phone: '', address: '' },
  employees: [],
  rolesPermissions: {},
  rentalPricing: { default_daily_rate: 0, minimum_rental_period: '', security_deposit: 0, long_rental_discount: '', allow_custom_pricing: false },
  lateFeeRules: {
    fee_type: 'Percentage of daily rate',
    fee_percentage: 25,
    grace_period_days: 1,
    grace_period_mins: 20,
    hourly_penalty_amount: 500,
    apply_automatically: false,
    send_overdue_reminders: false,
  },
  paymentModes: [],
  messageTemplates: {},
  notificationRules: [],
  documentSecurity: { restrict_access: false, watermark_documents: false, allow_customer_upload: false },
  backup: { auto_backup_frequency: '', last_backup_time: '' },
  auditLogs: []
};
