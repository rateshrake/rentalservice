import React, { useState, useMemo, useEffect } from 'react';
import { NewRentalStepper } from './NewRentalStepper';
import { CustomerSelectionPanel } from './CustomerSelectionPanel';
import {
  EquipmentSelectionPanel,
  EquipmentListItem,
} from './EquipmentSelectionPanel';
import { RentalSummaryPanel } from './RentalSummaryPanel';
import { ScheduleStepPanel } from './ScheduleStepPanel';
import { PricingPaymentStepPanel } from './PricingPaymentStepPanel';
import { ReviewConfirmStepPanel } from './ReviewConfirmStepPanel';
import { StatusBar } from '../StatusBar';
import { CustomerItem, NewRentalPricing, NewRentalSchedule, RentalItem, InventoryItem } from '../../types';
import { CheckCircle, Calendar, ArrowRight, Printer } from 'lucide-react';
import { parseTimeParts, normalizeTimeFormatted } from './TimePickerInput';

interface NewRentalViewProps {
  customers: CustomerItem[];
  inventory: InventoryItem[];
  onNavigateTab: (tab: string) => void;
  onCreateRentalBooking: (booking: Partial<RentalItem>) => Promise<RentalItem | void>;
  onOpenSearch?: () => void;
  onOpenAddCustomer?: (initialPhone: string, onCreated: (customer: CustomerItem) => void) => void;
}

export const NewRentalView: React.FC<NewRentalViewProps> = ({
  customers,
  inventory,
  onNavigateTab,
  onCreateRentalBooking,
  onOpenSearch,
  onOpenAddCustomer,
}) => {
  // Wizard current step (1-5)
  const [currentStep, setCurrentStep] = useState<number>(2);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(() => {
    return customers && customers.length > 0 ? customers[0] : null;
  });

  // Auto-populate customer if customers load asynchronously and none is selected yet
  useEffect(() => {
    if (!selectedCustomer && customers && customers.length > 0) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  // Selected Equipment: map id -> quantity. Defaults to empty (no equipment selected by default)
  const [selectedEquipmentQuantities, setSelectedEquipmentQuantities] = useState<
    Record<number, number>
  >({});

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
  const [stepError, setStepError] = useState<string | null>(null);

  // Pricing state
  const [pricing, setPricing] = useState<NewRentalPricing>({
    subtotalPerDay: 0,
    rentalDays: 2,
    rentalAmount: 0,
    securityDeposit: 0,
    advancePaid: 0,
    discount: 0,
    totalAmount: 0,
    balanceDue: 0,
    paymentMode: 'UPI',
  });

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<RentalItem | null>(null);

  const equipmentList: EquipmentListItem[] = (inventory || []).map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    categoryKey: item.category.toLowerCase(),
    availableCount: item.status === 'Available' ? 1 : 0,
    dailyRate: item.rental_rate,
    imageUrl: item.image_url,
  }));

  // Compute selected gear list
  const selectedGear = useMemo(() => {
    return Object.entries(selectedEquipmentQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([idStr, qty]) => {
        const item =
          equipmentList.find((eq) => eq.id === parseInt(idStr)) ||
          equipmentList[0];
        return { item, quantity: qty };
      })
      .filter((g) => g.item !== undefined);
  }, [selectedEquipmentQuantities, inventory]);

  // Compute daily subtotal
  const dailySubtotal = useMemo(() => {
    return selectedGear.reduce(
      (sum, g) => sum + g.item.dailyRate * g.quantity,
      0
    );
  }, [selectedGear]);

  // Synchronize pricing whenever equipment daily subtotal or rental duration changes
  useEffect(() => {
    setPricing((p) => {
      const rentAmt = dailySubtotal * schedule.durationDays;
      const totAmt = rentAmt + p.securityDeposit;
      return {
        ...p,
        subtotalPerDay: dailySubtotal,
        rentalDays: schedule.durationDays,
        rentalAmount: rentAmt,
        totalAmount: totAmt,
        balanceDue: Math.max(0, totAmt - p.advancePaid),
      };
    });
  }, [dailySubtotal, schedule.durationDays]);

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
    if (!selectedCustomer) return;
    setIsSubmitting(true);
    const rentalCode = `RNT-2025-${Math.floor(100 + Math.random() * 900)}`;
    const equipmentNames = selectedGear
      .map((g) => (g.quantity > 1 ? `${g.item.name} (x${g.quantity})` : g.item.name))
      .join(' + ');

    const parsedPickup = parseTimeParts(schedule.pickupTime);
    const cleanPickupTime = normalizeTimeFormatted(parsedPickup.time, parsedPickup.period);
    const parsedReturn = parseTimeParts(schedule.returnTime);
    const cleanReturnTime = normalizeTimeFormatted(parsedReturn.time, parsedReturn.period);

    const newRentalPayload: Partial<RentalItem> = {
      rental_code: rentalCode,
      customer_name: selectedCustomer.name,
      customer_phone: selectedCustomer.primary_phone,
      equipment_name: equipmentNames,
      pickup_date: `${schedule.pickupDate} ${cleanPickupTime}`,
      return_time: `${schedule.returnDate} ${cleanReturnTime}`,
      amount: pricing.rentalAmount,
      payment_status: pricing.paymentMode === 'Pay Later' ? 'Unpaid' : (pricing.balanceDue === 0 ? 'Paid' : 'Unpaid'),
      status: 'Active',
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
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className={`font-bold ${createdBooking.payment_status === 'Paid' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {createdBooking.payment_status}
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
                  setSelectedCustomer(null);
                  setSelectedEquipmentQuantities({});
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
      {/* Main Content (Not globally scrollable) */}
      <div className="flex-1 flex flex-col min-h-0 px-8 py-5">
        {/* Stepper with 5 Steps */}
        <div className="shrink-0">
          <NewRentalStepper
            currentStep={currentStep}
            onSelectStep={(step) => setCurrentStep(step)}
          />
        </div>

        {/* Main Content Area Based on Step */}
        <div className="flex flex-col xl:flex-row gap-5 items-stretch flex-1 min-h-0 pt-4">
          {/* Column 1: Customer Selection (Fixed) */}
          <div className="w-full xl:w-[340px] shrink-0 flex flex-col min-h-0 overflow-y-auto">
            <CustomerSelectionPanel
              selectedCustomer={selectedCustomer}
              allCustomers={customers}
              onSelectCustomer={(cust) => setSelectedCustomer(cust)}
              onEditCustomer={() => onNavigateTab('customers')}
              onViewAllRentals={() => onNavigateTab('rentals')}
              onAddNewCustomer={(searchQuery) => {
                onOpenAddCustomer?.(searchQuery, (newCust) => {
                  setSelectedCustomer(newCust);
                });
              }}
            />
          </div>

          {/* Column 2: Dynamic Content Area */}
          <div className="w-full xl:flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto pr-2 pb-4 scrollbar-thin">
            {stepError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 flex items-center justify-between animate-in fade-in duration-150">
                <span>{stepError}</span>
                <button 
                  type="button" 
                  onClick={() => setStepError(null)} 
                  className="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            {currentStep <= 2 ? (
              <EquipmentSelectionPanel
                inventory={inventory}
                selectedItems={selectedEquipmentQuantities}
                onToggleSelect={handleToggleSelectEquipment}
                onUpdateQuantity={handleUpdateQuantity}
                onViewInventory={() => onNavigateTab('inventory')}
                onNext={() => {
                  if (!selectedCustomer) {
                    setStepError('Please select a customer first.');
                    return;
                  }
                  if (selectedGear.length === 0) {
                    setStepError('Please select at least one equipment item.');
                    return;
                  }
                  setStepError(null);
                  setCurrentStep(3);
                }}
              />
            ) : currentStep === 3 ? (
              <ScheduleStepPanel
                schedule={schedule}
                onChangeSchedule={handleScheduleChange}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            ) : currentStep === 4 ? (
              <ReviewConfirmStepPanel
                customer={selectedCustomer}
                selectedGear={selectedGear}
                schedule={schedule}
                pricing={pricing}
                onBack={() => setCurrentStep(3)}
                onNext={() => setCurrentStep(5)}
              />
            ) : (
              <PricingPaymentStepPanel
                pricing={pricing}
                onChangePricing={handlePricingChange}
                isSubmitting={isSubmitting}
                onBack={() => setCurrentStep(4)}
                onConfirm={handleConfirmBooking}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
  );
};
