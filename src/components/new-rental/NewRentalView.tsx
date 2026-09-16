import React, { useState, useMemo } from 'react';
import { NewRentalHeader } from './NewRentalHeader';
import { NewRentalStepper } from './NewRentalStepper';
import { CustomerSelectionPanel } from './CustomerSelectionPanel';
import {
  EquipmentSelectionPanel,
  EquipmentListItem,
  referenceEquipmentList,
} from './EquipmentSelectionPanel';
import { RentalSummaryPanel } from './RentalSummaryPanel';
import { ScheduleStepPanel } from './ScheduleStepPanel';
import { PricingPaymentStepPanel } from './PricingPaymentStepPanel';
import { ReviewConfirmStepPanel } from './ReviewConfirmStepPanel';
import { StatusBar } from '../StatusBar';
import { CustomerItem, NewRentalPricing, NewRentalSchedule, RentalItem } from '../../types';
import { CheckCircle, Calendar, ArrowRight, Printer } from 'lucide-react';

interface NewRentalViewProps {
  customers: CustomerItem[];
  onNavigateTab: (tab: string) => void;
  onCreateRentalBooking: (booking: Partial<RentalItem>) => Promise<RentalItem | void>;
  onOpenSearch?: () => void;
}

export const NewRentalView: React.FC<NewRentalViewProps> = ({
  customers,
  onNavigateTab,
  onCreateRentalBooking,
  onOpenSearch,
}) => {
  // Wizard current step (1-5)
  const [currentStep, setCurrentStep] = useState<number>(2);

  // Selected Customer (defaulting to Vikram Shah matching screenshot)
  const defaultCustomer = useMemo(() => {
    return (
      customers.find((c) => c.name === 'Vikram Shah') ||
      customers[0] || {
        id: 1,
        code: 'CUST-001',
        name: 'Vikram Shah',
        primary_phone: '+91 98765 43210',
        alternate_phone: '+91 87654 32109',
        email: 'vikram.shah@gmail.com',
        location: 'Mumbai, Maharashtra',
        total_rentals: 8,
        active_rentals: 1,
        outstanding_amount: 0,
        last_rental: '12 May 2025',
        verification: 'Verified' as const,
        avatar_type: 'initials' as const,
        avatar_text: 'VS',
        customer_since: '12 Jan 2024',
        id_proof_type: 'Identity Proof (Aadhaar)',
        id_proof_masked: '•••• •••• 1234',
        notes: 'Regular customer. Prefers Sony and Canon gear.',
      }
    );
  }, [customers]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem>(defaultCustomer);

  // Selected Equipment: map id -> quantity. In screenshot, Sony A7 IV (qty 1) and Canon R6 Mark II (qty 1) are checked!
  const [selectedEquipmentQuantities, setSelectedEquipmentQuantities] = useState<
    Record<number, number>
  >({
    1: 1, // Sony A7 IV
    2: 1, // Canon R6 Mark II
  });

  // Schedule state
  const [schedule, setSchedule] = useState<NewRentalSchedule>({
    pickupDate: '2025-05-28',
    pickupTime: '10:00 AM',
    returnDate: '2025-05-30',
    returnTime: '08:00 PM',
    durationDays: 2,
  });

  // Has custom dates been set
  const [hasSetDates, setHasSetDates] = useState<boolean>(false);

  // Pricing state
  const [pricing, setPricing] = useState<NewRentalPricing>({
    subtotalPerDay: 4500,
    rentalDays: 2,
    rentalAmount: 9000,
    securityDeposit: 10000,
    advancePaid: 3000,
    discount: 0,
    totalAmount: 19000,
    balanceDue: 16000,
    paymentMode: 'UPI',
  });

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<RentalItem | null>(null);

  // Compute selected gear list
  const selectedGear = useMemo(() => {
    return Object.entries(selectedEquipmentQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([idStr, qty]) => {
        const item =
          referenceEquipmentList.find((eq) => eq.id === parseInt(idStr)) ||
          referenceEquipmentList[0];
        return { item, quantity: qty };
      });
  }, [selectedEquipmentQuantities]);

  // Compute daily subtotal
  const dailySubtotal = useMemo(() => {
    return selectedGear.reduce(
      (sum, g) => sum + g.item.dailyRate * g.quantity,
      0
    );
  }, [selectedGear]);

  // Handle equipment toggle
  const handleToggleSelectEquipment = (item: EquipmentListItem) => {
    setSelectedEquipmentQuantities((prev) => {
      const next = { ...prev };
      if (next[item.id]) {
        delete next[item.id];
      } else {
        next[item.id] = 1;
      }
      return next;
    });
  };

  // Handle quantity update
  const handleUpdateQuantity = (itemId: number, delta: number) => {
    setSelectedEquipmentQuantities((prev) => {
      const current = prev[itemId] || 0;
      const nextVal = current + delta;
      const next = { ...prev };
      if (nextVal <= 0) {
        delete next[itemId];
      } else {
        next[itemId] = nextVal;
      }
      return next;
    });
  };

  // Update schedule
  const handleScheduleChange = (updates: Partial<NewRentalSchedule>) => {
    setSchedule((prev) => {
      const next = { ...prev, ...updates };
      setHasSetDates(true);
      // Recalculate pricing
      const rentAmt = dailySubtotal * next.durationDays;
      const totAmt = rentAmt + pricing.securityDeposit;
      setPricing((p) => ({
        ...p,
        subtotalPerDay: dailySubtotal,
        rentalDays: next.durationDays,
        rentalAmount: rentAmt,
        totalAmount: totAmt,
        balanceDue: Math.max(0, totAmt - p.advancePaid),
      }));
      return next;
    });
  };

  // Update pricing
  const handlePricingChange = (updates: Partial<NewRentalPricing>) => {
    setPricing((prev) => ({ ...prev, ...updates }));
  };

  // Handle Confirm and Create Booking
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const rentalCode = `RNT-2025-${Math.floor(100 + Math.random() * 900)}`;
    const equipmentNames = selectedGear
      .map((g) => (g.quantity > 1 ? `${g.item.name} (x${g.quantity})` : g.item.name))
      .join(' + ');

    const newRentalPayload: Partial<RentalItem> = {
      rental_code: rentalCode,
      customer_name: selectedCustomer.name,
      customer_phone: selectedCustomer.primary_phone,
      equipment_name: equipmentNames,
      pickup_date: `${schedule.pickupDate} ${schedule.pickupTime}`,
      return_time: `${schedule.returnDate} ${schedule.returnTime}`,
      amount: pricing.rentalAmount,
      payment_status: pricing.balanceDue === 0 ? 'Paid' : 'Pending',
      status: 'Reserved',
    };

    try {
      const result = await onCreateRentalBooking(newRentalPayload);
      setCreatedBooking(
        result || ({
          id: Date.now(),
          ...newRentalPayload,
        } as RentalItem)
      );
    } catch (err) {
      console.error('Failed to create rental booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If booking was created successfully, show confirmation screen
  if (createdBooking) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] h-full overflow-hidden">
        <NewRentalHeader
          onBack={() => onNavigateTab('dashboard')}
          onOpenSearch={onOpenSearch}
        />
        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Rental Booking Confirmed!
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Booking has been created and saved to SQLite. A confirmation SMS & WhatsApp notice has been queued.
            </p>

            <div className="mt-6 bg-[#FFF5F6] border border-rose-100 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Rental Reference ID:</span>
                <span className="font-mono font-bold text-slate-900">
                  {createdBooking.rental_code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">
                  {createdBooking.customer_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Equipment:</span>
                <span className="font-semibold text-slate-900">
                  {createdBooking.equipment_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rental Period:</span>
                <span className="font-medium text-slate-800">
                  {createdBooking.pickup_date} &rarr; {createdBooking.return_time}
                </span>
              </div>
              <div className="border-t border-rose-200/60 pt-2 flex justify-between">
                <span className="text-slate-600 font-bold">Total Amount:</span>
                <span className="font-bold text-[#E11D48] text-sm">
                  ₹{createdBooking.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigateTab('rentals')}
                className="px-5 py-2.5 bg-[#E11D48] hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>View in Rentals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setCreatedBooking(null);
                  setCurrentStep(2);
                }}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Create Another Rental
              </button>
            </div>
          </div>
        </div>
        <StatusBar />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] h-full overflow-hidden">
      {/* Top Header with Global Search, Notifications, Profile and Title */}
      <NewRentalHeader
        onBack={() => onNavigateTab('dashboard')}
        onOpenSearch={onOpenSearch}
      />

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-8 py-5">
        {/* Stepper with 5 Steps */}
        <NewRentalStepper
          currentStep={currentStep}
          onSelectStep={(step) => setCurrentStep(step)}
        />

        {/* Main Content Area Based on Step */}
        {currentStep <= 2 ? (
          /* Step 1 & 2: 3-Column Layout Matching Screenshot media_1789503534233.png */
          <div className="flex flex-col xl:flex-row gap-5 items-start">
            {/* Column 1: 1. Customer (~28% width) */}
            <div className="w-full xl:w-[340px] shrink-0">
              <CustomerSelectionPanel
                selectedCustomer={selectedCustomer}
                allCustomers={customers}
                onSelectCustomer={(cust) => setSelectedCustomer(cust)}
                onEditCustomer={() => onNavigateTab('customers')}
                onViewAllRentals={() => onNavigateTab('rentals')}
              />
            </div>

            {/* Column 2: 2. Equipment (~44% width) */}
            <div className="w-full xl:flex-1 min-w-0">
              <EquipmentSelectionPanel
                selectedItems={selectedEquipmentQuantities}
                onToggleSelect={handleToggleSelectEquipment}
                onUpdateQuantity={handleUpdateQuantity}
                onViewInventory={() => onNavigateTab('inventory')}
              />
            </div>

            {/* Column 3: Rental Summary (~28% width) */}
            <div className="w-full xl:w-[340px] shrink-0">
              <RentalSummaryPanel
                customer={selectedCustomer}
                selectedGear={selectedGear}
                rentalDays={hasSetDates ? schedule.durationDays : null}
                durationLabel={
                  hasSetDates
                    ? `${schedule.pickupDate} - ${schedule.returnDate}`
                    : 'Not selected yet'
                }
                depositAmount={hasSetDates ? pricing.securityDeposit : 0}
                advancePaidAmount={hasSetDates ? pricing.advancePaid : 0}
                onChangeCustomer={() => setCurrentStep(1)}
                onSetDates={() => setCurrentStep(3)}
                onEditEquipment={() => setCurrentStep(2)}
                onContinue={() => setCurrentStep(3)}
              />
            </div>
          </div>
        ) : currentStep === 3 ? (
          /* Step 3: Schedule & Timing */
          <ScheduleStepPanel
            schedule={schedule}
            onChangeSchedule={handleScheduleChange}
            onBack={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
          />
        ) : currentStep === 4 ? (
          /* Step 4: Pricing & Payment */
          <PricingPaymentStepPanel
            pricing={pricing}
            onChangePricing={handlePricingChange}
            onBack={() => setCurrentStep(3)}
            onNext={() => setCurrentStep(5)}
          />
        ) : (
          /* Step 5: Review & Confirm */
          <ReviewConfirmStepPanel
            customer={selectedCustomer}
            selectedGear={selectedGear}
            schedule={schedule}
            pricing={pricing}
            isSubmitting={isSubmitting}
            onBack={() => setCurrentStep(4)}
            onConfirm={handleConfirmBooking}
          />
        )}
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
  );
};
