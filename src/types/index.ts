export interface StatItem {
  id: number;
  key: string;
  title: string;
  value: string;
  trend_val: string;
  trend_label: string;
  trend_direction: 'up' | 'down' | 'neutral';
  badge_type: 'emerald' | 'rose' | 'neutral';
}

export type PaymentStatusType = 'Paid' | 'Pending' | 'Unpaid';
export type RentalStatusType = 'Due Today' | 'Active' | 'Returned' | 'Overdue' | 'Reserved' | 'On Time';

export interface RentalItem {
  id: number;
  rental_code: string;
  customer_name: string;
  customer_phone?: string;
  equipment_name: string;
  pickup_date?: string;
  return_time: string;
  amount: number;
  payment_status: PaymentStatusType;
  status: RentalStatusType;
}

export interface CustomerItem {
  id: number;
  code: string;
  name: string;
  primary_phone: string;
  alternate_phone?: string;
  email?: string;
  location?: string;
  total_rentals: number;
  active_rentals: number;
  outstanding_amount: number;
  last_rental: string;
  verification: 'Verified' | 'Pending';
  avatar_type: 'photo' | 'initials';
  avatar_text?: string;
  avatar_img?: string;
  customer_since: string;
  id_proof_type: string;
  id_proof_masked: string;
  notes: string;
}

export interface MaintenanceItem {
  id: number;
  date: string;
  title: string;
  description: string;
  icon_type: 'check' | 'wrench';
}

export type EquipmentCategoryType =
  | 'Cameras'
  | 'Lenses'
  | 'Audio'
  | 'Lighting'
  | 'Gimbals'
  | 'Tripods'
  | 'Accessories';

export type EquipmentStatusType =
  | 'Rented Out'
  | 'Available'
  | 'Reserved'
  | 'Maintenance'
  | 'Damaged';

export type EquipmentConditionType = 'Excellent' | 'Good' | 'Needs Repair';

export interface InventoryItem {
  id: number;
  name: string;
  subtitle?: string;
  category: EquipmentCategoryType;
  asset_id: string;
  serial_number: string;
  rental_rate: number;
  status: EquipmentStatusType;
  current_customer?: string;
  expected_return?: string;
  condition: EquipmentConditionType;
  image_url: string;
  lifetime_revenue: number;
  lifetime_rentals: number;
  utilization_rate: number;
  purchase_date: string;
  warranty: string;
  maintenance_history?: MaintenanceItem[];
}

export interface AttentionItem {
  id: number;
  type: 'overdue' | 'payment';
  code: string;
  party_name: string;
  detail: string;
  badge_text: string;
  is_resolved?: number;
}

export interface TopEquipmentItem {
  id: number;
  rank: number;
  name: string;
  category: 'camera' | 'gimbal' | 'lens' | 'audio' | 'lighting';
  rentals_count: number;
  earnings: number;
}

export interface RevenueTrendItem {
  id: number;
  date_label: string;
  revenue: number;
  is_current: number;
}

export interface DashboardData {
  stats: StatItem[];
  rentals: RentalItem[];
  attention: AttentionItem[];
  topEquipment: TopEquipmentItem[];
  revenueTrend: RevenueTrendItem[];
  summary: {
    totalRevenue: string;
    revenueChange: string;
    averageDaily: string;
    dailyChange: string;
  };
}

export interface PaymentItem {
  id: number;
  transaction_id: string;
  rental_id: string;
  customer_name: string;
  amount: number;
  mode: 'UPI' | 'Card' | 'Bank Transfer' | 'Cash';
  type: 'Rental' | 'Deposit' | 'Refund';
  collected_by: string;
  date: string;
  time: string;
  status: 'Paid' | 'Pending' | 'Partial' | 'Deposit' | 'Refund';
  utr_reference?: string;
  notes?: string;
  equipment_name?: string;
  rental_period?: string;
}

export interface CategoryUtilizationItem {
  id: number;
  category: string;
  icon_name: 'camera' | 'lens' | 'gimbal' | 'lighting' | 'audio' | 'accessories';
  utilization_rate: number;
}

export interface CustomerRevenueRankingItem {
  id: number;
  rank: number;
  name: string;
  initials: string;
  avatar_bg: string;
  rentals_count: number;
  revenue: number;
}

export interface PaymentModeSplitItem {
  id: number;
  mode: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface InsightObservationItem {
  id: number;
  title: string;
  description: string;
  icon_type: 'camera' | 'growth' | 'users' | 'credit_card' | 'bar_chart';
  icon_color: string;
  bg_color: string;
}

export interface AnalyticsData {
  kpis: StatItem[];
  revenueTrend: RevenueTrendItem[];
  equipmentRanking: TopEquipmentItem[];
  categoryUtilization: CategoryUtilizationItem[];
  topCustomers: CustomerRevenueRankingItem[];
  paymentSplit: PaymentModeSplitItem[];
  insights: InsightObservationItem[];
  summary: {
    totalRevenue: string;
    revenueChange: string;
  };
}

export interface MessageTemplateItem {
  id: number;
  title: string;
  badge: 'Booking' | 'Reminder' | 'Overdue' | 'Payment' | 'Marketing';
  snippet: string;
  body: string;
  icon_type: 'calendar' | 'clock' | 'alert' | 'credit_card' | 'megaphone';
}

export interface MessageHistoryItem {
  id: number;
  customer_name: string;
  initials: string;
  subject: string;
  channel: 'whatsapp' | 'sms';
  status: 'Delivered' | 'Read' | 'Sent' | 'Failed';
  time: string;
}

export interface MessagesData {
  templates: MessageTemplateItem[];
  history: MessageHistoryItem[];
}

export interface DocumentItem {
  id: number;
  document_name: string;
  customer_name: string;
  rental_id: string;
  type: 'Identity Proof' | 'Receipt' | 'Agreement' | 'Damage Photo';
  file_type: 'pdf' | 'jpg' | 'png';
  uploaded_on_date: string;
  uploaded_on_time: string;
  verified_by: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  file_size: string;
  security: string;
  preview_data?: {
    aadhaar_number?: string;
    dob?: string;
    gender?: string;
    is_masked?: boolean;
    image_url?: string;
  };
}

export interface DocumentsData {
  documents: DocumentItem[];
  counts: {
    all: number;
    identity: number;
    receipts: number;
    agreements: number;
    damage: number;
  };
}

export interface BusinessProfile {
  business_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  logo_url?: string;
}

export interface EmployeeItem {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface RentalPricingSettings {
  default_daily_rate: number;
  minimum_rental_period: string;
  security_deposit: number;
  long_rental_discount: string;
  allow_custom_pricing: boolean;
}

export interface LateFeeRulesSettings {
  fee_type: string;
  fee_percentage: number;
  grace_period_days: number;
  apply_automatically: boolean;
  send_overdue_reminders: boolean;
}

export interface PaymentModeSettingItem {
  id: string;
  name: string;
  description: string;
  is_enabled: boolean;
}

export interface NotificationRuleSettingItem {
  id: string;
  label: string;
  timing: string;
  is_enabled: boolean;
}

export interface DocumentSecuritySettings {
  restrict_access: boolean;
  watermark_documents: boolean;
  allow_customer_upload: boolean;
}

export interface BackupSettings {
  auto_backup_frequency: string;
  last_backup_time: string;
}

export interface AuditLogItem {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip_address: string;
}

export interface SettingsData {
  businessProfile: BusinessProfile;
  employees: EmployeeItem[];
  rolesPermissions: Record<string, string[]>;
  rentalPricing: RentalPricingSettings;
  lateFeeRules: LateFeeRulesSettings;
  paymentModes: PaymentModeSettingItem[];
  messageTemplates: Record<string, string>;
  notificationRules: NotificationRuleSettingItem[];
  documentSecurity: DocumentSecuritySettings;
  backup: BackupSettings;
  auditLogs: AuditLogItem[];
}

export interface SelectedRentalEquipment {
  equipment: InventoryItem;
  quantity: number;
  dailyRate: number;
}

export interface NewRentalSchedule {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  durationDays: number;
}

export interface NewRentalPricing {
  subtotalPerDay: number;
  rentalDays: number;
  rentalAmount: number;
  securityDeposit: number;
  advancePaid: number;
  discount: number;
  totalAmount: number;
  balanceDue: number;
  paymentMode: string;
}

export interface ElectronAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  getDashboardData: () => Promise<DashboardData>;
  getAllRentals: () => Promise<RentalItem[]>;
  createRental: (data: Partial<RentalItem>) => Promise<RentalItem>;
  updateRentalStatus: (id: number, status?: string, payment_status?: string) => Promise<boolean>;
  getCustomers: () => Promise<CustomerItem[]>;
  updateCustomerNotes: (id: number, notes: string) => Promise<boolean>;
  getInventory: () => Promise<InventoryItem[]>;
  getPayments: () => Promise<PaymentItem[]>;
  createPayment: (data: Partial<PaymentItem>) => Promise<PaymentItem>;
  getAnalyticsData: () => Promise<AnalyticsData>;
  getMessagesData: () => Promise<MessagesData>;
  sendMessage: (msg: Partial<MessageHistoryItem>) => Promise<boolean>;
  getDocumentsData: () => Promise<DocumentsData>;
  uploadDocument: (data: Partial<DocumentItem>) => Promise<DocumentItem>;
  updateDocumentStatus: (id: number, status: string) => Promise<boolean>;
  getSettingsData: () => Promise<SettingsData>;
  saveSettingsData: (settings: Partial<SettingsData>) => Promise<boolean>;
  addEmployee: (emp: Partial<EmployeeItem>) => Promise<EmployeeItem>;
  triggerBackup: () => Promise<boolean>;
  platform: string;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}



